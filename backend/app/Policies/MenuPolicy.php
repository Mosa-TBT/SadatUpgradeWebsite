<?php

namespace App\Policies;

class MenuPolicy extends BasePolicy
{
    protected array $map = [
        'viewAny' => 'navigation.view',
        'view' => 'navigation.view',
        'create' => 'navigation.update',
        'update' => 'navigation.update',
        'delete' => 'navigation.update',
    ];
}
