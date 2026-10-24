import { auth } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  // Menú de navegación para teléfonos.
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const abierto = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!abierto));
      nav.classList.toggle("is-open", !abierto);
    });

    nav.querySelectorAll("a").forEach((enlace) => {
      enlace.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  const formulario = document.querySelector(".demo-form");
  if (!formulario) return;

  const esRegistro = window.location.pathname.toLowerCase().endsWith("/registro.html");
  const boton = formulario.querySelector('button[type="submit"]');
  const nota = formulario.querySelector(".form-note");

  function mostrarMensaje(mensaje, error = false) {
    if (nota) {
      nota.textContent = mensaje;
      nota.setAttribute("role", error ? "alert" : "status");
      nota.style.color = error ? "#c62828" : "#16845b";
    } else {
      alert(mensaje);
    }
  }

  function traducirError(codigo) {
    const errores = {
      "auth/email-already-in-use": "Este correo ya tiene una cuenta. Prueba iniciar sesión.",
      "auth/invalid-email": "El correo electrónico no es válido.",
      "auth/weak-password": "La contraseña es demasiado débil. Utiliza al menos 8 caracteres.",
      "auth/invalid-credential": "El correo o la contraseña son incorrectos.",
      "auth/user-not-found": "No encontramos una cuenta con ese correo.",
      "auth/wrong-password": "La contraseña es incorrecta.",
      "auth/too-many-requests": "Hubo demasiados intentos. Espera un momento e inténtalo de nuevo.",
      "auth/network-request-failed": "No se pudo conectar. Comprueba tu conexión a internet.",
      "auth/operation-not-allowed": "El método de correo y contraseña no está habilitado en Firebase.",
      "auth/unauthorized-domain": "Este dominio no está autorizado en Firebase Authentication."
    };
    return errores[codigo] || "No pudimos completar la operación. Código: " + codigo;
  }

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    if (!formulario.reportValidity()) return;

    const email = formulario.querySelector("#email")?.value.trim();
    const password = formulario.querySelector("#password")?.value;
    const nombre = formulario.querySelector("#name")?.value.trim();

    if (!email || !password) {
      mostrarMensaje("Completa el correo y la contraseña.", true);
      return;
    }

    boton.disabled = true;
    const textoOriginal = boton.textContent;
    boton.textContent = esRegistro ? "Creando cuenta..." : "Iniciando sesión...";

    try {
      if (esRegistro) {
        if (!nombre) throw new Error("Escribe tu nombre completo.");

        const resultado = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(resultado.user, { displayName: nombre });

        mostrarMensaje("¡Cuenta creada correctamente! Te llevaremos al inicio de sesión.");
        formulario.reset();

        setTimeout(() => {
          window.location.href = "login.html";
        }, 1800);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        mostrarMensaje("¡Inicio de sesión correcto! La autenticación ya funciona. El panel privado se añadirá en la siguiente etapa.");
        boton.textContent = "Sesión iniciada";
        // No redirigimos todavía: el panel privado aún no se ha creado.
      }
    } catch (error) {
      const mensaje = error.message?.startsWith("Escribe ")
        ? error.message
        : traducirError(error.code || "unknown");
      mostrarMensaje(mensaje, true);
      boton.disabled = false;
      boton.textContent = textoOriginal;
    }
  });
});
