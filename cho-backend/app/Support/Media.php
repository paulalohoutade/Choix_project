<?php

namespace App\Support;

use Aws\S3\S3Client;

/**
 * Génère l'URL publique d'un fichier média selon le disque configuré :
 * - driver local  → {APP_URL}/storage/{path}
 * - driver s3     → URL pré-signée S3 (contourne Cloudflare)
 */
class Media
{
    public static function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (config('filesystems.disks.public.driver') === 's3') {
            return self::signedUrl($path);
        }

        return asset('storage/' . $path);
    }

    protected static function signedUrl(string $path): string
    {
        $client = new S3Client([
            'version'                 => 'latest',
            'region'                  => config('filesystems.disks.public.region'),
            'endpoint'                => config('filesystems.disks.public.endpoint'),
            'credentials' => [
                'key'    => config('filesystems.disks.public.key'),
                'secret' => config('filesystems.disks.public.secret'),
            ],
            'use_path_style_endpoint' => true,
            'http'                    => ['verify' => false],
        ]);

        $cmd = $client->getCommand('getObject', [
            'Bucket' => config('filesystems.disks.public.bucket'),
            'Key'    => $path,
        ]);

        return (string) $client->createPresignedRequest($cmd, '+5 minutes')->getUri();
    }
}
