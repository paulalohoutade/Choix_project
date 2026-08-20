<?php

namespace Database\Seeders;

use App\Models\Album;
use App\Models\Track;
use Illuminate\Database\Seeder;

class AlbumSeeder extends Seeder
{
    public function run(): void
    {
        // ─────────────────────────────────────────────
        // ALBUM 1
        // ─────────────────────────────────────────────
        $album = Album::updateOrCreate(
            [
                'slug' => 'louange-adoration-vol-1',
            ],
            [
                'title'        => 'Louange & Adoration Vol.1',
                'description'  => 'Premier album officiel de la Chorale de l\'Église du Christianisme Céleste.',
                'release_year' => 2022,
                'is_featured'  => true,
                'status'       => 'published',
            ]
        );

        $tracks = [
            [
                'title' => 'Gloire à Dieu',
                'track_number' => 1,
                'duration_seconds' => 245,
                'youtube_url' => null,
            ],
            [
                'title' => 'Seigneur tu es grand',
                'track_number' => 2,
                'duration_seconds' => 312,
                'youtube_url' => null,
            ],
            [
                'title' => 'Alléluia',
                'track_number' => 3,
                'duration_seconds' => 198,
                'youtube_url' => null,
            ],
            [
                'title' => 'Merci Seigneur',
                'track_number' => 4,
                'duration_seconds' => 267,
                'youtube_url' => null,
            ],
            [
                'title' => 'Tu es digne',
                'track_number' => 5,
                'duration_seconds' => 290,
                'youtube_url' => null,
            ],
        ];

        foreach ($tracks as $trackData) {
            Track::updateOrCreate(
                [
                    'album_id' => $album->id,
                    'slug' => \Illuminate\Support\Str::slug($trackData['title']),
                ],
                [
                    'title' => $trackData['title'],
                    'track_number' => $trackData['track_number'],
                    'duration_seconds' => $trackData['duration_seconds'],
                    'youtube_url' => $trackData['youtube_url'],
                    'is_downloadable' => false,
                ]
            );
        }

        // ─────────────────────────────────────────────
        // ALBUM 2
        // ─────────────────────────────────────────────
        $album2 = Album::updateOrCreate(
            [
                'slug' => 'cantiques-de-zion-vol-2',
            ],
            [
                'title'        => 'Cantiques de Zion Vol.2',
                'description'  => 'Deuxième album de la chorale avec des chants traditionnels revisités.',
                'release_year' => 2023,
                'is_featured'  => false,
                'status'       => 'published',
            ]
        );

        Track::updateOrCreate(
            [
                'album_id' => $album2->id,
                'slug' => 'cantique-damour',
            ],
            [
                'title' => 'Cantique d\'amour',
                'track_number' => 1,
                'duration_seconds' => 210,
                'is_downloadable' => false,
            ]
        );

        $this->command->info('✔ Albums et pistes créés ou mis à jour avec succès.');
    }
}