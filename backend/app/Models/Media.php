<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    use Auditable;
    use SoftDeletes;

    protected $table = 'media';

    protected $fillable = [
        'disk', 'folder', 'path', 'thumb_path', 'filename', 'original_name', 'mime_type',
        'extension', 'size', 'width', 'height', 'alt', 'title', 'uploaded_by',
    ];

    protected $casts = [
        'size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
    ];

    protected $appends = ['url', 'thumbnail_url', 'is_image'];

    public function auditLabel(): string
    {
        return 'media';
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function getUrlAttribute(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    public function getThumbnailUrlAttribute(): string
    {
        if ($this->thumb_path) {
            return Storage::disk($this->disk)->url($this->thumb_path);
        }

        return $this->url;
    }

    public function getIsImageAttribute(): bool
    {
        return str_starts_with((string) $this->mime_type, 'image/');
    }
}
