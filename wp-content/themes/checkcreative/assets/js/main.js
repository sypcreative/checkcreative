import { initDescriptionPin } from "./gsap.js";
import { initLenis } from "./initLenis.js";

// main.js
document.addEventListener("DOMContentLoaded", () => {
  const lenis = initLenis();
  console.log("✅ DOM listo — main.js inicializado");
  initDescriptionPin();
  // O cualquier otra función global
  console.log("🚀 Todas las funciones inicializadas");
});
