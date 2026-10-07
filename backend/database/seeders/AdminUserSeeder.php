<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Never commit a static admin password to GitHub. Prefer ADMIN_PASSWORD /
        // EDITOR_PASSWORD from the environment; otherwise generate and log a
        // random one-time password.
        $adminPassword = (string) (env('ADMIN_PASSWORD') ?: Str::password(20));
        $editorPassword = (string) (env('EDITOR_PASSWORD') ?: Str::password(20));

        $admin = User::updateOrCreate(
            ['email' => 'admin@sadatupgrade.com'],
            [
                'name' => 'Sadat Administrator',
                'password' => Hash::make($adminPassword),
                'status' => 'active',
                'is_super_admin' => true,
                'job_title' => 'System Administrator',
                'email_verified_at' => now(),
            ],
        );

        if ($role = Role::query()->where('slug', 'super-admin')->first()) {
            $admin->syncRoles([$role->id]);
        }

        // A non-super-admin editor account to demonstrate RBAC.
        $editor = User::updateOrCreate(
            ['email' => 'editor@sadatupgrade.com'],
            [
                'name' => 'Content Editor',
                'password' => Hash::make($editorPassword),
                'status' => 'active',
                'is_super_admin' => false,
                'job_title' => 'Content Editor',
                'email_verified_at' => now(),
            ],
        );

        if ($role = Role::query()->where('slug', 'editor')->first()) {
            $editor->syncRoles([$role->id]);
        }

        $this->command?->warn('Seeded admin credentials (set ADMIN_PASSWORD/EDITOR_PASSWORD to control):');
        $this->command?->line('  admin@sadatupgrade.com / '.$adminPassword);
        $this->command?->line('  editor@sadatupgrade.com / '.$editorPassword);
    }
}
