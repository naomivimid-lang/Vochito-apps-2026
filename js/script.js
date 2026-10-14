// Funciones compartidas de la interfaz de Bochito
// Resaltar el enlace de la página actual y registrar errores de carga básicos.
document.addEventListener("DOMContentLoaded", function () {
    const paginaActual = window.location.pathname.split("/").pop() || "index.html";
    const enlaces = document.querySelectorAll(".navbar-bochito .nav-link");

    enlaces.forEach(function (enlace) {
        const destino = enlace.getAttribute("href");
        if (destino === paginaActual) {
            enlace.classList.add("active");
            enlace.setAttribute("aria-current", "page");
        }
    });
});
