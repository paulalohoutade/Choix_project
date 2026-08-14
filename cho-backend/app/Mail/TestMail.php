<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TestMail extends Mailable
{
    use Queueable, SerializesModels;

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Test de configuration SMTP — '.config('app.name'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.test',
            with: [
                'appName' => config('app.name'),
                'sentAt' => now()->format('d/m/Y H:i:s'),
                'mailer' => config('mail.default'),
                'host' => config('mail.mailers.smtp.host'),
                'port' => config('mail.mailers.smtp.port'),
            ],
        );
    }
}
