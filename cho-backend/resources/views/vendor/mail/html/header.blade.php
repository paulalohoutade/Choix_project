@props(['url'])
@php
    $logoPath = base_path('resources/views/mail/logo.png');
    $logoData = file_exists($logoPath)
        ? 'data:image/png;base64,'.base64_encode((string) file_get_contents($logoPath))
        : null;
    $siteName = \App\Models\Setting::get('site_name', 'Chorale Hefzibah');
    $tagline  = \App\Models\Setting::get('site_description', '');
@endphp
<tr>
<td class="header" style="background-color: #1A3A5C; border-radius: 12px 12px 0 0; padding: 28px 32px 22px; text-align: center;">
@if ($logoData)
<a href="{{ $url }}" style="display: inline-block;">
<img src="{{ $logoData }}" alt="{{ $siteName }}" width="200" style="max-width: 200px; height: auto; display: block; margin: 0 auto;">
</a>
@else
<a href="{{ $url }}" style="color: #ffffff; font-size: 19px; font-weight: bold; text-decoration: none;">{{ $siteName }}</a>
@endif
<h1 style="margin: 14px 0 0; color: #ffffff; font-size: 19px; font-weight: 700;">{{ $siteName }}</h1>
@if ($tagline)
<p style="margin: 5px 0 0; color: #facc15; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">{{ $tagline }}</p>
@endif
</td>
</tr>
