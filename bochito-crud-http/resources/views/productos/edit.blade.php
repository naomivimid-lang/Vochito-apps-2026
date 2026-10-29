@extends('layouts.app')
@section('title', 'Editar producto')

@section('content')
<div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-6">
        <div class="card shadow-sm border-0">
            <div class="card-header bg-white">
                <h1 class="h5 mb-0"><i class="bi bi-pencil-square text-primary"></i> Editar producto #{{ $producto['id'] }}</h1>
            </div>
            <div class="card-body">
                {{-- EJERCICIO 3: el navegador solo envía GET/POST; Laravel simula PUT con @method --}}
                <form method="POST" action="{{ route('productos.update', $producto['id']) }}" novalidate>
                    @csrf
                    @method('PUT')

                    @include('productos._form', [
                        'producto' => $producto,
                        'boton' => 'Actualizar',
                        'icono' => 'bi-arrow-repeat',
                        'color' => 'primary',
                    ])
                </form>
            </div>
        </div>
    </div>
</div>
@endsection