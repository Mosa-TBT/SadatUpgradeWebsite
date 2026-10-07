<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Language;
use App\Models\Translation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TranslationController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Translation::query();

        if ($request->filled('language_id')) {
            $query->where('language_id', $request->input('language_id'));
        }

        if ($request->filled('group')) {
            $query->where('group', $request->input('group'));
        }

        if ($search = $request->string('search')->trim()->value()) {
            $query->where(fn ($q) => $q->where('key', 'like', "%{$search}%")->orWhere('value', 'like', "%{$search}%"));
        }

        return $this->ok($query->orderBy('group')->orderBy('key')->paginate(min((int) $request->input('per_page', 50), 200)));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'language_id' => ['required', 'integer', 'exists:languages,id'],
            'group' => ['required', 'string', 'max:60'],
            'key' => ['required', 'string', 'max:190'],
            'value' => ['nullable', 'string'],
        ]);

        $translation = Translation::updateOrCreate(
            [
                'language_id' => $data['language_id'],
                'group' => $data['group'],
                'key' => $data['key'],
            ],
            ['value' => $data['value'] ?? null],
        );

        return $this->created($translation, 'Translation saved');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $translation = Translation::findOrFail($id);

        $data = $request->validate([
            'value' => ['nullable', 'string'],
            'key' => ['required', 'string', 'max:190'],
            'group' => ['required', 'string', 'max:60'],
        ]);

        $translation->update($data);

        return $this->ok($translation, 'Translation updated');
    }

    public function destroy(int $id): JsonResponse
    {
        Translation::findOrFail($id)->delete();

        return $this->ok(null, 'Translation deleted');
    }

    public function groups(): JsonResponse
    {
        return $this->ok(Translation::query()->select('group')->distinct()->orderBy('group')->pluck('group'));
    }
}
