<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

/**
 * CRUD de productos de las tiendas locales de Bochito.
 * Para no depender de una base de datos, los productos se guardan en la sesión.
 */
class ProductoController extends Controller
{
    private const POR_PAGINA = 5;

    /** Reglas compartidas por store() y update(). */
    private const REGLAS = [
        'nombre'    => ['required', 'string', 'min:3', 'max:100'],
        'tienda'    => ['required', 'string', 'min:3', 'max:80'],
        'categoria' => ['required', 'string', 'max:50'],
        'precio'    => ['required', 'numeric', 'min:0'],
        'imagen'    => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
    ];

    private const MENSAJES = [
        'nombre.required'    => 'El nombre es obligatorio.',
        'nombre.min'         => 'El nombre debe tener al menos 3 caracteres.',
        'nombre.max'         => 'El nombre no puede tener más de 100 caracteres.',
        'tienda.required'    => 'La tienda es obligatoria.',
        'tienda.min'         => 'La tienda debe tener al menos 3 caracteres.',
        'tienda.max'         => 'La tienda no puede tener más de 80 caracteres.',
        'categoria.required' => 'La categoría es obligatoria.',
        'categoria.max'      => 'La categoría no puede tener más de 50 caracteres.',
        'precio.required'    => 'El precio es obligatorio.',
        'precio.numeric'     => 'El precio debe ser un número.',
        'precio.min'         => 'El precio no puede ser negativo.',
        'imagen.image'       => 'El archivo debe ser una imagen.',
        'imagen.mimes'       => 'La imagen debe ser JPG, PNG o WEBP.',
        'imagen.max'         => 'La imagen no puede pesar más de 2 MB.',
        'imagen.uploaded'    => 'No se pudo subir la imagen; revisa que pese menos de 2 MB.',
    ];

    /** Datos iniciales (simulan una tabla): catálogo de tiendas locales de Bochito. */
    private function semilla(): array
    {
        return [
            1  => ['id' => 1,  'nombre' => 'Pan artesanal',            'tienda' => 'Panadería La Espiga',      'categoria' => 'Alimentos',         'precio' => 80.00],
            2  => ['id' => 2,  'nombre' => 'Tortillas de maíz (1 kg)', 'tienda' => 'Tortillería Doña Lupe',    'categoria' => 'Alimentos',         'precio' => 28.00],
            3  => ['id' => 3,  'nombre' => 'Miel de abeja (500 g)',    'tienda' => 'Apiarios Sierra Verde',    'categoria' => 'Alimentos',         'precio' => 120.00],
            4  => ['id' => 4,  'nombre' => 'Jitomate (1 kg)',          'tienda' => 'Verduras Hernández',       'categoria' => 'Frutas y verduras', 'precio' => 32.00],
            5  => ['id' => 5,  'nombre' => 'Naranja (costal 5 kg)',    'tienda' => 'Frutería Don Chuy',        'categoria' => 'Frutas y verduras', 'precio' => 95.00],
            6  => ['id' => 6,  'nombre' => 'Aguacate (1 kg)',          'tienda' => 'Frutería Don Chuy',        'categoria' => 'Frutas y verduras', 'precio' => 70.00],
            7  => ['id' => 7,  'nombre' => 'Canasta de palma',         'tienda' => 'Artesanías Raíces',        'categoria' => 'Artesanías',        'precio' => 150.00],
            8  => ['id' => 8,  'nombre' => 'Jarro de barro',           'tienda' => 'Alfarería El Comal',       'categoria' => 'Artesanías',        'precio' => 65.00],
            9  => ['id' => 9,  'nombre' => 'Huacal de madera',         'tienda' => 'Carpintería San José',     'categoria' => 'Hogar',             'precio' => 110.00],
            10 => ['id' => 10, 'nombre' => 'Jabón de avena',           'tienda' => 'Cooperativa Sierra Verde', 'categoria' => 'Cuidado personal',  'precio' => 45.00],
        ];
    }

    private function todos(Request $request): array
    {
        return $request->session()->get('productos', $this->semilla());
    }

    private function guardar(Request $request, array $productos): void
    {
        $request->session()->put('productos', $productos);
    }

