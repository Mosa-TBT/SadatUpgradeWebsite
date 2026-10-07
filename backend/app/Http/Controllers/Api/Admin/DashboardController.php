<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\UserDashboardWidget;
use App\Support\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponse;

    public function __construct(protected DashboardService $dashboard) {}

    public function overview(Request $request): JsonResponse
    {
        $range = $request->input('range', '30d');

        return $this->ok($this->dashboard->overview($range));
    }

    public function layout(Request $request): JsonResponse
    {
        $widgets = UserDashboardWidget::query()
            ->where('user_id', $request->user()->id)
            ->orderBy('sort_order')
            ->get(['widget_key', 'sort_order', 'is_visible']);

        return $this->ok($widgets);
    }

    public function saveLayout(Request $request): JsonResponse
    {
        $data = $request->validate([
            'widgets' => ['required', 'array'],
            'widgets.*.widget_key' => ['required', 'string', 'max:60'],
            'widgets.*.sort_order' => ['required', 'integer', 'min:0'],
            'widgets.*.is_visible' => ['required', 'boolean'],
        ]);

        $userId = $request->user()->id;

        UserDashboardWidget::query()->where('user_id', $userId)->delete();

        foreach ($data['widgets'] as $widget) {
            UserDashboardWidget::create([
                'user_id' => $userId,
                'widget_key' => $widget['widget_key'],
                'sort_order' => $widget['sort_order'],
                'is_visible' => $widget['is_visible'],
            ]);
        }

        return $this->ok(null, 'Dashboard layout saved');
    }
}
