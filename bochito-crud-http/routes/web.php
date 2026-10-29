<?php

use App\Http\Controllers\ProductoController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/productos');

// GET    /productos              -> index   (lectura + filtros por URL)
// GET    /productos/create       -> create  (formulario)
// POST   /productos              -> store   (creación)
// GET    /productos/{id}/edit    -> edit    (formulario)
// PUT    /productos/{id}         -> update  (actualización)
// DELETE /productos/{id}         -> destroy (eliminación)
Route::resource('productos', ProductoController::class)
    ->except(['show'])
    ->parameters(['productos' => 'id']);