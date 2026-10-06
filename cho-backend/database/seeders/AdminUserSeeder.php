<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'paulalohoutade7@gmail.com');
        $password = env('ADMIN_PASSWORD', 'Admin@2024!');

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name'     => env('ADMIN_NAME', 'Admin Chorale'),
                'password' => $password,
                'role'     => 'super_admin',
            ]
        );

        // Sync password if ADMIN_PASSWORD is set (production)
        if (env('ADMIN_PASSWORD')) {
            $user->update(['password' => $password]);
        }

        $this->command?->info("Admin ready: {$user->email}");
    }
}
