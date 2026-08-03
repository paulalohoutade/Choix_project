<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Track;
use Illuminate\Http\JsonResponse;

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
}
