/*
 * formularios.js - Envío de formularios de demostración (prototipo)
 * Valida con las reglas del HTML (required, type, min) y muestra un aviso en lugar
 * de enviar a "#", que en un sitio estático da error o recarga la página.
 * Uso: <form class="needs-validation" novalidate data-exito="Texto del aviso">
 */
// shortcut: los datos no se guardan; conectar cada formulario a su API cuando exista el backend
// querySelectorAll: hay varios formularios con la misma clase y queremos todos (devuelve una lista).
document.querySelectorAll("form.needs-validation").forEach((form) => {
  const aviso = document.createElement("div");
  aviso.className = "alert alert-success mt-3 mb-0 d-none";
  aviso.setAttribute("role", "status");
  form.after(aviso);

  // Rango de fechas: "hasta" no puede ser anterior a "desde"
  // querySelector: se busca por atributo data-* dentro de este formulario (no tienen id) y solo se necesita el primero.
  const desde = form.querySelector("[data-desde]");
  const hasta = form.querySelector("[data-hasta]");

  /** Evento change: la fecha "hasta" no puede ser anterior a "desde". */
  function ajustarFechaMinima() {
    hasta.min = desde.value;
  }
  if (desde && hasta) desde.addEventListener("change", ajustarFechaMinima);

  /** Evento submit: valida con las reglas del HTML y muestra el aviso de éxito. */
  function alEnviarFormulario(e) {
    e.preventDefault();
    form.classList.add("was-validated");
    aviso.classList.add("d-none");
    if (!form.checkValidity()) return;

    aviso.textContent = form.dataset.exito || "Información enviada correctamente.";
    aviso.classList.remove("d-none");
    form.reset();
    form.classList.remove("was-validated");
  }
  form.addEventListener("submit", alEnviarFormulario);
});
