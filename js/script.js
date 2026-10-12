
// Buscar todos los botones de los requerimientos
const botones = document.querySelectorAll("[data-info]");

// Agregar una acción a cada botón
botones.forEach(function (boton) {

    boton.addEventListener("click", function () {

        // Obtener el número del requerimiento
        const numero = boton.getAttribute("data-info");

        // Buscar el texto correspondiente
        const detalle = document.getElementById("detalle-" + numero);

        // Mostrar u ocultar la información
        detalle.classList.toggle("d-none");

        // Cambiar el texto del botón
        if (detalle.classList.contains("d-none")) {
            boton.textContent = "Consultar requerimiento";
        } else {
            boton.textContent = "Ocultar información";
        }

    });

});
