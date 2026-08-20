
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {

        // Autoriser le frontend Vercel à communiquer avec l'API
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

        // CORS
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);

        // API pure — 401 JSON au lieu de rediriger vers route('login')
        $middleware->redirectGuestsTo(fn () => null);

        // Enregistrer le middleware 'role'
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {

        $exceptions->render(function (
            \Illuminate\Auth\AuthenticationException $e,
            Request $request
        ) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        });

    })
    ->create();