<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDonationController extends Controller
{
    public function index(): JsonResponse
    {
        $donations = Donation::orderByDesc('created_at')->paginate(20);

        return response()->json($donations);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(Donation::findOrFail($id));
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:pending,completed,failed',
        ]);

        $donation = Donation::findOrFail($id);
        $donation->update(['status' => $request->status]);

        return response()->json($donation);
    }
}
