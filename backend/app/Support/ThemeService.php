<?php

namespace App\Support;

use App\Models\Theme;
use Illuminate\Support\Facades\Cache;

class ThemeService
{
    public const CACHE_KEY = 'theme.active.tokens';

    /**
     * Canonical design tokens. Changing a value here changes the fallback for
     * every theme that does not override it.
     */
    public static function defaults(): array
    {
        return [
            'colors' => [
                'primary' => '#2563eb',
                'secondary' => '#7c3aed',
                'accent' => '#06b6d4',
                'background' => '#ffffff',
                'surface' => '#f8fafc',
                'card' => '#ffffff',
                'text' => '#0f172a',
                'muted' => '#64748b',
                'border' => '#e2e8f0',
                'success' => '#16a34a',
                'warning' => '#f59e0b',
                'danger' => '#dc2626',
                'info' => '#0ea5e9',
                'primary_foreground' => '#ffffff',
                'secondary_foreground' => '#ffffff',
                'ring' => '#2563eb',
            ],
            'dark_mode' => [
                'enabled' => true,
                'auto' => true,
            ],
            'dark' => [
                'background' => '#0b1120',
                'surface' => '#111827',
                'card' => '#111827',
                'text' => '#e5e7eb',
                'muted' => '#94a3b8',
                'border' => '#1f2937',
                'primary' => '#3b82f6',
                'secondary' => '#8b5cf6',
                'primary_foreground' => '#0b1120',
            ],
            'typography' => [
                'font_primary' => 'Inter',
                'font_secondary' => 'Inter',
                'font_heading' => 'Inter',
                'font_size_base' => '16',
                'font_weight_base' => '400',
                'heading_weight' => '700',
                'line_height' => '1.6',
                'letter_spacing' => '0',
                'scale' => '1.25',
            ],
            'layout' => [
                'sidebar_width' => '260',
                'header_height' => '64',
                'radius' => '0.5',
                'content_max_width' => '1400',
                'card_style' => 'elevated',
                'button_style' => 'rounded',
                'input_style' => 'outline',
                'shadow_intensity' => 'soft',
                'spacing' => '1',
            ],
        ];
    }

    public function activeTheme(): ?Theme
    {
        return Cache::rememberForever(self::CACHE_KEY.'.model', fn () => Theme::query()->where('is_active', true)->first());
    }

    /**
     * Built-in theme presets, used by the seeder and the admin UI.
     */
    public static function presets(): array
    {
        $defaults = static::defaults();

        $make = fn (array $override): array => array_replace_recursive($defaults, $override);

        return [
            'default' => ['name' => 'Default', 'description' => 'The default Sadat Upgrade look.', 'tokens' => $defaults],
            'corporate' => ['name' => 'Corporate', 'description' => 'Trusted, structured blue palette.', 'tokens' => $make([
                'colors' => ['primary' => '#0f4c81', 'secondary' => '#1f2937', 'accent' => '#0ea5e9', 'surface' => '#f1f5f9', 'border' => '#cbd5e1', 'ring' => '#0f4c81'],
                'typography' => ['font_heading' => 'Merriweather', 'font_primary' => 'Source Sans 3'],
                'layout' => ['radius' => '0.25', 'shadow_intensity' => 'subtle', 'button_style' => 'square'],
            ])],
            'minimal' => ['name' => 'Minimal', 'description' => 'Monochrome, high contrast, borderless.', 'tokens' => $make([
                'colors' => ['primary' => '#111827', 'secondary' => '#6b7280', 'accent' => '#111827', 'background' => '#ffffff', 'surface' => '#ffffff', 'border' => '#e5e7eb'],
                'typography' => ['font_heading' => 'Inter', 'letter_spacing' => '-0.01'],
                'layout' => ['radius' => '0', 'shadow_intensity' => 'none', 'button_style' => 'square', 'content_max_width' => '1200'],
            ])],
            'dark' => ['name' => 'Dark', 'description' => 'Dark-first modern interface.', 'tokens' => $make([
                'colors' => ['primary' => '#3b82f6', 'secondary' => '#8b5cf6', 'background' => '#0b1120', 'surface' => '#0f172a', 'card' => '#111827', 'text' => '#e5e7eb', 'muted' => '#94a3b8', 'border' => '#1f2937'],
                'dark_mode' => ['enabled' => true, 'auto' => false],
            ])],
        ];
    }

    /**
     * Active theme tokens merged over the canonical defaults.
     */
    public function tokens(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function (): array {
            $theme = Theme::query()->where('is_active', true)->first();

            return $this->mergeRecursive(self::defaults(), $theme?->tokens ?? []);
        });
    }

    public function activate(Theme $theme): void
    {
        Theme::query()->where('is_active', true)->update(['is_active' => false]);
        $theme->update(['is_active' => true]);
        $this->flush();
    }

    public function flush(): void
    {
        Cache::forget(self::CACHE_KEY);
        Cache::forget(self::CACHE_KEY.'.model');
        Cache::forget('public.config');
    }

    protected function mergeRecursive(array $base, array $override): array
    {
        foreach ($override as $key => $value) {
            if (is_array($value) && isset($base[$key]) && is_array($base[$key])) {
                $base[$key] = $this->mergeRecursive($base[$key], $value);
            } else {
                $base[$key] = $value;
            }
        }

        return $base;
    }
}
