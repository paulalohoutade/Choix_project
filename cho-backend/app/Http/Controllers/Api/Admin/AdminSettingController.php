<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = Setting::all()->pluck('value', 'key');

        return response()->json($settings);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            '*' => 'nullable|string|max:1000',
        ]);

        foreach ($request->all() as $key => $value) {
            Setting::set($key, $value);
        }

        return response()->json(['message' => 'Paramètres mis à jour.']);
    }
}
