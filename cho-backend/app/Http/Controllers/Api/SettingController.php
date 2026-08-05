<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    /**
     * Clés accessibles publiquement (sans authentification)
     */
    private const PUBLIC_KEYS = [
        'site_name',
        'site_description',
        'site_logo',
        'facebook_url',
        'youtube_url',
        'instagram_url',
        'whatsapp_number',
        'contact_email',
        'contact_phone',
        'address',
    ];

    public function public(): JsonResponse
    {
        $settings = Setting::whereIn('key', self::PUBLIC_KEYS)
            ->get()
            ->pluck('value', 'key');

        return response()->json($settings);
    }
}
