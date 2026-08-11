<?php

namespace App\Console\Commands;

use App\Models\Event;
use Illuminate\Console\Command;

class ClassifyEvents extends Command
{
    protected $signature = 'events:classify';

    protected $description = 'Recalcule et classe automatiquement chaque événement (à venir / passé) selon la date et l\'heure.';

    public function handle(): int
    {
        $reclassified = Event::query()
            ->get()
            ->filter(fn (Event $event) => $event->classifyStatus() !== $event->status)
            ->each->save();

        $this->info("{$reclassified->count()} événement(s) reclassé(s) automatiquement.");

        return self::SUCCESS;
    }
}
