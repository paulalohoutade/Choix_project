<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminMemberController extends Controller
{
    public function index(): JsonResponse
    {
        $members = Member::orderByDesc('is_leader')->orderBy('sort_order')->get();

        return response()->json($members);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:100',
            'role'       => 'required|string|max:100',
            'bio'        => 'nullable|string',
            'is_leader'  => 'boolean',
            'sort_order' => 'integer',
        ]);

        $member = Member::create($validated);

        return response()->json($member, 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(Member::findOrFail($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $member = Member::findOrFail($id);

        $validated = $request->validate([
            'name'       => 'sometimes|string|max:100',
            'role'       => 'sometimes|string|max:100',
            'bio'        => 'nullable|string',
            'is_leader'  => 'boolean',
            'sort_order' => 'integer',
        ]);

        $member->update($validated);

        return response()->json($member);
    }

    public function destroy(int $id): JsonResponse
    {
        $member = Member::findOrFail($id);

        if ($member->photo) {
            Storage::disk('public')->delete($member->photo);
        }

        $member->delete();

        return response()->json(['message' => 'Membre supprimé.']);
    }

    public function uploadPhoto(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpg,jpeg,png,webp|max:1024',
        ]);

        $member = Member::findOrFail($id);

        if ($member->photo) {
            Storage::disk('public')->delete($member->photo);
        }

        $path = $request->file('photo')->store('members', 'public');
        $member->update(['photo' => $path]);

        return response()->json(['photo_url' => $member->photo_url]);
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'members'              => 'required|array',
            'members.*.id'         => 'required|exists:members,id',
            'members.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->members as $item) {
            Member::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Ordre mis à jour.']);
    }
}
