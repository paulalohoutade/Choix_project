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

        $validated['slug'] = $this->uniqueSlug($validated['title']);

        $track = Track::create($validated);

        return response()->json($track, 201);
    }

    private function uniqueSlug(string $title): string
    {
        $base = Str::slug($title) ?: 'piste';
        $slug = $base;
        $i = 1;

        while (Track::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $i++;
        }

        return $slug;
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
            'audio_path'       => 'nullable|string|max:500',
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
            'audio' => ['required', 'file', 'max:512000', function ($attribute, $value, $fail) {
                $allowed = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'opus', 'aiff', 'wma', 'oga', 'm4b', 'mp2'];
                $ext     = strtolower($value->getClientOriginalExtension());

                if (in_array($ext, $allowed, true)) {
                    return;
                }

                $mime = $value->getMimeType();
                if (str_starts_with($mime, 'audio/')
                    || in_array($mime, ['video/mp4', 'application/ogg', 'application/octet-stream'], true)) {
                    return;
                }

                $fail('Le fichier audio n\'est pas valide. Formats acceptés : mp3, wav, ogg, m4a, flac, aac, opus, aiff, wma, oga, m4b, mp2.');
            }],
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
