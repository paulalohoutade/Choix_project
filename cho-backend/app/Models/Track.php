<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Track extends Model
{
    use HasFactory;

    protected $fillable = [
        'album_id',
        'title',
        'slug',
        'track_number',
        'duration_seconds',
        'audio_path',
        'youtube_url',
        'soundcloud_url',
        'lyrics',
        'is_downloadable',
        'download_path',
        'play_count',
    ];

    protected $casts = [
        'is_downloadable'  => 'boolean',
        'play_count'       => 'integer',
        'duration_seconds' => 'integer',
        'track_number'     => 'integer',
    ];

    protected $appends = [
        'audio_url',
        'formatted_duration',
        'source_type',
        'primary_source',
    ];

    // ── Hooks ──────────────────────────────────────────────────────────────
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Track $track) {
            if (empty($track->slug)) {
                $track->slug = Str::slug($track->title);
            }
        });
    }

    // ── Relations ──────────────────────────────────────────────────────────
    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }

    // ── Accesseurs ─────────────────────────────────────────────────────────
    public function getAudioUrlAttribute(): ?string
    {
        return $this->audio_path
            ? route('tracks.audio', ['track' => $this->id])
            : null;
    }

    public function getFormattedDurationAttribute(): string
    {
        if (! $this->duration_seconds) {
            return '--:--';
        }
        $minutes = intdiv($this->duration_seconds, 60);
        $seconds = $this->duration_seconds % 60;
        return sprintf('%d:%02d', $minutes, $seconds);
    }

    public function getSourceTypeAttribute(): string
    {
        if ($this->audio_path)     return 'local';
        if ($this->youtube_url)    return 'youtube';
        if ($this->soundcloud_url) return 'soundcloud';
        return 'none';
    }

    public function getPrimarySourceAttribute(): ?string
    {
        return $this->audio_url
            ?? $this->youtube_url
            ?? $this->soundcloud_url;
    }

    // ── Méthodes ───────────────────────────────────────────────────────────
    public function incrementPlayCount(): void
    {
        $this->increment('play_count');
    }
}
