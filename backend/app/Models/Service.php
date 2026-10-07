<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasSlug;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use Auditable;
    use HasSlug;
    use SoftDeletes;

    protected $fillable = [
        'title', 'slug', 'icon', 'short_description', 'description',
        'features', 'technologies', 'image_media_id', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'technologies' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = ['image_url'];

    public function image(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'image_media_id');
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image?->url;
    }
}
