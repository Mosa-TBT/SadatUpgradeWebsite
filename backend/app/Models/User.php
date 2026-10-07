<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasRoles;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use Auditable;
    use HasApiTokens;
    use HasFactory;
    use HasRoles;
    use Notifiable;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'avatar_media_id',
        'status',
        'is_super_admin',
        'job_title',
        'bio',
        'timezone',
        'locale',
        'last_login_at',
        'last_login_ip',
        'password_changed_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_super_admin' => 'boolean',
            'last_login_at' => 'datetime',
            'password_changed_at' => 'datetime',
        ];
    }

    public function auditLabel(): string
    {
        return 'user';
    }

    public function avatar(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'avatar_media_id');
    }

    public function loginActivities(): HasMany
    {
        return $this->hasMany(LoginActivity::class);
    }

    public function dashboardWidgets(): HasMany
    {
        return $this->hasMany(UserDashboardWidget::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function getAvatarUrlAttribute(): ?string
    {
        return $this->avatar?->url;
    }
}
