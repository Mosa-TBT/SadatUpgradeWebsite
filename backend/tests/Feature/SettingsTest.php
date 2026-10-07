<?php

namespace Tests\Feature;

use App\Models\Setting;
use Tests\FeatureTestCase;

class SettingsTest extends FeatureTestCase
{
    public function test_admin_can_view_settings_registry(): void
    {
        $this->actingAsAdmin()
            ->getJson('/api/admin/settings/registry')
            ->assertOk()
            ->assertJsonPath('data.general.fields.0.type', 'string');
    }

    public function test_settings_can_be_updated_and_persist(): void
    {
        $this->actingAsAdmin()
            ->putJson('/api/admin/settings/general', [
                'values' => ['site_name' => 'Studio Upgrade', 'tagline' => 'We ship fast'],
            ])
            ->assertOk();

        $this->assertDatabaseHas('settings', [
            'group' => 'general',
            'key' => 'site_name',
            'value' => 'Studio Upgrade',
        ]);

        $this->actingAsAdmin()
            ->getJson('/api/admin/settings/general')
            ->assertJsonPath('data.fields.0.value', 'Studio Upgrade');
    }

    public function test_editor_cannot_update_settings(): void
    {
        $this->actingAsRole('editor')
            ->putJson('/api/admin/settings/security', [
                'values' => ['session_lifetime' => 5],
            ])
            ->assertForbidden();
    }

    public function test_unknown_keys_are_ignored(): void
    {
        $this->actingAsAdmin()
            ->putJson('/api/admin/settings/general', [
                'values' => ['not_a_real_key' => 'x'],
            ])
            ->assertOk();

        $this->assertDatabaseMissing('settings', ['key' => 'not_a_real_key']);
    }

    public function test_public_configuration_exposes_only_public_settings(): void
    {
        $this->actingAsAdmin()
            ->putJson('/api/admin/settings/general', ['values' => ['site_name' => 'Public Name']])
            ->assertOk();
        $this->actingAsAdmin()
            ->putJson('/api/admin/settings/security', ['values' => ['session_lifetime' => 999]])
            ->assertOk();
        $this->actingAsAdmin()
            ->putJson('/api/admin/settings/email', ['values' => ['mail_password' => 'secret-value']])
            ->assertOk();

        $config = $this->getJson('/api/public/config')->assertOk()->json('data');

        $this->assertEquals('Public Name', $config['settings']['general']['site_name'] ?? null);
        $this->assertArrayNotHasKey('session_lifetime', $config['settings']['security'] ?? []);
    }

    public function test_sensitive_setting_is_encrypted_at_rest(): void
    {
        $this->actingAsAdmin()
            ->putJson('/api/admin/settings/email', ['values' => ['mail_password' => 'SecretPass!']])
            ->assertOk();

        $row = Setting::query()->where('key', 'mail_password')->first();
        $this->assertTrue($row->is_encrypted);
        $this->assertNotSame('SecretPass!', $row->value);
    }
}