<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // MySQL / MariaDB
        if (DB::getDriverName() !== 'pgsql') {
            Schema::table('events', function (Blueprint $table) {
                $table->string('status', 20)->default('upcoming')->change();
            });

            return;
        }

        // PostgreSQL : l'ENUM d'origine crée une contrainte CHECK qui bloquerait
        // les nouvelles valeurs ('ongoing'). On la supprime, puis on repasse en varchar.
        $constraints = DB::select("
            SELECT c.conname
            FROM pg_constraint c
            JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)
            WHERE c.conrelid = 'events'::regclass
              AND c.contype = 'c'
              AND a.attname = 'status'
        ");

        foreach ($constraints as $constraint) {
            DB::statement(sprintf('ALTER TABLE events DROP CONSTRAINT IF EXISTS "%s"', $constraint->conname));
        }

        DB::statement("ALTER TABLE events ALTER COLUMN status TYPE varchar(20) USING status::varchar(20)");
        DB::statement("ALTER TABLE events ALTER COLUMN status SET DEFAULT 'upcoming'");
        DB::statement("ALTER TABLE events ALTER COLUMN status SET NOT NULL");
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('status', 20)->default('upcoming')->change();
        });
    }
};
