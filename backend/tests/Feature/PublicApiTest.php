<?php

namespace Tests\Feature;

use App\Models\Page;
use App\Models\Post;
use Tests\FeatureTestCase;

class PublicApiTest extends FeatureTestCase
{
    public function test_public_config_is_accessible(): void
    {
        $this->getJson('/api/public/config')
            ->assertOk()
            ->assertJsonStructure(['data' => ['settings', 'theme', 'languages', 'maintenance']]);
    }

    public function test_public_menus_are_accessible(): void
    {
        $this->getJson('/api/public/menus')->assertOk();
    }

    public function test_published_pages_are_returned(): void
    {
        Page::create(['title' => 'Live', 'slug' => 'live', 'status' => 'published']);

        $this->getJson('/api/public/pages')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_draft_pages_are_not_returned_publicly(): void
    {
        Page::create(['title' => 'Secret', 'slug' => 'secret', 'status' => 'draft']);

        $this->getJson('/api/public/pages')->assertJsonCount(0, 'data');
    }

    public function test_contact_form_submission_stores_message(): void
    {
        $this->postJson('/api/public/contact', [
            'first_name' => 'Ali',
            'email' => 'ali@test.com',
            'message' => 'I need a website.',
        ])->assertStatus(201);

        $this->assertDatabaseHas('contact_messages', ['email' => 'ali@test.com']);
    }

    public function test_admin_endpoints_require_authentication(): void
    {
        $this->getJson('/api/admin/users')->assertUnauthorized();
        $this->getJson('/api/admin/settings')->assertUnauthorized();
        $this->getJson('/api/admin/audit-logs')->assertUnauthorized();
    }

    public function test_sitemap_is_generated(): void
    {
        Page::create(['title' => 'Home', 'slug' => 'home', 'status' => 'published']);
        Post::create(['title' => 'Hello', 'slug' => 'hello', 'status' => 'published']);

        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertSee('urlset')
            ->assertSee('/hello');
    }
}