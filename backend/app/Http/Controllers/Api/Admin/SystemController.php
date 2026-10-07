<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Support\SettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SystemController extends Controller
{
    use ApiResponse;

    public function __construct(protected SettingService $settings) {}

    public function info(): JsonResponse
    {
        $database = [
            'driver' => config('database.default'),
            'name' => config('database.connections.'.config('database.default').'.database'),
        ];

        try {
            $database['version'] = DB::selectOne('select version() as version')->version ?? null;
            $database['status'] = 'connected';
            $database['size_mb'] = $this->databaseSize();
        } catch (\Throwable $e) {
            $database['status'] = 'error';
            $database['error'] = $e->getMessage();
        }

        try {
            Cache::put('system.health', 'ok', 10);
            $cacheStatus = Cache::get('system.health') === 'ok' ? 'working' : 'unknown';
        } catch (\Throwable) {
            $cacheStatus = 'error';
        }

        return $this->ok([
            'application' => [
                'name' => config('app.name'),
                'version' => config('app.version', '1.0.0'),
                'environment' => config('app.env'),
                'debug' => (bool) config('app.debug'),
                'url' => config('app.url'),
                'timezone' => config('app.timezone'),
                'server_time' => now()->toIso8601String(),
                'maintenance' => (bool) $this->settings->get('website', 'maintenance_mode', false),
            ],
            'runtime' => [
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'os' => PHP_OS_FAMILY,
                'extensions' => array_values(array_intersect(['gd', 'imagick', 'mbstring', 'openssl', 'pdo_mysql', 'fileinfo', 'zip'], get_loaded_extensions())),
            ],
            'database' => $database,
            'cache' => ['store' => config('cache.default'), 'status' => $cacheStatus],
            'queue' => ['connection' => config('queue.default'), 'status' => 'ready'],
            'storage' => [
                'disk' => config('filesystems.default'),
                'free_space' => @disk_free_space(base_path()) ? round(disk_free_space(base_path()) / 1073741824, 2).' GB' : null,
                'media_files' => \App\Models\Media::query()->count(),
                'media_size_mb' => round((int) \App\Models\Media::query()->sum('size') / 1048576, 2),
            ],
        ]);
    }

    public function maintenance(Request $request): JsonResponse
    {
        $data = $request->validate(['enabled' => ['required', 'boolean']]);

        $this->settings->set('website', 'maintenance_mode', $data['enabled']);

        return $this->ok(['maintenance_mode' => $data['enabled']], $data['enabled'] ? 'Maintenance mode enabled' : 'Maintenance mode disabled');
    }

    public function cacheAction(Request $request): JsonResponse
    {
        $data = $request->validate([
            'action' => ['required', 'in:clear_cache,clear_config,cache_config,clear_route,cache_route,clear_view,cache_view,optimize,clear_logs'],
        ]);

        $commands = [
            'clear_cache' => ['cache:clear', 'Application cache cleared'],
            'clear_config' => ['config:clear', 'Configuration cache cleared'],
            'cache_config' => ['config:cache', 'Configuration cached'],
            'clear_route' => ['route:clear', 'Route cache cleared'],
            'cache_route' => ['route:cache', 'Routes cached'],
            'clear_view' => ['view:clear', 'Compiled views cleared'],
            'cache_view' => ['view:cache', 'Views cached'],
            'optimize' => ['optimize:clear', 'All caches cleared'],
            'clear_logs' => ['log:clear', 'Log files cleared'],
        ];

        [$command, $message] = $commands[$data['action']];

        Artisan::call($command);
        $this->settings->flush();

        return $this->ok(['output' => trim(Artisan::output())], $message);
    }

    protected function databaseSize(): ?float
    {
        try {
            $name = config('database.connections.'.config('database.default').'.database');
            $row = DB::selectOne(
                'select round(sum(data_length + index_length)/1048576, 2) as size from information_schema.tables where table_schema = ?',
                [$name]
            );

            return (float) ($row->size ?? 0);
        } catch (\Throwable) {
            return null;
        }
    }
}
