<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $events = [
            [
                'title'      => 'Concert de Louange de Noël',
                'slug'       => 'concert-louange-noel-2024',
                'description'=> 'Grand concert de Noël avec la chorale et des invités spéciaux.',
                'location'   => 'Temple CEC Central, Cotonou',
                'event_date' => '2024-12-24 18:00:00',
                'type'       => 'concert',
                'status'     => 'upcoming',
            ],
            [
                'title'      => 'Messe Chantée de Pâques',
                'slug'       => 'messe-chantee-paques-2025',
                'description'=> 'Célébration de Pâques avec chants liturgiques.',
                'location'   => 'Paroisse CEC Akpakpa, Cotonou',
                'event_date' => '2025-04-20 09:00:00',
                'type'       => 'messe',
                'status'     => 'upcoming',
            ],
            [
                'title'      => 'Retraite Spirituelle & Musicale',
                'slug'       => 'retraite-spirituelle-musicale-2025',
                'description'=> 'Trois jours de retraite entre chant, prière et partage.',
                'location'   => 'Centre Spirituel CEC, Abomey-Calavi',
                'event_date' => '2025-06-15 07:00:00',
                'type'       => 'retraite',
                'status'     => 'upcoming',
            ],
        ];

        foreach ($events as $eventData) {
            Event::create($eventData);
        }

        $this->command->info('✔ Événements de test créés.');
    }
}
