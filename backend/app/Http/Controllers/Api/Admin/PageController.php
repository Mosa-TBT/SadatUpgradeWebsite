<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Page;
use App\Support\AuditLogger;
use App\Support\BlockRegistry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PageController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditLogger $audit) {}

    public function blocks(): JsonResponse
    {
        return $this->ok(BlockRegistry::all());
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Page::class);

        $query = Page::query()->with(['author:id,name', 'featuredMedia'])->withCount('sections');

        if ($search = $request->string('search')->trim()->value()) {
            $query->where(fn ($q) => $q->where('title', 'like', "%{$search}%")->orWhere('slug', 'like', "%{$search}%"));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return $this->ok(
            $query->orderByDesc('updated_at')->paginate(min((int) $request->input('per_page', 15), 100))->withQueryString()
        );
    }

    public function show(string $id): JsonResponse
    {
        $page = Page::with(['sections', 'author:id,name', 'featuredMedia'])->withCount('revisions')->findOrFail($id);
        $this->authorize('view', $page);

        return $this->ok($page);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $page = Page::findOrFail($id);
        $this->authorize('update', $page);

        $data = $this->validatePage($request, $page);
        $sections = $data['sections'] ?? null;
        unset($data['sections']);

        DB::transaction(function () use ($page, $data, $sections, $request) {
            $this->snapshot($page, $request->user()->id, 'Before update');
            $page->update($data);

            if (is_array($sections)) {
                $this->syncSectionsInternal($page, $sections);
            }
        });

        return $this->ok($page->fresh('sections'), 'Page updated');
    }

    public function destroy(string $id): JsonResponse
    {
        $page = Page::findOrFail($id);
        $this->authorize('delete', $page);

        if ($page->is_system) {
            return $this->error('System pages cannot be deleted.', 422);
        }

        $page->delete();

        return $this->ok(null, 'Page deleted');
    }

    public function publish(Request $request, string $id): JsonResponse
    {
        $page = Page::findOrFail($id);
        $this->authorize('publish', $page);

        $page->update([
            'status' => $page->status === 'published' ? 'draft' : 'published',
            'published_at' => $page->published_at ?? now(),
        ]);
        $this->snapshot($page, $request->user()->id, 'Status: '.$page->status);

        return $this->ok($page, 'Page status updated');
    }

    public function schedule(Request $request, string $id): JsonResponse
    {
        $page = Page::findOrFail($id);
        $this->authorize('publish', $page);

        $data = $request->validate(['published_at' => ['required', 'date', 'after:now']]);

        $page->update(['status' => 'scheduled', 'published_at' => $data['published_at']]);

        return $this->ok($page, 'Page scheduled');
    }

    public function syncSections(Request $request, string $id): JsonResponse
    {
        $page = Page::findOrFail($id);
        $this->authorize('update', $page);

        $data = $request->validate([
            'sections' => ['present', 'array'],
        ]);

        DB::transaction(function () use ($page, $data, $request) {
            $this->syncSectionsInternal($page, $data['sections']);
            $this->snapshot($page, $request->user()->id, 'Sections updated');
        });

        return $this->ok($page->fresh('sections'), 'Sections saved');
    }

    public function revisions(string $id): JsonResponse
    {
        $page = Page::findOrFail($id);
        $this->authorize('view', $page);

        return $this->ok($page->revisions()->with('creator:id,name')->get());
    }

    public function restoreRevision(Request $request, string $id, int $revision): JsonResponse
    {
        $page = Page::findOrFail($id);
        $this->authorize('update', $page);

        $snapshot = $page->revisions()->findOrFail($revision);
        $data = $snapshot->snapshot;
        $sections = $data['sections'] ?? [];
        unset($data['sections'], $data['id'], $data['created_at'], $data['updated_at'], $data['deleted_at']);

        DB::transaction(function () use ($page, $data, $sections, $request) {
            $page->update($data);
            $this->syncSectionsInternal($page, $sections);
            $this->snapshot($page, $request->user()->id, 'Restored revision');
        });

        return $this->ok($page->fresh('sections'), 'Revision restored');
    }

    protected function validatePage(Request $request, ?Page $page = null): array
    {
        $id = $page?->id;

        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:pages,slug,'.$id],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string'],
            'status' => ['nullable', 'in:draft,published,scheduled'],
            'template' => ['nullable', 'string', 'max:60'],
            'featured_media_id' => ['nullable', 'integer', 'exists:media,id'],
            'author_id' => ['nullable', 'integer', 'exists:users,id'],
            'published_at' => ['nullable', 'date'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_home' => ['boolean'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'seo_keywords' => ['nullable', 'string', 'max:255'],
            'og_title' => ['nullable', 'string', 'max:255'],
            'og_description' => ['nullable', 'string', 'max:500'],
            'og_image' => ['nullable', 'string', 'max:500'],
            'canonical_url' => ['nullable', 'string', 'max:500'],
            'robots_index' => ['boolean'],
            'robots_follow' => ['boolean'],
            'sections' => ['nullable', 'array'],
            'sections.*.id' => ['nullable', 'integer'],
            'sections.*.type' => ['required_with:sections', 'string', 'in:'.implode(',', BlockRegistry::keys())],
            'sections.*.name' => ['nullable', 'string', 'max:120'],
            'sections.*.sort_order' => ['nullable', 'integer', 'min:0'],
            'sections.*.data' => ['nullable', 'array'],
            'sections.*.is_active' => ['boolean'],
        ]);
    }

    protected function applySections(Page $page, array $sections, int $userId): void
    {
        $page->update(['author_id' => $page->author_id ?? $userId]);
        $this->syncSectionsInternal($page, $sections);
    }

    protected function syncSectionsInternal(Page $page, array $sections): void
    {
        $keepIds = [];

        foreach (array_values($sections) as $index => $section) {
            $attributes = [
                'type' => $section['type'],
                'name' => $section['name'] ?? null,
                'sort_order' => $section['sort_order'] ?? $index,
                'data' => $section['data'] ?? [],
                'is_active' => $section['is_active'] ?? true,
            ];

            if (! empty($section['id'])) {
                $existing = $page->sections()->find($section['id']);

                if ($existing) {
                    $existing->update($attributes);
                    $keepIds[] = $existing->id;

                    continue;
                }
            }

            $created = $page->sections()->create($attributes);
            $keepIds[] = $created->id;
        }

        $page->sections()->whereNotIn('id', $keepIds)->delete();
    }

    protected function snapshot(Page $page, int $userId, string $note): void
    {
        $page->load('sections');

        $page->revisions()->create([
            'snapshot' => $page->toArray(),
            'note' => $note,
            'created_by' => $userId,
        ]);
    }
}
