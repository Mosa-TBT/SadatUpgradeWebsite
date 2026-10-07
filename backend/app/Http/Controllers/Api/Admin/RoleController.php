<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Role;
use App\Support\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RoleController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditLogger $audit) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Role::class);

        $query = Role::query()->with('permissions:id,name,slug,group')->withCount('users');

        if ($search = $request->string('search')->trim()->value()) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $this->ok($query->get());
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Role::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:roles,slug'],
            'description' => ['nullable', 'string', 'max:255'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);

        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        $permissions = $data['permissions'] ?? [];
        unset($data['permissions']);

        $role = Role::create($data);
        $role->permissions()->sync($permissions);

        return $this->created($role->load('permissions'), 'Role created');
    }

    public function show(int $id): JsonResponse
    {
        $role = Role::with('permissions')->withCount('users')->findOrFail($id);
        $this->authorize('view', $role);

        return $this->ok($role);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $role = Role::findOrFail($id);
        $this->authorize('update', $role);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:roles,slug,'.$role->id],
            'description' => ['nullable', 'string', 'max:255'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);

        $permissions = $data['permissions'] ?? null;
        unset($data['permissions']);

        if (! $role->is_system && ! empty($data['slug'])) {
            $data['slug'] = Str::slug($data['slug']);
        } else {
            unset($data['slug']);
        }

        $role->update($data);

        if (is_array($permissions)) {
            $role->permissions()->sync($permissions);
        }

        return $this->ok($role->fresh('permissions'), 'Role updated');
    }

    public function duplicate(int $id): JsonResponse
    {
        $role = Role::with('permissions')->findOrFail($id);
        $this->authorize('create', Role::class);

        $new = $role->replicate();
        $new->name = $role->name.' Copy';
        $new->slug = $role->slug.'-copy-'.Str::lower(Str::random(4));
        $new->is_system = false;
        $new->save();
        $new->permissions()->sync($role->permissions->pluck('id'));

        return $this->created($new->load('permissions'), 'Role duplicated');
    }

    public function destroy(int $id): JsonResponse
    {
        $role = Role::findOrFail($id);
        $this->authorize('delete', $role);

        if ($role->is_system) {
            return $this->error('System roles cannot be deleted.', 422);
        }

        $role->delete();

        return $this->ok(null, 'Role deleted');
    }
}
