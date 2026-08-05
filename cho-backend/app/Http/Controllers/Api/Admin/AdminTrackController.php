<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Track;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminTrackController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tracks = Track::with('album:id,title,slug')
            ->when($request->album_id, fn ($q) => $q->where('album_id', $request->album_id))
            ->orderBy('album_id')
            ->orderBy('track_number')
            ->get();

        return response()->json($tracks);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'album_id'         => 'required|exists:albums,id',
            'title'            => 'required|string|max:200',
            'track_number'     => 'required|integer|min:1',
            'duration_seconds' => 'nullable|integer|min:1',
            'youtube_url'      => 'nullable|url',
            'soundcloud_url'   => 'nullable|url',
            'lyrics'           => 'nullable|string',
            'is_downloadable'  => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        $track = Track::create($validated);

        return response()->json($track, 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(Track::with('album')->findOrFail($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $track = Track::findOrFail($id);

        $validated = $request->validate([
            'title'            => 'sometimes|string|max:200',
            'track_number'     => 'sometimes|integer|min:1',
            'duration_seconds' => 'nullable|integer|min:1',
            'youtube_url'      => 'nullable|url',
            'soundcloud_url'   => 'nullable|url',
            'lyrics'           => 'nullable|string',
            'is_downloadable'  => 'boolean',
        ]);

        $track->update($validated);

        return response()->json($track);
    }

    public function destroy(int $id): JsonResponse
    {
        $track = Track::findOrFail($id);

        if ($track->audio_path)    Storage::disk('public')->delete($track->audio_path);
        if ($track->download_path) Storage::disk('public')->delete($track->download_path);

        $track->delete();

        return response()->json(['message' => 'Piste supprimée avec succès.']);
    }

    public function uploadAudio(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'audio' => 'required|mimes:mp3,wav,ogg,m4a,flac,aac,opus,aiff,wma,oga,m4b,mp2|max:51200', // 50 Mo max
        ]);

        $track = Track::findOrFail($id);

        if ($track->audio_path) {
            Storage::disk('public')->delete($track->audio_path);
        }

        $path = $request->file('audio')->store('tracks/audio', 'public');
        $track->update(['audio_path' => $path]);

        return response()->json(['audio_url' => $track->audio_url]);
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'tracks'                => 'required|array',
            'tracks.*.id'           => 'required|exists:tracks,id',
            'tracks.*.track_number' => 'required|integer|min:1',
        ]);

        foreach ($request->tracks as $item) {
            Track::where('id', $item['id'])->update(['track_number' => $item['track_number']]);
        }

        return response()->json(['message' => 'Ordre mis à jour.']);
    }
}
