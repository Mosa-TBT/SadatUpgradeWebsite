<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasSlug;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use Auditable;
    use HasSlug;
    use SoftDeletes;

    protected $fillable = [
        'title', 'slug', 'excerpt', 'content', 'featured_media_id', 'category_id',
        'author_id', 'status', 'published_at', 'read_time', 'is_featured',
        'seo_title', 'seo_description', 'og_image', 'robots_index', 'robots_follow',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_featured' => 'boolean',
        'robots_index' => 'boolean',
        'robots_follow' => 'boolean',
        'read_time' => 'integer',
    ];

    protected $appends = ['image_url'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(PostCategory::class, 'category_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function featuredMedia(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'featured_media_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'post_tag');
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->featuredMedia?->url;
    }
}
