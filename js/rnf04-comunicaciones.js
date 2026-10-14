/*
 * rnf04-comunicaciones.js - RNF04: demostración de cola de solicitudes con reintentos.
 * Interacción "Agregar y eliminar elementos": se crean <li> con createElement/appendChild
 * y se quitan con remove() usando delegación de eventos (un solo listener en la lista).
 */

// getElementById: todos estos elementos tienen id único en RNF04.html.
const campoOperacion = document.getElementById("operacion");
const botonAgregar = document.getElementById("agregar");
const botonReintentar = document.getElementById("reintentar");
const estado = document.getElementById("estado");
const lista = document.getElementById("listaSolicitudes");

const solicitudes = [];
let siguienteId = 1;

/** Evento click: agrega una solicitud a la cola. */
function alAgregarSolicitud() {
  const descripcion = campoOperacion.value.trim();

  if (!descripcion) {
    estado.textContent = "Escribe una descripción antes de agregar.";
    campoOperacion.classList.add("is-invalid");
    campoOperacion.focus();
    return;
  }

  campoOperacion.classList.remove("is-invalid");
  solicitudes.push({ id: siguienteId++, descripcion, intentos: 0 });

  campoOperacion.value = "";
  mostrarSolicitudes();
  estado.textContent = "Solicitud agregada a la cola de demostración.";
}

/** Evento input: quita el aviso de error en cuanto se empieza a escribir. */
function alEscribirOperacion() {
  campoOperacion.classList.remove("is-invalid");
}

/** Evento click: simula un reintento para todas las solicitudes pendientes. */
function alReintentar() {
  if (solicitudes.length === 0) {
    estado.textContent = "No hay solicitudes pendientes para reintentar.";
    return;
  }

  solicitudes.forEach(function (solicitud) {
    solicitud.intentos++;
  });

  mostrarSolicitudes();
  estado.textContent = "Se simuló un reintento para las solicitudes pendientes.";
}

/** Evento click (delegado en la lista): un solo listener atiende todos los botones "Quitar".
 *  Así funciona también con los elementos que se agregan después de cargar la página. */
function alQuitarSolicitud(e) {
  const boton = e.target.closest("button[data-id]");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  const posicion = solicitudes.findIndex(function (s) { return s.id === id; });
  if (posicion === -1) return;

  solicitudes.splice(posicion, 1);
  boton.closest("li").remove(); // remove(): quita el <li> del DOM sin volver a dibujar toda la lista
  estado.textContent = solicitudes.length === 0
    ? "No hay solicitudes pendientes."
    : "Solicitud eliminada de la cola.";
}

function mostrarSolicitudes() {
  lista.replaceChildren();

  solicitudes.forEach(function (solicitud) {
    const elemento = document.createElement("li");
    elemento.className = "d-flex justify-content-between align-items-center gap-2";

    const texto = document.createElement("span");
    texto.textContent = `${solicitud.descripcion} — Intentos simulados: ${solicitud.intentos}`;

    const quitar = document.createElement("button");
    quitar.type = "button";
    quitar.className = "btn btn-outline-danger btn-sm flex-shrink-0";
    quitar.dataset.id = solicitud.id;
    quitar.setAttribute("aria-label", `Quitar solicitud: ${solicitud.descripcion}`);
    quitar.innerHTML = '<i class="bi bi-trash"></i> Quitar';

    elemento.append(texto, quitar);
    lista.appendChild(elemento);
  });
}

botonAgregar.addEventListener("click", alAgregarSolicitud);
botonReintentar.addEventListener("click", alReintentar);
campoOperacion.addEventListener("input", alEscribirOperacion);
lista.addEventListener("click", alQuitarSolicitud);
