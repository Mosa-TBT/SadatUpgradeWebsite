<?php

namespace App\Policies;

class SettingPolicy extends BasePolicy
{
    protected array $map = [
        'viewAny' => 'settings.view',
        'view' => 'settings.view',
        'create' => 'settings.update',
        'update' => 'settings.update',
        'delete' => 'settings.update',
    ];
}
