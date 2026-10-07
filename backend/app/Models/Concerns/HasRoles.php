<?php

namespace App\Models\Concerns;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;

trait HasRoles
{
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_user')->withTimestamps();
    }

    public function isSuperAdmin(): bool
    {
        return (bool) $this->is_super_admin;
    }

    public function hasRole(string $slug): bool
    {
        return $this->roles->contains('slug', $slug);
    }

    /**
     * @param  array<int, string>  $slugs
     */
    public function hasAnyRole(array $slugs): bool
    {
        return $this->roles->whereIn('slug', $slugs)->isNotEmpty();
    }

    public function hasPermission(string $slug): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        return $this->allPermissions()->contains('slug', $slug);
    }

    /**
     * @param  array<int, string>  $slugs
     */
    public function hasAnyPermission(array $slugs): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        return $this->allPermissions()->whereIn('slug', $slugs)->isNotEmpty();
    }

    /**
     * @return Collection<int, Permission>
     */
    public function allPermissions(): Collection
    {
        return $this->roles->flatMap->permissions->unique('id')->values();
    }

    /**
     * @return array<int, string>
     */
    public function permissionSlugs(): array
    {
        if ($this->isSuperAdmin()) {
            return Permission::query()->pluck('slug')->all();
        }

        return $this->allPermissions()->pluck('slug')->all();
    }

    /**
     * @param  array<int, int|string>  $roles
     */
    public function assignRole(int|string|array $roles): void
    {
        $ids = Role::query()
            ->whereIn('id', is_array($roles) ? $roles : [$roles])
            ->orWhereIn('slug', is_array($roles) ? $roles : [$roles])
            ->pluck('id');

        $this->roles()->syncWithoutDetaching($ids);
        $this->unsetRelation('roles');
    }

    /**
     * @param  array<int, int|string>  $roles
     */
    public function syncRoles(array $roles): void
    {
        $ids = Role::query()
            ->whereIn('id', $roles)
            ->orWhereIn('slug', $roles)
            ->pluck('id');

        $this->roles()->sync($ids);
        $this->unsetRelation('roles');
    }
}
