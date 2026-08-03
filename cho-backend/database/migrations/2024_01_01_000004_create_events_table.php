<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->string('slug', 220)->unique();
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->dateTime('event_date');
            $table->dateTime('end_date')->nullable();
            $table->string('cover_image')->nullable();
            $table->enum('type', ['concert', 'messe', 'retraite', 'tournee', 'autre'])->default('autre');
            $table->enum('status', ['upcoming', 'past', 'cancelled'])->default('upcoming');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
