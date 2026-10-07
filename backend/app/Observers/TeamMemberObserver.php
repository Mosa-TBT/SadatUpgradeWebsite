<?php

namespace App\Observers;

use App\Models\TeamMember;
use Illuminate\Support\Facades\Cache;

class TeamMemberObserver
{
    public const CACHE_KEY = 'public.team';

    /**
     * Invalidate the cached public team listing whenever a member changes,
     * so a new/updated/inactive member is reflected immediately.
     */
    protected function invalidate(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    public function created(TeamMember $member): void
    {
        $this->invalidate();
    }

    public function updated(TeamMember $member): void
    {
        $this->invalidate();
    }

    public function deleted(TeamMember $member): void
    {
        $this->invalidate();
    }

    public function restored(TeamMember $member): void
    {
        $this->invalidate();
    }
}