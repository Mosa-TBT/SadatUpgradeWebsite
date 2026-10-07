<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\TeamMember;
use App\Http\Resources\TeamMemberResource;
use Database\Seeders\TeamSeeder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Tests\FeatureTestCase;

class TeamMemberFlowTest extends FeatureTestCase
{
    protected function seedTeam(): void
    {
        Storage::fake('public');
        $this->seed(TeamSeeder::class);
    }

    public function test_seeder_creates_two_team_members_from_filenames(): void
    {
        $this->seedTeam();

        $this->assertDatabaseHas('team_members', [
            'name' => 'Sayeed Najmuldin Sadat',
            'role' => 'CEO',
            'status' => 'active',
            'sort_order' => 1,
        ]);

        $this->assertDatabaseHas('team_members', [
            'name' => 'Mosa Barekzai',
            'role' => 'Developer',
            'status' => 'active',
            'sort_order' => 2,
        ]);

        foreach (['SayeedNajmuldinSadatCeo.png', 'MosaBarekzaiDeveloper.jpeg'] as $name) {
            $media = Media::where('original_name', $name)->first();
            $this->assertNotNull($media, "Media not created for {$name}");
            $this->assertEquals('uploads/team', $media->folder);
            Storage::disk('public')->assertExists($media->path);
        }
    }

    public function test_public_team_returns_only_active_members_in_order(): void
    {
        $admin = \App\Models\User::factory()->create(['is_super_admin' => true, 'status' => 'active']);
        $auth = $this->actingAs($admin, 'sanctum');
        $token = $admin->createToken('t')->plainTextToken;

        $this->withToken($token)->postJson('/api/admin/team', [
            'name' => 'Zed',
            'role' => 'Designer',
            'sort_order' => 5,
            'status' => 'active',
        ])->assertCreated();

        $this->withToken($token)->postJson('/api/admin/team', [
            'name' => 'Alpha',
            'role' => 'Manager',
            'sort_order' => 1,
            'status' => 'active',
        ])->assertCreated();

        $this->withToken($token)->postJson('/api/admin/team', [
            'name' => 'Hidden',
            'role' => 'Intern',
            'sort_order' => 2,
            'status' => 'inactive',
        ])->assertCreated();

        $data = $this->getJson('/api/public/team')->assertOk()->json('data');

        $this->assertCount(2, $data);
        $this->assertEquals('Alpha', $data[0]['name']);
        $this->assertEquals('Zed', $data[1]['name']);
        $this->assertArrayNotHasKey('email', $data[0]);
    }

    public function test_new_member_appears_without_waiting_for_cache_expiry(): void
    {
        // Prime the public cache with an empty team.
        Cache::put(\App\Observers\TeamMemberObserver::CACHE_KEY, collect(), now()->addMinutes(15));

        $admin = \App\Models\User::factory()->create(['is_super_admin' => true, 'status' => 'active']);
        $token = $admin->createToken('t')->plainTextToken;

        $this->withToken($token)->postJson('/api/admin/team', [
            'name' => 'Fresh Face',
            'role' => 'Developer',
            'status' => 'active',
            'sort_order' => 1,
        ])->assertCreated();

        $data = $this->getJson('/api/public/team')->assertOk()->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('Fresh Face', $data[0]['name']);
    }

    public function test_inactive_member_disappears_from_public(): void
    {
        $member = TeamMember::create([
            'name' => 'Toggle Me',
            'role' => 'Engineer',
            'status' => 'active',
            'sort_order' => 1,
        ]);

        $admin = \App\Models\User::factory()->create(['is_super_admin' => true, 'status' => 'active']);
        $token = $admin->createToken('t')->plainTextToken;

        $this->withToken($token)->postJson("/api/admin/team/{$member->id}/toggle")->assertOk();

        $this->getJson('/api/public/team')->assertJsonCount(0, 'data');
    }

    public function test_portfolio_url_is_optional(): void
    {
        $admin = \App\Models\User::factory()->create(['is_super_admin' => true, 'status' => 'active']);
        $token = $admin->createToken('t')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/admin/team', [
                'name' => 'No Portfolio',
                'role' => 'Developer',
                'status' => 'active',
                'portfolio_url' => null,
            ])
            ->assertCreated();

        $this->assertDatabaseHas('team_members', ['name' => 'No Portfolio', 'portfolio_url' => null]);
    }

    public function test_valid_portfolio_url_is_accepted(): void
    {
        $admin = \App\Models\User::factory()->create(['is_super_admin' => true, 'status' => 'active']);
        $token = $admin->createToken('t')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/admin/team', [
                'name' => 'With Portfolio',
                'role' => 'Designer',
                'status' => 'active',
                'portfolio_url' => 'https://example.com/sayeed',
            ])
            ->assertCreated();

        $this->assertDatabaseHas('team_members', ['name' => 'With Portfolio', 'portfolio_url' => 'https://example.com/sayeed']);
    }

    public function test_unsafe_portfolio_schemes_are_rejected(): void
    {
        $admin = \App\Models\User::factory()->create(['is_super_admin' => true, 'status' => 'active']);
        $token = $admin->createToken('t')->plainTextToken;

        foreach (['javascript:alert(1)', 'data:text/html,<script>', 'vbscript:msgbox(1)'] as $unsafe) {
            $this->withToken($token)
                ->postJson('/api/admin/team', [
                    'name' => 'Unsafe',
                    'role' => 'Developer',
                    'status' => 'active',
                    'portfolio_url' => $unsafe,
                ])
                ->assertStatus(422);
        }

        $this->assertDatabaseCount('team_members', 0);
    }

    public function test_position_is_required(): void
    {
        $admin = \App\Models\User::factory()->create(['is_super_admin' => true, 'status' => 'active']);
        $token = $admin->createToken('t')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/admin/team', [
                'name' => 'No Position',
                'status' => 'active',
            ])
            ->assertStatus(422);
    }

    public function test_public_resource_shape(): void
    {
        $member = TeamMember::create([
            'name' => 'Shape Test',
            'role' => 'CEO',
            'status' => 'active',
            'sort_order' => 1,
            'portfolio_url' => null,
        ]);

        $resource = TeamMemberResource::make($member)->resolve();
        $this->assertArrayHasKey('id', $resource);
        $this->assertArrayHasKey('name', $resource);
        $this->assertEquals('CEO', $resource['position']);
        $this->assertArrayHasKey('portfolio_url', $resource);
        $this->assertArrayHasKey('image_url', $resource);
        $this->assertArrayHasKey('sort_order', $resource);
    }
}