import gsap from "gsap";

/**
 * Inicializa el cambio de tema con animación al clicar el botón.
 */
export function initThemeToggler() {
  const root = document.documentElement;
  const btn = document.querySelector("#theme-toggle");

  if (!btn) return;

  // 1️⃣ Aplica el tema guardado al cargar
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark-theme") {
    root.classList.add("dark-theme");
    root.classList.remove("light-theme");
  } else {
    root.classList.add("light-theme");
    root.classList.remove("dark-theme");
  }

  // 2️⃣ Escucha el click del botón
  btn.addEventListener("click", () => {
    const isDark = root.classList.contains("dark-theme");
    const nextTheme = isDark ? "light-theme" : "dark-theme";

    // Guarda preferencia
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {}

    // ✨ overlay animado
    const overlay = document.createElement("div");
    overlay.classList.add("theme-overlay");
    document.body.appendChild(overlay);

    gsap.set(overlay, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: isDark ? "#fff" : "#000",
      pointerEvents: "none",
      zIndex: 9999,
      opacity: 0,
    });

    gsap.to(overlay, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => {
        root.classList.toggle("dark-theme", !isDark);
        root.classList.toggle("light-theme", isDark);
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => overlay.remove(),
        });
      },
    });
  });
}
