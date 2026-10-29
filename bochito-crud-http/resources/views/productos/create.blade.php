@extends('layouts.app')
@section('title', 'Nuevo producto')

@section('content')
<div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-6">
        <div class="card shadow-sm border-0">
            <div class="card-header bg-white">
                <h1 class="h5 mb-0"><i class="bi bi-plus-circle text-success"></i> Nuevo producto</h1>
            </div>
            <div class="card-body">
                {{-- EJERCICIO 2: POST con @csrf y validación --}}
                <form method="POST" action="{{ route('productos.store') }}" novalidate>
                    @csrf

                    @include('productos._form', [
                        'boton' => 'Guardar',
                        'icono' => 'bi-save',
                        'color' => 'success',
                    ])
                </form>
            </div>
        </div>
    </div>
</div>
@endsection