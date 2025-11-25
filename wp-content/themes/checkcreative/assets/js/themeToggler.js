// themeToggler.js

let themeListenersAttached = false;

export function initCookieDarkLight() {
  // ⚠️ Para que no dupliquemos listeners cada vez que Barba llama a esto
  if (themeListenersAttached) {
    applyStoredTheme();
    return;
  }

  themeListenersAttached = true;

  function getThemeElement() {
    // El elemento que controla el tema: body o html con data-theme-status
    return (
      document.querySelector("[data-theme-status]") || document.documentElement
    );
  }

  function setTheme(theme) {
    const el = getThemeElement();
    el.setAttribute("data-theme-status", theme);
    localStorage.setItem("theme", theme);
  }

  function toggleTheme() {
    const el = getThemeElement();
    const currentTheme = el.getAttribute("data-theme-status") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";

    console.log("Toggle theme:", currentTheme, "→", newTheme);
    setTheme(newTheme);
  }

  function applyStoredTheme() {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    }
  }

  // 🎹 Shift + T → alternar tema
  document.addEventListener("keydown", function (e) {
    const tagName = e.target.tagName.toLowerCase();
    if (
      tagName === "input" ||
      tagName === "textarea" ||
      e.target.isContentEditable
    ) {
      return;
    }

    if (e.shiftKey && (e.key === "t" || e.key === "T" || e.keyCode === 84)) {
      e.preventDefault();
      toggleTheme();
    }
  });

  // 🖱️ Delegación de eventos para cualquier [data-theme-toggle]
  // Funciona aunque Barba reemplace el botón
  document.addEventListener("click", function (e) {
    const toggle = e.target.closest("[data-theme-toggle]");
    if (!toggle) return;

    e.preventDefault();
    toggleTheme();
  });

  // Aplicar tema guardado al cargar
  applyStoredTheme();
}
