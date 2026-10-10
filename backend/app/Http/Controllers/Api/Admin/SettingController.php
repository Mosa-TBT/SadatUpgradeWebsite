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
use Illuminate\Validation\ValidationException;

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
        Gate::authorize('update', new \App\Models\Setting);

        abort_unless(in_array($group, SettingsRegistry::groups(), true), 404);

        $payload = $request->validate([
            'values' => ['required', 'array'],
        ])['values'];

        $payload = $this->validateContactLists($payload);

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

    /**
     * Validate and clean the multi-value contact / social lists before storage.
     * Returns the cleaned payload (invalid rows discarded only after full
     * validation fails for the whole request); throws a ValidationException
     * with field-keyed messages when any entry is invalid.
     *
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    protected function validateContactLists(array $payload): array
    {
        $errors = [];

        if (array_key_exists('contact_emails', $payload)) {
            $list = is_array($payload['contact_emails']) ? $payload['contact_emails'] : [];
            $cleaned = [];

            foreach ($list as $index => $entry) {
                $entry = is_string($entry) ? trim($entry) : '';

                if ($entry === '') {
                    $errors['contact_emails'][] = 'Email '.($index + 1).' cannot be empty.';
                    continue;
                }

                if (! filter_var($entry, FILTER_VALIDATE_EMAIL)) {
                    $errors['contact_emails'][] = 'Email '.($index + 1).' is not a valid email address.';
                    continue;
                }

                $cleaned[] = $entry;
            }

            $payload['contact_emails'] = $cleaned;
        }

        if (array_key_exists('contact_phones', $payload)) {
            $list = is_array($payload['contact_phones']) ? $payload['contact_phones'] : [];
            $cleanedPhones = [];

            foreach ($list as $index => $entry) {
                $entry = is_string($entry) ? trim($entry) : '';

                if ($entry === '') {
                    $errors['contact_phones'][] = 'Phone '.($index + 1).' cannot be empty.';
                    continue;
                }

                if (! preg_match('/^[0-9+\-(). ]{3,30}$/', $entry)) {
                    $errors['contact_phones'][] = 'Phone '.($index + 1).' contains unsupported characters.';
                    continue;
                }

                $cleanedPhones[] = $entry;
            }

            $payload['contact_phones'] = $cleanedPhones;
        }

        if (array_key_exists('social_links', $payload)) {
            $list = is_array($payload['social_links']) ? $payload['social_links'] : [];
            $platforms = ['facebook', 'instagram', 'linkedin', 'x', 'youtube', 'github'];
            $cleanedLinks = [];

            foreach ($list as $index => $entry) {
                if (! is_array($entry)) {
                    $errors['social_links'][] = 'Social link '.($index + 1).' is malformed.';
                    continue;
                }

                $platform = is_string($entry['platform'] ?? '') ? trim($entry['platform']) : '';
                $url = is_string($entry['url'] ?? '') ? trim($entry['url']) : '';
                $active = filter_var($entry['is_active'] ?? true, FILTER_VALIDATE_BOOLEAN);

                if ($platform === '' || ! in_array($platform, $platforms, true)) {
                    $errors['social_links'][] = 'Social link '.($index + 1).' needs a supported platform.';
                    continue;
                }

                if ($url === '' || ! filter_var($url, FILTER_VALIDATE_URL) || ! in_array(parse_url($url, PHP_URL_SCHEME), ['http', 'https'], true)) {
                    $errors['social_links'][] = 'Social link '.($index + 1).' needs a valid http(s) URL.';
                    continue;
                }

                $cleanedLinks[] = ['platform' => $platform, 'url' => $url, 'is_active' => $active];
            }

            $payload['social_links'] = $cleanedLinks;
        }

        if ($errors) {
            throw ValidationException::withMessages($errors);
        }

        return $payload;
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
                'ui_type' => $definition['ui_type'] ?? null,
                'item_fields' => $definition['item_fields'] ?? null,
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
