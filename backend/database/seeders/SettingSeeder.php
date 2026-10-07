<?php

namespace Database\Seeders;

use App\Support\SettingService;
use App\Support\SettingsRegistry;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $service = app(SettingService::class);

        foreach (SettingsRegistry::all() as $group => $keys) {
            foreach ($keys as $key => $definition) {
                $service->set($group, $key, $definition['default'] ?? null);
            }
        }

        $service->flush();
    }
}
