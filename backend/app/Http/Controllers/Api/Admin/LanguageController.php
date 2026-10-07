<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Language;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LanguageController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return $this->ok(Language::query()->withCount('translations')->orderBy('sort_order')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:10', 'unique:languages,code'],
            'name' => ['required', 'string', 'max:255'],
            'native_name' => ['required', 'string', 'max:255'],
            'direction' => ['required', 'in:ltr,rtl'],
            'is_active' => ['boolean'],
            'is_default' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $language = DB::transaction(function () use ($data) {
            if (! empty($data['is_default'])) {
                Language::query()->update(['is_default' => false]);
            }

            return Language::create($data);
        });

        return $this->created($language, 'Language created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $language = Language::findOrFail($id);

        $data = $request->validate([
            'code' => ['required', 'string', 'max:10', 'unique:languages,code,'.$id],
            'name' => ['required', 'string', 'max:255'],
            'native_name' => ['required', 'string', 'max:255'],
            'direction' => ['required', 'in:ltr,rtl'],
            'is_active' => ['boolean'],
            'is_default' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($language, $data) {
            if (! empty($data['is_default'])) {
                Language::query()->whereKeyNot($language->id)->update(['is_default' => false]);
            }

            $language->update($data);
        });

        return $this->ok($language->fresh(), 'Language updated');
    }

    public function setDefault(int $id): JsonResponse
    {
        $language = Language::findOrFail($id);

        DB::transaction(function () use ($language) {
            Language::query()->update(['is_default' => false]);
            $language->update(['is_default' => true, 'is_active' => true]);
        });

        return $this->ok($language, 'Default language updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $language = Language::findOrFail($id);

        if ($language->is_default) {
            return $this->error('The default language cannot be deleted.', 422);
        }

        $language->delete();

        return $this->ok(null, 'Language deleted');
    }
}
