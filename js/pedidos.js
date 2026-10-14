/*
 * pedidos.js - RF02 (registro de pedidos) y RF05 (registro de incidencias)
 * Requiere sesión iniciada. Usa Bochito (js/datos.js) para guardar los datos.
 * Endpoints equivalentes en el backend:
 *   POST /api/pedidos                      -> crear pedido
 *   POST /api/pedidos/:id/incidencias      -> registrar incidencia
 */
const sesion = Bochito.requerirSesion();
if (sesion) Bochito.activarBarraSesion(sesion);

// getElementById: formularios, tabla y modal tienen id único, es lo más directo para un solo nodo.
const formPedido = document.getElementById("formPedido");
const tabla = document.getElementById("tablaPedidos");
const mensaje = document.getElementById("mensaje");
const modal = new bootstrap.Modal(document.getElementById("modalIncidencia"));
const formIncidencia = document.getElementById("formIncidencia");
let pedidoIncidencia = null;

// Campos del pedido; se reutilizan en la validación en vivo, en la barra de progreso y al enviar
const campos = ["cliente", "producto", "cantidad", "entrega"].map((id) => document.getElementById(id));

// Barra de progreso (interacción libre): avanza 25 % por cada campo válido.
// Se usan las clases de ancho de Bootstrap (w-25, w-50...) en vez de style en línea.
const progreso = document.getElementById("progresoPedido");
// querySelector: la barra es el único .progress-bar dentro de su contenedor, basta el primero.
const barraProgreso = progreso.querySelector(".progress-bar");
const textoProgreso = document.getElementById("textoProgreso");
const CLASES_ANCHO = ["w-0", "w-25", "w-50", "w-75", "w-100"];

// "yyyy-MM-ddTHH:mm" en hora local, para el atributo min de datetime-local
function ahoraLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `alert alert-${tipo}`;
}

function dibujarTabla() {
  tabla.innerHTML = "";
  Bochito.getPedidos().forEach((p) => {
    const fila = document.createElement("tr");
    fila.append(
      Bochito.celda(p.po), Bochito.celda(p.cliente), Bochito.celda(p.producto),
      Bochito.celda(p.cantidad), Bochito.celda(Bochito.formatoFecha(p.entrega)),
      Bochito.celdaEstatus(p.estatus)
    );
    const acciones = document.createElement("td");
    acciones.className = "text-end text-nowrap";
    if (p.incidencias.length) {
      const aviso = document.createElement("span");
      aviso.className = "badge text-bg-warning me-2";
      aviso.textContent = `${p.incidencias.length} incidencia(s)`;
      acciones.appendChild(aviso);
    }
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary btn-sm";
    btn.dataset.id = p.id; // la delegación de eventos (alClicTabla) lee el pedido desde data-id
    btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Incidencia';
    acciones.appendChild(btn);
    fila.appendChild(acciones);
    tabla.appendChild(fila);
  });
}

// ---- RF02: registrar pedido ----
document.getElementById("entrega").min = ahoraLocal();

/** Reglas de validación de un campo (las usan blur, input y submit). */
function campoValido(c) {
  let ok = c.checkValidity() && c.value.trim() !== "";
  if (c.id === "cantidad") ok = ok && Number.isInteger(Number(c.value)) && Number(c.value) > 0;
  if (c.id === "entrega") ok = ok && new Date(c.value) > new Date(); // debe ser futura
  return ok;
}

/** Barra de progreso: refleja cuántos campos ya son válidos. */
function actualizarProgreso() {
  const completos = campos.filter(campoValido).length;
  const porcentaje = (completos / campos.length) * 100;
  barraProgreso.classList.remove(...CLASES_ANCHO);
  barraProgreso.classList.add(CLASES_ANCHO[completos]);
  barraProgreso.classList.toggle("bg-success", completos === campos.length);
  progreso.setAttribute("aria-valuenow", porcentaje);
  textoProgreso.textContent = `${porcentaje} % completado`;
}

/** Evento input (delegado en el formulario): quita el error en cuanto el campo es válido y avanza la barra. */
function alEscribirPedido(e) {
  if (!campos.includes(e.target)) return;
  if (e.target.classList.contains("is-invalid") && campoValido(e.target)) e.target.classList.remove("is-invalid");
  actualizarProgreso();
}

