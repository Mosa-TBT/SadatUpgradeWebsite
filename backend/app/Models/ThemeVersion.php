<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ThemeVersion extends Model
{
    protected $fillable = ['theme_id', 'version', 'tokens', 'note', 'created_by'];

    protected $casts = ['tokens' => 'array'];

    public function theme(): BelongsTo
    {
        return $this->belongsTo(Theme::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
