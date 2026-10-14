/*
 * productos-locales.js - Productos de tiendas locales (prototipo)
 * Lo usan busquedas.html y catalogo.html.
 */
// shortcut: catálogo fijo de ejemplo; cambiar por la API cuando exista el backend
const PRODUCTOS = [
  { nombre: "Pan artesanal", tienda: "Panadería La Espiga", categoria: "Alimentos", precio: 80, descripcion: "Pan de horno de leña hecho cada mañana." },
  { nombre: "Tortillas de maíz (1 kg)", tienda: "Tortillería Doña Lupe", categoria: "Alimentos", precio: 28, descripcion: "Maíz nixtamalizado de la región." },
  { nombre: "Miel de abeja (500 g)", tienda: "Apiarios Sierra Verde", categoria: "Alimentos", precio: 120, descripcion: "Miel pura de productores locales." },
  { nombre: "Jitomate (1 kg)", tienda: "Verduras Hernández", categoria: "Frutas y verduras", precio: 32, descripcion: "Cosechado en huertos de la comunidad." },
  { nombre: "Naranja (costal 5 kg)", tienda: "Frutería Don Chuy", categoria: "Frutas y verduras", precio: 95, descripcion: "Naranja dulce para jugo." },
  { nombre: "Aguacate (1 kg)", tienda: "Frutería Don Chuy", categoria: "Frutas y verduras", precio: 70, descripcion: "Aguacate hass de temporada." },
  { nombre: "Canasta de palma", tienda: "Artesanías Raíces", categoria: "Artesanías", precio: 150, descripcion: "Tejida a mano por artesanas locales." },
  { nombre: "Jarro de barro", tienda: "Alfarería El Comal", categoria: "Artesanías", precio: 65, descripcion: "Barro natural, ideal para café de olla." },
  { nombre: "Huacal de madera", tienda: "Carpintería San José", categoria: "Hogar", precio: 110, descripcion: "Para transportar o exhibir mercancía." },
  { nombre: "Jabón de avena", tienda: "Cooperativa Sierra Verde", categoria: "Cuidado personal", precio: 45, descripcion: "Jabón artesanal sin químicos agresivos." },
];
const ICONOS = {
  Alimentos: "fa-bread-slice",
  "Frutas y verduras": "fa-apple-whole",
  Artesanías: "fa-palette",
  Hogar: "fa-house",
  "Cuidado personal": "fa-pump-soap",
};
