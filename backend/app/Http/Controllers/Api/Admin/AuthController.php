<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\LoginActivity;
use App\Models\Role;
use App\Models\User;
use App\Support\AuditLogger;
use App\Support\SettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SettingService $settings,
        protected AuditLogger $audit,
    ) {}

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'device_name' => ['nullable', 'string', 'max:120'],
        ]);

        $maxAttempts = (int) $this->settings->get('security', 'login_max_attempts', 5);
        $decayMinutes = (int) $this->settings->get('security', 'login_decay_minutes', 1);
        $throttleKey = Str::lower($data['email']).'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, $maxAttempts)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            $this->recordLogin($data['email'], 'failed', $request);

            throw ValidationException::withMessages([
                'email' => ["Too many login attempts. Please try again in {$seconds} seconds."],
            ]);
        }

        $user = User::query()->where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            RateLimiter::hit($throttleKey, $decayMinutes * 60);
            $this->recordLogin($data['email'], 'failed', $request);
            $this->audit->log('auth.failed', null, [], ['email' => $data['email']], 'Failed login attempt', $user?->id);

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->status !== 'active') {
            $this->recordLogin($data['email'], 'blocked', $request, $user);

            return $this->error('Your account is not active. Please contact an administrator.', 403);
        }

        RateLimiter::clear($throttleKey);

        $token = $user->createToken($data['device_name'] ?? 'admin-panel')->plainTextToken;

        $user->forceFill([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ])->save();

        $this->recordLogin($data['email'], 'success', $request, $user);
        $this->audit->log('auth.login', $user, [], [], 'User logged in', $user->id);

        return $this->ok([
            'token' => $token,
            'user' => $this->userPayload($user),
        ], 'Logged in successfully');
    }

    public function me(Request $request): JsonResponse
    {
        return $this->ok($this->userPayload($request->user()));
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        $request->user()->currentAccessToken()?->delete();
        $this->audit->log('auth.logout', $user, [], [], 'User logged out', $user->id);

        return $this->ok(null, 'Logged out successfully');
    }

    public function logoutAll(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->tokens()->delete();
        $this->audit->log('auth.logout_all', $user, [], [], 'User logged out from all devices', $user->id);

        return $this->ok(null, 'Logged out from all devices');
    }

    public function register(Request $request): JsonResponse
    {
        if (! $this->settings->get('website', 'registration_enabled', true)) {
            return $this->error('Registration is currently disabled.', 403);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', $this->passwordRule()],
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'phone' => $data['phone'] ?? null,
            'status' => 'active',
        ]);

        if ($role = Role::query()->where('slug', 'subscriber')->first()) {
            $user->syncRoles([$role->id]);
        }

        $token = $user->createToken('website')->plainTextToken;
        $this->audit->log('auth.register', $user, [], [], 'User registered', $user->id);

        return $this->created([
            'token' => $token,
            'user' => $this->userPayload($user),
        ], 'Account created successfully');
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($request->only('email'));

        return $this->ok(null, __($status));
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', $this->passwordRule()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'password_changed_at' => now(),
                ])->save();
                $user->tokens()->delete();
                $this->audit->log('auth.password_reset', $user, [], [], 'Password reset', $user->id);
            },
        );

        if ($status !== Password::PASSWORD_RESET) {
            return $this->error(__($status), 422);
        }

        return $this->ok(null, 'Password has been reset successfully.');
    }

    public function changePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'confirmed', $this->passwordRule()],
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

        $current = $user->currentAccessToken();
        $user->tokens()->when($current, fn ($q) => $q->where('id', '!=', $current->id))->delete();

        $this->audit->log('auth.password_changed', $user, [], [], 'Password changed', $user->id);

        return $this->ok(null, 'Password changed successfully');
    }

    public function sessions(Request $request): JsonResponse
    {
        $currentId = $request->user()->currentAccessToken()?->id;

        $sessions = $request->user()->tokens()->latest()->get()->map(fn ($token) => [
            'id' => $token->id,
            'name' => $token->name,
            'abilities' => $token->abilities,
            'is_current' => $token->id === $currentId,
            'last_used_at' => $token->last_used_at?->toIso8601String(),
            'created_at' => $token->created_at?->toIso8601String(),
        ]);

        return $this->ok($sessions);
    }

    public function destroySession(Request $request, int $id): JsonResponse
    {
        $request->user()->tokens()->where('id', $id)->delete();

        return $this->ok(null, 'Session revoked');
    }

    protected function passwordRule(): PasswordRule
    {
        $rule = PasswordRule::min((int) $this->settings->get('security', 'password_min_length', 8));

        if ($this->settings->get('security', 'password_require_mixed_case', true)) {
            $rule = $rule->mixedCase();
        }

        if ($this->settings->get('security', 'password_require_numbers', true)) {
            $rule = $rule->numbers();
        }

        if ($this->settings->get('security', 'password_require_symbols', false)) {
            $rule = $rule->symbols();
        }

        return $rule;
    }

    protected function recordLogin(string $email, string $status, Request $request, ?User $user = null): void
    {
        LoginActivity::create([
            'user_id' => $user?->id,
            'email' => $email,
            'status' => $status,
            'ip_address' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 1000, ''),
        ]);
    }

    protected function userPayload(User $user): array
    {
        $user->load('roles.permissions', 'avatar');

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'job_title' => $user->job_title,
            'bio' => $user->bio,
            'timezone' => $user->timezone,
            'locale' => $user->locale,
            'status' => $user->status,
            'is_super_admin' => $user->is_super_admin,
            'avatar_url' => $user->avatar?->url,
            'email_verified' => ! is_null($user->email_verified_at),
            'last_login_at' => $user->last_login_at?->toIso8601String(),
            'created_at' => $user->created_at?->toIso8601String(),
            'roles' => $user->roles->map(fn ($role) => ['id' => $role->id, 'name' => $role->name, 'slug' => $role->slug])->values(),
            'permissions' => $user->permissionSlugs(),
        ];
    }
}
