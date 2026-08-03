<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminAlbumController extends Controller
{
    public function index(): JsonResponse
    {
        $albums = Album::withCount('tracks')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($albums);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:200',
            'description'  => 'nullable|string',
            'release_year' => 'required|integer|min:1900|max:2100',
            'is_featured'  => 'boolean',
            'status'       => 'in:draft,published',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        $album = Album::create($validated);

        return response()->json($album, 201);
    }

    public function show(int $id): JsonResponse
    {
        $album = Album::with('tracks')->findOrFail($id);

        return response()->json($album);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $album = Album::findOrFail($id);

        $validated = $request->validate([
            'title'        => 'sometimes|string|max:200',
            'description'  => 'nullable|string',
            'release_year' => 'sometimes|integer|min:1900|max:2100',
            'is_featured'  => 'boolean',
            'status'       => 'in:draft,published',
        ]);

        $album->update($validated);

        return response()->json($album);
    }

    public function destroy(int $id): JsonResponse
    {
        $album = Album::findOrFail($id);

        if ($album->cover_image) {
            Storage::disk('public')->delete($album->cover_image);
        }

        $album->delete();

        return response()->json(['message' => 'Album supprimé avec succès.']);
    }

    public function toggleFeatured(int $id): JsonResponse
    {
        // Un seul album vedette à la fois
        Album::where('is_featured', true)->update(['is_featured' => false]);

        $album = Album::findOrFail($id);
        $album->update(['is_featured' => true]);

        return response()->json([
            'message' => 'Album mis en vedette.',
            'album'   => $album,
        ]);
    }

    public function uploadCover(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'cover' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $album = Album::findOrFail($id);

        if ($album->cover_image) {
            Storage::disk('public')->delete($album->cover_image);
        }

        $path = $request->file('cover')->store('albums/covers', 'public');
        $album->update(['cover_image' => $path]);

        return response()->json(['cover_url' => $album->cover_url]);
    }
}
