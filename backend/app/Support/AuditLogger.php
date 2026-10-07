<?php

namespace App\Support;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AuditLogger
{
    public function modelEvent(string $event, Model $model, array $old = [], array $new = []): void
    {
        if (! Auth::check()) {
            return;
        }

        $prefix = method_exists($model, 'auditLabel')
            ? $model->auditLabel()
            : Str::snake(class_basename($model));

        $this->log(
            event: "{$prefix}.{$event}",
            model: $model,
            old: $old,
            new: $new,
        );
    }

    public function log(
        string $event,
        ?Model $model = null,
        array $old = [],
        array $new = [],
        ?string $description = null,
        ?int $userId = null,
    ): AuditLog {
        $request = request();

        return AuditLog::create([
            'user_id' => $userId ?? Auth::id(),
            'event' => $event,
            'auditable_type' => $model ? $model->getMorphClass() : null,
            'auditable_id' => $model?->getKey(),
            'description' => $description,
            'old_values' => $this->sanitize($old) ?: null,
            'new_values' => $this->sanitize($new) ?: null,
            'ip_address' => $request?->ip(),
            'user_agent' => Str::limit((string) $request?->userAgent(), 1000, ''),
            'url' => Str::limit((string) $request?->fullUrl(), 1000, ''),
            'method' => $request?->method(),
        ]);
    }

    public function activity(string $event, string $description, array $properties = []): AuditLog
    {
        return $this->log($event, null, [], $properties, $description);
    }

    /**
     * Remove sensitive values before persisting.
     */
    protected function sanitize(array $values): array
    {
        $blocked = ['password', 'password_confirmation', 'remember_token', 'token', 'secret', 'api_key'];

        foreach ($values as $key => $value) {
            if (in_array(Str::lower((string) $key), $blocked, true)) {
                $values[$key] = '[hidden]';
            }
        }

        return $values;
    }
}