/** Evento focusout (equivale a blur pero sí burbujea, por eso se puede delegar): valida al salir del campo. */
function alSalirDeCampo(e) {
  if (!campos.includes(e.target)) return;
  e.target.classList.toggle("is-invalid", !campoValido(e.target));
}

/** Evento reset: limpia errores y reinicia la barra de progreso. */
function alLimpiarPedido() {
  campos.forEach((c) => c.classList.remove("is-invalid"));
  setTimeout(actualizarProgreso, 0); // esperar a que el navegador vacíe los campos
}

/** Evento submit: valida todo el formulario y registra el pedido. */
function alEnviarPedido(e) {
  e.preventDefault();
  let valido = true;
  campos.forEach((c) => {
    const ok = campoValido(c);
    c.classList.toggle("is-invalid", !ok);
    valido = valido && ok;
  });
  if (!valido) return mostrarMensaje("Revisa los campos marcados.", "danger");

  const [cliente, producto, cantidad, entrega] = campos;
  const nuevo = Bochito.agregarPedido({
    cliente: cliente.value.trim(), producto: producto.value.trim(),
    cantidad: Number(cantidad.value), entrega: entrega.value,
  });
  formPedido.reset();
  campos.forEach((c) => c.classList.remove("is-invalid"));
  mostrarMensaje(`Pedido ${nuevo.po} registrado con estatus "${nuevo.estatus}".`, "success");
  dibujarTabla();
}

formPedido.addEventListener("submit", alEnviarPedido);
formPedido.addEventListener("input", alEscribirPedido);
formPedido.addEventListener("focusout", alSalirDeCampo);
formPedido.addEventListener("reset", alLimpiarPedido);

// ---- RF05: registrar incidencia ----
function abrirIncidencia(pedido) {
  pedidoIncidencia = pedido;
  document.getElementById("incidenciaPedido").textContent = `${pedido.po} · ${pedido.cliente} · ${pedido.producto}`;
  formIncidencia.reset();
  // querySelectorAll: pueden estar marcados varios campos a la vez y hay que limpiarlos todos.
  formIncidencia.querySelectorAll(".is-invalid").forEach((c) => c.classList.remove("is-invalid"));
  document.getElementById("nuevaFecha").min = ahoraLocal();
  modal.show();
}

/** Evento click (delegado en la tabla): un solo listener atiende todos los botones "Incidencia". */
function alClicTabla(e) {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;
  const pedido = Bochito.getPedidos().find((p) => p.id === Number(btn.dataset.id));
  if (pedido) abrirIncidencia(pedido);
}

/** Evento submit del modal: valida y registra la incidencia. */
function alEnviarIncidencia(e) {
  e.preventDefault();
  const tipo = document.getElementById("tipoIncidencia");
  const causa = document.getElementById("causaIncidencia");
  const fecha = document.getElementById("nuevaFecha");
  const oks = [tipo.value !== "", causa.value.trim().length >= 5, fecha.value !== "" && new Date(fecha.value) > new Date()];
  [tipo, causa, fecha].forEach((c, i) => c.classList.toggle("is-invalid", !oks[i]));
  if (!oks.every(Boolean)) return;

  const lista = Bochito.getPedidos();
  const p = lista.find((x) => x.id === pedidoIncidencia.id);
  p.incidencias.push({ tipo: tipo.value, causa: causa.value.trim(), nuevaFecha: fecha.value, registrada: new Date().toISOString() });
  p.entrega = fecha.value; // la nueva fecha estimada reemplaza a la anterior
  Bochito.savePedidos(lista);
  modal.hide();
  dibujarTabla();
  // RF06 (notificación al cliente) se resolverá en el backend; aquí solo se informa.
  mostrarMensaje(`Incidencia registrada en ${p.po}. Se notificará al cliente.`, "warning");
}

tabla.addEventListener("click", alClicTabla);
formIncidencia.addEventListener("submit", alEnviarIncidencia);

actualizarProgreso();
if (sesion) dibujarTabla();
