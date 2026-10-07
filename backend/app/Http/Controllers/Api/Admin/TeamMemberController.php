<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\TeamMember;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class TeamMemberController extends AdminResourceController
{
    protected function model(): string
    {
        return TeamMember::class;
    }

    protected function searchable(): array
    {
        return ['name', 'role', 'department'];
    }

    protected function filterable(): array
    {
        return ['department'];
    }

    protected function with(): array
    {
        return ['image'];
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
            'role' => ['required', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'image_media_id' => ['nullable', 'integer', 'exists:media,id'],
            'socials' => ['nullable', 'array'],
            'portfolio_url' => ['nullable', 'url', 'max:500', 'regex:/^https?:\/\//i'],
            'status' => ['nullable', 'in:active,inactive'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
