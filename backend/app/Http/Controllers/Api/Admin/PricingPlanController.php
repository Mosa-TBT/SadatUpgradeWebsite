<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\PricingPlan;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class PricingPlanController extends AdminResourceController
{
    protected function model(): string
    {
        return PricingPlan::class;
    }

    protected function searchable(): array
    {
        return ['name'];
    }

    protected function defaultSort(): string
    {
        return 'sort_order';
    }

    protected function defaultDirection(): string
    {
        return 'asc';
    }

    protected function rules(Request $request, ?Model $instance = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:5'],
            'period' => ['nullable', 'string', 'max:30'],
            'description' => ['nullable', 'string', 'max:500'],
            'features' => ['nullable', 'array'],
            'cta_label' => ['nullable', 'string', 'max:120'],
            'cta_url' => ['nullable', 'url', 'max:500'],
            'delivery_time' => ['nullable', 'string', 'max:60'],
            'is_popular' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
