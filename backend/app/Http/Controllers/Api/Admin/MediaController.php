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

        $this->audit->log('media.deleted', null, ['filename' => $media->original_name], [], 'Media deleted');
        $this->media->delete($media);

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

        foreach ($media as $item) {
            $this->media->delete($item);
        }

        $this->audit->log('media.bulk_deleted', null, [], ['count' => $count], "Deleted {$count} media items");

        return $this->ok(['deleted' => $count], 'Media deleted');
    }
}
