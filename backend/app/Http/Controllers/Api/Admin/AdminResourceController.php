<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

abstract class AdminResourceController extends Controller
{
    use ApiResponse;

    abstract protected function model(): string;

    /**
     * @return array<string, mixed>
     */
    abstract protected function rules(Request $request, ?Model $instance = null): array;

    /**
     * @return array<int, string>
     */
    protected function searchable(): array
    {
        return ['title'];
    }

    /**
     * @return array<int, string>
     */
    protected function filterable(): array
    {
        return [];
    }

    protected function defaultSort(): string
    {
        return 'id';
    }

    protected function defaultDirection(): string
    {
        return 'desc';
    }

    /**
     * @return array<int, string>
     */
    protected function with(): array
    {
        return [];
    }

    protected function beforeStore(array $data): array
    {
        return $data;
    }

    protected function afterStore(Model $model, array $data): void {}

    protected function afterUpdate(Model $model, array $data): void {}

    public function index(Request $request): JsonResponse
    {
        $model = $this->model();
        $query = $model::query()->with($this->with());

        if ($search = $request->string('search')->trim()->value()) {
            $query->where(function ($q) use ($search) {
                foreach ($this->searchable() as $column) {
                    $q->orWhere($column, 'like', "%{$search}%");
                }
            });
        }

        foreach ($this->filterable() as $column) {
            if ($request->filled($column)) {
                $query->where($column, $request->input($column));
            }
        }

        if ($request->filled('status') && $this->hasColumn($model, 'status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('is_active') && $this->hasColumn($model, 'is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $sort = $request->input('sort', $this->defaultSort());
        $direction = $request->input('direction', $this->defaultDirection()) === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sort, $direction);

        $perPage = min((int) $request->input('per_page', 15), 100);

        if ($request->boolean('all')) {
            return $this->ok($query->get());
        }

        return $this->ok($query->paginate($perPage)->withQueryString());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->rules($request));
        $data = $this->beforeStore($data);

        $model = $this->model();
        $instance = $model::create($data);

        $this->afterStore($instance, $data);

        return $this->created($this->fresh($instance), 'Created successfully');
    }

    public function show(int|string $id): JsonResponse
    {
        return $this->ok($this->fresh($this->find($id)));
    }

    public function update(Request $request, int|string $id): JsonResponse
    {
        $instance = $this->find($id);
        $data = $request->validate($this->rules($request, $instance));

        $instance->update($this->beforeStore($data));
        $this->afterUpdate($instance, $data);

        return $this->ok($this->fresh($instance), 'Updated successfully');
    }

    public function destroy(int|string $id): JsonResponse
    {
        $this->find($id)->delete();

        return $this->ok(null, 'Deleted successfully');
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer'],
            'items.*.sort_order' => ['required', 'integer'],
        ]);

        $model = $this->model();

        foreach ($request->input('items') as $item) {
            $model::query()->whereKey($item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return $this->ok(null, 'Order updated');
    }

    public function toggle(int|string $id): JsonResponse
    {
        $instance = $this->find($id);

        if ($this->hasColumn($this->model(), 'is_active')) {
            $instance->update(['is_active' => ! $instance->is_active]);
        } elseif ($this->hasColumn($this->model(), 'status')) {
            $instance->update(['status' => $instance->status === 'active' ? 'inactive' : 'active']);
        }

        return $this->ok($this->fresh($instance), 'Status updated');
    }

    protected function find(int|string $id): Model
    {
        $model = $this->model();

        $query = $model::query()->with($this->with());

        $instance = ctype_digit((string) $id)
            ? $query->whereKey($id)->first()
            : $query->where('slug', $id)->first();

        abort_if(! $instance, 404, 'Resource not found.');

        return $instance;
    }

    protected function fresh(Model $model): Model
    {
        return $model->fresh($this->with());
    }

    protected function hasColumn(string $model, string $column): bool
    {
        static $cache = [];
        $table = (new $model)->getTable();

        return $cache[$table][$column] ??= \Illuminate\Support\Facades\Schema::hasColumn($table, $column);
    }

    protected function slugify(string $value): string
    {
        return Str::slug($value);
    }
}
