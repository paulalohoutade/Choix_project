<?php

use Illuminate\Support\Facades\Route;

// ── Controllers publics ───────────────────────────────────────────────────
use App\Http\Controllers\Api\AlbumController;
use App\Http\Controllers\Api\TrackController;
use App\Http\Controllers\Api\TrackAudioController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\SettingController;

// ── Auth ──────────────────────────────────────────────────────────────────
use App\Http\Controllers\Api\Auth\AuthController;

// ── Controllers admin ─────────────────────────────────────────────────────
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\AdminAlbumController;
use App\Http\Controllers\Api\Admin\AdminTrackController;
use App\Http\Controllers\Api\Admin\AdminEventController;
use App\Http\Controllers\Api\Admin\AdminPostController;
use App\Http\Controllers\Api\Admin\AdminGalleryController;
use App\Http\Controllers\Api\Admin\AdminMemberController;
use App\Http\Controllers\Api\Admin\AdminContactController;
use App\Http\Controllers\Api\Admin\AdminSettingController;

/*
|--------------------------------------------------------------------------
| ROUTES PUBLIQUES — sans authentification
|--------------------------------------------------------------------------
*/
Route::prefix('v1')->group(function () {

    // Albums
    Route::get('albums',               [AlbumController::class, 'index']);
    Route::get('albums/featured',      [AlbumController::class, 'featured']);
    Route::get('albums/{slug}',        [AlbumController::class, 'show']);
    Route::get('albums/{slug}/tracks', [AlbumController::class, 'tracks']);

    // Piste : incrémenter le compteur d'écoute + enregistrer la durée
    Route::post('tracks/{id}/play',     [TrackController::class, 'incrementPlay']);
    Route::post('tracks/{id}/duration', [TrackController::class, 'updateDuration']);

    // Diffuser l'audio avec support des requêtes Range
    Route::get('tracks/{track}/audio', [TrackAudioController::class, 'stream'])->name('tracks.audio');

    // Événements
    Route::get('events',               [EventController::class, 'index']);
    Route::get('events/upcoming',      [EventController::class, 'upcoming']);
    Route::get('events/{slug}',        [EventController::class, 'show']);

    // Blog / Actualités
    Route::get('posts',                [PostController::class, 'index']);
    Route::get('posts/{slug}',         [PostController::class, 'show']);

    // Galerie
    Route::get('gallery',              [GalleryController::class, 'index']);
    Route::get('gallery/{id}',         [GalleryController::class, 'show']);

    // Membres
    Route::get('members',              [MemberController::class, 'index']);

    // Contact
    Route::post('contact',             [ContactController::class, 'store']);

    // Paramètres publics
    Route::get('settings/public',      [SettingController::class, 'public']);

    // Authentification + reset mot de passe
    Route::post('auth/login',           [AuthController::class, 'login']);
    Route::post('auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('auth/reset-password',  [AuthController::class, 'resetPassword']);

});

/*
|--------------------------------------------------------------------------
| ROUTES ADMIN — protégées par Sanctum
|--------------------------------------------------------------------------
*/
Route::prefix('v1/admin')
    ->middleware(['auth:sanctum', 'role:super_admin,admin,editor'])
    ->group(function () {

    // Auth
    Route::post('auth/logout',         [AuthController::class, 'logout']);
    Route::get('auth/me',              [AuthController::class, 'me']);

    // Dashboard
    Route::get('dashboard/stats',      [DashboardController::class, 'stats']);

    // Albums
    Route::apiResource('albums',       AdminAlbumController::class);
    Route::post('albums/{id}/toggle-featured', [AdminAlbumController::class, 'toggleFeatured']);
    Route::post('albums/{id}/cover',   [AdminAlbumController::class, 'uploadCover']);

    // Pistes
    Route::apiResource('tracks',       AdminTrackController::class);
    Route::post('tracks/{id}/audio',   [AdminTrackController::class, 'uploadAudio']);
    Route::post('tracks/reorder',      [AdminTrackController::class, 'reorder']);

    // Événements
    Route::apiResource('events',       AdminEventController::class);
    Route::post('events/{id}/cover',   [AdminEventController::class, 'uploadCover']);

    // Posts
    Route::apiResource('posts',        AdminPostController::class);
    Route::post('posts/{id}/publish',  [AdminPostController::class, 'publish']);
    Route::post('posts/{id}/cover',    [AdminPostController::class, 'uploadCover']);

    // Galerie
    Route::apiResource('gallery',      AdminGalleryController::class);
    Route::post('gallery/upload',      [AdminGalleryController::class, 'upload']);
    Route::post('gallery/reorder',     [AdminGalleryController::class, 'reorder']);

    // Membres
    Route::apiResource('members',      AdminMemberController::class);
    Route::post('members/{id}/photo',  [AdminMemberController::class, 'uploadPhoto']);
    Route::post('members/reorder',     [AdminMemberController::class, 'reorder']);

    // Messages de contact
    Route::get('contacts',             [AdminContactController::class, 'index']);
    Route::get('contacts/{id}',        [AdminContactController::class, 'show']);
    Route::patch('contacts/{id}/read', [AdminContactController::class, 'markAsRead']);
    Route::delete('contacts/{id}',     [AdminContactController::class, 'destroy']);

    // Paramètres
    Route::get('settings',             [AdminSettingController::class, 'index']);
    Route::put('settings',             [AdminSettingController::class, 'update']);

});
