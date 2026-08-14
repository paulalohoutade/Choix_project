<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Track;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrackController extends Controller
{
    /**
     * Incrémente le compteur d'écoute d'une piste
     */
    public function incrementPlay(int $id): JsonResponse
    {
        $track = Track::findOrFail($id);
        $track->incrementPlayCount();

        return response()->json([
            'play_count' => $track->fresh()->play_count,
        ]);
    }

    /**
     * Enregistre la durée réelle extraite du fichier audio
     */
    public function updateDuration(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'duration_seconds' => 'required|integer|min:1|max:86400',
        ]);

        $track = Track::findOrFail($id);
        $track->update(['duration_seconds' => $validated['duration_seconds']]);

        return response()->json([
            'duration_seconds' => $track->duration_seconds,
        ]);
    }
}
