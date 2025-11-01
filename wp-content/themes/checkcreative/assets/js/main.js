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

  //   initPixelatedVideoEffect({
  //     container: ".block-hero-home", // contenedor principal
  //     video: ".block-hero-home__video", // elemento <video>
  //     // trigger: ".block-hero-home__content" // opcional: otro elemento para hover
  //   });
});
