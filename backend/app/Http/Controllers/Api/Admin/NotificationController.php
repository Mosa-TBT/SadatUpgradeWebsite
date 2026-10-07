<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        return $this->ok([
            'unread' => $user->unreadNotifications()->count(),
            'notifications' => $user->notifications()->paginate(min((int) $request->input('per_page', 15), 50)),
        ]);
    }

    public function markRead(Request $request, string $id): JsonResponse
    {
        $request->user()->notifications()->where('id', $id)->first()?->markAsRead();

        return $this->ok(null, 'Notification marked as read');
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return $this->ok(null, 'All notifications marked as read');
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $request->user()->notifications()->where('id', $id)->delete();

        return $this->ok(null, 'Notification deleted');
    }
}
