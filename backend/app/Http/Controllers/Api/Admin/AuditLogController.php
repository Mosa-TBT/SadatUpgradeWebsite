<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::query()->with('user:id,name,email');

        if ($search = $request->string('search')->trim()->value()) {
            $query->where(fn ($q) => $q->where('event', 'like', "%{$search}%")->orWhere('description', 'like', "%{$search}%")->orWhere('ip_address', 'like', "%{$search}%"));
        }

        if ($request->filled('event')) {
            $query->where('event', 'like', $request->input('event').'%');
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        if ($request->filled('from')) {
            $query->where('created_at', '>=', $request->date('from'));
        }

        if ($request->filled('to')) {
            $query->where('created_at', '<=', $request->date('to')->endOfDay());
        }

        return $this->ok($query->latest()->paginate(min((int) $request->input('per_page', 20), 100))->withQueryString());
    }

    public function show(int $id): JsonResponse
    {
        return $this->ok(AuditLog::with('user:id,name,email')->findOrFail($id));
    }

    public function events(): JsonResponse
    {
        return $this->ok(AuditLog::query()->select('event')->distinct()->orderBy('event')->pluck('event'));
    }
}
