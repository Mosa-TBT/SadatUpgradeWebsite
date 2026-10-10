<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Http\Resources\TeamMemberResource;
use App\Models\ContactMessage;
use App\Models\Faq;
use App\Models\JobOpening;
use App\Models\Language;
use App\Models\Menu;
use App\Models\NewsletterSubscriber;
use App\Models\Page;
use App\Models\PageView;
use App\Models\Post;
use App\Models\PricingPlan;
use App\Models\Project;
use App\Models\Service;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Observers\TeamMemberObserver;
use App\Support\SettingService;
use App\Support\ThemeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class PublicController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SettingService $settings,
        protected ThemeService $themes,
    ) {}

    public function config(): JsonResponse
    {
        return $this->ok([
            'settings' => $this->settings->publicConfig(),
            'theme' => $this->themes->tokens(),
            'languages' => Language::query()->where('is_active', true)->orderBy('sort_order')->get(['code', 'name', 'native_name', 'direction', 'is_default']),
            'maintenance' => [
                'enabled' => (bool) $this->settings->get('website', 'maintenance_mode', false),
                'message' => $this->settings->get('website', 'maintenance_message'),
            ],
        ]);
    }

    public function menus(): JsonResponse
    {
        $menus = Menu::query()
            ->where('is_active', true)
            ->with(['items' => fn ($q) => $q->where('is_active', true)->with('page')])
            ->get();

        $result = $menus->mapWithKeys(fn (Menu $menu) => [
            $menu->location => $this->tree($menu->items),
        ]);

        return $this->ok($result);
    }

    public function pages(): JsonResponse
    {
        return $this->ok(Page::query()
            ->where('status', 'published')
            ->orderBy('sort_order')
            ->get(['id', 'title', 'slug', 'excerpt', 'updated_at']));
    }

    public function page(string $slug): JsonResponse
    {
        $page = Page::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->with(['sections' => fn ($q) => $q->where('is_active', true), 'featuredMedia'])
            ->firstOrFail();

        return $this->ok($page);
    }

    public function services(): JsonResponse
    {
        return $this->ok(Service::query()->where('is_active', true)->orderBy('sort_order')->with('image')->get());
    }

    public function projects(): JsonResponse
    {
        return $this->ok(Project::query()->where('is_active', true)->where('status', 'published')->orderBy('sort_order')->with('image')->get());
    }

    public function posts(): JsonResponse
    {
        return $this->ok(Post::query()
            ->where('status', 'published')
            ->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()))
            ->with(['category', 'author:id,name', 'featuredMedia', 'tags'])
            ->orderByDesc('published_at')
            ->paginate(9));
    }

    public function post(string $slug): JsonResponse
    {
        $post = Post::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->with(['category', 'author:id,name', 'featuredMedia', 'tags'])
            ->firstOrFail();

        return $this->ok($post);
    }

    public function testimonials(): JsonResponse
    {
        return $this->ok(Testimonial::query()->where('is_active', true)->orderBy('sort_order')->with('avatar')->get());
    }

    public function team(): JsonResponse
    {
        $members = Cache::remember(TeamMemberObserver::CACHE_KEY, now()->addMinutes(15), function () {
            return TeamMember::query()
                ->where('status', 'active')
                ->orderBy('sort_order')
                ->orderBy('id')
                ->with('image')
                ->get();
        });

        return $this->ok(TeamMemberResource::collection($members));
    }

    public function faqs(Request $request): JsonResponse
    {
        $query = Faq::query()->where('is_active', true)->orderBy('sort_order');

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        return $this->ok($query->get());
    }

    public function pricing(): JsonResponse
    {
        return $this->ok(PricingPlan::query()->where('is_active', true)->orderBy('sort_order')->get());
    }

    public function jobs(): JsonResponse
    {
        return $this->ok(JobOpening::query()->where('status', 'open')->orderBy('sort_order')->get());
    }

    public function contact(Request $request): JsonResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:120'],
            'last_name' => ['nullable', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'company' => ['nullable', 'string', 'max:255'],
            'service' => ['nullable', 'string', 'max:120'],
            'budget' => ['nullable', 'string', 'max:120'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $data['ip_address'] = $request->ip();
        ContactMessage::create($data);

        return $this->created(null, 'Thank you! We will get back to you shortly.');
    }

    public function newsletter(Request $request): JsonResponse
    {
        $data = $request->validate(['email' => ['required', 'email', 'max:255']]);

        NewsletterSubscriber::updateOrCreate(
            ['email' => $data['email']],
            ['status' => 'subscribed', 'source' => 'website', 'subscribed_at' => now(), 'unsubscribed_at' => null],
        );

        return $this->ok(null, 'Subscribed successfully');
    }

    public function trackPageView(Request $request): JsonResponse
    {
        $data = $request->validate(['path' => ['required', 'string', 'max:255']]);

        PageView::create([
            'path' => $data['path'],
            'ip_address' => $request->ip(),
            'referrer' => $request->header('referer'),
            'user_agent' => $request->userAgent(),
        ]);

        return $this->ok(null, 'Tracked');
    }

    public function sitemap(): Response
    {
        if (! $this->settings->get('seo', 'sitemap_enabled', true)) {
            abort(404);
        }

        $urls = collect();

        // The website exposes exactly four public pages: Home, About, Services, Contact.
        $publicSlugs = ['home', 'about', 'services', 'contact'];

        Page::query()
            ->whereIn('slug', $publicSlugs)
            ->where('status', 'published')
            ->get(['slug', 'updated_at'])
            ->each(function ($page) use ($urls) {
                $urls->push(['loc' => url('/'.($page->slug === 'home' ? '' : $page->slug)), 'lastmod' => $page->updated_at?->toAtomString()]);
            });

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n".'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";

        foreach ($urls as $entry) {
            $xml .= '  <url><loc>'.e($entry['loc']).'</loc>'.($entry['lastmod'] ? '<lastmod>'.e($entry['lastmod']).'</lastmod>' : '').'</url>'."\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }

    protected function tree($items, ?int $parentId = null): array
    {
        return collect($items)
            ->where('parent_id', $parentId)
            ->sortBy('sort_order')
            ->values()
            ->map(fn ($item) => [
                'id' => $item->id,
                'label' => $item->label,
                'url' => $item->resolved_url,
                'target' => $item->target,
                'icon' => $item->icon,
                'children' => $this->tree($items, $item->id),
            ])
            ->all();
    }
}
