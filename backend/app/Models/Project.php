<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasSlug;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use Auditable;
    use HasSlug;
    use SoftDeletes;

    protected $fillable = [
        'title', 'slug', 'category', 'client_name', 'short_description', 'description',
        'duration', 'team_size', 'image_media_id', 'technologies', 'results', 'challenges',
        'solutions', 'testimonial_content', 'testimonial_author', 'testimonial_role',
        'live_url', 'repo_url', 'status', 'is_active', 'is_featured', 'sort_order', 'published_at',
    ];

    protected $casts = [
        'technologies' => 'array',
        'results' => 'array',
        'challenges' => 'array',
        'solutions' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'team_size' => 'integer',
        'sort_order' => 'integer',
        'published_at' => 'datetime',
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
