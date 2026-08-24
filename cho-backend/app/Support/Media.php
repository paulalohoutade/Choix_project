<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

/**
 * Génère l'URL publique d'un fichier média selon le disque configuré :
 * - driver local  → {APP_URL}/storage/{path}
 * - driver s3     → URL directe du bucket (Backblaze B2, AWS…)
 */
class Media
{
    public static function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return config('filesystems.disks.public.driver') === 's3'
            ? Storage::disk('public')->url($path)
            : asset('storage/' . $path);
    }
}
