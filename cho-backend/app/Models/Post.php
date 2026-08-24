<?php

namespace App\Models;

use App\Support\Media;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'excerpt',
        'body',
        'cover_image',
        'category',
        'status',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    protected $appends = ['cover_url'];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Post $post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title);
            }
        });
    }

    // ── Relations ──────────────────────────────────────────────────────────
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // ── Scopes ─────────────────────────────────────────────────────────────
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
                     ->whereNotNull('published_at');
    }

    // ── Accesseurs ─────────────────────────────────────────────────────────
    public function getCoverUrlAttribute(): ?string
    {
        return Media::url($this->cover_image);
    }
}
