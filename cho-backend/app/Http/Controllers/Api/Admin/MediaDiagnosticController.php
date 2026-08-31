<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaDiagnosticController extends Controller
{
    public function run(): JsonResponse
    {
        $diskConfig = config('filesystems.disks.public');
        $driver     = $diskConfig['driver'] ?? null;

        $result = [
            'env_medial_disk_driver'      => env('MEDIA_DISK_DRIVER'),
            'config_driver'               => $driver,
            'env_fs_default'              => env('FILESYSTEM_DISK'),
            'config_default'              => config('filesystems.default'),
            'bucket'                      => $diskConfig['bucket'] ?? null,
            'region'                      => $diskConfig['region'] ?? null,
            'endpoint'                    => $diskConfig['endpoint'] ?? null,
            'has_key'                     => ! empty($diskConfig['key'] ?? ''),
            'has_secret'                  => ! empty($diskConfig['secret'] ?? ''),
            'app_url'                     => config('app.url'),
        ];

        // Test d'écriture/lecture réelle si driver s3
        if ($driver === 's3') {
            $key = '_diagnostic_' . Str::random(8) . '.txt';
            try {
                $disk = Storage::disk('public');
                $wr   = $disk->put($key, 'hello-from-render-' . now()->toIso8601String());
                $rd   = $disk->exists($key) ? $disk->get($key) : null;
                $disk->delete($key);

                $result['write']   = $wr ? 'ok' : 'FAILED';
                $result['read']    = ($rd === null) ? 'FAILED (file not found)' : $rd;
                $result['cleanup'] = $disk->exists($key) ? 'FAILED (still exists)' : 'ok';
            } catch (\Throwable $e) {
                $result['s3_error'] = get_class($e) . ': ' . $e->getMessage();
            }
        } else {
            $result['write'] = 'SKIPPED — le driver public n\'est pas s3 sur ce serveur';
        }

        return response()->json($result);
    }
}
