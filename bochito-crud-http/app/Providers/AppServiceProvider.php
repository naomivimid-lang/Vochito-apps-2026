<?php

namespace App\Providers;

use Illuminate\Pagination\Paginator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Los enlaces de paginación usan las clases de Bootstrap 5.
        Paginator::useBootstrapFive();
    }
}