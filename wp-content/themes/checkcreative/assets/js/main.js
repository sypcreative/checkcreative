import { initImageTrail } from "./cursorTrail.js";
import {
  imageParallax,
  initAboutHero,
  initBestProjectsPin,
  initDescriptionPin,
  initDirectionalListHover,
  initGallerySlider,
  initHeroParallax,
  initHighlightText,
  stampCC,
  textAnimations,
} from "./gsap.js";
import { setupBarba } from "./pageTransition.js";
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
      () =>
        initImageTrail({
          minWidth: 992,
          moveDistance: 15,
          stopDuration: 350,
          trailLength: 8,
        }),
    ],
    byNs: {
      home: [initHeroParallax, initDescriptionPin, initBestProjectsPin],
      about: [initAboutHero, initDirectionalListHover],
      "single-proyecto": [initGallerySlider],
      contacto: [],
    },
    initOnLoad: true, // <-- se ejecutan también al cargar sin transición
  });
});
