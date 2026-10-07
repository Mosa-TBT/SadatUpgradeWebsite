<?php

namespace App\Support;

use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class MediaService
{
    public function __construct(protected SettingService $settings) {}

    public function upload(UploadedFile $file, array $options = []): Media
    {
        $this->guard($file);

        $disk = $options['disk'] ?? $this->settings->get('storage', 'storage_disk', 'public');
        $folder = trim($options['folder'] ?? 'uploads', '/');
        $extension = Str::lower($file->getClientOriginalExtension() ?: $file->extension());
        $basename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) ?: 'file';
        $filename = $basename.'-'.Str::lower(Str::random(8)).($extension ? '.'.$extension : '');

        $path = $file->storeAs($folder, $filename, ['disk' => $disk]);

        if (! $path) {
            throw new RuntimeException('Unable to store the uploaded file.');
        }

        [$width, $height] = $this->dimensions($file);

        $media = Media::create([
            'disk' => $disk,
            'folder' => $folder,
            'path' => $path,
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType() ?: $file->getMimeType(),
            'extension' => $extension,
            'size' => $file->getSize(),
            'width' => $width,
            'height' => $height,
            'alt' => $options['alt'] ?? null,
            'title' => $options['title'] ?? pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'uploaded_by' => $options['uploaded_by'] ?? auth()->id(),
        ]);

        $thumbPath = $this->generateThumbnail($file, $media, $folder, $basename, $disk);

        if ($thumbPath) {
            $media->update(['thumb_path' => $thumbPath]);
        }

        return $media->refresh();
    }

    public function delete(Media $media): void
    {
        Storage::disk($media->disk)->delete(array_filter([$media->path, $media->thumb_path]));
        $media->forceDelete();
    }

    protected function guard(UploadedFile $file): void
    {
        $maxKb = (int) $this->settings->get('storage', 'max_upload_size_kb', 5120);

        if ($file->getSize() > $maxKb * 1024) {
            throw new RuntimeException("The file exceeds the maximum upload size of {$maxKb} KB.");
        }

        $mime = $file->getClientMimeType() ?: '';
        $allowed = array_filter(array_map('trim', explode(',', implode(',', [
            $this->settings->get('storage', 'allowed_image_types', 'jpg,jpeg,png,webp,gif,svg'),
            $this->settings->get('storage', 'allowed_document_types', 'pdf,doc,docx,xls,xlsx,ppt,pptx,txt,csv,zip'),
        ]))));

        $extension = Str::lower($file->getClientOriginalExtension());

        if (! in_array($extension, $allowed, true)) {
            throw new RuntimeException("Files with the .{$extension} extension are not allowed.");
        }

        $safeMimes = [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
            'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain', 'text/csv', 'application/zip', 'application/x-zip-compressed', 'application/octet-stream',
        ];

        if ($mime && ! in_array($mime, $safeMimes, true) && ! str_starts_with($mime, 'image/')) {
            throw new RuntimeException('Unsupported file type.');
        }
    }

    /**
     * @return array{0: ?int, 1: ?int}
     */
    protected function dimensions(UploadedFile $file): array
    {
        try {
            if (str_starts_with((string) $file->getMimeType(), 'image/') && $file->getMimeType() !== 'image/svg+xml') {
                $size = @getimagesize($file->getRealPath());

                if ($size) {
                    return [$size[0], $size[1]];
                }
            }
        } catch (\Throwable) {
            // ignore
        }

        return [null, null];
    }

    protected function generateThumbnail(UploadedFile $file, Media $media, string $folder, string $basename, string $disk): ?string
    {
        if (! $this->settings->get('storage', 'generate_thumbnails', true)) {
            return null;
        }

        if (! str_starts_with((string) $media->mime_type, 'image/') || $media->mime_type === 'image/svg+xml') {
            return null;
        }

        if (! function_exists('imagecreatetruecolor')) {
            return null;
        }

        $target = (int) $this->settings->get('storage', 'thumbnail_width', 400);
        $quality = (int) $this->settings->get('storage', 'image_quality', 85);

        try {
            $source = match ($media->mime_type) {
                'image/jpeg', 'image/jpg' => imagecreatefromjpeg($file->getRealPath()),
                'image/png' => imagecreatefrompng($file->getRealPath()),
                'image/webp' => function_exists('imagecreatefromwebp') ? imagecreatefromwebp($file->getRealPath()) : null,
                'image/gif' => imagecreatefromgif($file->getRealPath()),
                default => null,
            };

            if (! $source) {
                return null;
            }

            $width = imagesx($source);
            $height = imagesy($source);
            $ratio = $target / max($width, 1);
            $newWidth = max(1, (int) round($width * $ratio));
            $newHeight = max(1, (int) round($height * $ratio));

            $canvas = imagecreatetruecolor($newWidth, $newHeight);
            imagealphablending($canvas, false);
            imagesavealpha($canvas, true);
            imagecopyresampled($canvas, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

            $thumbRelative = trim($folder, '/').'/thumbs/'.$basename.'-'.Str::lower(Str::random(6)).'.webp';
            $thumbFull = Storage::disk($disk)->path($thumbRelative);
            @mkdir(dirname($thumbFull), 0775, true);
            imagewebp($canvas, $thumbFull, $quality);

            imagedestroy($source);
            imagedestroy($canvas);

            return $thumbRelative;
        } catch (\Throwable) {
            return null;
        }
    }
}
