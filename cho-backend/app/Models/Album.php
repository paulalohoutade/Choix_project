<?php

namespace App\Models;

use App\Support\Media;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class Album extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'cover_image',
        'release_year',
        'is_featured',
        'status',
    ];

    protected $casts = [
        'is_featured'  => 'boolean',
        'release_year' => 'integer',
    ];

    protected $appends = ['cover_url'];

    // ── Hooks ──────────────────────────────────────────────────────────────
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Album $album) {
            if (empty($album->slug)) {
                $album->slug = Str::slug($album->title);
            }
        });
    }

    // ── Relations ──────────────────────────────────────────────────────────
    public function tracks(): HasMany
    {
        return $this->hasMany(Track::class)->orderBy('track_number');
    }

    // ── Scopes ─────────────────────────────────────────────────────────────
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    // ── Accesseurs ─────────────────────────────────────────────────────────
    public function getCoverUrlAttribute(): ?string
    {
        return Media::url($this->cover_image);
    }
}
