<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = GalleryItem::with('event:id,title,slug')
            ->orderBy('sort_order');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        $items = $query->paginate(20);

        return response()->json($items);
    }

    public function show(int $id): JsonResponse
    {
        $item = GalleryItem::with('event:id,title,slug')->findOrFail($id);

        return response()->json($item);
    }
}
