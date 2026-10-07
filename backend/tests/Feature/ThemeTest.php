<?php

namespace Tests\Feature;

use App\Models\Theme;
use Tests\FeatureTestCase;

class ThemeTest extends FeatureTestCase
{
    public function test_theme_can_be_created_and_saved(): void
    {
        $this->actingAsAdmin()
            ->postJson('/api/admin/themes', [
                'name' => 'Custom',
                'tokens' => ['colors' => ['primary' => '#112233']],
            ])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Custom');

        $this->assertDatabaseHas('themes', ['name' => 'Custom']);
        $this->assertDatabaseHas('theme_versions', ['version' => 1]);
    }

    public function test_theme_can_be_updated(): void
    {
        $theme = Theme::create([
            'name' => 'Test',
            'slug' => 'test-theme',
            'tokens' => ['colors' => ['primary' => '#000000']],
        ]);

        $this->actingAsAdmin()
            ->putJson("/api/admin/themes/{$theme->id}", [
                'name' => 'Renamed',
                'tokens' => ['colors' => ['primary' => '#ff00ff']],
            ])
            ->assertOk();

        $this->assertEquals('#ff00ff', $theme->fresh()->tokens['colors']['primary']);
    }

    public function test_theme_publish_creates_version(): void
    {
        $theme = Theme::create([
            'name' => 'Publishable',
            'slug' => 'publishable',
            'tokens' => ['colors' => ['primary' => '#123456']],
        ]);

        $this->actingAsAdmin()
            ->postJson("/api/admin/themes/{$theme->id}/activate")
            ->assertOk();

        $this->assertTrue($theme->fresh()->is_active);
        $this->assertDatabaseHas('theme_versions', ['theme_id' => $theme->id, 'version' => 1]);
    }

    public function test_theme_can_be_duplicated(): void
    {
        $theme = Theme::create([
            'name' => 'Original',
            'slug' => 'original',
            'tokens' => ['colors' => ['primary' => '#abc123']],
        ]);

        $this->actingAsAdmin()
            ->postJson("/api/admin/themes/{$theme->id}/duplicate")
            ->assertCreated();

        $this->assertDatabaseHas('themes', ['name' => 'Original Copy']);
    }

    public function test_active_theme_cannot_be_deleted(): void
    {
        $theme = Theme::create([
            'name' => 'Active',
            'slug' => 'active',
            'is_active' => true,
            'tokens' => ['colors' => []],
        ]);

        $this->actingAsAdmin()
            ->deleteJson("/api/admin/themes/{$theme->id}")
            ->assertStatus(422);

        $this->assertDatabaseHas('themes', ['id' => $theme->id]);
    }

    public function test_editor_cannot_publish_theme(): void
    {
        $this->seedRbac();
        $theme = Theme::create([
            'name' => 'X',
            'slug' => 'x',
            'tokens' => ['colors' => []],
        ]);

        $this->actingAsRole('editor')
            ->postJson("/api/admin/themes/{$theme->id}/activate")
            ->assertForbidden();
    }
}