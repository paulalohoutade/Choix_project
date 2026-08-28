<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE events MODIFY COLUMN status ENUM('upcoming', 'ongoing', 'past', 'cancelled') NOT NULL DEFAULT 'upcoming'");
    }

    public function down(): void
    {
        DB::statement("UPDATE events SET status = 'upcoming' WHERE status = 'ongoing'");
        DB::statement("ALTER TABLE events MODIFY COLUMN status ENUM('upcoming', 'past', 'cancelled') NOT NULL DEFAULT 'upcoming'");
    }
};
