<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'site_name'          => 'Chorale CEC',
            'site_description'   => 'Chorale officielle de l\'Église du Christianisme Céleste',
            'site_logo'          => '',
            'facebook_url'       => 'https://facebook.com/chorale-cec',
            'youtube_url'        => 'https://youtube.com/@chorale-cec',
            'instagram_url'      => '',
            'whatsapp_number'    => '+22900000000',
            'contact_email'      => 'contact@chorale-cec.org',
            'contact_phone'      => '+22900000000',
            'address'            => 'Église du Christianisme Céleste, Cotonou, Bénin',
            'donation_enabled'   => 'true',
        ];

        foreach ($settings as $key => $value) {
            Setting::set($key, $value);
        }

        $this->command->info('✔ Paramètres par défaut créés.');
    }
}
