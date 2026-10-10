<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Media;
use App\Support\AuditLogger;
use App\Support\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class MediaController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected MediaService $media,
        protected AuditLogger $audit,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Media::class);

        $query = Media::query()->with('uploader:id,name');

        if ($search = $request->string('search')->trim()->value()) {
            $query->where(fn ($q) => $q->where('original_name', 'like', "%{$search}%")->orWhere('filename', 'like', "%{$search}%")->orWhere('title', 'like', "%{$search}%"));
        }

        if ($request->filled('folder')) {
            $query->where('folder', $request->input('folder'));
        }

        match ($request->input('type')) {
            'image' => $query->where('mime_type', 'like', 'image/%'),
            'video' => $query->where('mime_type', 'like', 'video/%'),
            'document' => $query->where(fn ($q) => $q->where('mime_type', 'like', 'application/%')->orWhere('mime_type', 'like', 'text/%')),
            default => null,
        };

        $sort = in_array($request->input('sort'), ['created_at', 'size', 'original_name'], true) ? $request->input('sort') : 'created_at';
        $direction = $request->input('direction') === 'asc' ? 'asc' : 'desc';

        return $this->ok($query->orderBy($sort, $direction)->paginate(min((int) $request->input('per_page', 24), 100)));
    }

    public function folders(): JsonResponse
    {
        $this->authorize('viewAny', Media::class);

        return $this->ok(Media::query()->distinct()->pluck('folder'));
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Media::class);

        $request->validate([
            'file' => ['required_without:files', 'file'],
            'files' => ['required_without:file', 'array'],
            'files.*' => ['file'],
            'folder' => ['nullable', 'string', 'max:120'],
            'alt' => ['nullable', 'string', 'max:255'],
        ]);

        // Surface the real reason when the web-server/PHP rejects an upload
        // (size limits, missing temp dir, interrupted transfer). The generic
        // "The files.0 failed to upload." gives no actionable detail.
        $invalid = $this->invalidUploads($request);
        if ($invalid !== []) {
            $key = array_key_first($invalid);
            return $this->error($invalid[$key][0], 422, $invalid);
        }

        $folder = $request->input('folder', 'uploads');
        $uploaded = [];

        try {
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $uploaded[] = $this->media->upload($file, [
                        'folder' => $folder,
                        'uploaded_by' => $request->user()->id,
                    ]);
                }
            } else {
                $uploaded[] = $this->media->upload($request->file('file'), [
                    'folder' => $folder,
                    'alt' => $request->input('alt'),
                    'uploaded_by' => $request->user()->id,
                ]);
            }
        } catch (RuntimeException $e) {
            return $this->error($e->getMessage(), 422);
        }

        foreach ($uploaded as $media) {
            $this->audit->log('media.uploaded', $media, [], ['filename' => $media->original_name], 'Media uploaded');
        }

        return $this->created(count($uploaded) === 1 ? $uploaded[0] : $uploaded, 'Uploaded successfully');
    }

    /**
     * Detect uploads the web server rejected before Laravel ever saw a valid
     * file (size limits, missing temp dir, interrupted transfer).
     *
     * @return array<string, array<int, string>> keyed by input key (e.g. "files.0")
     */
    protected function invalidUploads(Request $request): array
    {
        $errors = [];

        foreach (['file', 'files'] as $source) {
            if (! $request->hasFile($source)) {
                continue;
            }

            $uploaded = $request->file($source);

            if (is_array($uploaded)) {
                foreach ($uploaded as $index => $file) {
                    if ($file instanceof \Illuminate\Http\UploadedFile && ! $file->isValid()) {
                        $errors["{$source}.{$index}"] = [$this->uploadFailureMessage($file->getError())];
                    }
                }
            } elseif ($uploaded instanceof \Illuminate\Http\UploadedFile && ! $uploaded->isValid()) {
                $errors[$source] = [$this->uploadFailureMessage($uploaded->getError())];
            }
        }

        return $errors;
    }

    protected function uploadFailureMessage(int $error): string
    {
        return match ($error) {
            UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'The image is larger than the server upload limit. Reduce the file size, or ask the administrator to raise upload_max_filesize / post_max_size / client_max_body_size.',
            UPLOAD_ERR_PARTIAL => 'The image upload was interrupted. Please try again.',
            UPLOAD_ERR_NO_TMP_DIR => 'The server temporary upload directory is unavailable. Please contact the administrator.',
            UPLOAD_ERR_NO_FILE => 'No file was selected.',
            default => 'The image upload was rejected by the server. Please try again or contact the administrator.',
        };
    }

    public function show(int $id): JsonResponse
    {
        $media = Media::with('uploader:id,name')->findOrFail($id);
        $this->authorize('view', $media);

        return $this->ok($media);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $media = Media::findOrFail($id);
        $this->authorize('update', $media);

        $data = $request->validate([
            'alt' => ['nullable', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'folder' => ['nullable', 'string', 'max:120'],
        ]);

        $media->update($data);

        return $this->ok($media, 'Media updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $media = Media::findOrFail($id);
        $this->authorize('delete', $media);

        try {
            $this->media->delete($media);
        } catch (RuntimeException $e) {
            return $this->error($e->getMessage(), 422);
        }

        $this->audit->log('media.deleted', null, ['filename' => $media->original_name], [], 'Media deleted');

        return $this->ok(null, 'Media deleted');
    }

    public function bulkDestroy(Request $request): JsonResponse
    {
        $this->authorize('delete', Media::class);

        $data = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer'],
        ]);

        $media = Media::whereIn('id', $data['ids'])->get();
        $count = $media->count();

        try {
            foreach ($media as $item) {
                $this->media->delete($item);
            }
        } catch (RuntimeException $e) {
            return $this->error($e->getMessage(), 422);
        }

        $this->audit->log('media.bulk_deleted', null, [], ['count' => $count], "Deleted {$count} media items");

        return $this->ok(['deleted' => $count], 'Media deleted');
    }
}
