<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Crée le super admin si inexistant
        User::firstOrCreate(
            ['email' => 'paulalohoutade7@gmail.com'],
            [
                'name'     => 'Admin Chorale',
                'password' => Hash::make('Admin@2024!'),
                'role'     => 'super_admin',
            ]
        );

        $this->command->info('✔ Super admin créé : paulalohoutade7@gmail.com / Admin@2024!');
        $this->command->warn('  ⚠ Changez ce mot de passe immédiatement après la première connexion !');
    }
}
