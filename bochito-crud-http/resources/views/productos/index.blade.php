@extends('layouts.app')
@section('title', 'Listado')

@section('content')
<div class="encabezado text-white rounded-3 p-4 mb-4 shadow-sm">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
            <h1 class="h3 mb-1">Productos de tiendas locales</h1>
            <p class="mb-0 opacity-75">Catálogo que Bochito entrega a domicilio.</p>
        </div>
        <a href="{{ route('productos.create') }}" class="btn btn-light text-primary fw-semibold">
            <i class="bi bi-plus-lg"></i> Nuevo producto
        </a>
    </div>
</div>

{{-- EJERCICIO 1: formulario GET, los filtros viajan en la URL --}}
<form method="GET" action="{{ route('productos.index') }}" class="row g-2 mb-3">
    <div class="col-12 col-md-4">
        <label for="buscar" class="visually-hidden">Buscar</label>
        <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input type="text" id="buscar" name="buscar" value="{{ $buscar }}"
                   class="form-control" placeholder="Buscar por nombre...">
        </div>
    </div>
    <div class="col-6 col-md-3">
        <label for="categoria" class="visually-hidden">Categoría</label>
        <select id="categoria" name="categoria" class="form-select">
            <option value="">Todas las categorías</option>
            @foreach ($categorias as $cat)
                <option value="{{ $cat }}" @selected($cat === $categoria)>{{ $cat }}</option>
            @endforeach
        </select>
    </div>
    <div class="col-6 col-md-3">
        <label for="tienda" class="visually-hidden">Tienda</label>
        <select id="tienda" name="tienda" class="form-select">
            <option value="">Todas las tiendas</option>
            @foreach ($tiendas as $t)
                <option value="{{ $t }}" @selected($t === $tienda)>{{ $t }}</option>
            @endforeach
        </select>
    </div>
    <div class="col-12 col-md-2 d-grid d-md-flex gap-2">
        <button class="btn btn-primary flex-md-fill"><i class="bi bi-funnel"></i> Filtrar</button>
        <a href="{{ route('productos.index') }}" class="btn btn-outline-secondary" title="Limpiar filtros">
            <i class="bi bi-x-lg"></i><span class="d-md-none"> Limpiar</span>
        </a>
    </div>
</form>

<p class="small text-muted mb-2">
    {{ $productos->total() }} {{ $productos->total() === 1 ? 'producto encontrado' : 'productos encontrados' }}
</p>

{{-- Escritorio y tablet: tabla de Bootstrap --}}
<div class="card shadow-sm border-0 d-none d-md-block">
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>#</th>
                    <th>Imagen</th>
                    <th>Producto</th>
                    <th>Tienda</th>
                    <th>Categoría</th>
                    <th class="text-end">Precio</th>
                    <th class="text-end">Acciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($productos as $p)
                    <tr>
                        <td class="text-muted">{{ $p['id'] }}</td>
                        <td>@include('productos._imagen', ['producto' => $p, 'clase' => 'producto-miniatura'])</td>
                        <td class="fw-semibold">{{ $p['nombre'] }}</td>
                        <td><i class="bi bi-shop text-muted"></i> {{ $p['tienda'] }}</td>
                        <td><span class="badge text-bg-secondary">{{ $p['categoria'] }}</span></td>
                        <td class="text-end precio">${{ number_format($p['precio'], 2) }}</td>
                        <td class="text-end text-nowrap">
                            <a href="{{ route('productos.edit', $p['id']) }}"
                               class="btn btn-sm btn-outline-primary" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </a>
                            {{-- EJERCICIO 4: botón que abre el modal de confirmación --}}
                            <button type="button" class="btn btn-sm btn-outline-danger" title="Eliminar"
                                    data-bs-toggle="modal" data-bs-target="#modalEliminar"
                                    data-id="{{ $p['id'] }}" data-nombre="{{ $p['nombre'] }}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="text-center text-muted py-4">
                            <i class="bi bi-inbox fs-3 d-block"></i> Sin resultados
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

{{-- Móvil: tarjetas --}}
<div class="d-md-none">
    @forelse ($productos as $p)
        <div class="card shadow-sm border-0 mb-2 tarjeta-producto overflow-hidden">
            @include('productos._imagen', ['producto' => $p, 'clase' => 'producto-imagen'])
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start gap-2">
                    <div>
                        <span class="badge text-bg-secondary mb-1">{{ $p['categoria'] }}</span>
                        <h2 class="card-title mb-1">{{ $p['nombre'] }}</h2>
                        <p class="small text-muted mb-0"><i class="bi bi-shop"></i> {{ $p['tienda'] }}</p>
                    </div>
                    <strong class="precio text-primary">${{ number_format($p['precio'], 2) }}</strong>
                </div>
                <div class="d-flex gap-2 mt-3">
                    <a href="{{ route('productos.edit', $p['id']) }}" class="btn btn-sm btn-outline-primary flex-fill">
                        <i class="bi bi-pencil"></i> Editar
                    </a>
                    <button type="button" class="btn btn-sm btn-outline-danger flex-fill"
                            data-bs-toggle="modal" data-bs-target="#modalEliminar"
                            data-id="{{ $p['id'] }}" data-nombre="{{ $p['nombre'] }}">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>
    @empty
        <div class="text-center text-muted py-4">
            <i class="bi bi-inbox fs-3 d-block"></i> Sin resultados
        </div>
    @endforelse
</div>

{{-- Paginación visual (conserva los filtros) --}}
<div class="d-flex justify-content-center mt-3">
    {{ $productos->links() }}
</div>

{{-- EJERCICIO 4: modal de confirmación con @method('DELETE') --}}
<div class="modal fade" id="modalEliminar" tabindex="-1" aria-labelledby="tituloEliminar" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <form id="formEliminar" method="POST" class="modal-content">
            @csrf
            @method('DELETE')
            <div class="modal-header">
                <h5 class="modal-title" id="tituloEliminar">
                    <i class="bi bi-exclamation-triangle text-danger"></i> Confirmar eliminación
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
                ¿Seguro que deseas eliminar <strong id="nombreEliminar"></strong>?
                <p class="small text-muted mb-0 mt-2">Esta acción no se puede deshacer.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-danger"><i class="bi bi-trash"></i> Eliminar</button>
            </div>
        </form>
    </div>
</div>
@endsection

@push('scripts')
<script>
    // Cambia el action del formulario según el producto elegido.
    document.getElementById('modalEliminar').addEventListener('show.bs.modal', (e) => {
        const btn = e.relatedTarget;
        document.getElementById('nombreEliminar').textContent = btn.dataset.nombre;
        document.getElementById('formEliminar').action = `{{ url('productos') }}/${btn.dataset.id}`;
    });
</script>
@endpush