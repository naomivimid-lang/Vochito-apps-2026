/*
 * busquedas.js - Búsqueda de productos y artículos de tiendas locales
 * Página pública: no requiere sesión.
 * Filtra por texto (producto, tienda o descripción), categoría y precio máximo.
 * Endpoint equivalente: GET /api/productos?q=...&categoria=...&precioMax=...
 */
// PRODUCTOS e ICONOS vienen de js/productos-locales.js
const form = document.getElementById("formBusqueda");
const selCategoria = document.getElementById("categoria");
const precioMax = document.getElementById("precioMax");
const resultados = document.getElementById("resultados");
const resumen = document.getElementById("resumen");
const sinResultados = document.getElementById("sinResultados");

Object.keys(ICONOS).forEach((c) => selCategoria.add(new Option(c, c)));

/** Minúsculas y sin acentos, para que "panaderia" encuentre "Panadería". */
const normalizar = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Tarjeta de producto; textContent evita inyectar HTML. */
function tarjeta(p) {
  const col = document.createElement("div");
  col.className = "col-12 col-md-6 col-lg-4";
  col.innerHTML = `
    <div class="card h-100 shadow-sm border-0 p-3">
      <div class="card-body d-flex flex-column">
        <div class="rounded-circle d-flex align-items-center justify-content-center mb-3"
             style="width: 56px; height: 56px; background-color: #d6eaf0">
          <i class="fa-solid ${ICONOS[p.categoria]} fs-4" style="color: #03455b" aria-hidden="true"></i>
        </div>
        <span class="p-cat small fw-bold" style="color: #187171"></span>
        <h2 class="p-nombre h5 mt-1"></h2>
        <p class="p-desc text-muted mb-2"></p>
        <p class="small mb-3"><i class="fa-solid fa-store" aria-hidden="true"></i> <span class="p-tienda"></span></p>
        <strong class="p-precio fs-5 mt-auto"></strong>
      </div>
    </div>`;
  col.querySelector(".p-cat").textContent = p.categoria;
  col.querySelector(".p-nombre").textContent = p.nombre;
  col.querySelector(".p-desc").textContent = p.descripcion;
  col.querySelector(".p-tienda").textContent = p.tienda;
  col.querySelector(".p-precio").textContent = `$${p.precio}`;
  return col;
}

/** Aplica los tres filtros; los campos vacíos no filtran. */
function buscar() {
  const texto = normalizar(document.getElementById("texto").value.trim());
  const categoria = selCategoria.value;
  const max = precioMax.value === "" ? Infinity : Number(precioMax.value);

  const precioMal = !(max >= 0); // también atrapa NaN
  precioMax.classList.toggle("is-invalid", precioMal);
  if (precioMal) return;

  const lista = PRODUCTOS.filter((p) =>
    (!texto || normalizar(`${p.nombre} ${p.tienda} ${p.descripcion}`).includes(texto)) &&
    (!categoria || p.categoria === categoria) &&
    p.precio <= max
  );

  resultados.replaceChildren(...lista.map(tarjeta));
  resumen.textContent = `${lista.length} producto(s) encontrado(s).`;
  sinResultados.classList.toggle("d-none", lista.length > 0);
}

form.addEventListener("submit", (e) => { e.preventDefault(); buscar(); });
// "Limpiar" restablece los campos y vuelve a mostrar todos los productos
form.addEventListener("reset", () => setTimeout(buscar, 0));

buscar();
