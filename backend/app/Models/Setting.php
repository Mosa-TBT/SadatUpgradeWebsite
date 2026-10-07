<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['group', 'key', 'value', 'type', 'is_encrypted', 'is_public'];

    protected $casts = [
        'is_encrypted' => 'boolean',
        'is_public' => 'boolean',
    ];

    public function getRouteKeyName(): string
    {
        return 'key';
    }
}
