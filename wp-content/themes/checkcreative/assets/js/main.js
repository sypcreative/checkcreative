import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  initBasicCustomCursor,
  initDynamicCustomTextCursor,
} from "./cursor.js";
import { initImageTrail } from "./cursorTrail.js";
import {
  imageParallax,
  initAboutHero,
  initBestProjectCards,
  initBestProjectsPin,
  initContactGallery,
  initCSSMarquee,
  initDescriptionPin,
  initDirectionalListHover,
  initFooterParallax,
  initGallerySlider,
  initHeroParallax,
  initHighlightText,
  initMasonryGrid,
  initScrollLine,
  initStackingCards,
  stampCC,
} from "./gsap.js";
import { setupBarba } from "./pageTransition.js";
import { initCookieDarkLight } from "./themeToggler.js";
import { initDynamicCurrentTime } from "./timestamp.js";

document.addEventListener("DOMContentLoaded", () => {
  setupBarba({
    common: [
      initBasicCustomCursor,
      // initDynamicCustomTextCursor,
      initCookieDarkLight,
      imageParallax,
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
      home: [
        initHeroParallax,
        initDescriptionPin,
        initBestProjectsPin,
        initBestProjectCards,
        initStackingCards,
        initCSSMarquee,
      ],
      about: [initAboutHero, initDirectionalListHover],
      "single-proyecto": [initGallerySlider],
      services: [initScrollLine],
      contact: [initContactGallery],
      contacto: [],
      gallery: [initMasonryGrid],
      // ESPAÑOL
      "sobre-nosotros": [initAboutHero, initDirectionalListHover],
      "single-proyecto-es": [initGallerySlider],
      "contacto-es": [],
    },
    initOnLoad: true, // <-- se ejecutan también al cargar sin transición
  });
});
