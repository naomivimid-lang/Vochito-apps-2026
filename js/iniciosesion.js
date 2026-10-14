/*
 * iniciosesion.js - RF01 (inicio de sesión) y RNF06 (bloqueo tras 5 intentos)
 * Prototipo: las credenciales se verifican aquí. En el proyecto real se enviarían
 * con POST /api/auth/login y el backend respondería 200 (ok), 401 (datos incorrectos)
 * o 423 (cuenta bloqueada).
 */
const USUARIO_DEMO = { correo: "ventas@bochito.mx", contrasena: "Bochito#2026!" };
const MAX_INTENTOS = 5;
const MINUTOS_BLOQUEO = 5;
const CLAVE_BLOQUEO = "bochito_bloqueo";

// getElementById: todos los campos del login tienen id único.
const form = document.getElementById("formLogin");
const correo = document.getElementById("correo");
const contrasena = document.getElementById("contrasena");
const alerta = document.getElementById("alertaLogin");
const btnEntrar = document.getElementById("btnEntrar");

// ---- Control de intentos (se guarda para que sobreviva a recargar la página) ----
function leerBloqueo() {
  try { return JSON.parse(localStorage.getItem(CLAVE_BLOQUEO)) || { intentos: 0, hasta: 0 }; }
  catch { return { intentos: 0, hasta: 0 }; }
}
function guardarBloqueo(b) {
  try { localStorage.setItem(CLAVE_BLOQUEO, JSON.stringify(b)); } catch { /* sin almacenamiento */ }
}

function mostrarAlerta(texto, tipo) {
  alerta.textContent = texto;
  alerta.className = `alert alert-${tipo}`;
}

/** Devuelve los minutos que faltan si la cuenta está bloqueada, o 0 si no. */
function minutosRestantes() {
  const { hasta } = leerBloqueo();
  return hasta > Date.now() ? Math.ceil((hasta - Date.now()) / 60000) : 0;
}

function actualizarEstadoFormulario() {
  const min = minutosRestantes();
  btnEntrar.disabled = min > 0;
  if (min > 0) mostrarAlerta(`Cuenta bloqueada temporalmente. Intenta de nuevo en ${min} min.`, "danger");
}

/** Evento click: mostrar/ocultar contraseña (cambia el type del input y el ícono del botón). */
function alternarContrasena(e) {
  const visible = contrasena.type === "text";
  contrasena.type = visible ? "password" : "text";
  // querySelector: dentro del botón solo hay un <i>, basta el primero.
  e.currentTarget.querySelector("i").className = visible ? "fa-solid fa-eye" : "fa-solid fa-eye-slash";
}

/** Eventos input/blur: validación en tiempo real del correo y de la contraseña. */
function validarCampoEnVivo(e) {
  const campo = e.target;
  if (campo === correo) {
    // No marcar error mientras el campo sigue vacío y no se ha salido de él
    if (campo.value === "" && e.type === "input") return campo.classList.remove("is-invalid", "is-valid");
    const ok = campo.checkValidity() && campo.value.trim() !== "";
    campo.classList.toggle("is-invalid", !ok);
    campo.classList.toggle("is-valid", ok);
  } else if (campo === contrasena) {
    const ok = campo.value.length > 0;
    campo.classList.toggle("is-invalid", !ok && e.type === "blur");
    if (ok) campo.classList.remove("is-invalid");
  }
}

/** Evento submit: valida el formato, verifica credenciales y controla los intentos. */
function alEnviarLogin(e) {
  e.preventDefault();
  if (minutosRestantes() > 0) return actualizarEstadoFormulario();

  // 1) Validación del formato (Bootstrap marca los campos con .is-invalid)
  const okCorreo = correo.checkValidity();
  const okPass = contrasena.value.length > 0;
  correo.classList.toggle("is-invalid", !okCorreo);
  contrasena.classList.toggle("is-invalid", !okPass);
  if (!okCorreo || !okPass) return;

  // 2) Verificación de credenciales
  const datosOk = correo.value.trim().toLowerCase() === USUARIO_DEMO.correo && contrasena.value === USUARIO_DEMO.contrasena;
  if (datosOk) {
    guardarBloqueo({ intentos: 0, hasta: 0 });
    Bochito.iniciarSesion({ correo: USUARIO_DEMO.correo });
    mostrarAlerta("Acceso correcto. Redirigiendo...", "success");
    setTimeout(() => (window.location.href = "pedidos.html"), 600);
    return;
  }

  // 3) Datos incorrectos: contar el intento y bloquear si llega al máximo
  const b = leerBloqueo();
  b.intentos += 1;
  if (b.intentos >= MAX_INTENTOS) {
    b.hasta = Date.now() + MINUTOS_BLOQUEO * 60000;
    b.intentos = 0;
    guardarBloqueo(b);
    contrasena.value = "";
    return actualizarEstadoFormulario();
  }
  guardarBloqueo(b);
  mostrarAlerta(`Correo o contraseña incorrectos. Te quedan ${MAX_INTENTOS - b.intentos} intento(s).`, "danger");
}

document.getElementById("verContrasena").addEventListener("click", alternarContrasena);
form.addEventListener("submit", alEnviarLogin);
correo.addEventListener("input", validarCampoEnVivo);
correo.addEventListener("blur", validarCampoEnVivo);
contrasena.addEventListener("input", validarCampoEnVivo);
contrasena.addEventListener("blur", validarCampoEnVivo);

// Si ya hay sesión, ir directo a pedidos
if (Bochito.getSesion()) window.location.href = "pedidos.html";
actualizarEstadoFormulario();
