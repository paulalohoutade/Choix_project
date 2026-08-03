<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class AdminPostController extends Controller
{
    public function index(): JsonResponse
    {
        $posts = Post::with('author:id,name')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($posts);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'    => 'required|string|max:200',
            'excerpt'  => 'nullable|string',
            'body'     => 'required|string',
            'category' => 'in:annonce,temoignage,concert,album,autre',
            'status'   => 'in:draft,published',
        ]);

        $validated['slug']    = Str::slug($validated['title']);
        $validated['user_id'] = $request->user()->id;

        if (($validated['status'] ?? 'draft') === 'published') {
            $validated['published_at'] = Carbon::now();
        }

        $post = Post::create($validated);

        return response()->json($post, 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(Post::with('author:id,name')->findOrFail($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $post = Post::findOrFail($id);

        $validated = $request->validate([
            'title'    => 'sometimes|string|max:200',
            'excerpt'  => 'nullable|string',
            'body'     => 'sometimes|string',
            'category' => 'in:annonce,temoignage,concert,album,autre',
            'status'   => 'in:draft,published',
        ]);

        $post->update($validated);

        return response()->json($post);
    }

    public function destroy(int $id): JsonResponse
    {
        $post = Post::findOrFail($id);

        if ($post->cover_image) {
            Storage::disk('public')->delete($post->cover_image);
        }

        $post->delete();

        return response()->json(['message' => 'Article supprimé.']);
    }

    public function publish(int $id): JsonResponse
    {
        $post = Post::findOrFail($id);
        $post->update([
            'status'       => 'published',
            'published_at' => Carbon::now(),
        ]);

        return response()->json(['message' => 'Article publié.', 'post' => $post]);
    }

    public function uploadCover(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'cover' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $post = Post::findOrFail($id);

        if ($post->cover_image) {
            Storage::disk('public')->delete($post->cover_image);
        }

        $path = $request->file('cover')->store('posts/covers', 'public');
        $post->update(['cover_image' => $path]);

        return response()->json(['cover_url' => $post->cover_url]);
    }
}
