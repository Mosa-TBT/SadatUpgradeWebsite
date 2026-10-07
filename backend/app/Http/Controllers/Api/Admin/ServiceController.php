<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Service;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ServiceController extends AdminResourceController
{
    protected function model(): string
    {
        return Service::class;
    }

    protected function searchable(): array
    {
        return ['title', 'short_description'];
    }

    protected function with(): array
    {
        return ['image'];
    }

    protected function rules(Request $request, ?Model $instance = null): array
    {
        $id = $instance?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:services,slug,'.$id],
            'icon' => ['nullable', 'string', 'max:60'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'technologies' => ['nullable', 'array'],
            'technologies.*' => ['string', 'max:255'],
            'image_media_id' => ['nullable', 'integer', 'exists:media,id'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }
}
