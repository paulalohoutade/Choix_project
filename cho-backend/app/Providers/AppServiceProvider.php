<?php

namespace App\Providers;

use Illuminate\Health\Checks\DatabaseHealthCheck;
use Illuminate\Support\Facades\Health;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        // /up vérifie Neon — un ping externe maintient Render + DB éveillés
        Health::checks([
            DatabaseHealthCheck::new(),
        ]);
    }
}
