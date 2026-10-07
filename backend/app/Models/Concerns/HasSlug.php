<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

trait HasSlug
{
    public static function bootHasSlug(): void
    {
        static::creating(function ($model): void {
            if (empty($model->slug)) {
                $model->slug = static::uniqueSlug($model, $model->title ?? $model->name ?? Str::random(8));
            }
        });

        static::updating(function ($model): void {
            if ($model->isDirty('title') && ! $model->isDirty('slug')) {
                $model->slug = static::uniqueSlug($model, $model->title);
            }
        });
    }

    protected static function uniqueSlug($model, string $source): string
    {
        $base = Str::slug($source) ?: Str::random(8);
        $slug = $base;
        $i = 1;

        while ($model->newQuery()->where('slug', $slug)->whereKeyNot($model->getKey())->exists()) {
            $slug = $base.'-'.(++$i);
        }

        return $slug;
    }
}
