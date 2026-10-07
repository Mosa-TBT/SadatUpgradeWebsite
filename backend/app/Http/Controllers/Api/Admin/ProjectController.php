<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Project;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProjectController extends AdminResourceController
{
    protected function model(): string
    {
        return Project::class;
    }

    protected function searchable(): array
    {
        return ['title', 'client_name', 'category'];
    }

    protected function filterable(): array
    {
        return ['category'];
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
        $id = $instance?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:projects,slug,'.$id],
            'category' => ['nullable', 'string', 'max:120'],
            'client_name' => ['nullable', 'string', 'max:255'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'duration' => ['nullable', 'string', 'max:60'],
            'team_size' => ['nullable', 'integer', 'min:0'],
            'image_media_id' => ['nullable', 'integer', 'exists:media,id'],
            'technologies' => ['nullable', 'array'],
            'results' => ['nullable', 'array'],
            'challenges' => ['nullable', 'array'],
            'solutions' => ['nullable', 'array'],
            'testimonial_content' => ['nullable', 'string', 'max:1000'],
            'testimonial_author' => ['nullable', 'string', 'max:255'],
            'testimonial_role' => ['nullable', 'string', 'max:255'],
            'live_url' => ['nullable', 'url', 'max:500'],
            'repo_url' => ['nullable', 'url', 'max:500'],
            'status' => ['nullable', 'in:draft,published'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    public function publish(int|string $id): JsonResponse
    {
        $project = $this->find($id);
        $project->update([
            'status' => $project->status === 'published' ? 'draft' : 'published',
            'published_at' => $project->published_at ?? now(),
        ]);

        return $this->ok($this->fresh($project), 'Project status updated');
    }
}
