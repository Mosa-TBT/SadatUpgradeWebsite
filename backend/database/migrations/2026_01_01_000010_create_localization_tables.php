<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique();
            $table->string('name');
            $table->string('native_name');
            $table->string('direction', 3)->default('ltr');
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_default')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('language_id')->constrained()->cascadeOnDelete();
            $table->string('group', 60)->default('general')->index();
            $table->string('key', 190);
            $table->text('value')->nullable();
            $table->timestamps();
            $table->unique(['language_id', 'group', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('translations');
        Schema::dropIfExists('languages');
    }
};
