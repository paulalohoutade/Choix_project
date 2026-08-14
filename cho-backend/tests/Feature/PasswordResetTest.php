<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_forgot_password_sends_reset_link_notification(): void
    {
        Notification::fake();

        User::factory()->create([
            'email' => 'admin@choir.test',
        ]);

        $this->postJson('/api/v1/auth/forgot-password', ['email' => 'admin@choir.test'])
            ->assertOk()
            ->assertJsonPath('message', 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.');

        Notification::assertSentTo(
            User::where('email', 'admin@choir.test')->first(),
            ResetPasswordNotification::class
        );
    }

    public function test_forgot_password_does_not_leak_existing_accounts(): void
    {
        Notification::fake();

        $this->postJson('/api/v1/auth/forgot-password', ['email' => 'inconnu@choir.test'])
            ->assertOk();

        Notification::assertNothingSent();
    }

    public function test_reset_password_updates_password_and_revokes_tokens(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@choir.test',
            'password' => Hash::make('old-password'),
        ]);

        $user->createToken('test-token');

        $this->assertDatabaseCount('password_reset_tokens', 0);

        $this->postJson('/api/v1/auth/forgot-password', ['email' => 'admin@choir.test']);

        $token = Password::broker()->createToken($user);

        $this->assertDatabaseHas('password_reset_tokens', [
            'email' => 'admin@choir.test',
        ]);

        $this->postJson('/api/v1/auth/reset-password', [
            'token' => $token,
            'email' => 'admin@choir.test',
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ])->assertOk();

        $this->assertTrue(Hash::check('new-password-123', $user->fresh()->password));
        $this->assertCount(0, $user->fresh()->tokens);
    }

    public function test_reset_password_rejects_invalid_token(): void
    {
        User::factory()->create([
            'email' => 'admin@choir.test',
        ]);

        $this->postJson('/api/v1/auth/reset-password', [
            'token' => 'invalid-token',
            'email' => 'admin@choir.test',
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ])->assertStatus(400);
    }
}
