import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  doc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  // Menú móvil, si la página incluye estos elementos.
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }));
  }

  const message = document.getElementById("form-message");
  const showMessage = (text, type = "error") => {
    if (!message) return;
    message.textContent = text;
    message.dataset.type = type;
  };

  const friendlyAuthError = (error) => {
    const code = error?.code || "";
    const messages = {
      "auth/invalid-email": "El correo electrónico no tiene un formato válido.",
      "auth/user-not-found": "No encontramos una cuenta con ese correo.",
      "auth/wrong-password": "La contraseña no es correcta.",
      "auth/invalid-credential": "El correo o la contraseña no son correctos.",
      "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
      "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
      "auth/too-many-requests": "Hubo demasiados intentos. Espera un momento e inténtalo de nuevo.",
      "auth/network-request-failed": "No se pudo conectar. Comprueba tu conexión a internet.",
      "auth/operation-not-allowed": "Activa Correo electrónico/contraseña en Firebase Authentication."
    };
    return messages[code] || `No se pudo completar la operación (${code || "error desconocido"}). Revisa la configuración de Firebase.`;
  };

  // Inicio de sesión real con Firebase Authentication.
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async event => {
      event.preventDefault();
      const email = loginForm.elements.email?.value.trim();
      const password = loginForm.elements.password?.value;
      const button = document.getElementById("login-button");
      if (!email || !password) {
        showMessage("Escribe tu correo y contraseña.");
        return;
      }
      if (button) {
        button.disabled = true;
        button.textContent = "Verificando…";
      }
      showMessage("");
      try {
        await signInWithEmailAndPassword(auth, email, password);
        showMessage("Inicio de sesión correcto. Abriendo tu panel…", "success");
        window.location.replace("panel.html");
      } catch (error) {
        showMessage(friendlyAuthError(error));
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = "Iniciar sesión";
        }
      }
    });
  }

  // Registro real; compatible con un formulario que use id="register-form".
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async event => {
      event.preventDefault();
      const email = registerForm.elements.email?.value.trim();
      const password = registerForm.elements.password?.value;
      const name = registerForm.elements.name?.value.trim() || "";
      const button = document.getElementById("register-button");
      if (!email || !password) {
        showMessage("Escribe tu correo y una contraseña.");
        return;
      }
      if (password.length < 6) {
        showMessage("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
      if (button) {
        button.disabled = true;
        button.textContent = "Creando cuenta…";
      }
      showMessage("");
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        // Perfil básico no médico. Los datos clínicos se añadirán con reglas
        // de acceso adecuadas antes de usar información real.
        await setDoc(doc(db, "users", credential.user.uid), {
          email,
          displayName: name,
          createdAt: serverTimestamp()
        });
        window.location.replace("panel.html");
      } catch (error) {
        showMessage(friendlyAuthError(error));
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = "Crear cuenta";
        }
      }
    });
  }

  // Panel privado: comprobar sesión y mostrar el correo autenticado.
  if (document.body.dataset.page === "panel" || document.getElementById("panel-email")) {
    onAuthStateChanged(auth, user => {
      if (!user) {
        window.location.replace("login.html");
        return;
      }
      const emailTarget = document.getElementById("panel-email");
      if (emailTarget) emailTarget.textContent = user.email || "Usuario autenticado";
      const nameTarget = document.getElementById("panel-name");
      if (nameTarget) nameTarget.textContent = user.displayName || "Mi espacio médico";
    });
  }

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      logoutButton.disabled = true;
      try {
        await signOut(auth);
        window.location.replace("login.html");
      } catch (error) {
        showMessage(friendlyAuthError(error));
        logoutButton.disabled = false;
      }
    });
  }
});
