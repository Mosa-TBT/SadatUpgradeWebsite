<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Theme;
use App\Support\AuditLogger;
use App\Support\ThemeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ThemeController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected ThemeService $themes,
        protected AuditLogger $audit,
    ) {}

    public function defaults(): JsonResponse
    {
        return $this->ok(ThemeService::defaults());
    }

    public function presets(): JsonResponse
    {
        return $this->ok(ThemeService::presets());
    }

    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Theme::class);

        $themes = Theme::query()
            ->withCount('versions')
            ->orderByDesc('is_active')
            ->orderBy('name')
            ->get();

        return $this->ok([
            'themes' => $themes,
            'active_tokens' => $this->themes->tokens(),
            'defaults' => ThemeService::defaults(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Theme::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'tokens' => ['required', 'array'],
        ]);

        $theme = Theme::create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
            'description' => $data['description'] ?? null,
            'tokens' => $data['tokens'],
            'created_by' => $request->user()->id,
        ]);

        $theme->publishVersion($request->user()->id, 'Initial version');

        return $this->created($theme->load('versions'), 'Theme created');
    }

    public function show(int $id): JsonResponse
    {
        $theme = Theme::with('versions')->findOrFail($id);
        $this->authorize('view', $theme);

        return $this->ok($theme);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $theme = Theme::findOrFail($id);
        $this->authorize('update', $theme);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'tokens' => ['required', 'array'],
        ]);

        $theme->update($data);

        if ($theme->is_active) {
            $this->themes->flush();
        }

        return $this->ok($theme->fresh(), 'Theme updated');
    }

    public function duplicate(int $id, Request $request): JsonResponse
    {
        $theme = Theme::findOrFail($id);
        $this->authorize('create', Theme::class);

        $copy = $theme->replicate();
        $copy->name = $theme->name.' Copy';
        $copy->slug = $theme->slug.'-copy-'.Str::lower(Str::random(4));
        $copy->is_active = false;
        $copy->is_system = false;
        $copy->created_by = $request->user()->id;
        $copy->save();
        $copy->publishVersion($request->user()->id, 'Duplicated from '.$theme->name);

        return $this->created($copy->load('versions'), 'Theme duplicated');
    }

    public function activate(int $id, Request $request): JsonResponse
    {
        $theme = Theme::findOrFail($id);
        $this->authorize('publish', $theme);

        $this->themes->activate($theme);
        $theme->publishVersion($request->user()->id, 'Published');
        $this->audit->log('theme.published', $theme, [], ['theme' => $theme->name], 'Theme published');

        return $this->ok($theme->fresh(), 'Theme published and activated');
    }

    public function preview(Request $request): JsonResponse
    {
        $data = $request->validate(['tokens' => ['required', 'array']]);

        return $this->ok($this->mergeDefaults($data['tokens']));
    }

    public function versions(int $id): JsonResponse
    {
        $theme = Theme::findOrFail($id);
        $this->authorize('view', $theme);

        return $this->ok($theme->versions()->with('creator:id,name')->get());
    }

    public function restoreVersion(int $id, int $version, Request $request): JsonResponse
    {
        $theme = Theme::findOrFail($id);
        $this->authorize('update', $theme);

        $snapshot = $theme->versions()->where('version', $version)->firstOrFail();

        $theme->update(['tokens' => $snapshot->tokens]);

        if ($theme->is_active) {
            $this->themes->flush();
        }

        $theme->publishVersion($request->user()->id, "Restored version {$version}");
        $this->audit->log('theme.version_restored', $theme, [], ['version' => $version], "Theme restored to v{$version}");

        return $this->ok($theme->fresh(), "Restored version {$version}");
    }

    public function destroy(int $id): JsonResponse
    {
        $theme = Theme::findOrFail($id);
        $this->authorize('delete', $theme);

        if ($theme->is_active) {
            return $this->error('The active theme cannot be deleted.', 422);
        }

        if ($theme->is_system && Theme::query()->count() <= 1) {
            return $this->error('The last remaining theme cannot be deleted.', 422);
        }

        $theme->delete();

        return $this->ok(null, 'Theme deleted');
    }

    protected function mergeDefaults(array $tokens): array
    {
        $defaults = ThemeService::defaults();

        $merge = function (array $base, array $override) use (&$merge): array {
            foreach ($override as $key => $value) {
                if (is_array($value) && isset($base[$key]) && is_array($base[$key])) {
                    $base[$key] = $merge($base[$key], $value);
                } else {
                    $base[$key] = $value;
                }
            }

            return $base;
        };

        return $merge($defaults, $tokens);
    }
}
