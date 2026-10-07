<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class TagController extends AdminResourceController
{
    protected function model(): string
    {
        return Tag::class;
    }

    protected function searchable(): array
    {
        return ['name'];
    }

    protected function rules(Request $request, ?Model $instance = null): array
    {
        $id = $instance?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:tags,slug,'.$id],
        ];
    }
}
