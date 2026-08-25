<?php

namespace App\Support;

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

        // Bucket privé → sert via le proxy Laravel (/api/v1/media/{path})
        // Le proxy génère une URL pré-signée B2 et redirige (contourne Cloudflare)
        if (config('filesystems.disks.public.driver') === 's3') {
            return route('media.show', ['path' => $path]);
        }

        // Disque local → URL via le symlink storage/
        return asset('storage/' . $path);
    }
}
