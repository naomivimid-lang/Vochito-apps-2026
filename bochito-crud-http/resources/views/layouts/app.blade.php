<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Productos') | Bochito</title>

    {{-- Bootstrap Icons por CDN --}}
    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    {{-- Bootstrap 5 compilado con Vite --}}
    @vite(['resources/sass/app.scss', 'resources/js/app.js'])
</head>
<body class="d-flex flex-column min-vh-100">
    {{-- Navbar responsiva: en móvil se colapsa en el botón de menú --}}
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center gap-2" href="{{ route('productos.index') }}">
                <i class="bi bi-truck"></i> Bochito
                <span class="fw-light d-none d-sm-inline">· Envíos y Ventas</span>
            </a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#menuPrincipal" aria-controls="menuPrincipal"
                    aria-expanded="false" aria-label="Abrir menú">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="menuPrincipal">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link @if (request()->routeIs('productos.index')) active @endif"
                           href="{{ route('productos.index') }}">
                            <i class="bi bi-box-seam"></i> Productos
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link @if (request()->routeIs('productos.create')) active @endif"
                           href="{{ route('productos.create') }}">
                            <i class="bi bi-plus-circle"></i> Nuevo producto
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <main class="container py-4 flex-grow-1">
        {{-- Mensajes flash con alertas de Bootstrap --}}
        @if (session('ok'))
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle"></i> {{ session('ok') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
            </div>
        @endif

        @yield('content')
    </main>

    <footer class="bg-white border-top py-3 mt-auto">
        <div class="container small text-muted d-flex flex-column flex-sm-row justify-content-between gap-1">
            <span>Bochito: Envíos y Ventas · Aplicaciones Web 2026</span>
            <span>Miguel Ángel Guerrero López · UPP</span>
        </div>
    </footer>

    @stack('scripts')
</body>
</html>