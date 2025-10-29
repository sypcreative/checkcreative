import {
  imageParallax,
  initAboutHero,
  initBestProjectsPin,
  initDescriptionPin,
  initHeroParallax,
} from "./gsap.js";
import { initLenis } from "./initLenis.js";

// main.js
document.addEventListener("DOMContentLoaded", () => {
  const lenis = initLenis();
  console.log("✅ DOM listo — main.js inicializado");
  initDescriptionPin();
  initHeroParallax();
  initBestProjectsPin();
  initAboutHero();
  imageParallax();
  // O cualquier otra función global
  console.log("🚀 Todas las funciones inicializadas");
});
