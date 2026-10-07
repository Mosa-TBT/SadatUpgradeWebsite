<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Media;
use App\Models\Page;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $term = $request->string('q')->trim()->value();

        if (strlen($term) < 2) {
            return $this->ok([]);
        }

        $results = [];

        if ($request->user()->hasPermission('users.view')) {
            $results[] = $this->group('Users', '/admin/users', User::query()
                ->where(fn ($q) => $q->where('name', 'like', "%{$term}%")->orWhere('email', 'like', "%{$term}%"))
                ->limit(5)->get(['id', 'name', 'email']),
                fn (User $u) => ['title' => $u->name, 'subtitle' => $u->email, 'href' => "/admin/users/{$u->id}"]);
        }

        if ($request->user()->hasPermission('pages.view')) {
            $results[] = $this->group('Pages', '/admin/pages', Page::query()
                ->where('title', 'like', "%{$term}%")->limit(5)->get(['id', 'title', 'slug', 'status']),
                fn (Page $p) => ['title' => $p->title, 'subtitle' => $p->status, 'href' => "/admin/pages/{$p->id}"]);
        }

        if ($request->user()->hasPermission('content.view')) {
            $results[] = $this->group('Posts', '/admin/posts', Post::query()
                ->where('title', 'like', "%{$term}%")->limit(5)->get(['id', 'title', 'status']),
                fn (Post $p) => ['title' => $p->title, 'subtitle' => $p->status, 'href' => "/admin/posts/{$p->id}"]);

            $results[] = $this->group('Services', '/admin/services', Service::query()
                ->where('title', 'like', "%{$term}%")->limit(5)->get(['id', 'title']),
                fn (Service $s) => ['title' => $s->title, 'subtitle' => 'Service', 'href' => "/admin/services/{$s->id}"]);

            $results[] = $this->group('Projects', '/admin/projects', Project::query()
                ->where('title', 'like', "%{$term}%")->limit(5)->get(['id', 'title', 'category']),
                fn (Project $p) => ['title' => $p->title, 'subtitle' => $p->category, 'href' => "/admin/projects/{$p->id}"]);
        }

        if ($request->user()->hasPermission('media.view')) {
            $results[] = $this->group('Media', '/admin/media', Media::query()
                ->where('original_name', 'like', "%{$term}%")->limit(5)->get(['id', 'original_name']),
                fn (Media $m) => ['title' => $m->original_name, 'subtitle' => 'Media', 'href' => '/admin/media']);
        }

        return $this->ok(array_values(array_filter($results)));
    }

    protected function group(string $label, string $base, $items, callable $map): array
    {
        return [
            'label' => $label,
            'items' => collect($items)->map($map)->values(),
        ];
    }
}
