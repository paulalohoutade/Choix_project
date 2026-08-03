<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Album;
use Illuminate\Http\JsonResponse;

class AlbumController extends Controller
{
    public function index(): JsonResponse
    {
        $albums = Album::published()
            ->withCount('tracks')
            ->orderByDesc('release_year')
            ->get();

        return response()->json($albums);
    }

    public function featured(): JsonResponse
    {
        $album = Album::published()
            ->featured()
            ->with('tracks')
            ->first();

        return response()->json($album);
    }

    public function show(string $slug): JsonResponse
    {
        $album = Album::published()
            ->with('tracks')
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($album);
    }

    public function tracks(string $slug): JsonResponse
    {
        $album  = Album::published()->where('slug', $slug)->firstOrFail();
        $tracks = $album->tracks()->get();

        return response()->json($tracks);
    }
}
