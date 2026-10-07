<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Post;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PostController extends AdminResourceController
{
    protected function model(): string
    {
        return Post::class;
    }

    protected function searchable(): array
    {
        return ['title', 'excerpt'];
    }

    protected function filterable(): array
    {
        return ['category_id'];
    }

    protected function with(): array
    {
        return ['category', 'author:id,name', 'featuredMedia', 'tags'];
    }

    protected function rules(Request $request, ?Model $instance = null): array
    {
        $id = $instance?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:posts,slug,'.$id],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string'],
            'featured_media_id' => ['nullable', 'integer', 'exists:media,id'],
            'category_id' => ['nullable', 'integer', 'exists:post_categories,id'],
            'author_id' => ['nullable', 'integer', 'exists:users,id'],
            'status' => ['nullable', 'in:draft,published,scheduled'],
            'published_at' => ['nullable', 'date'],
            'read_time' => ['nullable', 'integer', 'min:0'],
            'is_featured' => ['boolean'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'og_image' => ['nullable', 'string', 'max:500'],
            'robots_index' => ['boolean'],
            'robots_follow' => ['boolean'],
            'tags' => ['nullable', 'array'],
        ];
    }

    protected function afterStore(Model $model, array $data): void
    {
        $this->syncTags($model, $data);
    }

    protected function afterUpdate(Model $model, array $data): void
    {
        $this->syncTags($model, $data);
    }

    protected function syncTags(Model $model, array $data): void
    {
        if (! array_key_exists('tags', $data)) {
            return;
        }

        $ids = collect($data['tags'] ?? [])->map(function ($tag) {
            if (is_numeric($tag)) {
                return (int) $tag;
            }

            return \App\Models\Tag::firstOrCreate(
                ['slug' => \Illuminate\Support\Str::slug((string) $tag)],
                ['name' => (string) $tag],
            )->id;
        })->filter()->unique()->values()->all();

        $model->tags()->sync($ids);
    }

    public function publish(int|string $id): JsonResponse
    {
        $post = $this->find($id);
        $post->update([
            'status' => $post->status === 'published' ? 'draft' : 'published',
            'published_at' => $post->published_at ?? now(),
        ]);

        return $this->ok($this->fresh($post), 'Post status updated');
    }
}
