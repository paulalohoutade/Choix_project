<?php

namespace App\Models;

use App\Support\Media;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'role',
        'bio',
        'photo',
        'is_leader',
        'sort_order',
    ];

    protected $casts = [
        'is_leader' => 'boolean',
    ];

    protected $appends = ['photo_url'];

    public function scopeLeaders(Builder $query): Builder
    {
        return $query->where('is_leader', true)->orderBy('sort_order');
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return Media::url($this->photo);
    }
}
