<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use FilesystemIterator;

class MediaPushCloudCommand extends Command
{
    protected $signature = 'media:push-cloud {--dry : Liste les fichiers sans les envoyer}';

    protected $description = 'Envoie tous les fichiers de storage/app/public vers le disque média configuré (S3/B2) en conservant les chemins relatifs';

    public function handle(): int
    {
        if (config('filesystems.disks.public.driver') !== 's3') {
            $this->error('MEDIA_DISK_DRIVER doit valoir "s3" (avec AWS_* renseignés) avant de lancer cette commande.');

            return 1;
        }

        $base = storage_path('app/public');
        $disk = Storage::disk('public');

        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($base, FilesystemIterator::SKIP_DOTS)
        );

        $count = 0;
        $bytes = 0;

        foreach ($iterator as $file) {
            if (! $file->isFile() || $file->getFilename() === '.gitignore') {
                continue;
            }

            $relative = ltrim(str_replace('\\', '/', substr($file->getPathname(), strlen($base))), '/');
            $size     = $file->getSize();

            if ($this->option('dry')) {
                $this->line("[dry] {$relative} (" . round($size / 1048576, 1) . ' Mo)');
            } else {
                $this->line("↑ {$relative} (" . round($size / 1048576, 1) . ' Mo)');
                $stream = fopen($file->getPathname(), 'r');
                $disk->put($relative, $stream);
                if (is_resource($stream)) {
                    fclose($stream);
                }
            }

            $count++;
            $bytes += $size;
        }

        $this->info("{$count} fichier(s) — " . round($bytes / 1048576, 1) . ' Mo au total.');

        return 0;
    }
}
