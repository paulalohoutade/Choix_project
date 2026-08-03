<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Post::published()->with('author:id,name,avatar');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $posts = $query->orderByDesc('published_at')->paginate(10);

        return response()->json($posts);
    }

    public function show(string $slug): JsonResponse
    {
        $post = Post::published()
            ->with('author:id,name,avatar')
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($post);
    }
}
