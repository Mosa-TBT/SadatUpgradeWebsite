<?php

namespace App\Policies;

class PagePolicy extends BasePolicy
{
    protected array $map = [
        'viewAny' => 'pages.view',
        'view' => 'pages.view',
        'create' => 'pages.create',
        'update' => 'pages.update',
        'delete' => 'pages.delete',
        'publish' => 'pages.publish',
    ];

    public function publish(\App\Models\User $user, mixed $model): bool
    {
        return $this->allow($user, 'publish');
    }
}
