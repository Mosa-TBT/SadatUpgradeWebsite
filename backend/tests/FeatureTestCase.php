<?php

namespace Tests;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RbacSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class FeatureTestCase extends BaseTestCase
{
    use RefreshDatabase;

    protected function newAdmin(): User
    {
        return User::factory()->create([
            'is_super_admin' => true,
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
    }

    protected function actingAsAdmin(): static
    {
        return $this->actingAs($this->newAdmin(), 'sanctum');
    }

    protected function seedRbac(): void
    {
        $this->seed(RbacSeeder::class);
    }

    protected function newUserWithRole(string $roleSlug): User
    {
        $this->seedRbac();
        $user = User::factory()->create([
            'is_super_admin' => false,
            'status' => 'active',
        ]);
        $user->syncRoles([Role::query()->where('slug', $roleSlug)->firstOrFail()->id]);

        return $user;
    }

    protected function actingAsRole(string $roleSlug): static
    {
        return $this->actingAs($this->newUserWithRole($roleSlug), 'sanctum');
    }
}