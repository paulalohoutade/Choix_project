<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminGalleryController extends Controller
{
    public function index(): JsonResponse
    {
        $items = GalleryItem::with('event:id,title')
            ->orderBy('sort_order')
            ->get();

        return response()->json($items);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'       => 'nullable|string|max:200',
            'description' => 'nullable|string',
            'type'        => 'in:photo,video',
            'youtube_url' => 'nullable|url',
            'event_id'    => 'nullable|exists:events,id',
            'sort_order'  => 'integer',
        ]);

        $item = GalleryItem::create($validated);

        return response()->json($item, 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(GalleryItem::findOrFail($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = GalleryItem::findOrFail($id);

        $validated = $request->validate([
            'title'       => 'nullable|string|max:200',
            'description' => 'nullable|string',
            'youtube_url' => 'nullable|url',
            'event_id'    => 'nullable|exists:events,id',
            'sort_order'  => 'integer',
        ]);

        $item->update($validated);

        return response()->json($item);
    }

    public function destroy(int $id): JsonResponse
    {
        $item = GalleryItem::findOrFail($id);

        if ($item->file_path) {
            Storage::disk('public')->delete($item->file_path);
        }

        $item->delete();

        return response()->json(['message' => 'Élément supprimé.']);
    }

    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file'     => 'nullable|file|mimes:jpg,jpeg,png,webp,gif,mp4,webm,mov,ogg,avi,mkv,m4v|max:204800',
            'files'    => 'nullable|array|max:40',
            'files.*'  => 'file|mimes:jpg,jpeg,png,webp,gif,mp4,webm,mov,ogg,avi,mkv,m4v|max:204800',
            'title'    => 'nullable|string|max:200',
            'type'     => 'nullable|in:photo,video',
            'event_id' => 'nullable|exists:events,id',
        ]);

        $titles = $request->input('titles', []);

        try {
            if ($request->hasFile('files')) {
                $items = [];
                foreach ($request->file('files') as $index => $file) {
                    $path = $file->store('gallery', 'public');
                    if (!$path) {
                        return response()->json(['error' => 'File storage returned empty path.'], 500);
                    }
                    $mime  = $file->getMimeType();
                    $type  = isset($titles[$index]) ? null : $request->type;
                    $type  = $type ?? (str_starts_with($mime, 'video/') ? 'video' : 'photo');
                    $items[] = GalleryItem::create([
                        'title'    => $titles[$index] ?? $request->title,
                        'file_path'=> $path,
                        'type'     => $type,
                        'event_id' => $request->event_id,
                    ]);
                }

                return response()->json($items, 201);
            }

            if (!$request->hasFile('file')) {
                return response()->json(['error' => 'Aucun fichier fourni.'], 422);
            }

            $path = $request->file('file')->store('gallery', 'public');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Upload failed: ' . $e->getMessage()], 500);
        }

        if (!$path) {
            return response()->json(['error' => 'File storage returned empty path.'], 500);
        }

        $mime = $request->file('file')->getMimeType();
        $type = $request->type ?? (str_starts_with($mime, 'video/') ? 'video' : 'photo');

        $item = GalleryItem::create([
            'title'    => $request->title,
            'file_path'=> $path,
            'type'     => $type,
            'event_id' => $request->event_id,
        ]);

        return response()->json($item, 201);
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'items'            => 'required|array',
            'items.*.id'       => 'required|exists:gallery_items,id',
            'items.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->items as $item) {
            GalleryItem::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Ordre mis à jour.']);
    }
}
