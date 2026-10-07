<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Support\ThemeService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ThemeSeeder extends Seeder
{
    public function run(): void
    {
        foreach (ThemeService::presets() as $slug => $preset) {
            $theme = Theme::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $preset['name'],
                    'description' => $preset['description'] ?? null,
                    'tokens' => $preset['tokens'],
                    'is_active' => $slug === 'default',
                    'is_system' => true,
                    'created_by' => null,
                ],
            );

            if ($theme->versions()->doesntExist()) {
                $theme->versions()->create([
                    'version' => 1,
                    'tokens' => $theme->tokens,
                    'note' => 'Seeded preset',
                ]);
            }
        }

        app(ThemeService::class)->flush();
    }
}
