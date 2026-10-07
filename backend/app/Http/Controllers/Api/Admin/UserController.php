<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use App\Support\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditLogger $audit) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        $query = User::query()->with('roles:id,name,slug');

        if ($search = $request->string('search')->trim()->value()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('role')) {
            $query->whereHas('roles', fn ($q) => $q->where('slug', $request->input('role')));
        }

        return $this->ok(
            $query->latest()->paginate(min((int) $request->input('per_page', 15), 100))->withQueryString()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', User::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'phone' => ['nullable', 'string', 'max:30'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'in:active,suspended,pending'],
            'is_super_admin' => ['boolean'],
            'roles' => ['nullable', 'array'],
            'roles.*' => ['integer', 'exists:roles,id'],
        ]);

        $roles = $data['roles'] ?? [];
        unset($data['roles']);

        $user = User::create($data);

        if ($roles) {
            $user->syncRoles($roles);
        }

        return $this->created($user->load('roles'), 'User created successfully');
    }

    public function show(int $id): JsonResponse
    {
        $user = User::with('roles.permissions', 'avatar')->findOrFail($id);
        $this->authorize('view', $user);

        return $this->ok($user);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $this->authorize('update', $user);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'confirmed', Password::min(8)],
            'phone' => ['nullable', 'string', 'max:30'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'timezone' => ['nullable', 'string', 'max:64'],
            'status' => ['nullable', 'in:active,suspended,pending'],
            'avatar_media_id' => ['nullable', 'integer', 'exists:media,id'],
            'roles' => ['nullable', 'array'],
            'roles.*' => ['integer', 'exists:roles,id'],
        ]);

        $roles = $data['roles'] ?? null;
        unset($data['roles']);

        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password_changed_at'] = now();
        }

        if ($user->isSuperAdmin() && array_key_exists('is_super_admin', $data) === false) {
            // keep super admin flag unless explicitly handled
        }

        $user->update($data);

        if (is_array($roles)) {
            $user->syncRoles($roles);
        }

        return $this->ok($user->fresh('roles'), 'User updated successfully');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $this->authorize('delete', $user);

        if ($user->id === $request->user()->id) {
            return $this->error('You cannot delete your own account.', 422);
        }

        $user->delete();

        return $this->ok(null, 'User deleted successfully');
    }

    public function toggleStatus(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $this->authorize('update', $user);

        if ($user->id === $request->user()->id) {
            return $this->error('You cannot change your own status.', 422);
        }

        $user->update(['status' => $user->status === 'active' ? 'suspended' : 'active']);
        $user->tokens()->delete();

        return $this->ok($user, 'User status updated');
    }

    public function verify(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $this->authorize('update', $user);

        $user->forceFill(['email_verified_at' => now()])->save();

        return $this->ok($user, 'User verified');
    }

    public function resetPassword(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $this->authorize('resetPassword', $user);

        $data = $request->validate([
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user->forceFill([
            'password' => Hash::make($data['password']),
            'password_changed_at' => now(),
        ])->save();

        $user->tokens()->delete();
        $this->audit->log('user.password_reset', $user, [], [], 'Administrator reset the password', $request->user()->id);

        return $this->ok(null, 'Password reset successfully');
    }

    public function assignRoles(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $this->authorize('update', $user);

        $data = $request->validate([
            'roles' => ['required', 'array'],
            'roles.*' => ['integer', 'exists:roles,id'],
        ]);

        $user->syncRoles($data['roles']);
        $this->audit->log('user.roles_changed', $user, [], ['roles' => $data['roles']], 'Roles updated', $request->user()->id);

        return $this->ok($user->load('roles'), 'Roles updated');
    }

    public function activity(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $this->authorize('view', $user);

        return $this->ok([
            'logins' => $user->loginActivities()->latest()->limit(20)->get(),
            'audit' => \App\Models\AuditLog::query()->where('user_id', $user->id)->latest()->limit(20)->get(),
        ]);
    }
}
