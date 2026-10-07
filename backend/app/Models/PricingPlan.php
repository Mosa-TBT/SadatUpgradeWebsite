<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PricingPlan extends Model
{
    use Auditable;
    use SoftDeletes;

    protected $fillable = [
        'name', 'price', 'currency', 'period', 'description', 'features',
        'cta_label', 'cta_url', 'delivery_time', 'is_popular', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'features' => 'array',
        'price' => 'decimal:2',
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
}
