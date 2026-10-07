<?php

namespace App\Support;

use App\Models\AuditLog;
use App\Models\ContactMessage;
use App\Models\LoginActivity;
use App\Models\Media;
use App\Models\NewsletterSubscriber;
use App\Models\Page;
use App\Models\PageView;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function range(string $range): CarbonImmutable
    {
        return match ($range) {
            'today' => CarbonImmutable::today(),
            '7d' => CarbonImmutable::now()->subDays(6)->startOfDay(),
            '90d' => CarbonImmutable::now()->subDays(89)->startOfDay(),
            'year' => CarbonImmutable::now()->subDays(364)->startOfDay(),
            default => CarbonImmutable::now()->subDays(29)->startOfDay(),
        };
    }

    public function stats(CarbonImmutable $from): array
    {
        return [
            'users' => [
                'total' => User::query()->count(),
                'active' => User::query()->where('status', 'active')->count(),
                'new' => User::query()->where('created_at', '>=', $from)->count(),
            ],
            'pages' => [
                'total' => Page::query()->count(),
                'published' => Page::query()->where('status', 'published')->count(),
                'draft' => Page::query()->where('status', 'draft')->count(),
            ],
            'posts' => [
                'total' => Post::query()->count(),
                'published' => Post::query()->where('status', 'published')->count(),
            ],
            'projects' => Project::query()->count(),
            'services' => Service::query()->count(),
            'media' => Media::query()->count(),
            'contacts' => [
                'total' => ContactMessage::query()->count(),
                'new' => ContactMessage::query()->where('status', 'new')->count(),
            ],
            'subscribers' => NewsletterSubscriber::query()->count(),
            'page_views' => PageView::query()->where('created_at', '>=', $from)->count(),
        ];
    }

    public function series(CarbonImmutable $from): array
    {
        return [
            'users' => $this->dailySeries(User::class, $from),
            'page_views' => $this->dailySeries(PageView::class, $from),
        ];
    }

    protected function dailySeries(string $model, CarbonImmutable $from): array
    {
        $rows = $model::query()
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->where('created_at', '>=', $from)
            ->groupBy('day')
            ->orderBy('day')
            ->pluck('total', 'day');

        $series = [];
        $cursor = $from->startOfDay();
        $end = CarbonImmutable::now()->startOfDay();

        while ($cursor->lte($end)) {
            $key = $cursor->toDateString();
            $series[] = ['date' => $key, 'value' => (int) ($rows[$key] ?? 0)];
            $cursor = $cursor->addDay();
        }

        return $series;
    }

    public function recentActivity(int $limit = 10): array
    {
        return AuditLog::query()
            ->with('user:id,name,email')
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn (AuditLog $log) => [
                'id' => $log->id,
                'event' => $log->event,
                'description' => $log->description,
                'user' => $log->user?->only(['id', 'name', 'email']),
                'created_at' => $log->created_at?->toIso8601String(),
            ])
            ->all();
    }

    public function recentUsers(int $limit = 5): array
    {
        return User::query()
            ->latest()
            ->limit($limit)
            ->get(['id', 'name', 'email', 'status', 'created_at'])
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'created_at' => $user->created_at?->toIso8601String(),
            ])
            ->all();
    }

    public function loginActivity(int $limit = 10): array
    {
        return LoginActivity::query()
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn (LoginActivity $activity) => [
                'id' => $activity->id,
                'email' => $activity->email,
                'status' => $activity->status,
                'ip_address' => $activity->ip_address,
                'created_at' => $activity->created_at?->toIso8601String(),
            ])
            ->all();
    }

    public function securityEvents(CarbonImmutable $from): array
    {
        return [
            'failed_logins' => LoginActivity::query()
                ->where('status', 'failed')
                ->where('created_at', '>=', $from)
                ->count(),
            'successful_logins' => LoginActivity::query()
                ->where('status', 'success')
                ->where('created_at', '>=', $from)
                ->count(),
        ];
    }

    public function topPages(CarbonImmutable $from, int $limit = 5): array
    {
        return PageView::query()
            ->select('path', DB::raw('COUNT(*) as views'))
            ->where('created_at', '>=', $from)
            ->groupBy('path')
            ->orderByDesc('views')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => ['path' => $row->path, 'views' => (int) $row->views])
            ->all();
    }

    public function overview(string $range = '30d'): array
    {
        $from = $this->range($range);

        return [
            'range' => $range,
            'stats' => $this->stats($from),
            'series' => $this->series($from),
            'recent_activity' => $this->recentActivity(),
            'recent_users' => $this->recentUsers(),
            'login_activity' => $this->loginActivity(),
            'security' => $this->securityEvents($from),
            'top_pages' => $this->topPages($from),
        ];
    }
}
