<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Aws\S3\S3Client;

class MediaController extends Controller
{
    /**
     * Redirige vers une URL pré-signée S3 pour le fichier demandé.
     * Contourne Cloudflare (qui écrase Content-Type) en servant
     * directement depuis l'endpoint S3 de Backblaze.
     */
    public function show(Request $request, string $path)
    {
        $disk = Storage::disk('public');

        if (! $disk->exists($path)) {
            abort(404);
        }

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

        $signedUrl = (string) $client->createPresignedRequest($cmd, '+5 minutes')->getUri();

        return redirect($signedUrl, 302);
    }
}
