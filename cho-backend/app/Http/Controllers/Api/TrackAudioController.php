<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Track;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class TrackAudioController extends Controller
{
    /**
     * Diffuse le fichier audio d'une piste en supportant les requêtes Range
     * (lecture et seek corrects, même pour des fichiers très longs).
     */
    public function stream(Request $request, Track $track): Response
    {
        if (! $track->audio_path || ! Storage::disk('public')->exists($track->audio_path)) {
            abort(404);
        }

        $disk = Storage::disk('public');
        $path = $track->audio_path;
        $size = $disk->size($path);
        $mime = $disk->mimeType($path) ?: 'application/octet-stream';

        $start  = 0;
        $end    = $size - 1;
        $status = 200;

        $range = $request->header('Range');
        if ($range && preg_match('/^bytes=(\d*)-(\d*)$/i', trim($range), $m)) {
            if ($m[1] === '' && $m[2] !== '') {
                // Plage suffixe : les N derniers octets
                $start  = max(0, $size - (int) $m[2]);
                $end    = $size - 1;
                $status = 206;
            } elseif ($m[1] !== '') {
                $start = (int) $m[1];
                $end   = $m[2] !== '' ? (int) $m[2] : $size - 1;

                if ($start >= $size) {
                    return response('', 416, ['Content-Range' => "bytes */{$size}"]);
                }
                if ($end >= $size) {
                    $end = $size - 1;
                }
                $status = 206;
            }
        }

        $length = $end - $start + 1;
        if ($length <= 0) {
            return response('', 416, ['Content-Range' => "bytes */{$size}"]);
        }

        return response()->stream(function () use ($disk, $path, $start, $length) {
            $stream = $disk->readStream($path);
            fseek($stream, $start);
            $remaining = $length;
            while ($remaining > 0 && ! feof($stream)) {
                $chunk   = min(1024 * 512, $remaining);
                $buffer  = fread($stream, $chunk);
                if ($buffer === false || $buffer === '') {
                    break;
                }
                echo $buffer;
                $remaining -= strlen($buffer);
                flush();
            }
            fclose($stream);
        }, $status, array_filter([
            'Content-Type'   => $mime,
            'Content-Length' => $length,
            'Accept-Ranges'  => 'bytes',
            'Content-Range'  => $status === 206 ? "bytes {$start}-{$end}/{$size}" : null,
            'Cache-Control'  => 'public, max-age=604800, immutable',
        ]));
    }
}
