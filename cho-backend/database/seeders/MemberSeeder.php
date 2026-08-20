<?php

namespace Database\Seeders;

use App\Models\Member;
use Illuminate\Database\Seeder;

class MemberSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            [
                'name'       => 'Frère Jean-Baptiste AGOSSOU',
                'role'       => 'Chef de Chorale',
                'bio'        => 'Chef de chorale depuis 2015, passionné de musique liturgique.',
                'is_leader'  => true,
                'sort_order' => 1,
            ],
            [
                'name'       => 'Sœur Marie AHOUANSOU',
                'role'       => 'Soprano — Section Leader',
                'bio'        => 'Membre fondateur de la chorale.',
                'is_leader'  => false,
                'sort_order' => 2,
            ],
            [
                'name'       => 'Frère Kokou DOSSOU',
                'role'       => 'Basse — Section Leader',
                'bio'        => '',
                'is_leader'  => false,
                'sort_order' => 3,
            ],
            [
                'name'       => 'Sœur Afi HOUNKPE',
                'role'       => 'Alto',
                'bio'        => '',
                'is_leader'  => false,
                'sort_order' => 4,
            ],
        ];

        foreach ($members as $memberData) {
            Member::firstOrCreate(['name' => $memberData['name']], $memberData);
        }

        $this->command->info('✔ Membres de test créés.');
    }
}