    /**
     * Guarda la imagen subida (si hay) en storage/app/public/productos y devuelve su ruta.
     * Si no se subió una nueva, conserva la anterior; si se subió, borra la anterior.
     */
    private function imagen(Request $request, ?string $anterior = null): ?string
    {
        if (! $request->hasFile('imagen')) {
            return $anterior;
        }
        if ($anterior) {
            Storage::disk('public')->delete($anterior);
        }

        return $request->file('imagen')->store('productos', 'public');
    }

    /** Listas para los filtros y el autocompletado del formulario. */
    private function opciones(Request $request): array
    {
        $todos = collect($this->todos($request));

        return [
            'categorias' => $todos->pluck('categoria')->unique()->sort()->values(),
            'tiendas'    => $todos->pluck('tienda')->unique()->sort()->values(),
        ];
    }

    /** EJERCICIO 1: GET con filtros por query string. */
    public function index(Request $request)
    {
        $productos = collect($this->todos($request));

        // Parámetros de la URL: /productos?buscar=pan&categoria=Alimentos&tienda=...
        $buscar    = $request->query('buscar');
        $categoria = $request->query('categoria');
        $tienda    = $request->query('tienda');

        if ($buscar) {
            $productos = $productos->filter(
                fn ($p) => str_contains(mb_strtolower($p['nombre']), mb_strtolower($buscar))
            );
        }

        if ($categoria) {
            $productos = $productos->where('categoria', $categoria);
        }

        if ($tienda) {
            $productos = $productos->where('tienda', $tienda);
        }

        // Paginación visual (reto extra) conservando los filtros en los enlaces.
        $pagina = LengthAwarePaginator::resolveCurrentPage();
        $paginados = new LengthAwarePaginator(
            $productos->forPage($pagina, self::POR_PAGINA)->values(),
            $productos->count(),
            self::POR_PAGINA,
            $pagina,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return view('productos.index', [
            'productos' => $paginados,
            'buscar'    => $buscar,
            'categoria' => $categoria,
            'tienda'    => $tienda,
        ] + $this->opciones($request));
    }

    public function create(Request $request)
    {
        return view('productos.create', $this->opciones($request));
    }

    /** EJERCICIO 2: POST con validación. */
    public function store(Request $request)
    {
        $datos = $request->validate(self::REGLAS, self::MENSAJES);

        $productos = $this->todos($request);
        $id = (empty($productos) ? 0 : max(array_keys($productos))) + 1;

        $datos['imagen'] = $this->imagen($request);
        $productos[$id] = ['id' => $id] + $datos;
        $this->guardar($request, $productos);

        return redirect()->route('productos.index')
            ->with('ok', "Producto «{$datos['nombre']}» creado correctamente.");
    }

    public function edit(Request $request, int $id)
    {
        $productos = $this->todos($request);
        abort_unless(isset($productos[$id]), 404);

        return view('productos.edit', ['producto' => $productos[$id]] + $this->opciones($request));
    }

    /** EJERCICIO 3: PUT (actualización). */
    public function update(Request $request, int $id)
    {
        $productos = $this->todos($request);
        abort_unless(isset($productos[$id]), 404);

        $datos = $request->validate(self::REGLAS, self::MENSAJES);

        $datos['imagen'] = $this->imagen($request, $productos[$id]['imagen'] ?? null);
        $productos[$id] = ['id' => $id] + $datos;
        $this->guardar($request, $productos);

        return redirect()->route('productos.index')
            ->with('ok', "Producto «{$datos['nombre']}» actualizado correctamente.");
    }

    /** EJERCICIO 4: DELETE. */
    public function destroy(Request $request, int $id)
    {
        $productos = $this->todos($request);
        abort_unless(isset($productos[$id]), 404);

        $nombre = $productos[$id]['nombre'];
        if (! empty($productos[$id]['imagen'])) {
            Storage::disk('public')->delete($productos[$id]['imagen']);
        }
        unset($productos[$id]);
        $this->guardar($request, $productos);

        return redirect()->route('productos.index')
            ->with('ok', "Producto «{$nombre}» eliminado.");
    }
}