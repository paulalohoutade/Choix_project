<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $password = env('ADMIN_PASSWORD', 'Admin@2024!');

        // Crée le super admin si inexistant
        $user = User::firstOrCreate(
            ['email' => 'paulalohoutade7@gmail.com'],
            [
                'name'     => 'Admin Chorale',
                'password' => $password,
                'role'     => 'super_admin',
            ]
        );

        // Synchronise le mot de passe avec ADMIN_PASSWORD si défini (production)
        if (env('ADMIN_PASSWORD')) {
            $user->update(['password' => $password]);
        }
    }
}
