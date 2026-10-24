
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
        mostrarMensaje("¡Inicio de sesión correcto! Abriendo tu panel...");
        boton.textContent = "Sesión iniciada";
        setTimeout(() => {
          window.location.href = "panel.html";
        }, 700);
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
