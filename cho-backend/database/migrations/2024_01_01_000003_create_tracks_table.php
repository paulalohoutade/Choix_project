<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tracks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('album_id')->constrained()->cascadeOnDelete();
            $table->string('title', 200);
            $table->string('slug', 220)->unique();
            $table->unsignedTinyInteger('track_number');
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->string('audio_path')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('soundcloud_url')->nullable();
            $table->longText('lyrics')->nullable();
            $table->boolean('is_downloadable')->default(false);
            $table->string('download_path')->nullable();
            $table->unsignedInteger('play_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tracks');
    }
};
