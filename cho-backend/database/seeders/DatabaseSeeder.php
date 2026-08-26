<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use App\Models\Album;
use App\Models\GalleryItem;
use App\Models\Track;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Vider le contenu avant de reséeder
        Track::truncate();
        Album::truncate();
        GalleryItem::truncate();

        $this->call([
            AdminUserSeeder::class,
            SettingSeeder::class,
            EventSeeder::class,
            MemberSeeder::class,
        ]);
    }
}
