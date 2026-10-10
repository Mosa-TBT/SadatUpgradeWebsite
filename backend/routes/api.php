<?php

use App\Http\Controllers\Api\Admin\AuditLogController;
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\ContactMessageController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\FaqController;
use App\Http\Controllers\Api\Admin\JobOpeningController;
use App\Http\Controllers\Api\Admin\LanguageController;
use App\Http\Controllers\Api\Admin\LoginActivityController;
use App\Http\Controllers\Api\Admin\MediaController;
use App\Http\Controllers\Api\Admin\MenuController;
use App\Http\Controllers\Api\Admin\NewsletterSubscriberController;
use App\Http\Controllers\Api\Admin\NotificationController;
use App\Http\Controllers\Api\Admin\PageController;
use App\Http\Controllers\Api\Admin\PermissionController;
use App\Http\Controllers\Api\Admin\PostCategoryController;
use App\Http\Controllers\Api\Admin\PostController;
use App\Http\Controllers\Api\Admin\PricingPlanController;
use App\Http\Controllers\Api\Admin\ProfileController;
use App\Http\Controllers\Api\Admin\ProjectController;
use App\Http\Controllers\Api\Admin\RoleController;
use App\Http\Controllers\Api\Admin\SearchController;
use App\Http\Controllers\Api\Admin\ServiceController;
use App\Http\Controllers\Api\Admin\SettingController;
use App\Http\Controllers\Api\Admin\SystemController;
use App\Http\Controllers\Api\Admin\TagController;
use App\Http\Controllers\Api\Admin\TeamMemberController;
use App\Http\Controllers\Api\Admin\TestimonialController;
use App\Http\Controllers\Api\Admin\ThemeController;
use App\Http\Controllers\Api\Admin\TranslationController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\PublicController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API (website frontend)
|--------------------------------------------------------------------------
*/
Route::prefix('public')->group(function () {
    Route::get('config', [PublicController::class, 'config']);
    Route::get('menus', [PublicController::class, 'menus']);
    Route::get('pages', [PublicController::class, 'pages']);
    Route::get('pages/{slug}', [PublicController::class, 'page']);
    Route::get('services', [PublicController::class, 'services']);
    Route::get('projects', [PublicController::class, 'projects']);
    Route::get('posts', [PublicController::class, 'posts']);
    Route::get('posts/{slug}', [PublicController::class, 'post']);
    Route::get('testimonials', [PublicController::class, 'testimonials']);
    Route::get('team', [PublicController::class, 'team']);
    Route::get('faqs', [PublicController::class, 'faqs']);
    Route::get('pricing', [PublicController::class, 'pricing']);
    Route::get('jobs', [PublicController::class, 'jobs']);

    Route::middleware('throttle:20,1')->group(function () {
        Route::post('contact', [PublicController::class, 'contact']);
        Route::post('newsletter', [PublicController::class, 'newsletter']);
    });

    Route::post('page-views', [PublicController::class, 'trackPageView'])->middleware('throttle:120,1');
});

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:10,1');
    Route::post('register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');
    Route::post('reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:5,1');

    Route::middleware(['auth:sanctum', 'active'])->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('logout-all', [AuthController::class, 'logoutAll']);
        Route::post('change-password', [AuthController::class, 'changePassword']);
        Route::get('sessions', [AuthController::class, 'sessions']);
        Route::delete('sessions/{id}', [AuthController::class, 'destroySession']);
    });
});

