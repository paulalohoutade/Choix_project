<?php

namespace App\Console\Commands;

use App\Models\Album;
use App\Models\GalleryItem;
use App\Models\Track;
use Illuminate\Console\Command;

class ResetContentCommand extends Command
{
    protected $signature = 'content:reset {--confirm : Confirme la suppression}';

    protected $description = 'Supprime tous les albums, pistes et éléments de galerie';

    public function handle(): int
    {
        $albumCount = Album::count();
        $trackCount = Track::count();
        $galleryCount = GalleryItem::count();

        if ($albumCount === 0 && $trackCount === 0 && $galleryCount === 0) {
            $this->info('Aucun contenu à supprimer.');
            return self::SUCCESS;
        }

        $this->info("Prêt à supprimer : {$albumCount} album(s), {$trackCount} piste(s), {$galleryCount} élément(s) galerie.");

        if (!$this->option('confirm')) {
            $this->warn('Ajoutez --confirm pour confirmer la suppression.');
            return self::SUCCESS;
        }

        Track::truncate();
        $this->info('Pistes supprimées.');

        Album::truncate();
        $this->info('Albums supprimés.');

        GalleryItem::truncate();
        $this->info('Éléments de galerie supprimés.');

        $this->info('Contenu réinitialisé avec succès.');
        return self::SUCCESS;
    }
}
