<?php

namespace Database\Seeders;

use App\Models\Album;
use App\Models\Track;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AlbumSeeder extends Seeder
{
    public function run(): void
    {
        // ─────────────────────────────────────────────
        // ALBUM 1 — odè
        // ─────────────────────────────────────────────
        $album0 = Album::updateOrCreate(
            ['slug' => 'ode'],
            [
                'title'        => 'odè',
                'description'  => 'Album odè de la Chorale Hefzibah.',
                'release_year' => 2024,
                'is_featured'  => false,
                'status'       => 'published',
            ]
        );

        Track::updateOrCreate(
            ['album_id' => $album0->id, 'slug' => Str::slug('jab')],
            [
                'title'            => 'jab',
                'track_number'     => 1,
                'duration_seconds' => 180,
                'audio_path'       => 'tracks/audio/ai95OXv1jsEjE9eduR4X4zB48tmA8LWF4c3cQY1P.mp3',
                'is_downloadable'  => false,
            ]
        );

        // ─────────────────────────────────────────────
        // ALBUM 2 — Louange & Adoration Vol.1
        // ─────────────────────────────────────────────
        $album = Album::updateOrCreate(
            ['slug' => 'louange-adoration-vol-1'],
            [
                'title'        => 'Louange & Adoration Vol.1',
                'description'  => 'Premier album officiel de la Chorale de l\'Église du Christianisme Céleste.',
                'release_year' => 2022,
                'is_featured'  => true,
                'status'       => 'published',
            ]
        );

        $louangeTracks = [
            ['title' => 'Gloire à Dieu',        'track_number' => 1, 'duration_seconds' => 245, 'audio_path' => 'tracks/audio/wOyQTVvEgRtiHfQNTjX3kXBd9m1H2OtsJsZsqksE.mp3'],
            ['title' => 'Seigneur tu es grand',  'track_number' => 2, 'duration_seconds' => 312, 'audio_path' => 'tracks/audio/VaoECwqYNVTMPkWUF8Q8cW6UxXrucEUyxnBVXDBE.mp4'],
            ['title' => 'Alléluia',              'track_number' => 3, 'duration_seconds' => 198, 'audio_path' => 'tracks/audio/nh5pVgQonOfz5HIgbSxtxyC0sO3myZ1CoCIqfwei.mp4'],
            ['title' => 'Merci Seigneur',        'track_number' => 4, 'duration_seconds' => 267, 'audio_path' => 'tracks/audio/qE2SapwRbtOaYgWA9y5A7sFTfLNECk64cRyjIEBK.mp4'],
            ['title' => 'Tu es digne',           'track_number' => 5, 'duration_seconds' => 290, 'audio_path' => 'tracks/audio/Myxogn6R7rGMvAv56lTdn0ShtWLJqTbrAo66uyst.mp4'],
        ];

        foreach ($louangeTracks as $trackData) {
            Track::updateOrCreate(
                ['album_id' => $album->id, 'slug' => Str::slug($trackData['title'])],
                [
                    'title'            => $trackData['title'],
                    'track_number'     => $trackData['track_number'],
                    'duration_seconds' => $trackData['duration_seconds'],
                    'audio_path'       => $trackData['audio_path'],
                    'is_downloadable'  => false,
                ]
            );
        }

        // ─────────────────────────────────────────────
        // ALBUM 3 — Cantiques de Zion Vol.2
        // ─────────────────────────────────────────────
        $album2 = Album::updateOrCreate(
            ['slug' => 'cantiques-de-zion-vol-2'],
            [
                'title'        => 'Cantiques de Zion Vol.2',
                'description'  => 'Deuxième album de la chorale avec des chants traditionnels revisités.',
                'release_year' => 2023,
                'is_featured'  => false,
                'status'       => 'published',
            ]
        );

        Track::updateOrCreate(
            ['album_id' => $album2->id, 'slug' => Str::slug('cantique-damour')],
            [
                'title'            => 'Cantique d\'amour',
                'track_number'     => 1,
                'duration_seconds' => 210,
                'audio_path'       => 'tracks/audio/ke6QyWaOTNqUypTqPD9NS3zFsLmgDMMwf0kTTgBK.mp4',
                'is_downloadable'  => false,
            ]
        );

        $this->command->info('✔ Albums et pistes créés ou mis à jour avec succès.');
    }
}
