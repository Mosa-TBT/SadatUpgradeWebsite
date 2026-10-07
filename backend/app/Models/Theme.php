<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Theme extends Model
{
    use Auditable;

    protected $fillable = ['name', 'slug', 'description', 'tokens', 'is_active', 'is_system', 'created_by'];

    protected $casts = [
        'tokens' => 'array',
        'is_active' => 'boolean',
        'is_system' => 'boolean',
    ];

    public function auditLabel(): string
    {
        return 'theme';
    }

    protected static function booted(): void
    {
        static::creating(function (Theme $theme): void {
            if (empty($theme->slug)) {
                $theme->slug = Str::slug($theme->name).'-'.Str::lower(Str::random(5));
            }
        });
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function versions(): HasMany
    {
        return $this->hasMany(ThemeVersion::class)->orderByDesc('version');
    }

    public function publishVersion(?int $userId = null, ?string $note = null): ThemeVersion
    {
        $next = (int) $this->versions()->max('version') + 1;

        return $this->versions()->create([
            'version' => $next,
            'tokens' => $this->tokens,
            'note' => $note,
            'created_by' => $userId,
        ]);
    }
}
