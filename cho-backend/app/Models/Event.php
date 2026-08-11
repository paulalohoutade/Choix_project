<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'location',
        'event_date',
        'end_date',
        'cover_image',
        'type',
        'status',
    ];

    protected $casts = [
        'event_date' => 'datetime',
        'end_date'   => 'datetime',
    ];

    protected $appends = ['cover_url'];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Event $event) {
            if (empty($event->slug)) {
                $event->slug = Str::slug($event->title);
            }
        });

        // Classification automatique du statut selon la date et l'heure.
        static::saving(function (Event $event) {
            $event->status = $event->classifyStatus();
        });
    }

    // ── Relations ──────────────────────────────────────────────────────────
    public function galleryItems(): HasMany
    {
        return $this->hasMany(GalleryItem::class);
    }

    // ── Scopes ─────────────────────────────────────────────────────────────
    public function scopeUpcoming(Builder $query): Builder
    {
        return $query
            ->where('status', '!=', 'cancelled')
            ->where(function (Builder $q) {
                $q->where(function (Builder $q) {
                    $q->whereNull('end_date')->where('event_date', '>=', now());
                })->orWhere(function (Builder $q) {
                    $q->whereNotNull('end_date')->where('end_date', '>=', now());
                });
            });
    }

    public function scopePast(Builder $query): Builder
    {
        return $query
            ->where('status', '!=', 'cancelled')
            ->where(function (Builder $q) {
                $q->where(function (Builder $q) {
                    $q->whereNull('end_date')->where('event_date', '<', now());
                })->orWhere(function (Builder $q) {
                    $q->whereNotNull('end_date')->where('end_date', '<', now());
                });
            });
    }

    public function scopeStatusIs(Builder $query, ?string $status): Builder
    {
        return match ($status) {
            'upcoming'  => $query->upcoming(),
            'past'      => $query->past(),
            'cancelled' => $query->where('status', 'cancelled'),
            default     => $query,
        };
    }

    // ── Classification automatique ─────────────────────────────────────────
    /**
     * Calcule le statut réel d'un événement à partir de la date et de l'heure :
     * - 'cancelled' reste inchangé ;
     * - passé dès que event_date (ou end_date si renseignée) est dépassée ;
     * - sinon 'upcoming'.
     */
    public function classifyStatus(): string
    {
        if ($this->status === 'cancelled') {
            return 'cancelled';
        }

        $end = $this->end_date ?? $this->event_date;

        return $end->lessThan(now()) ? 'past' : 'upcoming';
    }

    // ── Accesseurs ─────────────────────────────────────────────────────────
    public function getCoverUrlAttribute(): ?string
    {
        return $this->cover_image
            ? asset('storage/' . $this->cover_image)
            : null;
    }
}
