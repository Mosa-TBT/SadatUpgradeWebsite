<?php

namespace App\Policies;

class MediaPolicy extends BasePolicy
{
    protected array $map = [
        'viewAny' => 'media.view',
        'view' => 'media.view',
        'create' => 'media.upload',
        'update' => 'media.upload',
        'delete' => 'media.delete',
    ];
}
