<?php

namespace Tests\Feature;

use App\Models\Page;
use Tests\FeatureTestCase;

class PageTest extends FeatureTestCase
{
    public function test_page_can_be_created_with_sections(): void
    {
        $this->actingAsAdmin()
            ->postJson('/api/admin/pages', [
                'title' => 'Landing',
                'status' => 'draft',
                'sections' => [
                    ['type' => 'hero', 'data' => ['title' => 'Hello hero']],
                    ['type' => 'cta', 'data' => ['title' => 'Buy now']],
                ],
            ])
            ->assertCreated()
            ->assertJsonCount(2, 'data.sections');

        $page = Page::where('title', 'Landing')->first();
        $this->assertNotNull($page);
        $this->assertCount(2, $page->sections);
        $this->assertDatabaseHas('page_sections', ['type' => 'hero', 'page_id' => $page->id]);
    }

    public function test_invalid_block_type_is_rejected(): void
    {
        $this->actingAsAdmin()
            ->postJson('/api/admin/pages', [
                'title' => 'Bad',
                'sections' => [['type' => 'not-a-real-block']],
            ])
            ->assertStatus(422);
    }

    public function test_page_can_be_published(): void
    {
        $page = Page::create(['title' => 'Draft Page', 'slug' => 'draft-page', 'status' => 'draft']);

        $this->actingAsAdmin()
            ->postJson("/api/admin/pages/{$page->id}/publish")
            ->assertOk();

        $this->assertEquals('published', $page->fresh()->status);
        $this->assertNotNull($page->fresh()->published_at);
    }

    public function test_sections_can_be_synced(): void
    {
        $page = Page::create(['title' => 'Sync Page', 'slug' => 'sync-page']);
        $existing = $page->sections()->create(['type' => 'text', 'data' => ['title' => 'a']]);

        $this->actingAsAdmin()
            ->putJson("/api/admin/pages/{$page->id}/sections", [
                'sections' => [
                    ['id' => $existing->id, 'type' => 'text', 'data' => ['title' => 'updated']],
                    ['type' => 'divider'],
                ],
            ])
            ->assertOk();

        $this->assertCount(2, $page->sections()->get());
        $this->assertEquals('updated', $page->sections()->find($existing->id)->data['title']);
    }

    public function test_revision_can_be_restored(): void
    {
        $page = Page::create(['title' => 'V1', 'slug' => 'v1', 'content' => 'original text']);

        $this->actingAsAdmin()
            ->putJson("/api/admin/pages/{$page->id}", [
                'title' => 'V1',
                'slug' => 'v1',
                'content' => 'new text',
            ])
            ->assertOk();

        $this->assertEquals('new text', $page->fresh()->content);
        $revision = $page->revisions()->orderBy('id')->first();
        $this->assertNotNull($revision);
        $this->assertEquals('original text', $revision->snapshot['content']);

        $this->actingAsAdmin()
            ->postJson("/api/admin/pages/{$page->id}/revisions/{$revision->id}/restore")
            ->assertOk();

        $this->assertEquals('original text', $page->fresh()->content);
    }

    public function test_page_can_be_deleted(): void
    {
        $page = Page::create(['title' => 'Delete Me', 'slug' => 'delete-me']);

        $this->actingAsAdmin()
            ->deleteJson("/api/admin/pages/{$page->id}")
            ->assertOk();

        $this->assertSoftDeleted('pages', ['id' => $page->id]);
    }
}