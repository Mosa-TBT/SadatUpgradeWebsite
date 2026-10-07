<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Page extends Model
{
    use Auditable;
    use SoftDeletes;

    protected $fillable = [
        'title', 'slug', 'excerpt', 'content', 'status', 'template',
        'featured_media_id', 'author_id', 'published_at', 'sort_order', 'is_home', 'is_system',
        'seo_title', 'seo_description', 'seo_keywords', 'og_title', 'og_description',
        'og_image', 'canonical_url', 'robots_index', 'robots_follow',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_home' => 'boolean',
        'is_system' => 'boolean',
        'robots_index' => 'boolean',
        'robots_follow' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function featuredMedia(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'featured_media_id');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class)->orderBy('sort_order');
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(PageRevision::class)->orderByDesc('created_at');
    }

    public function isPublished(): bool
    {
        return $this->status === 'published'
            && (is_null($this->published_at) || $this->published_at->isPast());
    }
}
