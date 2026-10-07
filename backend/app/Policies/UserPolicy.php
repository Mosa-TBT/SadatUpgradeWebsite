<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy extends BasePolicy
{
    protected array $map = [
        'viewAny' => 'users.view',
        'view' => 'users.view',
        'create' => 'users.create',
        'update' => 'users.update',
        'delete' => 'users.delete',
    ];

    public function resetPassword(User $user, User $model): bool
    {
        return $user->hasPermission('users.update');
    }
}
