<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasSlug;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobOpening extends Model
{
    use Auditable;
    use HasSlug;
    use SoftDeletes;

    protected $fillable = [
        'title', 'slug', 'department', 'location', 'type', 'salary',
        'description', 'requirements', 'status', 'posted_at', 'sort_order',
    ];

    protected $casts = [
        'requirements' => 'array',
        'posted_at' => 'datetime',
        'sort_order' => 'integer',
    ];
}
