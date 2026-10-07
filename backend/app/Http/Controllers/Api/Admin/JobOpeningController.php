<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\JobOpening;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class JobOpeningController extends AdminResourceController
{
    protected function model(): string
    {
        return JobOpening::class;
    }

    protected function searchable(): array
    {
        return ['title', 'department', 'location'];
    }

    protected function filterable(): array
    {
        return ['department', 'type'];
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
        $id = $instance?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:job_openings,slug,'.$id],
            'department' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:40'],
            'salary' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'requirements' => ['nullable', 'array'],
            'status' => ['nullable', 'in:open,closed'],
            'posted_at' => ['nullable', 'date'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
