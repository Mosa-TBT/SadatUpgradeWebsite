<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RbacSeeder extends Seeder
{
    /**
     * @return array<int, array{slug: string, name: string, group: string}>
     */
    public static function permissions(): array
    {
        $slugs = [
            'dashboard' => ['dashboard.view'],
            'users' => ['users.view', 'users.create', 'users.update', 'users.delete'],
            'roles' => ['roles.view', 'roles.create', 'roles.update', 'roles.delete', 'permissions.view'],
            'pages' => ['pages.view', 'pages.create', 'pages.update', 'pages.delete', 'pages.publish'],
            'posts' => ['posts.view', 'posts.create', 'posts.update', 'posts.delete', 'posts.publish'],
            'content' => ['content.view', 'content.create', 'content.update', 'content.delete'],
            'media' => ['media.view', 'media.upload', 'media.delete'],
            'settings' => ['settings.view', 'settings.update'],
            'theme' => ['theme.view', 'theme.update', 'theme.publish'],
            'navigation' => ['navigation.view', 'navigation.update'],
            'messages' => ['messages.view', 'messages.update', 'messages.delete'],
            'localization' => ['localization.view', 'localization.update'],
            'logs' => ['logs.view'],
            'system' => ['system.view', 'system.manage'],
        ];

        $permissions = [];

        foreach ($slugs as $group => $items) {
            foreach ($items as $slug) {
                $permissions[] = [
                    'slug' => $slug,
                    'name' => ucwords(str_replace(['.', '_'], ' ', $slug)),
                    'group' => $group,
                ];
            }
        }

        return $permissions;
    }

    public function run(): void
    {
        foreach (self::permissions() as $permission) {
            Permission::updateOrCreate(['slug' => $permission['slug']], $permission);
        }

        $all = Permission::query()->pluck('id', 'slug');

        $everyone = $all->only([
            'dashboard.view', 'users.view', 'users.create', 'users.update', 'users.delete',
            'roles.view', 'roles.create', 'roles.update', 'roles.delete', 'permissions.view',
            'pages.view', 'pages.create', 'pages.update', 'pages.delete', 'pages.publish',
            'posts.view', 'posts.create', 'posts.update', 'posts.delete', 'posts.publish',
            'content.view', 'content.create', 'content.update', 'content.delete',
            'media.view', 'media.upload', 'media.delete',
            'settings.view', 'settings.update', 'theme.view', 'theme.update', 'theme.publish',
            'navigation.view', 'navigation.update', 'messages.view', 'messages.update', 'messages.delete',
            'localization.view', 'localization.update', 'logs.view', 'system.view',
        ])->values()->all();

        $roles = [
            'super-admin' => ['name' => 'Super Admin', 'description' => 'Full unrestricted access.', 'is_system' => true, 'permissions' => $all->values()->all()],
            'administrator' => ['name' => 'Administrator', 'description' => 'Manages all site content and settings.', 'is_system' => true, 'permissions' => $everyone],
            'editor' => ['name' => 'Editor', 'description' => 'Creates and publishes content.', 'is_system' => true, 'permissions' => $all->only([
                'dashboard.view', 'pages.view', 'pages.create', 'pages.update', 'pages.publish',
                'posts.view', 'posts.create', 'posts.update', 'posts.publish',
                'content.view', 'content.create', 'content.update',
                'media.view', 'media.upload', 'navigation.view', 'messages.view',
            ])->values()->all()],
            'author' => ['name' => 'Author', 'description' => 'Writes and manages own content.', 'is_system' => true, 'permissions' => $all->only([
                'dashboard.view', 'posts.view', 'posts.create', 'posts.update',
                'content.view', 'media.view', 'media.upload',
            ])->values()->all()],
            'subscriber' => ['name' => 'Subscriber', 'description' => 'Registered website member.', 'is_system' => true, 'permissions' => []],
        ];

        foreach ($roles as $slug => $data) {
            $role = Role::updateOrCreate(
                ['slug' => $slug],
                ['name' => $data['name'], 'description' => $data['description'], 'is_system' => $data['is_system']],
            );

            $role->permissions()->sync($data['permissions']);
        }
    }
}
