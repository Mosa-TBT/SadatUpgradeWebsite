<?php

namespace App\Models\Concerns;

use App\Support\AuditLogger;
use Illuminate\Support\Str;

trait Auditable
{
    public static function bootAuditable(): void
    {
        static::created(function ($model): void {
            app(AuditLogger::class)->modelEvent('created', $model, [], $model->getAttributes());
        });

        static::updated(function ($model): void {
            $changes = $model->getChanges();
            unset($changes['updated_at']);

            if (empty($changes)) {
                return;
            }

            $old = array_intersect_key($model->getOriginal(), $changes);
            app(AuditLogger::class)->modelEvent('updated', $model, $old, $changes);
        });

        static::deleted(function ($model): void {
            app(AuditLogger::class)->modelEvent('deleted', $model, $model->getOriginal(), []);
        });
    }

    public function auditLabel(): string
    {
        return Str::snake(class_basename($this));
    }
}
