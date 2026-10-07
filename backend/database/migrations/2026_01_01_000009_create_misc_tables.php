<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('email');
            $table->string('phone', 30)->nullable();
            $table->string('company')->nullable();
            $table->string('service')->nullable();
            $table->string('budget')->nullable();
            $table->text('message');
            $table->string('status', 20)->default('new')->index();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
        });

        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('status', 20)->default('subscribed')->index();
            $table->string('source', 60)->nullable();
            $table->timestamp('subscribed_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('user_dashboard_widgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('widget_key', 60);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->timestamps();
            $table->unique(['user_id', 'widget_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_dashboard_widgets');
        Schema::dropIfExists('newsletter_subscribers');
        Schema::dropIfExists('contact_messages');
    }
};
