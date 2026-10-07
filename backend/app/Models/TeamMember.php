<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeamMember extends Model
{
    use Auditable;
    use SoftDeletes;

    protected $fillable = [
        'name', 'role', 'department', 'bio', 'email', 'phone',
        'image_media_id', 'socials', 'portfolio_url', 'status', 'sort_order',
    ];

    protected $casts = ['socials' => 'array', 'sort_order' => 'integer'];

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
