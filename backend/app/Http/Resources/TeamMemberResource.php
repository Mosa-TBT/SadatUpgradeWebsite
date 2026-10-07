<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamMemberResource extends JsonResource
{
    /**
     * Public-facing shape for team members. Excludes internal/admin fields
     * such as email, phone and uploaded_by.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'role' => $this->role,
            'position' => $this->role,
            'department' => $this->department,
            'bio' => $this->bio,
            'socials' => $this->socials,
            'portfolio_url' => $this->portfolio_url,
            'image_url' => $this->image_url,
            'sort_order' => $this->sort_order,
            'status' => $this->status,
        ];
    }
}