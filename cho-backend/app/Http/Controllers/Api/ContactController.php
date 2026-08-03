<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:100',
            'email'   => 'required|email|max:150',
            'subject' => 'required|string|max:200',
            'message' => 'required|string|max:3000',
        ]);

        Contact::create($validated);

        // TODO: envoyer une notification email aux admins
        // Mail::to(config('mail.admin_address'))->send(new ContactReceived($validated));

        return response()->json([
            'message' => 'Votre message a été envoyé avec succès.',
        ], 201);
    }
}
