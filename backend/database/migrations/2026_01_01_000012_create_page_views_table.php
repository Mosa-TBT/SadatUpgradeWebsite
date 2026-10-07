<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->nullable()->constrained()->nullOnDelete();
            $table->string('path');
            $table->string('ip_address', 45)->nullable();
            $table->string('referrer')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
            $table->index('created_at');
            $table->index('path');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_views');
    }
};
