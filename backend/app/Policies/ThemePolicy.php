<?php

namespace App\Policies;

class ThemePolicy extends BasePolicy
{
    protected array $map = [
        'viewAny' => 'theme.view',
        'view' => 'theme.view',
        'create' => 'theme.update',
        'update' => 'theme.update',
        'delete' => 'theme.update',
        'publish' => 'theme.publish',
    ];

    public function publish(\App\Models\User $user, mixed $model): bool
    {
        return $this->allow($user, 'publish');
    }
}
