@php
    $logoPath = base_path('resources/views/mail/logo.png');
    $logoData = file_exists($logoPath)
        ? 'data:image/png;base64,'.base64_encode((string) file_get_contents($logoPath))
        : null;
    $siteName = \App\Models\Setting::get('site_name', 'Chorale Hefzibah');
    $tagline  = \App\Models\Setting::get('site_description', '');
@endphp
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test SMTP</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #eef1f6; margin: 0; padding: 32px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <table role="presentation" width="570" cellpadding="0" cellspacing="0" style="width: 570px; max-width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(15, 34, 54, 0.08);">
                    <tr>
                        <td style="background-color: #1a3a5c; padding: 28px 32px 22px; text-align: center;">
                            @if ($logoData)
                                <img src="{{ $logoData }}" alt="{{ $siteName }}" width="200" style="max-width: 200px; height: auto; display: block; margin: 0 auto;">
                            @endif
                            <h1 style="margin: 14px 0 0; color: #ffffff; font-size: 19px; font-weight: 700;">{{ $siteName }}</h1>
                            @if ($tagline)
                                <p style="margin: 5px 0 0; color: #facc15; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">{{ $tagline }}</p>
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 32px;">
                            <h2 style="margin: 0 0 16px; color: #0f2236; font-size: 18px;">Vérification de la configuration SMTP</h2>
                            <p style="margin: 0 0 16px; color: #52525b; line-height: 1.6;">Cet email confirme que l'envoi fonctionne correctement.</p>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 16px; background-color: #f7f9fc; border-left: 4px solid #facc15; border-radius: 4px;">
                                <tr>
                                    <td style="padding: 16px; color: #52525b; font-size: 14px;">
                                        <strong style="color: #1a3a5c;">Envoyé le :</strong> {{ $sentAt }}<br>
                                        <strong style="color: #1a3a5c;">Mailer :</strong> {{ $mailer }}<br>
                                        <strong style="color: #1a3a5c;">Hôte :</strong> {{ $host }}<br>
                                        <strong style="color: #1a3a5c;">Port :</strong> {{ $port }}
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 0; color: #6b7280; font-size: 13px;">Si vous recevez cet email, votre configuration SMTP est opérationnelle.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 32px; background-color: #f7f9fc; border-top: 1px solid #e5e7eb; text-align: center;">
                            <p style="margin: 0; color: #a1a1aa; font-size: 12px;">© {{ date('Y') }} {{ $siteName }}. Tous droits réservés.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
