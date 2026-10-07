<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasPermission
{
    /**
     * Usage: ->middleware('permission:users.view') or multiple: 'permission:users.view,users.update'
     * Any one of the given permissions grants access.
     */
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        if ($permissions === [] || $user->hasAnyPermission($permissions)) {
            return $next($request);
        }

        return response()->json([
            'message' => 'You do not have permission to perform this action.',
            'required' => $permissions,
        ], 403);
    }
}
