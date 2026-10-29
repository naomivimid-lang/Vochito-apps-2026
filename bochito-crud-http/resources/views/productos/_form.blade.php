{{--
    Formulario compartido por create y edit (reto extra).
    Variables: $producto (array, opcional), $categorias, $tiendas, $boton, $icono, $color
--}}
@php($producto = $producto ?? [])

<div class="mb-3">
    <label for="nombre" class="form-label">Nombre del producto</label>
    <input type="text" id="nombre" name="nombre"
           value="{{ old('nombre', $producto['nombre'] ?? '') }}"
           class="form-control @error('nombre') is-invalid @enderror"
           placeholder="Ej. Pan artesanal">
    @error('nombre')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="mb-3">
    <label for="tienda" class="form-label">Tienda local</label>
    <input type="text" id="tienda" name="tienda" list="listaTiendas"
           value="{{ old('tienda', $producto['tienda'] ?? '') }}"
           class="form-control @error('tienda') is-invalid @enderror"
           placeholder="Ej. Panadería La Espiga">
    <datalist id="listaTiendas">
        @foreach ($tiendas as $t)
            <option value="{{ $t }}">
        @endforeach
    </datalist>
    @error('tienda')
        <div class="invalid-feedback">{{ $message }}</div>
    @enderror
</div>

<div class="row">
    <div class="col-12 col-sm-7 mb-3">
        <label for="categoria" class="form-label">Categoría</label>
        <input type="text" id="categoria" name="categoria" list="listaCategorias"
               value="{{ old('categoria', $producto['categoria'] ?? '') }}"
               class="form-control @error('categoria') is-invalid @enderror"
               placeholder="Ej. Alimentos">
        <datalist id="listaCategorias">
            @foreach ($categorias as $c)
                <option value="{{ $c }}">
            @endforeach
        </datalist>
        @error('categoria')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="col-12 col-sm-5 mb-3">
        <label for="precio" class="form-label">Precio</label>
        <div class="input-group has-validation">
            <span class="input-group-text">$</span>
            <input type="number" step="0.01" id="precio" name="precio"
                   value="{{ old('precio', $producto['precio'] ?? '') }}"
                   class="form-control @error('precio') is-invalid @enderror">
            @error('precio')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
    </div>
</div>

<div class="d-flex flex-column flex-sm-row gap-2">
    <button class="btn btn-{{ $color }}"><i class="bi {{ $icono }}"></i> {{ $boton }}</button>
    <a href="{{ route('productos.index') }}" class="btn btn-outline-secondary">Cancelar</a>
</div>