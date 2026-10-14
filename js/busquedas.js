/*
 * busquedas.js - Búsqueda de productos y artículos de tiendas locales
 * Página pública: no requiere sesión.
 * Filtra por texto (producto, tienda o descripción), categoría y precio máximo.
 * Endpoint equivalente: GET /api/productos?q=...&categoria=...&precioMax=...
 */
// PRODUCTOS, ICONOS y tarjeta() vienen de js/productos-locales.js
// getElementById: cada elemento tiene un id único; es el método más directo y rápido para un solo nodo.
const form = document.getElementById("formBusqueda");
const selCategoria = document.getElementById("categoria");
const precioMax = document.getElementById("precioMax");
const resultados = document.getElementById("resultados");
const resumen = document.getElementById("resumen");
const sinResultados = document.getElementById("sinResultados");

Object.keys(ICONOS).forEach((c) => selCategoria.add(new Option(c, c)));

/** Minúsculas y sin acentos, para que "panaderia" encuentre "Panadería". */
const normalizar = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

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

/** Evento submit: evita recargar la página y aplica los filtros. */
function alEnviarBusqueda(e) {
  e.preventDefault();
  buscar();
}

/** Evento reset: "Limpiar" restablece los campos y vuelve a mostrar todos los productos. */
function alLimpiarBusqueda() {
  setTimeout(buscar, 0); // esperar a que el navegador vacíe los campos
}

/** Evento input: filtra mientras se escribe (búsqueda en tiempo real). */
function alEscribirBusqueda() {
  buscar();
}

form.addEventListener("submit", alEnviarBusqueda);
form.addEventListener("reset", alLimpiarBusqueda);
form.addEventListener("input", alEscribirBusqueda);

buscar();
