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
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditLogger $audit) {}

    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->load('avatar', 'roles');

        return $this->ok($user);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:30'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'timezone' => ['nullable', 'string', 'max:64'],
            'locale' => ['nullable', 'string', 'max:10'],
            'avatar_media_id' => ['nullable', 'integer', 'exists:media,id'],
        ]);

        $user->update($data);

        return $this->ok($user->fresh('avatar'), 'Profile updated');
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = $request->user();

        if (! Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $user->forceFill([
            'password' => Hash::make($data['password']),
            'password_changed_at' => now(),
        ])->save();

        $this->audit->log('profile.password_changed', $user, [], [], 'Profile password changed', $user->id);

        return $this->ok(null, 'Password updated');
    }

    public function preferences(Request $request): JsonResponse
    {
        $data = $request->validate([
            'timezone' => ['nullable', 'string', 'max:64'],
            'locale' => ['nullable', 'string', 'max:10'],
        ]);

        $request->user()->update($data);

        return $this->ok($request->user()->fresh(), 'Preferences updated');
    }
}
