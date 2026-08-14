<?php

namespace App\Console\Commands;

use App\Mail\TestMail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestMailCommand extends Command
{
    protected $signature = 'mail:test {email? : Adresse de destination (défaut : MAIL_FROM_ADDRESS)}';

    protected $description = 'Envoie un email de test pour vérifier la configuration SMTP.';

    public function handle(): int
    {
        $recipient = $this->argument('email') ?: config('mail.from.address');

        if (! $recipient) {
            $this->error('Aucune adresse de destination. Renseigne MAIL_FROM_ADDRESS dans le .env ou passe un email en argument.');

            return self::FAILURE;
        }

        try {
            Mail::to($recipient)->send(new TestMail);
        } catch (\Throwable $e) {
            $this->error('Échec de l\'envoi : '.$e->getMessage());

            return self::FAILURE;
        }

        $this->info("Email de test envoyé à {$recipient} via « {$this->describeMailer()} ».");

        return self::SUCCESS;
    }

    private function describeMailer(): string
    {
        $mailer = config('mail.default');

        if ($mailer === 'log') {
            return 'log — aucun envoi réel, consulte storage/logs/laravel.log';
        }

        return $mailer;
    }
}
