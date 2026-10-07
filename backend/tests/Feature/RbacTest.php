<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\FeatureTestCase;

class RbacTest extends FeatureTestCase
{
    public function test_super_admin_has_full_access(): void
    {
        $this->actingAsAdmin()
            ->getJson('/api/admin/users')
            ->assertOk();

        $this->actingAsAdmin()
            ->getJson('/api/admin/settings')
            ->assertOk();
    }

    public function test_editor_cannot_access_users(): void
    {
        $this->actingAsRole('editor')
            ->getJson('/api/admin/users')
            ->assertForbidden();
    }

    public function test_editor_can_access_content(): void
    {
        $this->newUserWithRole('editor');

        $this->actingAsRole('editor')
            ->getJson('/api/admin/services')
            ->assertOk();
    }

    public function test_subscriber_cannot_access_admin(): void
    {
        $this->actingAsRole('subscriber')
            ->getJson('/api/admin/dashboard/overview')
            ->assertForbidden();
    }

    public function test_permissions_are_seeded(): void
    {
        $this->seedRbac();

        $this->assertDatabaseHas('permissions', ['slug' => 'users.view']);
        $this->assertDatabaseHas('permissions', ['slug' => 'theme.publish']);
        $this->assertDatabaseHas('permissions', ['slug' => 'logs.view']);
        $this->assertDatabaseHas('roles', ['slug' => 'super-admin']);
        $this->assertDatabaseHas('roles', ['slug' => 'editor']);
    }

    public function test_user_roles_can_be_assigned(): void
    {
        $this->seedRbac();
        $admin = $this->newAdmin();
        $user = User::factory()->create();

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/admin/users/{$user->id}/roles", [
                'roles' => [\App\Models\Role::query()->where('slug', 'editor')->first()->id],
            ])
            ->assertOk();

        $this->assertTrue($user->fresh()->hasRole('editor'));
    }
}