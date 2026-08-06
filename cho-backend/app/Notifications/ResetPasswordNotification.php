<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly string $token
    ) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        // URL du frontend React — configurer FRONTEND_URL dans le .env
        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');

        $url = $frontendUrl
            . '/admin/reset-password'
            . '?token=' . $this->token
            . '&email=' . urlencode($notifiable->getEmailForPasswordReset());

        return (new MailMessage)
            ->subject('Réinitialisation de votre mot de passe — Chorale ECC')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Vous avez demandé la réinitialisation de votre mot de passe administrateur.')
            ->action('Réinitialiser mon mot de passe', $url)
            ->line('Ce lien expirera dans **60 minutes**.')
            ->line('Si vous n\'avez pas effectué cette demande, ignorez cet email — votre compte reste sécurisé.')
            ->salutation('La Chorale Hefzibah');
    }
}
