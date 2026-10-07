<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $menus = [
            'header' => [
                'name' => 'Header Menu',
                'location' => 'header',
                'items' => [
                    ['label' => 'Home', 'url' => '/'],
                    ['label' => 'About', 'url' => '/about'],
                    ['label' => 'Services', 'url' => '/services', 'children' => [
                        ['label' => 'Web Development', 'url' => '/services'],
                        ['label' => 'Mobile Development', 'url' => '/services'],
                        ['label' => 'IT Consulting', 'url' => '/services'],
                    ]],
                    ['label' => 'Portfolio', 'url' => '/portfolio'],
                    ['label' => 'Pricing', 'url' => '/pricing'],
                    ['label' => 'Contact', 'url' => '/contact'],
                ],
            ],
            'footer' => [
                'name' => 'Footer Menu',
                'location' => 'footer',
                'items' => [
                    ['label' => 'Services', 'url' => '/services'],
                    ['label' => 'About Us', 'url' => '/about'],
                    ['label' => 'Portfolio', 'url' => '/portfolio'],
                    ['label' => 'Careers', 'url' => '/careers'],
                    ['label' => 'Blog', 'url' => '/blog'],
                    ['label' => 'Privacy Policy', 'url' => '/privacy'],
                    ['label' => 'Terms of Service', 'url' => '/terms'],
                ],
            ],
        ];

        foreach ($menus as $slug => $data) {
            $menu = Menu::updateOrCreate(
                ['slug' => $slug],
                ['name' => $data['name'], 'location' => $data['location'], 'is_active' => true],
            );

            $menu->items()->delete();

            foreach (array_values($data['items']) as $index => $item) {
                $parent = $menu->items()->create([
                    'label' => $item['label'],
                    'type' => 'internal',
                    'url' => $item['url'],
                    'sort_order' => $index,
                    'is_active' => true,
                ]);

                foreach (array_values($item['children'] ?? []) as $childIndex => $child) {
                    $menu->items()->create([
                        'parent_id' => $parent->id,
                        'label' => $child['label'],
                        'type' => 'internal',
                        'url' => $child['url'],
                        'sort_order' => $childIndex,
                        'is_active' => true,
                    ]);
                }
            }
        }
    }
}
