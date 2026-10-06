<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Health check — touche Neon volontairement :
// un ping externe (UptimeRobot, etc.) maintient Render ET Neon éveillés.
Route::get('/up', function () {
    try {
        DB::select('select 1');
    } catch (\Throwable $e) {
        return response('db down', 503);
    }

    return response('ok', 200);
})->withoutMiddleware([\Illuminate\Session\Middleware\StartSession::class]);
