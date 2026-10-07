<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('group', 60)->default('general')->index();
            $table->string('key', 120);
            $table->longText('value')->nullable();
            $table->string('type', 20)->default('string');
            $table->boolean('is_encrypted')->default(false);
            $table->boolean('is_public')->default(false)->index();
            $table->timestamps();
            $table->unique(['group', 'key']);
        });

        Schema::create('themes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('description')->nullable();
            $table->json('tokens');
            $table->boolean('is_active')->default(false)->index();
            $table->boolean('is_system')->default(false);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('theme_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('theme_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('version');
            $table->json('tokens');
            $table->string('note')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->unique(['theme_id', 'version']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('theme_versions');
        Schema::dropIfExists('themes');
        Schema::dropIfExists('settings');
    }
};
