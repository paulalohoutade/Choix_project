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
    }

    // ── Relations ──────────────────────────────────────────────────────────
    public function galleryItems(): HasMany
    {
        return $this->hasMany(GalleryItem::class);
    }

    // ── Scopes ─────────────────────────────────────────────────────────────
    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('status', 'upcoming')->orderBy('event_date');
    }

    // ── Accesseurs ─────────────────────────────────────────────────────────
    public function getCoverUrlAttribute(): ?string
    {
        return $this->cover_image
            ? asset('storage/' . $this->cover_image)
            : null;
    }
}
