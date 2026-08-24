<?php

namespace App\Models;

use App\Support\Media;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class GalleryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'file_path',
        'type',
        'youtube_url',
        'event_id',
        'sort_order',
    ];

    protected $appends = ['file_url'];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function getFileUrlAttribute(): ?string
    {
        return Media::url($this->file_path);
    }
}
