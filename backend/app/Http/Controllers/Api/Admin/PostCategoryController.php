<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\PostCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class PostCategoryController extends AdminResourceController
{
    protected function model(): string
    {
        return PostCategory::class;
    }

    protected function searchable(): array
    {
        return ['name'];
    }

    protected function with(): array
    {
        return ['posts:id,category_id'];
    }

    protected function rules(Request $request, ?Model $instance = null): array
    {
        $id = $instance?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:post_categories,slug,'.$id],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }
}
