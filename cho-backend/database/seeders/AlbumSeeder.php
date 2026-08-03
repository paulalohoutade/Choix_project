<?php

namespace Database\Seeders;

use App\Models\Album;
use App\Models\Track;
use Illuminate\Database\Seeder;

class AlbumSeeder extends Seeder
{
    public function run(): void
    {
        $album = Album::create([
            'title'        => 'Louange & Adoration Vol.1',
            'slug'         => 'louange-adoration-vol-1',
            'description'  => 'Premier album officiel de la Chorale de l\'Église du Christianisme Céleste.',
            'release_year' => 2022,
            'is_featured'  => true,
            'status'       => 'published',
        ]);

        $tracks = [
            ['title' => 'Gloire à Dieu',           'track_number' => 1, 'duration_seconds' => 245, 'youtube_url' => null],
            ['title' => 'Seigneur tu es grand',     'track_number' => 2, 'duration_seconds' => 312, 'youtube_url' => null],
            ['title' => 'Alléluia',                 'track_number' => 3, 'duration_seconds' => 198, 'youtube_url' => null],
            ['title' => 'Merci Seigneur',           'track_number' => 4, 'duration_seconds' => 267, 'youtube_url' => null],
            ['title' => 'Tu es digne',              'track_number' => 5, 'duration_seconds' => 290, 'youtube_url' => null],
        ];

        foreach ($tracks as $trackData) {
            Track::create(array_merge($trackData, [
                'album_id'        => $album->id,
                'slug'            => \Illuminate\Support\Str::slug($trackData['title']),
                'is_downloadable' => false,
            ]));
        }

        // Deuxième album
        $album2 = Album::create([
            'title'        => 'Cantiques de Zion Vol.2',
            'slug'         => 'cantiques-de-zion-vol-2',
            'description'  => 'Deuxième album de la chorale avec des chants traditionnels revisités.',
            'release_year' => 2023,
            'is_featured'  => false,
            'status'       => 'published',
        ]);

        Track::create([
            'album_id'        => $album2->id,
            'title'           => 'Cantique d\'amour',
            'slug'            => 'cantique-damour',
            'track_number'    => 1,
            'duration_seconds'=> 210,
            'is_downloadable' => false,
        ]);

        $this->command->info('✔ Albums et pistes de test créés.');
    }
}
