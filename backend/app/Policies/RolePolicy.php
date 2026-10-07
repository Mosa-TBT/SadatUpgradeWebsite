<?php

namespace App\Policies;

class RolePolicy extends BasePolicy
{
    protected array $map = [
        'viewAny' => 'roles.view',
        'view' => 'roles.view',
        'create' => 'roles.create',
        'update' => 'roles.update',
        'delete' => 'roles.delete',
    ];
}
