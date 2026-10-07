<?php

namespace App\Policies;

use App\Models\User;

abstract class BasePolicy
{
    /**
     * @var array<string, string> ability => permission slug
     */
    protected array $map = [];

    public function viewAny(User $user): bool
    {
        return $this->allow($user, 'viewAny');
    }

    public function view(User $user, mixed $model): bool
    {
        return $this->allow($user, 'view');
    }

    public function create(User $user): bool
    {
        return $this->allow($user, 'create');
    }

    public function update(User $user, mixed $model): bool
    {
        return $this->allow($user, 'update');
    }

    public function delete(User $user, mixed $model): bool
    {
        return $this->allow($user, 'delete');
    }

    protected function allow(User $user, string $ability): bool
    {
        $slug = $this->map[$ability] ?? null;

        if (! $slug) {
            return false;
        }

        return $user->hasPermission($slug);
    }
}
