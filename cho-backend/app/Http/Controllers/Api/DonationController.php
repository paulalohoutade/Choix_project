<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DonationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'donor_name'     => 'nullable|string|max:100',
            'donor_email'    => 'nullable|email|max:150',
            'amount'         => 'required|numeric|min:100',
            'currency'       => 'nullable|string|max:10',
            'payment_method' => 'required|in:mobile_money,card,other',
            'message'        => 'nullable|string|max:500',
        ]);

        $validated['transaction_ref'] = 'DON-' . strtoupper(Str::random(10));
        $validated['status']          = 'pending';
        $validated['currency']        = $validated['currency'] ?? 'XOF';

        $donation = Donation::create($validated);

        // TODO: intégrer une passerelle de paiement (CinetPay, PayDunya, FedaPay...)

        return response()->json([
            'message' => 'Don initié avec succès.',
            'ref'     => $donation->transaction_ref,
        ], 201);
    }

    public function status(string $ref): JsonResponse
    {
        $donation = Donation::where('transaction_ref', $ref)->firstOrFail();

        return response()->json([
            'ref'    => $donation->transaction_ref,
            'status' => $donation->status,
            'amount' => $donation->amount,
        ]);
    }
}
