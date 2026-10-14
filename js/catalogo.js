/*
 * catalogo.js - Catálogo de productos de tiendas locales agrupado por categoría
 * Usa PRODUCTOS e ICONOS de js/productos-locales.js (los mismos de Búsquedas).
 */
const menuCategorias = document.getElementById("menuCategorias");
const listaCatalogo = document.getElementById("listaCatalogo");

document.getElementById("totalProductos").textContent = PRODUCTOS.length;

Object.entries(ICONOS).forEach(([categoria, icono], i) => {
  const productos = PRODUCTOS.filter((p) => p.categoria === categoria);
  const id = `categoria-${i + 1}`;

  // Menú lateral: enlace a la sección con el número de productos
  const li = document.createElement("li");
  li.innerHTML = `
    <a class="cat-left text-reset text-decoration-none" href="#${id}">
      <span class="icon-circle icon-soft-blue"><i class="fa-solid ${icono}" aria-hidden="true"></i></span>
      <span class="nombre-categoria"></span>
    </a>
    <span class="count-badge"></span>`;
  li.querySelector(".nombre-categoria").textContent = categoria;
  li.querySelector(".count-badge").textContent = productos.length;
  menuCategorias.appendChild(li);

  // Sección de la categoría con sus tarjetas (textContent evita inyectar HTML)
  const seccion = document.createElement("section");
  seccion.id = id;
  seccion.className = "mb-5";
  seccion.innerHTML = `<h2 class="section-title"></h2><div class="products-grid"></div>`;
  seccion.querySelector("h2").textContent = categoria;
  const grid = seccion.querySelector(".products-grid");

  productos.forEach((p) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "product-card";
    tarjeta.innerHTML = `
      <div class="card-image-wrapper"><i class="fa-solid ${icono}" aria-hidden="true"></i></div>
      <div class="card-content">
        <h3 class="product-title"></h3>
        <p class="producto-descripcion small text-muted mb-0"></p>
        <p class="small mb-0"><i class="fa-solid fa-store" aria-hidden="true"></i> <span class="producto-tienda"></span></p>
        <div class="product-price"></div>
      </div>`;
    tarjeta.querySelector(".product-title").textContent = p.nombre;
    tarjeta.querySelector(".producto-descripcion").textContent = p.descripcion;
    tarjeta.querySelector(".producto-tienda").textContent = p.tienda;
    tarjeta.querySelector(".product-price").textContent = `$${p.precio}`;
    grid.appendChild(tarjeta);
  });

  listaCatalogo.appendChild(seccion);
});
