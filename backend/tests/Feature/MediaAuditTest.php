<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\FeatureTestCase;

class MediaAuditTest extends FeatureTestCase
{
    protected function fakePng(): UploadedFile
    {
        return UploadedFile::fake()->createWithContent('hero.png', str_repeat('png-data', 50), 'image/png');
    }

    public function test_admin_can_upload_image(): void
    {
        Storage::fake('public');

        $user = $this->newAdmin();
        $token = $user->createToken('t')->plainTextToken;

        $this->withToken($token)
            ->post('/api/admin/media', ['file' => $this->fakePng()])
            ->assertStatus(201);

        $this->assertDatabaseHas('media', [
            'original_name' => 'hero.png',
            'mime_type' => 'image/png',
        ]);

        $media = Media::query()->first();
        Storage::disk('public')->assertExists($media->path);
        $this->assertEquals($user->id, $media->uploaded_by);
    }

    public function test_unauthorized_user_cannot_upload(): void
    {
        Storage::fake('public');

        $subscriber = $this->newUserWithRole('subscriber');
        $token = $subscriber->createToken('t')->plainTextToken;

        $this->withToken($token)
            ->post('/api/admin/media', ['file' => $this->fakePng()])
            ->assertForbidden();

        $this->assertDatabaseCount('media', 0);
    }

    public function test_disallowed_file_type_is_rejected(): void
    {
        $user = $this->newAdmin();
        $token = $user->createToken('t')->plainTextToken;

        $this->withToken($token)
            ->post('/api/admin/media', [
                'file' => UploadedFile::fake()->create('evil.exe', 10, 'application/x-msdos-program'),
            ])
            ->assertStatus(422);
    }

    public function test_media_can_be_deleted_with_file(): void
    {
        Storage::fake('public');

        $user = $this->newAdmin();
        $token = $user->createToken('t')->plainTextToken;

        $this->withToken($token)
            ->post('/api/admin/media', ['file' => $this->fakePng()])
            ->assertStatus(201);

        $media = Media::query()->first();

        $this->withToken($token)
            ->deleteJson("/api/admin/media/{$media->id}")
            ->assertOk();

        $this->assertDatabaseMissing('media', ['id' => $media->id]);
        Storage::disk('public')->assertMissing($media->path);
    }

    public function test_user_update_is_audited(): void
    {
        $admin = $this->newAdmin();
        $target = User::factory()->create(['name' => 'Old Name']);

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/admin/users/{$target->id}", [
                'name' => 'New Name',
                'email' => $target->email,
            ])
            ->assertOk();

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $admin->id,
            'event' => 'user.updated',
        ]);
    }

    public function test_admin_login_creates_login_activity_and_audit(): void
    {
        $user = User::factory()->create(['status' => 'active']);

        $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertOk();

        $this->assertDatabaseHas('login_activities', [
            'user_id' => $user->id,
            'status' => 'success',
        ]);

        $this->assertDatabaseHas('audit_logs', ['event' => 'auth.login']);
    }
}