<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Testimonial extends Model
{
    use Auditable;
    use SoftDeletes;

    protected $fillable = ['name', 'role', 'content', 'rating', 'avatar_media_id', 'is_active', 'sort_order'];

    protected $casts = ['is_active' => 'boolean', 'rating' => 'integer', 'sort_order' => 'integer'];

    protected $appends = ['avatar_url'];

    public function avatar(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'avatar_media_id');
    }

    public function getAvatarUrlAttribute(): ?string
    {
        return $this->avatar?->url;
    }
}
