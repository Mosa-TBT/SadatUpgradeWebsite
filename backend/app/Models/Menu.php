<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Menu extends Model
{
    use Auditable;
    use SoftDeletes;

    protected $fillable = ['name', 'slug', 'location', 'description', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function auditLabel(): string
    {
        return 'menu';
    }

    public function items(): HasMany
    {
        return $this->hasMany(MenuItem::class)->orderBy('sort_order');
    }

    public function rootItems(): HasMany
    {
        return $this->items()->whereNull('parent_id');
    }
}
