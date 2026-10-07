<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDashboardWidget extends Model
{
    protected $fillable = ['user_id', 'widget_key', 'sort_order', 'is_visible'];

    protected $casts = ['is_visible' => 'boolean', 'sort_order' => 'integer'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
