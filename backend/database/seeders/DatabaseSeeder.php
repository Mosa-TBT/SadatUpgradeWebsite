<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RbacSeeder::class,
            AdminUserSeeder::class,
            SettingSeeder::class,
            ThemeSeeder::class,
            LanguageSeeder::class,
            PageSeeder::class,
            ContentSeeder::class,
            TeamSeeder::class,
            MenuSeeder::class,
        ]);
    }
}
