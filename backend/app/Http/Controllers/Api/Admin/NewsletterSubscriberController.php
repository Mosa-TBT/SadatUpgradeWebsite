<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterSubscriberController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = NewsletterSubscriber::query();

        if ($search = $request->string('search')->trim()->value()) {
            $query->where('email', 'like', "%{$search}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return $this->ok($query->latest()->paginate(min((int) $request->input('per_page', 15), 100)));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'source' => ['nullable', 'string', 'max:60'],
        ]);

        $subscriber = NewsletterSubscriber::updateOrCreate(
            ['email' => $data['email']],
            ['status' => 'subscribed', 'source' => $data['source'] ?? 'admin', 'subscribed_at' => now(), 'unsubscribed_at' => null],
        );

        return $this->created($subscriber, 'Subscriber added');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $subscriber = NewsletterSubscriber::findOrFail($id);

        $data = $request->validate([
            'status' => ['required', 'in:subscribed,unsubscribed'],
        ]);

        $subscriber->update([
            'status' => $data['status'],
            'subscribed_at' => $data['status'] === 'subscribed' ? now() : $subscriber->subscribed_at,
            'unsubscribed_at' => $data['status'] === 'unsubscribed' ? now() : null,
        ]);

        return $this->ok($subscriber, 'Subscriber updated');
    }

    public function destroy(int $id): JsonResponse
    {
        NewsletterSubscriber::findOrFail($id)->delete();

        return $this->ok(null, 'Subscriber removed');
    }
}
