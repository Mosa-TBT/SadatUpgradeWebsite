<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Support\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MenuController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditLogger $audit) {}

    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Menu::class);

        $menus = Menu::query()->with('items')->orderBy('location')->orderBy('name')->get()
            ->map(fn (Menu $menu) => [
                ...$menu->toArray(),
                'items' => $this->tree($menu->items),
            ]);

        return $this->ok($menus);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Menu::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:menus,slug'],
            'location' => ['required', 'string', 'max:60'],
            'description' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        return $this->created(Menu::create($data), 'Menu created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $menu = Menu::findOrFail($id);
        $this->authorize('update', $menu);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:menus,slug,'.$menu->id],
            'location' => ['required', 'string', 'max:60'],
            'description' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $menu->update($data);

        return $this->ok($menu->fresh(), 'Menu updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $menu = Menu::findOrFail($id);
        $this->authorize('delete', $menu);

        $menu->delete();

        return $this->ok(null, 'Menu deleted');
    }

    public function storeItem(Request $request, int $menuId): JsonResponse
    {
        $menu = Menu::findOrFail($menuId);
        $this->authorize('update', $menu);

        $data = $this->validateItem($request, $menu);

        $item = $menu->items()->create($data);

        return $this->created($item, 'Menu item added');
    }

    public function updateItem(Request $request, int $menuId, int $itemId): JsonResponse
    {
        $menu = Menu::findOrFail($menuId);
        $this->authorize('update', $menu);

        $item = $menu->items()->findOrFail($itemId);
        $item->update($this->validateItem($request, $menu, $item));

        return $this->ok($item->fresh(), 'Menu item updated');
    }

    public function destroyItem(int $menuId, int $itemId): JsonResponse
    {
        $menu = Menu::findOrFail($menuId);
        $this->authorize('update', $menu);

        $menu->items()->findOrFail($itemId)->delete();

        return $this->ok(null, 'Menu item removed');
    }

    public function reorder(Request $request, int $menuId): JsonResponse
    {
        $menu = Menu::findOrFail($menuId);
        $this->authorize('update', $menu);

        $data = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer'],
            'items.*.parent_id' => ['nullable', 'integer'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($menu, $data) {
            foreach ($data['items'] as $item) {
                $menu->items()->whereKey($item['id'])->update([
                    'parent_id' => $item['parent_id'] ?? null,
                    'sort_order' => $item['sort_order'],
                ]);
            }
        });

        return $this->ok(null, 'Menu order updated');
    }

    protected function validateItem(Request $request, Menu $menu, ?MenuItem $item = null): array
    {
        return $request->validate([
            'parent_id' => ['nullable', 'integer', 'exists:menu_items,id'],
            'label' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:internal,external,page,none'],
            'url' => ['nullable', 'string', 'max:500'],
            'page_id' => ['nullable', 'integer', 'exists:pages,id'],
            'target' => ['nullable', 'in:_self,_blank'],
            'icon' => ['nullable', 'string', 'max:60'],
            'visibility' => ['nullable', 'in:always,authenticated,guest'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);
    }

    /**
     * @param  \Illuminate\Support\Collection<int, MenuItem>  $items
     */
    protected function tree($items, ?int $parentId = null): array
    {
        return $items
            ->where('parent_id', $parentId)
            ->sortBy('sort_order')
            ->values()
            ->map(fn (MenuItem $item) => [
                ...$item->toArray(),
                'resolved_url' => $item->resolved_url,
                'page_title' => $item->page?->title,
                'children' => $this->tree($items, $item->id),
            ])
            ->all();
    }
}
