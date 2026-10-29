{{--
    Imagen de un producto, o un ícono si no tiene.
    Variables: $producto (array), $clase ('producto-miniatura' en la tabla, 'producto-imagen' en tarjetas)
--}}
@if (! empty($producto['imagen']))
    <img src="{{ asset('storage/' . $producto['imagen']) }}" alt="{{ $producto['nombre'] }}" class="{{ $clase }}">
@else
    <div class="{{ $clase }} producto-sin-imagen" role="img" aria-label="{{ $producto['nombre'] }} (sin imagen)">
        <i class="bi bi-image" aria-hidden="true"></i>
    </div>
@endif
