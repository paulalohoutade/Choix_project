<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Galerie ────────────────────────────────────────────────────────
        Schema::create('gallery_items', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200)->nullable();
            $table->text('description')->nullable();
            $table->string('file_path')->nullable();
            $table->enum('type', ['photo', 'video'])->default('photo');
            $table->string('youtube_url')->nullable();
            $table->foreignId('event_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // ── Membres de la chorale ──────────────────────────────────────────
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('role', 100);
            $table->text('bio')->nullable();
            $table->string('photo')->nullable();
            $table->boolean('is_leader')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // ── Messages de contact ────────────────────────────────────────────
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 150);
            $table->string('subject', 200);
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        // ── Paramètres globaux ─────────────────────────────────────────────
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key', 100)->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('contacts');
        Schema::dropIfExists('members');
        Schema::dropIfExists('gallery_items');
    }
};
