<?php

namespace App\Support;

use App\Models\Media;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;

class SettingService
{
    public const CACHE_KEY = 'settings.map';

    /**
     * @return array<string, array<string, mixed>>
     */
    public function map(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function (): array {
            $map = [];

            foreach (Setting::query()->get() as $setting) {
                $map[$setting->group][$setting->key] = $this->cast($setting);
            }

            return $map;
        });
    }

    public function get(string $group, string $key, mixed $default = null): mixed
    {
        $map = $this->map();

        if (array_key_exists($key, $map[$group] ?? [])) {
            return $map[$group][$key];
        }

        return SettingsRegistry::definitions()["{$group}.{$key}"]['default'] ?? $default;
    }

    public function group(string $group): array
    {
        $definitions = SettingsRegistry::all()[$group] ?? [];
        $stored = $this->map()[$group] ?? [];
        $result = [];

        foreach ($definitions as $key => $definition) {
            $result[$key] = array_key_exists($key, $stored)
                ? $stored[$key]
                : ($definition['default'] ?? null);
        }

        return $result;
    }

    public function set(string $group, string $key, mixed $value): Setting
    {
        $definition = SettingsRegistry::definitions()["{$group}.{$key}"] ?? [];
        $type = $definition['type'] ?? 'string';
        $encrypted = (bool) ($definition['encrypted'] ?? false);

        $setting = Setting::query()->updateOrCreate(
            ['group' => $group, 'key' => $key],
            [
                'value' => $this->serialize($value, $type, $encrypted),
                'type' => $type,
                'is_encrypted' => $encrypted,
                'is_public' => (bool) ($definition['public'] ?? false),
            ],
        );

        $this->flush();

        return $setting;
    }

    /**
     * @param  array<string, array<string, mixed>>  $values  keyed by group then key
     */
    public function setMany(array $values): void
    {
        foreach ($values as $group => $keys) {
            if (! is_array($keys)) {
                continue;
            }

            foreach ($keys as $key => $value) {
                $this->set($group, $key, $value);
            }
        }

        $this->flush();
    }

    public function flush(): void
    {
        Cache::forget(self::CACHE_KEY);
        Cache::forget('public.config');
    }

    public function publicConfig(): array
    {
        return Cache::rememberForever('public.config', function (): array {
            $result = [];
            $mediaIds = [];

            foreach (SettingsRegistry::all() as $group => $keys) {
                foreach ($keys as $key => $definition) {
                    if (empty($definition['public'])) {
                        continue;
                    }

                    $value = $this->get($group, $key);

                    if (($definition['type'] ?? 'string') === 'media') {
                        $mediaIds[] = $value;
                    }

                    $result[$group][$key] = $value;
                }
            }

            $media = Media::query()
                ->whereIn('id', array_filter($mediaIds))
                ->get()
                ->keyBy('id');

            foreach ($result as $group => &$keys) {
                foreach ($keys as $key => &$value) {
                    if ((SettingsRegistry::definitions()["{$group}.{$key}"]['type'] ?? null) === 'media') {
                        $value = $value ? ($media[$value]->url ?? null) : null;
                    }
                }
            }

            return $result;
        });
    }

    protected function cast(Setting $setting): mixed
    {
        $value = $setting->value;

        if ($setting->is_encrypted && $value !== null && $value !== '') {
            try {
                $value = Crypt::decryptString($value);
            } catch (\Throwable) {
                $value = null;
            }
        }

        return match ($setting->type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'integer' => is_null($value) ? null : (int) $value,
            'float' => is_null($value) ? null : (float) $value,
            'json' => $value ? json_decode($value, true) : null,
            default => $value,
        };
    }

    protected function serialize(mixed $value, string $type, bool $encrypted): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        $serialized = match ($type) {
            'boolean' => $value ? '1' : '0',
            'json' => json_encode($value),
            default => (string) $value,
        };

        if ($encrypted) {
            return Crypt::encryptString($serialized);
        }

        return $serialized;
    }
}
