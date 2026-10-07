<?php

namespace Tests\Feature;

use App\Models\Menu;
use Tests\FeatureTestCase;

class NavigationTest extends FeatureTestCase
{
    public function test_menu_can_be_created(): void
    {
        $this->actingAsAdmin()
            ->postJson('/api/admin/menus', [
                'name' => 'Header Menu',
                'location' => 'header',
            ])
            ->assertCreated();

        $this->assertDatabaseHas('menus', ['name' => 'Header Menu', 'location' => 'header']);
    }

    public function test_menu_items_can_be_added_in_hierarchy(): void
    {
        $menu = Menu::create(['name' => 'Header', 'slug' => 'header', 'location' => 'header']);

        $this->actingAsAdmin()
            ->postJson("/api/admin/menus/{$menu->id}/items", [
                'label' => 'Services',
                'type' => 'internal',
                'url' => '/services',
            ])
            ->assertCreated();

        $parent = $menu->items()->first();

        $this->actingAsAdmin()
            ->postJson("/api/admin/menus/{$menu->id}/items", [
                'parent_id' => $parent->id,
                'label' => 'Web Dev',
                'type' => 'internal',
                'url' => '/services/web',
            ])
            ->assertCreated();

        $this->assertEquals($parent->id, $menu->items()->where('label', 'Web Dev')->first()->parent_id);
    }

    public function test_menu_items_can_be_reordered(): void
    {
        $menu = Menu::create(['name' => 'Header', 'slug' => 'header', 'location' => 'header']);
        $a = $menu->items()->create(['label' => 'A', 'type' => 'internal', 'url' => '/a', 'sort_order' => 0]);
        $b = $menu->items()->create(['label' => 'B', 'type' => 'internal', 'url' => '/b', 'sort_order' => 1]);

        $this->actingAsAdmin()
            ->postJson("/api/admin/menus/{$menu->id}/reorder", [
                'items' => [
                    ['id' => $b->id, 'parent_id' => null, 'sort_order' => 0],
                    ['id' => $a->id, 'parent_id' => null, 'sort_order' => 1],
                ],
            ])
            ->assertOk();

        $this->assertEquals(0, $b->fresh()->sort_order);
        $this->assertEquals(1, $a->fresh()->sort_order);
    }

    public function test_menu_item_can_be_deleted(): void
    {
        $menu = Menu::create(['name' => 'Header', 'slug' => 'header', 'location' => 'header']);
        $item = $menu->items()->create(['label' => 'Temp', 'type' => 'internal', 'url' => '/temp']);

        $this->actingAsAdmin()
            ->deleteJson("/api/admin/menus/{$menu->id}/items/{$item->id}")
            ->assertOk();

        $this->assertDatabaseMissing('menu_items', ['id' => $item->id]);
    }

    public function test_editor_cannot_modify_navigation(): void
    {
        $menu = Menu::create(['name' => 'Header', 'slug' => 'header', 'location' => 'header']);

        $this->actingAsRole('editor')
            ->postJson("/api/admin/menus/{$menu->id}/items", [
                'label' => 'Nope',
                'type' => 'internal',
                'url' => '/nope',
            ])
            ->assertForbidden();
    }
}