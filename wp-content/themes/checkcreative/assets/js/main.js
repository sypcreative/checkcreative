import "bootstrap/dist/js/bootstrap.bundle.min.js";

import {
  initBasicCustomCursor,
  initDynamicCustomTextCursor,
  initPlayHoverCursor,
} from "./cursor.js";
import { initImageTrail } from "./cursorTrail.js";

import {
  imageParallax,
  initAboutHero,
  initBestProjectCards,
  initBestProjectsPin,
  initBoldFullScreenNavigation,
  initContactGallery,
  initCSSMarquee,
  initCSSMarqueeTestimonies,
  initDescriptionPin,
  initDirectionalListHover,
  initFooterParallax,
  initGallerySlider,
  initHeroParallax,
  initHighlightText,
  initMasonryGrid,
  initScrollLine,
  initStackingCards,
  initTabSystem,
  stampCC,
} from "./gsap.js";

import { initLazyMedia } from "./lazyMedia.js";
import { initActiveNavBarba, setupBarba } from "./pageTransition.js";
import { initCookieDarkLight } from "./themeToggler.js";
import { initDynamicCurrentTime } from "./timestamp.js";

const isMobile = () =>
  window.matchMedia("(max-width: 1024px) and (pointer: coarse)").matches;

// helpers
const idle = (cb, timeout = 1200) => {
  if ("requestIdleCallback" in window) {
    const id = requestIdleCallback(cb, { timeout });
    return () => cancelIdleCallback(id);
  }
  const t = setTimeout(cb, 60);
  return () => clearTimeout(t);
};

const defer = (cb) => {
  const id = requestAnimationFrame(() => requestAnimationFrame(cb));
  return () => cancelAnimationFrame(id);
};

// ✅ “heavy” común por vista (y footer SIEMPRE, porque Barba mata los triggers en leave)
function initCommonHeavy(scope) {
  let cancelDefer = null;
  let cancelIdle = null;

  cancelDefer = defer(() => {
    cancelIdle = idle(
      () => {
        // cosas del container/vista
        imageParallax(scope);
        initHighlightText(scope);
        stampCC(scope);

        // 🔥 footer persistente pero triggers mueren -> re-init en cada navegación
        initFooterParallax(document);

        if (!isMobile()) {
          initBasicCustomCursor(document);
          initImageTrail({
            minWidth: 992,
            moveDistance: 15,
            stopDuration: 350,
            trailLength: 8,
          });
        }
      },
      isMobile() ? 2500 : 900
    );
  });

  // 👇 tu setupBarba recoge esto como cleanup y lo ejecuta al cambiar de página
  return () => {
    try {
      cancelIdle && cancelIdle();
    } catch {}
    try {
      cancelDefer && cancelDefer();
    } catch {}
  };
}

document.addEventListener("DOMContentLoaded", () => {
  setupBarba({
    common: [
      // ligeros, siempre
      initActiveNavBarba,
      initCookieDarkLight,
      initDynamicCurrentTime,
      initBoldFullScreenNavigation,

      // heavy, siempre (con cleanup)
      initCommonHeavy,

      initPlayHoverCursor,
    ],

    byNs: {
      home: [
        (scope) => {
          initHeroParallax(scope);
          initDescriptionPin(scope);
          initBestProjectsPin(scope);
          initBestProjectCards(scope);
          initStackingCards(scope);
          initCSSMarquee(scope);
          initCSSMarqueeTestimonies(scope);
          initTabSystem(scope);

          if (!isMobile()) initDynamicCustomTextCursor(scope);
        },
      ],

      "single-proyecto": [
        (scope) => {
          // tu setupBarba guarda cleanups si devuelves function
          const lazyCleanup = initLazyMedia(scope);
          initGallerySlider(scope);
          return lazyCleanup;
        },
      ],

      about: [
        (scope) => {
          initAboutHero(scope);
          initDirectionalListHover(scope);
        },
      ],

      method: [(scope) => initScrollLine(scope)],
      contact: [(scope) => initContactGallery(scope)],

      gallery: [
        (scope) => {
          const lazyCleanup = initLazyMedia(scope);
          initMasonryGrid(scope);
          return lazyCleanup;
        },
      ],

      // aliases ES
      "sobre-nosotros": [
        (scope) => {
          initAboutHero(scope);
          initDirectionalListHover(scope);
        },
      ],
      metodo: [(scope) => initScrollLine(scope)],
      contacto: [(scope) => initContactGallery(scope)],
      galeria: [
        (scope) => {
          const lazyCleanup = initLazyMedia(scope);
          initMasonryGrid(scope);
          return lazyCleanup;
        },
      ],
    },

    initOnLoad: true,
  });
});
