<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            ['title' => 'Home', 'slug' => 'home', 'excerpt' => 'Digital solutions that drive results.', 'is_home' => true, 'sort_order' => 0, 'sections' => [
                ['type' => 'hero', 'data' => [
                    'badge' => 'Digital Innovation Agency',
                    'title' => 'We Build Digital Experiences That Drive Results',
                    'subtitle' => 'Transform your business with cutting-edge web solutions, stunning designs, and powerful digital strategies.',
                    'primary_label' => 'Start Your Project',
                    'primary_url' => '/contact',
                    'secondary_label' => 'View Our Work',
                    'secondary_url' => '/portfolio',
                    'align' => 'left',
                ]],
                ['type' => 'statistics', 'data' => ['title' => 'By the numbers', 'items' => [
                    ['value' => '500+', 'label' => 'Projects Delivered'],
                    ['value' => '98%', 'label' => 'Client Satisfaction'],
                    ['value' => '5+', 'label' => 'Years Experience'],
                ]]],
                ['type' => 'cta', 'data' => [
                    'title' => 'Ready to Transform Your Business?',
                    'subtitle' => "Let's discuss your project and create something amazing together.",
                    'primary_label' => 'Get Free Consultation',
                    'primary_url' => '/contact',
                ]],
            ]],
            ['title' => 'About Us', 'slug' => 'about', 'excerpt' => 'Who we are and what drives us.', 'sort_order' => 1],
            ['title' => 'Services', 'slug' => 'services', 'excerpt' => 'Complete digital solutions.', 'sort_order' => 2],
            ['title' => 'Portfolio', 'slug' => 'portfolio', 'excerpt' => 'Our recent work.', 'sort_order' => 3],
            ['title' => 'Pricing', 'slug' => 'pricing', 'excerpt' => 'Simple, transparent pricing.', 'sort_order' => 4],
            ['title' => 'Careers', 'slug' => 'careers', 'excerpt' => 'Join our team.', 'sort_order' => 5],
            ['title' => 'Blog', 'slug' => 'blog', 'excerpt' => 'Insights and updates.', 'sort_order' => 6],
            ['title' => 'Contact', 'slug' => 'contact', 'excerpt' => 'Get in touch.', 'sort_order' => 7],
            ['title' => 'Terms of Service', 'slug' => 'terms', 'excerpt' => 'Terms and conditions.', 'is_system' => true, 'sort_order' => 90],
            ['title' => 'Privacy Policy', 'slug' => 'privacy', 'excerpt' => 'How we handle your data.', 'is_system' => true, 'sort_order' => 91],
        ];

        foreach ($pages as $data) {
            $sections = $data['sections'] ?? [];
            unset($data['sections']);

            $page = Page::updateOrCreate(
                ['slug' => $data['slug']],
                array_merge([
                    'status' => 'published',
                    'published_at' => now(),
                    'author_id' => null,
                ], $data),
            );

            if ($sections) {
                $page->sections()->delete();

                foreach (array_values($sections) as $index => $section) {
                    $page->sections()->create([
                        'type' => $section['type'],
                        'sort_order' => $index,
                        'data' => $section['data'] ?? [],
                        'is_active' => true,
                    ]);
                }
            }
        }
    }
}
