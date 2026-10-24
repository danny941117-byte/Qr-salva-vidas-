document.addEventListener("DOMContentLoaded", () => {
  // Menú de navegación para teléfonos.
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const abierto =
        menuButton.getAttribute("aria-expanded") === "true";

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

  // Formularios de demostración de QR Médico.
  document.querySelectorAll(".demo-form").forEach((formulario) => {
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();

      alert(
        "Esta es una demostración de QR Médico. " +
        "El registro y el inicio de sesión reales " +
        "se habilitarán en la Fase 2 con Firebase."
      );
    });
  });
});