/*
|--------------------------------------------------------------------------
| Admin API
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware(['auth:sanctum', 'active'])->group(function () {
    /* Profile (self service) */
    Route::get('profile', [ProfileController::class, 'show']);
    Route::put('profile', [ProfileController::class, 'update']);
    Route::put('profile/password', [ProfileController::class, 'updatePassword']);
    Route::put('profile/preferences', [ProfileController::class, 'preferences']);

    /* Dashboard */
    Route::get('dashboard/overview', [DashboardController::class, 'overview'])->middleware('permission:dashboard.view');
    Route::get('dashboard/layout', [DashboardController::class, 'layout']);
    Route::put('dashboard/layout', [DashboardController::class, 'saveLayout']);

    /* Global search */
    Route::get('search', [SearchController::class, 'index']);

    /* Notifications */
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::post('notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::delete('notifications/{id}', [NotificationController::class, 'destroy']);

    /* Settings */
    Route::get('settings/registry', [SettingController::class, 'registry'])->middleware('permission:settings.view');
    Route::get('settings', [SettingController::class, 'index'])->middleware('permission:settings.view');
    Route::get('settings/{group}', [SettingController::class, 'show'])->middleware('permission:settings.view');
    Route::put('settings/{group}', [SettingController::class, 'update'])->middleware('permission:settings.update');

    /* Themes */
    Route::get('themes/defaults', [ThemeController::class, 'defaults'])->middleware('permission:theme.view');
    Route::get('themes/presets', [ThemeController::class, 'presets'])->middleware('permission:theme.view');
    Route::post('themes/preview', [ThemeController::class, 'preview'])->middleware('permission:theme.view');
    Route::get('themes', [ThemeController::class, 'index'])->middleware('permission:theme.view');
    Route::post('themes', [ThemeController::class, 'store'])->middleware('permission:theme.update');
    Route::get('themes/{id}', [ThemeController::class, 'show'])->middleware('permission:theme.view');
    Route::put('themes/{id}', [ThemeController::class, 'update'])->middleware('permission:theme.update');
    Route::post('themes/{id}/duplicate', [ThemeController::class, 'duplicate'])->middleware('permission:theme.update');
    Route::post('themes/{id}/activate', [ThemeController::class, 'activate'])->middleware('permission:theme.publish');
    Route::get('themes/{id}/versions', [ThemeController::class, 'versions'])->middleware('permission:theme.view');
    Route::post('themes/{id}/versions/{version}/restore', [ThemeController::class, 'restoreVersion'])->middleware('permission:theme.update');
    Route::delete('themes/{id}', [ThemeController::class, 'destroy'])->middleware('permission:theme.update');

    /* Navigation */
    Route::get('menus', [MenuController::class, 'index'])->middleware('permission:navigation.view');
    Route::post('menus', [MenuController::class, 'store'])->middleware('permission:navigation.update');
    Route::put('menus/{id}', [MenuController::class, 'update'])->middleware('permission:navigation.update');
    Route::delete('menus/{id}', [MenuController::class, 'destroy'])->middleware('permission:navigation.update');
    Route::post('menus/{menuId}/items', [MenuController::class, 'storeItem'])->middleware('permission:navigation.update');
    Route::put('menus/{menuId}/items/{itemId}', [MenuController::class, 'updateItem'])->middleware('permission:navigation.update');
    Route::delete('menus/{menuId}/items/{itemId}', [MenuController::class, 'destroyItem'])->middleware('permission:navigation.update');
    Route::post('menus/{menuId}/reorder', [MenuController::class, 'reorder'])->middleware('permission:navigation.update');

    /* Pages */
Route::get('pages/blocks', [PageController::class, 'blocks'])->middleware('permission:pages.view');
Route::get('pages', [PageController::class, 'index'])->middleware('permission:pages.view');
Route::get('pages/{id}', [PageController::class, 'show'])->middleware('permission:pages.view');
    Route::put('pages/{id}', [PageController::class, 'update'])->middleware('permission:pages.update');
    Route::delete('pages/{id}', [PageController::class, 'destroy'])->middleware('permission:pages.delete');
    Route::post('pages/{id}/publish', [PageController::class, 'publish'])->middleware('permission:pages.publish');
    Route::post('pages/{id}/schedule', [PageController::class, 'schedule'])->middleware('permission:pages.publish');
Route::put('pages/{id}/sections', [PageController::class, 'syncSections'])->middleware('permission:pages.update');
    Route::get('pages/{id}/revisions', [PageController::class, 'revisions'])->middleware('permission:pages.view');
    Route::post('pages/{id}/revisions/{revision}/restore', [PageController::class, 'restoreRevision'])->middleware('permission:pages.update');

    /* Media */
    Route::get('media/folders', [MediaController::class, 'folders'])->middleware('permission:media.view');
    Route::get('media', [MediaController::class, 'index'])->middleware('permission:media.view');
    Route::post('media', [MediaController::class, 'store'])->middleware('permission:media.upload');
    Route::post('media/bulk-delete', [MediaController::class, 'bulkDestroy'])->middleware('permission:media.delete');
    Route::get('media/{id}', [MediaController::class, 'show'])->middleware('permission:media.view');
    Route::put('media/{id}', [MediaController::class, 'update'])->middleware('permission:media.upload');
    Route::delete('media/{id}', [MediaController::class, 'destroy'])->middleware('permission:media.delete');

    /* Users */
    Route::get('users', [UserController::class, 'index'])->middleware('permission:users.view');
    Route::post('users', [UserController::class, 'store'])->middleware('permission:users.create');
    Route::get('users/{id}', [UserController::class, 'show'])->middleware('permission:users.view');
    Route::put('users/{id}', [UserController::class, 'update'])->middleware('permission:users.update');
    Route::delete('users/{id}', [UserController::class, 'destroy'])->middleware('permission:users.delete');
    Route::post('users/{id}/toggle-status', [UserController::class, 'toggleStatus'])->middleware('permission:users.update');
    Route::post('users/{id}/verify', [UserController::class, 'verify'])->middleware('permission:users.update');
    Route::post('users/{id}/reset-password', [UserController::class, 'resetPassword'])->middleware('permission:users.update');
    Route::put('users/{id}/roles', [UserController::class, 'assignRoles'])->middleware('permission:users.update');
    Route::get('users/{id}/activity', [UserController::class, 'activity'])->middleware('permission:users.view');

    /* Roles & permissions */
    Route::get('roles', [RoleController::class, 'index'])->middleware('permission:roles.view');
    Route::post('roles', [RoleController::class, 'store'])->middleware('permission:roles.create');
    Route::get('roles/{id}', [RoleController::class, 'show'])->middleware('permission:roles.view');
    Route::put('roles/{id}', [RoleController::class, 'update'])->middleware('permission:roles.update');
    Route::post('roles/{id}/duplicate', [RoleController::class, 'duplicate'])->middleware('permission:roles.create');
    Route::delete('roles/{id}', [RoleController::class, 'destroy'])->middleware('permission:roles.delete');
    Route::get('permissions', [PermissionController::class, 'index'])->middleware('permission:roles.view');

    /* Localization */
    Route::get('languages', [LanguageController::class, 'index'])->middleware('permission:localization.view');
    Route::post('languages', [LanguageController::class, 'store'])->middleware('permission:localization.update');
    Route::put('languages/{id}', [LanguageController::class, 'update'])->middleware('permission:localization.update');
    Route::post('languages/{id}/default', [LanguageController::class, 'setDefault'])->middleware('permission:localization.update');
    Route::delete('languages/{id}', [LanguageController::class, 'destroy'])->middleware('permission:localization.update');
    Route::get('translations/groups', [TranslationController::class, 'groups'])->middleware('permission:localization.view');
    Route::get('translations', [TranslationController::class, 'index'])->middleware('permission:localization.view');
    Route::post('translations', [TranslationController::class, 'store'])->middleware('permission:localization.update');
    Route::put('translations/{id}', [TranslationController::class, 'update'])->middleware('permission:localization.update');
    Route::delete('translations/{id}', [TranslationController::class, 'destroy'])->middleware('permission:localization.update');

    /* Content modules */
    $content = [
        'services' => ServiceController::class,
        'projects' => ProjectController::class,
        'testimonials' => TestimonialController::class,
        'team' => TeamMemberController::class,
        'faqs' => FaqController::class,
        'pricing-plans' => PricingPlanController::class,
        'jobs' => JobOpeningController::class,
        'post-categories' => PostCategoryController::class,
        'tags' => TagController::class,
    ];

    foreach ($content as $uri => $controller) {
        Route::get($uri, [$controller, 'index'])->middleware('permission:content.view');
        Route::post($uri, [$controller, 'store'])->middleware('permission:content.create');
        Route::get($uri.'/{id}', [$controller, 'show'])->middleware('permission:content.view');
        Route::put($uri.'/{id}', [$controller, 'update'])->middleware('permission:content.update');
        Route::delete($uri.'/{id}', [$controller, 'destroy'])->middleware('permission:content.delete');
        Route::post($uri.'/reorder', [$controller, 'reorder'])->middleware('permission:content.update');
        Route::post($uri.'/{id}/toggle', [$controller, 'toggle'])->middleware('permission:content.update');
    }

    Route::post('projects/{id}/publish', [ProjectController::class, 'publish'])->middleware('permission:content.update');
    Route::post('projects/{id}/toggle', [ProjectController::class, 'toggle'])->middleware('permission:content.update');

    /* Posts */
    Route::get('posts', [PostController::class, 'index'])->middleware('permission:posts.view');
    Route::post('posts', [PostController::class, 'store'])->middleware('permission:posts.create');
    Route::get('posts/{id}', [PostController::class, 'show'])->middleware('permission:posts.view');
    Route::put('posts/{id}', [PostController::class, 'update'])->middleware('permission:posts.update');
    Route::delete('posts/{id}', [PostController::class, 'destroy'])->middleware('permission:posts.delete');
    Route::post('posts/{id}/publish', [PostController::class, 'publish'])->middleware('permission:posts.publish');
    Route::post('posts/reorder', [PostController::class, 'reorder'])->middleware('permission:posts.update');

    /* Messages */
    Route::get('contact-messages', [ContactMessageController::class, 'index'])->middleware('permission:messages.view');
    Route::get('contact-messages/{id}', [ContactMessageController::class, 'show'])->middleware('permission:messages.view');
    Route::put('contact-messages/{id}', [ContactMessageController::class, 'update'])->middleware('permission:messages.update');
    Route::delete('contact-messages/{id}', [ContactMessageController::class, 'destroy'])->middleware('permission:messages.delete');
    Route::get('newsletter', [NewsletterSubscriberController::class, 'index'])->middleware('permission:messages.view');
    Route::post('newsletter', [NewsletterSubscriberController::class, 'store'])->middleware('permission:messages.update');
    Route::put('newsletter/{id}', [NewsletterSubscriberController::class, 'update'])->middleware('permission:messages.update');
    Route::delete('newsletter/{id}', [NewsletterSubscriberController::class, 'destroy'])->middleware('permission:messages.delete');

    /* Logs */
    Route::get('audit-logs', [AuditLogController::class, 'index'])->middleware('permission:logs.view');
    Route::get('audit-logs/events', [AuditLogController::class, 'events'])->middleware('permission:logs.view');
    Route::get('audit-logs/{id}', [AuditLogController::class, 'show'])->middleware('permission:logs.view');
    Route::get('login-activities', [LoginActivityController::class, 'index'])->middleware('permission:logs.view');

    /* System */
    Route::get('system/info', [SystemController::class, 'info'])->middleware('permission:system.view');
    Route::post('system/maintenance', [SystemController::class, 'maintenance'])->middleware('permission:system.manage');
    Route::post('system/cache', [SystemController::class, 'cacheAction'])->middleware('permission:system.manage');
});
