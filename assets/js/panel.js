import { auth } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const nameElement = document.getElementById("userName");
const emailElement = document.getElementById("userEmail");
const logoutButton = document.getElementById("logoutButton");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace("login.html");
    return;
  }

  nameElement.textContent = user.displayName || "Usuario de QR Médico";
  emailElement.textContent = user.email || "";
});

logoutButton?.addEventListener("click", async () => {
  logoutButton.disabled = true;
  logoutButton.textContent = "Cerrando sesión...";
  try {
    await signOut(auth);
    window.location.replace("login.html");
  } catch (error) {
    logoutButton.disabled = false;
    logoutButton.textContent = "Cerrar sesión";
    alert("No se pudo cerrar la sesión. Comprueba tu conexión e inténtalo de nuevo.");
  }
});
