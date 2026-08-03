<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;

class AdminContactController extends Controller
{
    public function index(): JsonResponse
    {
        $contacts = Contact::orderByDesc('created_at')->paginate(20);

        return response()->json($contacts);
    }

    public function show(int $id): JsonResponse
    {
        $contact = Contact::findOrFail($id);
        $contact->update(['is_read' => true]);

        return response()->json($contact);
    }

    public function markAsRead(int $id): JsonResponse
    {
        Contact::findOrFail($id)->update(['is_read' => true]);

        return response()->json(['message' => 'Message marqué comme lu.']);
    }

    public function destroy(int $id): JsonResponse
    {
        Contact::findOrFail($id)->delete();

        return response()->json(['message' => 'Message supprimé.']);
    }
}
