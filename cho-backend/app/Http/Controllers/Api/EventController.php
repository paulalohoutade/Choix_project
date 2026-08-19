<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Event::query();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $query->statusIs($request->filled('status') ? $request->status : null);

        $events = $query->orderByDesc('event_date')->paginate(12);

        return response()->json($events);
    }

    public function upcoming(): JsonResponse
    {
        $events = Event::upcoming()->orderBy('event_date')->take(3)->get();

        return response()->json($events);
    }

    public function recentPast(): JsonResponse
    {
        $events = Event::past()->orderByDesc('event_date')->take(3)->get();

        return response()->json($events);
    }

    public function show(string $slug): JsonResponse
    {
        $event = Event::where('slug', $slug)->firstOrFail();

        return response()->json($event);
    }
}
