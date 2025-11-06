import {
  imageParallax,
  initAboutHero,
  initBestProjectsPin,
  initDescriptionPin,
  initGallerySlider,
  initHeroParallax,
  textAnimations,
} from "./gsap.js";
import { setupBarba } from "./pageTransition.js";
import { initThemeToggler } from "./themeToggler.js";

document.addEventListener("DOMContentLoaded", () => {
  setupBarba({
    common: [initThemeToggler, imageParallax, textAnimations],
    byNs: {
      home: [initHeroParallax, initDescriptionPin, initBestProjectsPin],
      about: [initAboutHero],
      "single-proyecto": [initGallerySlider],
      contacto: [],
    },
    initOnLoad: true, // <-- se ejecutan también al cargar sin transición
  });
});
