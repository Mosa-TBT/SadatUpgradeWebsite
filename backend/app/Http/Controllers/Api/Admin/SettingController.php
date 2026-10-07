<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Support\AuditLogger;
use App\Support\SettingService;
use App\Support\SettingsRegistry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SettingController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SettingService $settings,
        protected AuditLogger $audit,
    ) {}

    public function registry(): JsonResponse
    {
        Gate::authorize('viewAny', \App\Models\Setting::class);

        $groups = [];

        foreach (SettingsRegistry::all() as $group => $keys) {
            $groups[$group] = [
                'label' => ucfirst($group),
                'fields' => collect($keys)->map(fn ($def, $key) => [
                    'key' => $key,
                    'group' => $group,
                    'label' => $def['label'] ?? $key,
                    'type' => $def['type'] ?? 'string',
                    'options' => $def['options'] ?? null,
                    'encrypted' => (bool) ($def['encrypted'] ?? false),
                    'public' => (bool) ($def['public'] ?? false),
                    'default' => $def['default'] ?? null,
                ])->values(),
            ];
        }

        return $this->ok($groups);
    }

    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', \App\Models\Setting::class);

        $groups = SettingsRegistry::groups();
        $result = [];

        foreach ($groups as $group) {
            $result[$group] = $this->groupPayload($group);
        }

        return $this->ok($result);
    }

    public function show(string $group): JsonResponse
    {
        Gate::authorize('viewAny', \App\Models\Setting::class);

        abort_unless(in_array($group, SettingsRegistry::groups(), true), 404);

        return $this->ok($this->groupPayload($group));
    }

    public function update(Request $request, string $group): JsonResponse
    {
        Gate::authorize('update', \App\Models\Setting::class);

        abort_unless(in_array($group, SettingsRegistry::groups(), true), 404);

        $payload = $request->validate([
            'values' => ['required', 'array'],
        ])['values'];

        $definitions = SettingsRegistry::definitions();
        $updated = [];

        foreach ($payload as $key => $value) {
            $definition = $definitions["{$group}.{$key}"] ?? null;

            if (! $definition) {
                continue;
            }

            $encrypted = (bool) ($definition['encrypted'] ?? false);

            if ($encrypted && ($value === '' || $value === null)) {
                continue; // keep existing secret when left blank
            }

            $this->settings->set($group, $key, $value);
            $updated[$key] = $encrypted ? '[updated]' : $value;
        }

        $this->audit->log("settings.{$group}.updated", null, [], $updated, "Updated {$group} settings");

        return $this->ok($this->groupPayload($group), 'Settings saved successfully');
    }

    protected function groupPayload(string $group): array
    {
        $definitions = SettingsRegistry::all()[$group] ?? [];
        $stored = $this->settings->map()[$group] ?? [];
        $fields = [];

        foreach ($definitions as $key => $definition) {
            $encrypted = (bool) ($definition['encrypted'] ?? false);
            $value = array_key_exists($key, $stored) ? $stored[$key] : ($definition['default'] ?? null);

            $fields[] = [
                'key' => $key,
                'label' => $definition['label'] ?? $key,
                'type' => $definition['type'] ?? 'string',
                'options' => $definition['options'] ?? null,
                'encrypted' => $encrypted,
                'public' => (bool) ($definition['public'] ?? false),
                'value' => $encrypted ? null : $value,
                'configured' => $encrypted ? ! empty($stored[$key] ?? null) : true,
            ];
        }

        return [
            'group' => $group,
            'label' => ucfirst($group),
            'fields' => $fields,
        ];
    }
}
