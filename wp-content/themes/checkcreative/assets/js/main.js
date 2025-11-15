import { initImageTrail } from "./cursorTrail.js";
import {
  imageParallax,
  initAboutHero,
  initBestProjectsPin,
  initDescriptionPin,
  initDirectionalListHover,
  initFooterParallax,
  initGallerySlider,
  initHeroParallax,
  initHighlightText,
  stampCC,
  textAnimations,
} from "./gsap.js";
import { setupBarba } from "./pageTransition.js";
import { initPreloader } from "./preloader.js";
import { initThemeToggler } from "./themeToggler.js";
import { initDynamicCurrentTime } from "./timestamp.js";

document.addEventListener("DOMContentLoaded", () => {
  setupBarba({
    common: [
      initThemeToggler,
      imageParallax,
      textAnimations,
      initDynamicCurrentTime,
      initHighlightText,
      stampCC,
      initFooterParallax,
      () =>
        initImageTrail({
          minWidth: 992,
          moveDistance: 15,
          stopDuration: 350,
          trailLength: 8,
        }),
    ],
    byNs: {
      // INGLÉS
      home: [initHeroParallax, initDescriptionPin, initBestProjectsPin],
      about: [initAboutHero, initDirectionalListHover],
      "single-proyecto": [initGallerySlider],
      contacto: [],

      // ESPAÑOL
      "sobre-nosotros": [initAboutHero, initDirectionalListHover],
      "single-proyecto-es": [initGallerySlider],
      "contacto-es": [],
    },
    initOnLoad: true, // <-- se ejecutan también al cargar sin transición
  });
});
