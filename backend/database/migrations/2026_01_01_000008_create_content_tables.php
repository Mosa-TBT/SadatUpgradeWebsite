<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('icon', 60)->nullable();
            $table->string('short_description', 500)->nullable();
            $table->text('description')->nullable();
            $table->json('features')->nullable();
            $table->json('technologies')->nullable();
            $table->foreignId('image_media_id')->nullable()->constrained('media')->nullOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->nullable()->index();
            $table->string('client_name')->nullable();
            $table->string('short_description', 500)->nullable();
            $table->text('description')->nullable();
            $table->string('duration', 60)->nullable();
            $table->unsignedInteger('team_size')->nullable();
            $table->foreignId('image_media_id')->nullable()->constrained('media')->nullOnDelete();
            $table->json('technologies')->nullable();
            $table->json('results')->nullable();
            $table->json('challenges')->nullable();
            $table->json('solutions')->nullable();
            $table->string('testimonial_content', 1000)->nullable();
            $table->string('testimonial_author')->nullable();
            $table->string('testimonial_role')->nullable();
            $table->string('live_url')->nullable();
            $table->string('repo_url')->nullable();
            $table->string('status', 20)->default('published')->index();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('post_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('excerpt', 500)->nullable();
            $table->longText('content')->nullable();
            $table->foreignId('featured_media_id')->nullable()->constrained('media')->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('post_categories')->nullOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status', 20)->default('draft')->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->unsignedInteger('read_time')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 500)->nullable();
            $table->string('og_image')->nullable();
            $table->boolean('robots_index')->default(true);
            $table->boolean('robots_follow')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('post_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            $table->unique(['post_id', 'tag_id']);
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role')->nullable();
            $table->text('content');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->foreignId('avatar_media_id')->nullable()->constrained('media')->nullOnDelete();
            $table->boolean('is_active')->default(true)->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role')->nullable();
            $table->string('department')->nullable();
            $table->text('bio')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 30)->nullable();
            $table->foreignId('image_media_id')->nullable()->constrained('media')->nullOnDelete();
            $table->json('socials')->nullable();
            $table->string('status', 20)->default('active')->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->text('answer');
            $table->string('category', 80)->default('general')->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('pricing_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 10, 2)->default(0);
            $table->string('currency', 5)->default('USD');
            $table->string('period', 30)->default('project');
            $table->string('description', 500)->nullable();
            $table->json('features')->nullable();
            $table->string('cta_label')->default('Get Started');
            $table->string('cta_url')->nullable();
            $table->string('delivery_time', 60)->nullable();
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_active')->default(true)->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('job_openings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('department')->nullable()->index();
            $table->string('location')->nullable();
            $table->string('type', 40)->default('Full-time');
            $table->string('salary')->nullable();
            $table->text('description')->nullable();
            $table->json('requirements')->nullable();
            $table->string('status', 20)->default('open')->index();
            $table->timestamp('posted_at')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_openings');
        Schema::dropIfExists('pricing_plans');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('team_members');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('post_tag');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('post_categories');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('services');
    }
};
