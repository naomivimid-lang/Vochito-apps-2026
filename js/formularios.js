/*
 * formularios.js - Envío de formularios de demostración (prototipo)
 * Valida con las reglas del HTML (required, type, min) y muestra un aviso en lugar
 * de enviar a "#", que en un sitio estático da error o recarga la página.
 * Uso: <form class="needs-validation" novalidate data-exito="Texto del aviso">
 */
// shortcut: los datos no se guardan; conectar cada formulario a su API cuando exista el backend
document.querySelectorAll("form.needs-validation").forEach((form) => {
  const aviso = document.createElement("div");
  aviso.className = "alert alert-success mt-3 mb-0 d-none";
  aviso.setAttribute("role", "status");
  form.after(aviso);

  // Rango de fechas: "hasta" no puede ser anterior a "desde"
  const desde = form.querySelector("[data-desde]");
  const hasta = form.querySelector("[data-hasta]");
  if (desde && hasta) desde.addEventListener("change", () => (hasta.min = desde.value));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.classList.add("was-validated");
    aviso.classList.add("d-none");
    if (!form.checkValidity()) return;

    aviso.textContent = form.dataset.exito || "Información enviada correctamente.";
    aviso.classList.remove("d-none");
    form.reset();
    form.classList.remove("was-validated");
  });
});
