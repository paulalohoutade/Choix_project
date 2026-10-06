<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class MakeAdmin extends Command
{
    protected $signature = 'choix:make-admin
        {email : Email de l''admin}
        {password : Mot de passe}
        {--name=Admin Chorale : Nom affiché}';

    protected $description = 'Crée ou met à jour un super_admin';

    public function handle(): int
    {
        $email = $this->argument('email');
        $password = $this->argument('password');

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $this->option('name'),
                'password' => $password,
                'role' => 'super_admin',
            ]
        );

        $this->info("Super admin prêt : {$user->email}");
        return self::SUCCESS;
    }
}
