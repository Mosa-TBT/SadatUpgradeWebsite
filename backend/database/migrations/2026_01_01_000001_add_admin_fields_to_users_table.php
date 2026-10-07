<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 30)->nullable()->after('email');
            $table->unsignedBigInteger('avatar_media_id')->nullable()->after('phone');
            $table->string('status', 20)->default('active')->after('password')->index();
            $table->boolean('is_super_admin')->default(false)->after('status');
            $table->string('job_title')->nullable()->after('is_super_admin');
            $table->text('bio')->nullable()->after('job_title');
            $table->string('timezone', 64)->default('UTC')->after('bio');
            $table->string('locale', 10)->default('en')->after('timezone');
            $table->timestamp('last_login_at')->nullable()->after('locale');
            $table->string('last_login_ip', 45)->nullable()->after('last_login_at');
            $table->timestamp('password_changed_at')->nullable()->after('last_login_ip');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone', 'avatar_media_id', 'status', 'is_super_admin', 'job_title',
                'bio', 'timezone', 'locale', 'last_login_at', 'last_login_ip',
                'password_changed_at', 'deleted_at',
            ]);
        });
    }
};
