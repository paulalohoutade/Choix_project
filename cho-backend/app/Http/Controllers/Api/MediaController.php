<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    /**
     * Sert un fichier média depuis le stockage privé (S3/B2).
     * Supporte les requêtes Range pour la lecture audio/vidéo.
     */
    public function show(Request $request, string $path): Response|void
    {
        $disk = Storage::disk('public');

        if (! $disk->exists($path)) {
            abort(404);
        }

        $size = $disk->size($path);
        $mime = $disk->mimeType($path) ?: 'application/octet-stream';

        $start  = 0;
        $end    = $size - 1;
        $status = 200;

        $range = $request->header('Range');
        if ($range && preg_match('/^bytes=(\d*)-(\d*)$/i', trim($range), $m)) {
            if ($m[1] === '' && $m[2] !== '') {
                $start  = max(0, $size - (int) $m[2]);
                $end    = $size - 1;
                $status = 206;
            } elseif ($m[1] !== '') {
                $start  = (int) $m[1];
                $end    = $m[2] !== '' ? (int) $m[2] : $size - 1;
                $status = 206;
            }
            if ($start >= $size) {
                return response('', 416, ['Content-Range' => "bytes */{$size}"]);
            }
            $end = min($end, $size - 1);
        }

        $length = $end - $start + 1;
        if ($length <= 0) {
            return response('', 416, ['Content-Range' => "bytes */{$size}"]);
        }

        $headers = array_filter([
            'Content-Type'   => $mime,
            'Content-Length' => $length,
            'Accept-Ranges'  => 'bytes',
            'Content-Range'  => $status === 206 ? "bytes {$start}-{$end}/{$size}" : null,
            'Cache-Control'  => 'public, max-age=31536000, immutable',
        ]);

        return response()->stream(function () use ($disk, $path, $start, $length) {
            $stream = $disk->readStream($path);
            fseek($stream, $start);
            $remaining = $length;
            while ($remaining > 0 && ! feof($stream)) {
                $chunk  = min(1024 * 512, $remaining);
                $buffer = fread($stream, $chunk);
                if ($buffer === false || $buffer === '') {
                    break;
                }
                echo $buffer;
                $remaining -= strlen($buffer);
                flush();
            }
            fclose($stream);
        }, $status, $headers);
    }
}
