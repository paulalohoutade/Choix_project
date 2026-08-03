<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminEventController extends Controller
{
    public function index(): JsonResponse
    {
        $events = Event::orderByDesc('event_date')->get();

        return response()->json($events);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:200',
            'description' => 'nullable|string',
            'location'    => 'nullable|string|max:255',
            'event_date'  => 'required|date',
            'end_date'    => 'nullable|date|after_or_equal:event_date',
            'type'        => 'in:concert,messe,retraite,tournee,autre',
            'status'      => 'in:upcoming,past,cancelled',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        $event = Event::create($validated);

        return response()->json($event, 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(Event::findOrFail($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'title'       => 'sometimes|string|max:200',
            'description' => 'nullable|string',
            'location'    => 'nullable|string|max:255',
            'event_date'  => 'sometimes|date',
            'end_date'    => 'nullable|date',
            'type'        => 'in:concert,messe,retraite,tournee,autre',
            'status'      => 'in:upcoming,past,cancelled',
        ]);

        $event->update($validated);

        return response()->json($event);
    }

    public function destroy(int $id): JsonResponse
    {
        $event = Event::findOrFail($id);

        if ($event->cover_image) {
            Storage::disk('public')->delete($event->cover_image);
        }

        $event->delete();

        return response()->json(['message' => 'Événement supprimé.']);
    }

    public function uploadCover(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'cover' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $event = Event::findOrFail($id);

        if ($event->cover_image) {
            Storage::disk('public')->delete($event->cover_image);
        }

        $path = $request->file('cover')->store('events/covers', 'public');
        $event->update(['cover_image' => $path]);

        return response()->json(['cover_url' => $event->cover_url]);
    }
}
