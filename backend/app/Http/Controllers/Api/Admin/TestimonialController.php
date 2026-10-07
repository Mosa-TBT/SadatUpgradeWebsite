<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class TestimonialController extends AdminResourceController
{
    protected function model(): string
    {
        return Testimonial::class;
    }

    protected function searchable(): array
    {
        return ['name', 'role', 'content'];
    }

    protected function with(): array
    {
        return ['avatar'];
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
            'role' => ['nullable', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'avatar_media_id' => ['nullable', 'integer', 'exists:media,id'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
