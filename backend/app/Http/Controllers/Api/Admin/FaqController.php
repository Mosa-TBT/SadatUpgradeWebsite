<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class FaqController extends AdminResourceController
{
    protected function model(): string
    {
        return Faq::class;
    }

    protected function searchable(): array
    {
        return ['question', 'answer'];
    }

    protected function filterable(): array
    {
        return ['category'];
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
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string'],
            'category' => ['nullable', 'string', 'max:80'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }
}
