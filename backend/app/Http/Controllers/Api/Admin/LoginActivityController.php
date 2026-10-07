<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\LoginActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoginActivityController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = LoginActivity::query()->with('user:id,name,email');

        if ($search = $request->string('search')->trim()->value()) {
            $query->where(fn ($q) => $q->where('email', 'like', "%{$search}%")->orWhere('ip_address', 'like', "%{$search}%"));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return $this->ok($query->latest()->paginate(min((int) $request->input('per_page', 20), 100))->withQueryString());
    }
}
