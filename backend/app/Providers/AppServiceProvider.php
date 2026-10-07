<?php

namespace App\Providers;

use App\Models\Menu;
use App\Models\Media;
use App\Models\Page;
use App\Models\Role;
use App\Models\Setting;
use App\Models\Theme;
use App\Models\User;
use App\Models\TeamMember;
use App\Observers\TeamMemberObserver;
use App\Policies\MenuPolicy;
use App\Policies\MediaPolicy;
use App\Policies\PagePolicy;
use App\Policies\RolePolicy;
use App\Policies\SettingPolicy;
use App\Policies\ThemePolicy;
use App\Policies\UserPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(120)->by($request->user()?->id ?: $request->ip());
        });

        Gate::before(function (User $user, string $ability) {
            return $user->isSuperAdmin() ? true : null;
        });

        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Role::class, RolePolicy::class);
        Gate::policy(Page::class, PagePolicy::class);
        Gate::policy(Media::class, MediaPolicy::class);
        Gate::policy(Menu::class, MenuPolicy::class);
        Gate::policy(Theme::class, ThemePolicy::class);
        Gate::policy(Setting::class, SettingPolicy::class);

        TeamMember::observe(TeamMemberObserver::class);

        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
