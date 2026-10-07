<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => config('app.name').' API',
        'status' => 'ok',
        'docs' => '/api/public/config',
    ]);
});

Route::get('/sitemap.xml', [\App\Http\Controllers\Api\PublicController::class, 'sitemap']);
