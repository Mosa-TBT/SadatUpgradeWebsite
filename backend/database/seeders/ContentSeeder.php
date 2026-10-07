<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\JobOpening;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\PricingPlan;
use App\Models\Project;
use App\Models\Service;
use App\Models\Tag;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->services();
        $this->projects();
        $this->posts();
        $this->testimonials();
        $this->faqs();
        $this->pricing();
        $this->jobs();
    }

    protected function services(): void
    {
        $services = [
            ['title' => 'Web Development', 'icon' => 'Globe', 'short_description' => 'Custom websites and web applications built with modern technologies for optimal performance.', 'features' => ['React & Next.js', 'Responsive Design', 'SEO Optimized'], 'technologies' => ['Next.js', 'Laravel', 'MySQL']],
            ['title' => 'Mobile Apps', 'icon' => 'Smartphone', 'short_description' => 'Native and cross-platform mobile applications that deliver exceptional user experiences.', 'features' => ['iOS & Android', 'React Native', 'App Store Optimization'], 'technologies' => ['React Native', 'Flutter', 'Firebase']],
            ['title' => 'UI/UX Design', 'icon' => 'Palette', 'short_description' => 'Beautiful, intuitive designs that convert visitors into customers.', 'features' => ['User Research', 'Prototyping', 'Design Systems'], 'technologies' => ['Figma', 'Adobe XD']],
            ['title' => 'Digital Marketing', 'icon' => 'Search', 'short_description' => 'Comprehensive digital marketing strategies to increase your online visibility.', 'features' => ['SEO & SEM', 'Social Media', 'Content Marketing'], 'technologies' => ['Google Ads', 'Analytics', 'Meta']],
            ['title' => 'E-commerce', 'icon' => 'Code', 'short_description' => 'Powerful online stores with secure payment processing and inventory management.', 'features' => ['Shopify & WooCommerce', 'Payment Integration', 'Analytics'], 'technologies' => ['Shopify', 'Stripe', 'WooCommerce']],
            ['title' => 'Analytics & Insights', 'icon' => 'BarChart3', 'short_description' => 'Data-driven insights to help you make informed business decisions.', 'features' => ['Google Analytics', 'Custom Dashboards', 'Performance Tracking'], 'technologies' => ['GA4', 'Looker Studio']],
        ];

        foreach ($services as $index => $service) {
            Service::updateOrCreate(
                ['slug' => Str::slug($service['title'])],
                array_merge($service, ['sort_order' => $index, 'is_active' => true]),
            );
        }
    }

    protected function projects(): void
    {
        $projects = [
            ['title' => 'E-commerce Platform', 'category' => 'Web Development', 'client_name' => 'RetailMax Inc.', 'short_description' => 'Modern e-commerce solution with advanced features.'],
            ['title' => 'Mobile Banking App', 'category' => 'Mobile App', 'client_name' => 'SecureBank', 'short_description' => 'Secure and intuitive banking application.'],
            ['title' => 'SaaS Dashboard', 'category' => 'UI/UX Design', 'client_name' => 'DataFlow Solutions', 'short_description' => 'Clean and functional dashboard interface.'],
            ['title' => 'Restaurant Website', 'category' => 'Web Development', 'client_name' => 'Bella Vista Restaurant', 'short_description' => 'Appetizing website with online ordering system.'],
            ['title' => 'Fitness App', 'category' => 'Mobile App', 'client_name' => 'FitLife Technologies', 'short_description' => 'Comprehensive fitness tracking application.'],
            ['title' => 'Corporate Rebrand', 'category' => 'Branding', 'client_name' => 'TechManufacturing Corp', 'short_description' => 'Complete brand identity transformation.'],
        ];

        foreach ($projects as $index => $project) {
            Project::updateOrCreate(
                ['slug' => Str::slug($project['title'])],
                array_merge($project, [
                    'description' => $project['short_description'],
                    'status' => 'published',
                    'published_at' => now(),
                    'is_active' => true,
                    'is_featured' => $index < 3,
                    'sort_order' => $index,
                    'technologies' => ['Next.js', 'Laravel', 'MySQL'],
                    'results' => ['Increased conversions', 'Improved performance'],
                    'challenges' => ['Legacy integration', 'Performance'],
                    'solutions' => ['Modern architecture', 'Caching strategy'],
                ]),
            );
        }
    }

    protected function posts(): void
    {
        $categories = ['Design', 'Development', 'Marketing'];
        foreach ($categories as $name) {
            PostCategory::updateOrCreate(['slug' => Str::slug($name)], ['name' => $name]);
        }

        $tags = ['ui', 'nextjs', 'seo', 'laravel', 'performance'];
        foreach ($tags as $name) {
            Tag::updateOrCreate(['slug' => Str::slug($name)], ['name' => $name]);
        }

        $posts = [
            ['title' => '10 Web Design Trends to Watch', 'category' => 'Design', 'tags' => ['ui']],
            ['title' => 'Why Next.js Is Our Go-To Framework', 'category' => 'Development', 'tags' => ['nextjs', 'performance']],
            ['title' => 'A Practical SEO Checklist', 'category' => 'Marketing', 'tags' => ['seo']],
            ['title' => 'Building Scalable APIs with Laravel', 'category' => 'Development', 'tags' => ['laravel']],
            ['title' => 'Designing for Conversion', 'category' => 'Design', 'tags' => ['ui']],
            ['title' => 'Measuring Marketing ROI', 'category' => 'Marketing', 'tags' => ['seo']],
        ];

        foreach ($posts as $index => $data) {
            $category = PostCategory::where('slug', Str::slug($data['category']))->first();

            $post = Post::updateOrCreate(
                ['slug' => Str::slug($data['title'])],
                [
                    'title' => $data['title'],
                    'excerpt' => 'A short introduction to '.$data['title'].'.',
                    'content' => '<p>'.implode('</p><p>', [
                        'This is a sample article seeded into the CMS so you can see the blog module in action.',
                        'Edit or delete it from the admin panel under Content → Posts.',
                    ]).'</p>',
                    'category_id' => $category?->id,
                    'status' => 'published',
                    'published_at' => now()->subDays($index),
                    'read_time' => 5,
                    'is_featured' => $index === 0,
                ],
            );

            $tagIds = Tag::whereIn('slug', $data['tags'])->pluck('id');
            $post->tags()->sync($tagIds);
        }
    }

    protected function testimonials(): void
    {
        $items = [
            ['name' => 'Sarah Johnson', 'role' => 'CEO, TechStart', 'content' => 'The team delivered an exceptional website that exceeded our expectations. Our conversion rate increased by 150%.', 'rating' => 5],
            ['name' => 'Michael Chen', 'role' => 'Founder, GrowthCo', 'content' => 'Professional, creative, and results-driven. They transformed our digital presence.', 'rating' => 5],
            ['name' => 'Emily Rodriguez', 'role' => 'Marketing Director, InnovateLab', 'content' => 'Outstanding work on our mobile app. The user experience is incredible.', 'rating' => 5],
        ];

        foreach ($items as $index => $item) {
            Testimonial::updateOrCreate(['name' => $item['name']], array_merge($item, ['sort_order' => $index, 'is_active' => true]));
        }
    }

    protected function faqs(): void
    {
        $faqs = [
            ['question' => 'What services do you offer?', 'answer' => 'We offer web development, mobile apps, UI/UX design, digital marketing and e-commerce solutions.', 'category' => 'general'],
            ['question' => 'How long does a typical project take?', 'answer' => 'Project timelines vary, but most projects take between 4 and 12 weeks.', 'category' => 'process'],
            ['question' => 'Do you provide ongoing support?', 'answer' => 'Yes, we offer maintenance and support packages.', 'category' => 'support'],
            ['question' => 'How do you price projects?', 'answer' => 'We offer both fixed-price and retainer arrangements.', 'category' => 'pricing'],
            ['question' => 'Can you work with our existing team?', 'answer' => 'Absolutely. We frequently collaborate with in-house teams.', 'category' => 'process'],
            ['question' => 'What is your payment schedule?', 'answer' => 'Typically 50% upfront and 50% on completion, but we are flexible.', 'category' => 'pricing'],
        ];

        foreach ($faqs as $index => $faq) {
            Faq::updateOrCreate(['question' => $faq['question']], array_merge($faq, ['sort_order' => $index, 'is_active' => true]));
        }
    }

    protected function pricing(): void
    {
        $plans = [
            ['name' => 'Starter', 'price' => 2999, 'description' => 'Perfect for small businesses.', 'features' => ['5 Pages', 'Responsive Design', 'Basic SEO', '1 Revision Round'], 'delivery_time' => '2-3 weeks', 'is_popular' => false],
            ['name' => 'Professional', 'price' => 7999, 'description' => 'Best for growing companies.', 'features' => ['15 Pages', 'Custom Design', 'Advanced SEO', 'CMS Integration', '3 Revision Rounds'], 'delivery_time' => '4-6 weeks', 'is_popular' => true],
            ['name' => 'Enterprise', 'price' => 19999, 'description' => 'Full-scale digital solutions.', 'features' => ['Unlimited Pages', 'Custom Application', 'E-commerce', 'Priority Support', 'Unlimited Revisions'], 'delivery_time' => '6-12 weeks', 'is_popular' => false],
        ];

        foreach ($plans as $index => $plan) {
            PricingPlan::updateOrCreate(['name' => $plan['name']], array_merge($plan, ['sort_order' => $index, 'is_active' => true, 'currency' => 'USD', 'period' => 'project']));
        }
    }

    protected function jobs(): void
    {
        $jobs = [
            ['title' => 'Senior Frontend Developer', 'department' => 'Engineering', 'location' => 'Remote', 'type' => 'Full-time', 'salary' => '$80k - $120k'],
            ['title' => 'UI/UX Designer', 'department' => 'Design', 'location' => 'New York, NY', 'type' => 'Full-time', 'salary' => '$70k - $100k'],
            ['title' => 'Project Manager', 'department' => 'Operations', 'location' => 'Remote', 'type' => 'Full-time', 'salary' => '$65k - $90k'],
            ['title' => 'Digital Marketing Specialist', 'department' => 'Marketing', 'location' => 'Remote', 'type' => 'Contract', 'salary' => '$40/hr'],
            ['title' => 'Backend Developer (Laravel)', 'department' => 'Engineering', 'location' => 'Hybrid', 'type' => 'Full-time', 'salary' => '$75k - $110k'],
        ];

        foreach ($jobs as $index => $job) {
            JobOpening::updateOrCreate(['slug' => Str::slug($job['title'])], array_merge($job, [
                'description' => 'Join our team as a '.$job['title'].'.',
                'requirements' => ['3+ years experience', 'Strong communication skills', 'Portfolio of work'],
                'status' => 'open',
                'posted_at' => now()->subDays(7 * ($index + 1)),
                'sort_order' => $index,
            ]));
        }
    }
}
