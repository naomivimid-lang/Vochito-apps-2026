/*
 * solicitudes.js - RF09: cancelación o modificación de pedidos
 * Solo se aceptan mientras el pedido no haya sido embarcado (estatus "En tránsito").
 * Usa Bochito (js/datos.js). Endpoint equivalente: POST /api/pedidos/:po/solicitudes
 * Uso: <form id="formSolicitud" data-accion="cancelar"> y <div id="avisoSolicitud">
 */
const formSolicitud = document.getElementById("formSolicitud");
const avisoSolicitud = document.getElementById("avisoSolicitud");
const EMBARCADO = "En tránsito";

function avisar(texto, tipo) {
  avisoSolicitud.textContent = texto;
  avisoSolicitud.className = `alert alert-${tipo} mt-3 mb-0`;
}

formSolicitud.addEventListener("submit", (e) => {
  e.preventDefault();
  formSolicitud.classList.add("was-validated");
  avisoSolicitud.className = "d-none"; // no dejar visible el aviso del intento anterior
  if (!formSolicitud.checkValidity()) return;

  const accion = formSolicitud.dataset.accion; // "cancelar" o "modificar"
  const po = document.getElementById("po").value.trim().toUpperCase();
  const pedido = Bochito.getPedidos().find((p) => p.po === po);

  if (!pedido) return avisar(`No existe el pedido ${po}. Revisa el número de orden de compra.`, "danger");
  if (pedido.estatus === EMBARCADO) {
    return avisar(`El pedido ${po} ya fue embarcado ("${EMBARCADO}"), por eso ya no se puede ${accion}.`, "danger");
  }
  // shortcut: la solicitud no se guarda; enviarla a la API cuando exista el backend
  avisar(`Solicitud para ${accion} el pedido ${po} registrada. Estatus actual: "${pedido.estatus}".`, "success");
  formSolicitud.reset();
  formSolicitud.classList.remove("was-validated");
});
