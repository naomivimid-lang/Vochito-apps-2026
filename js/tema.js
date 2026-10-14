/*
 * tema.js - Cambio de tema claro/oscuro (interacción 6: change, classList, data-bs-theme)
 * Se carga desde el <head> de todas las páginas. Agrega un switch de Bootstrap a la navbar
 * y guarda la elección del usuario para las demás páginas.
 */
const CLAVE_TEMA = "bochito_tema";

function leerTema() {
  try { return localStorage.getItem(CLAVE_TEMA) || "light"; }
  catch { return "light"; } // modo privado: sin almacenamiento
}

function guardarTema(tema) {
  try { localStorage.setItem(CLAVE_TEMA, tema); } catch { /* sin almacenamiento */ }
}

/** Bootstrap 5.3 lee data-bs-theme del <html> y cambia todos sus colores. */
function aplicarTema(tema) {
  document.documentElement.setAttribute("data-bs-theme", tema);
}

/** Evento change del switch: aplica el tema, lo guarda y cambia el ícono con classList. */
function alCambiarTema(e) {
  const tema = e.target.checked ? "dark" : "light";
  aplicarTema(tema);
  guardarTema(tema);

  // querySelector: dentro de la etiqueta del switch solo hay un <i>, basta el primero.
  const icono = document.querySelector("#interruptorTema + label i");
  icono.classList.toggle("fa-moon", tema === "light");
  icono.classList.toggle("fa-sun", tema === "dark");
}

/** Crea el switch y lo agrega al final del menú de la navbar. */
function montarInterruptor() {
  // querySelector: toma la primera lista .navbar-nav (el menú principal de la navbar).
  const menu = document.querySelector(".navbar-nav");
  if (!menu) return;

  const oscuro = leerTema() === "dark";
  const item = document.createElement("li");
  item.className = "nav-item d-flex align-items-center ms-lg-2 py-2 py-lg-0";
  item.innerHTML = `
    <div class="form-check form-switch mb-0 text-white">
      <input class="form-check-input" type="checkbox" role="switch" id="interruptorTema" ${oscuro ? "checked" : ""}>
      <label class="form-check-label" for="interruptorTema" title="Cambiar tema claro/oscuro">
        <i class="fa-solid ${oscuro ? "fa-sun" : "fa-moon"}" aria-hidden="true"></i>
        <span class="visually-hidden">Tema oscuro</span>
      </label>
    </div>`;
  menu.appendChild(item);

  // getElementById: el switch recién creado tiene id único.
  document.getElementById("interruptorTema").addEventListener("change", alCambiarTema);
}

// Aplicar el tema guardado cuanto antes para evitar un parpadeo del tema claro
aplicarTema(leerTema());
document.addEventListener("DOMContentLoaded", montarInterruptor);
