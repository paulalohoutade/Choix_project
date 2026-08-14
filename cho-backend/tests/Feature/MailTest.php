<?php

namespace Tests\Feature;

use App\Mail\TestMail;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class MailTest extends TestCase
{
    public function test_mail_test_command_sends_a_test_email(): void
    {
        Mail::fake();

        $this->artisan('mail:test', ['email' => 'admin@example.com'])
            ->expectsOutputToContain('admin@example.com')
            ->assertExitCode(0);

        Mail::assertSent(TestMail::class, fn (TestMail $mail) => $mail->hasTo('admin@example.com'));
    }
}
