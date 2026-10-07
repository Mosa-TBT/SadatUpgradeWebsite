<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Permission;
use Illuminate\Http\JsonResponse;

class PermissionController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $grouped = Permission::query()
            ->orderBy('group')
            ->orderBy('name')
            ->get()
            ->groupBy('group');

        return $this->ok($grouped);
    }
}
