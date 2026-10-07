<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = ContactMessage::query();

        if ($search = $request->string('search')->trim()->value()) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return $this->ok(
            $query->latest()->paginate(min((int) $request->input('per_page', 15), 100))->withQueryString()
        );
    }

    public function show(int $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);

        if ($message->status === 'new') {
            $message->update(['status' => 'read']);
        }

        return $this->ok($message);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);

        $data = $request->validate([
            'status' => ['required', 'in:new,read,replied,archived'],
        ]);

        $message->update($data);

        return $this->ok($message, 'Message updated');
    }

    public function destroy(int $id): JsonResponse
    {
        ContactMessage::findOrFail($id)->delete();

        return $this->ok(null, 'Message deleted');
    }
}
