<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tests\FeatureTestCase;

class AuthTest extends FeatureTestCase
{
    public function test_super_admin_can_login(): void
    {
        User::factory()->create([
            'email' => 'admin@test.com',
            'password' => Hash::make('Password@123'),
            'is_super_admin' => true,
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@test.com',
            'password' => 'Password@123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['data' => ['token', 'user' => ['id', 'permissions']]]);
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'admin@test.com',
            'password' => Hash::make('Password@123'),
        ]);

        $this->postJson('/api/auth/login', [
            'email' => 'admin@test.com',
            'password' => 'wrong-password',
        ])->assertStatus(422);

        $this->assertDatabaseHas('login_activities', ['status' => 'failed']);
    }

    public function test_suspended_user_cannot_login(): void
    {
        User::factory()->create([
            'email' => 'blocked@test.com',
            'password' => Hash::make('Password@123'),
            'status' => 'suspended',
        ]);

        $this->postJson('/api/auth/login', [
            'email' => 'blocked@test.com',
            'password' => 'Password@123',
        ])->assertStatus(403);

        $this->assertDatabaseHas('login_activities', ['status' => 'blocked']);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/auth/me')->assertUnauthorized();
    }

    public function test_logout_revokes_token(): void
    {
        $user = $this->newAdmin();
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/auth/logout')
            ->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_registration_respects_setting(): void
    {
        $this->postJson('/api/auth/register', [
            'name' => 'New User',
            'email' => 'new@test.com',
            'password' => 'Password@123',
            'password_confirmation' => 'Password@123',
        ])->assertCreated();

        $this->assertDatabaseHas('users', ['email' => 'new@test.com']);
    }
}