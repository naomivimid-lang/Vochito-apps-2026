/*
 * catalogo.js - Catálogo de productos de tiendas locales agrupado por categoría
 * Usa PRODUCTOS, ICONOS y tarjeta() de js/productos-locales.js (igual que Búsquedas).
 */
const menuCategorias = document.getElementById("menuCategorias");
const listaCatalogo = document.getElementById("listaCatalogo");

document.getElementById("totalProductos").textContent = PRODUCTOS.length;

Object.entries(ICONOS).forEach(([categoria, icono], i) => {
  const productos = PRODUCTOS.filter((p) => p.categoria === categoria);
  const id = `categoria-${i + 1}`;

  // Botón de la categoría: lleva a su sección y muestra cuántos productos tiene
  const boton = document.createElement("a");
  boton.className = "btn btn-outline-primary btn-sm";
  boton.href = `#${id}`;
  boton.innerHTML = `<i class="fa-solid ${icono}" aria-hidden="true"></i> <span class="nombre"></span> <span class="badge text-bg-light ms-1"></span>`;
  boton.querySelector(".nombre").textContent = categoria;
  boton.querySelector(".badge").textContent = productos.length;
  menuCategorias.appendChild(boton);

  // Sección de la categoría con las mismas tarjetas que Búsquedas
  const seccion = document.createElement("section");
  seccion.id = id;
  seccion.className = "mb-5";
  seccion.style.scrollMarginTop = "100px"; // que el menú fijo no tape el título al saltar
  seccion.innerHTML = `<h2 class="h4 fw-bold mb-3"></h2><div class="row g-4"></div>`;
  seccion.querySelector("h2").textContent = categoria;
  seccion.querySelector(".row").append(...productos.map(tarjeta));
  listaCatalogo.appendChild(seccion);
});
