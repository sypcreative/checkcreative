import barba from "@barba/core";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import gsap from "gsap";
import { isAgeVerified, secheckcreativegeGate } from "./ageGate.js";
import { initAnimatedBanner } from "./animatedBanner.js";
import blogFilters from "./blogFilters.js";
import {
  addToCartMultiplierWoocommerce,
  coupon,
  filterBarWoocommerce,
  initCartQtyStepper,
  initMiniCartDrawerWoocommerce,
  initProductPageAddToCart,
  maxWeightFn,
  refreshMiniCartAfterAdd,
  removeFromCartWoocommerce,
  updateTotalQty,
} from "./customWoocommerce.js";
import { initDraggableImages } from "./draggableImage.js";
import "./footerLiquid.js";
import lenis from "./initLenis.js";
import { loader } from "./loader.js";
import { initMagneticBadges } from "./magnetBadge.js";
import { newsletterFormHandler } from "./newsletter";
import {
  animateLinesText,
  initMobileNavbar,
  initQuoteImagesAnimation,
} from "./revealAnimations.js";
import {
  cacheFooterNodes,
  getCurrentNamespace,
  toggleFooterByNS,
} from "./revealFooter.js";
import { toggleBillingForm } from "./toggleBillingForm.js";
import "./wc-event-bridge.js";
/* ---------------------------------------------
   Funciones reutilizables
--------------------------------------------- */

function runSharedScripts() {
  animateLinesText();
  initDraggableImages();
  initQuoteImagesAnimation();
  initAnimatedBanner();
  initMagneticBadges();
  blogFilters();
  filterBarWoocommerce();
  removeFromCartWoocommerce();
  addToCartMultiplierWoocommerce();
  initCartQtyStepper();
  updateTotalQty();
  refreshMiniCartAfterAdd();
  newsletterFormHandler();
  initMobileNavbar();
  toggleBillingForm();
  initProductPageAddToCart();
  maxWeightFn();
  coupon();

  const dragArea = document.querySelector(".content-drag-area");
  const spacer = document.querySelector(".block-ventajas__spacer");
  if (dragArea && spacer) {
    const updateHeight = () => {
      spacer.style.height = `${dragArea.offsetHeight}px`;
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
  }
}

async function runModelRelatedScripts() {
  const { initModelScene, preloadModels } = await import("./model.js");
  const { initSlider } = await import("./slider.js");

  initModelScene();
  initSlider();
  preloadModels();
}

/* ---------------------------------------------
   Loader inicial
--------------------------------------------- */
function isFirstVisitFromOutside() {
  const referrer = document.referrer;
  const sameOrigin = referrer.includes(window.location.hostname);
  const hasVisited = sessionStorage.getItem("hasVisited");
  return !hasVisited && (!referrer || !sameOrigin);
}

function initialLoad() {
  const shouldShowLoader = isFirstVisitFromOutside();

  const midPointCallback = () => {
    if (shouldShowLoader) {
      runModelRelatedScripts();
    }
  };

  const afterLoaderCallback = () => {
    if (!shouldShowLoader) {
      runModelRelatedScripts();
    }

    runSharedScripts();
  };

  if (shouldShowLoader) {
    sessionStorage.setItem("hasVisited", "true");
    loader(midPointCallback).then(afterLoaderCallback);
  } else {
    afterLoaderCallback();
  }
}

/* ---------------------------------------------
    Invalida caché de Barba.js para el carrito
--------------------------------------------- */

const CART_SLUGS = ["/carrito/"];

document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link) return;

  const href = link.getAttribute("href") || "";
  const mustInvalidate = CART_SLUGS.some((slug) => href.includes(slug));

  if (mustInvalidate) {
    console.log(`Invalidando caché para: ${href}`);
    barba.cache.delete(href);
  }
});

/* ---------------------------------------------
   Barba.js Transiciones
--------------------------------------------- */
function initBarba() {
  const overlay = document.querySelector(".barba-transition-overlay");

  cacheFooterNodes();
  toggleFooterByNS(getCurrentNamespace());

  barba.init({
    prevent: ({ href }) => {
      const skip = [
        "/finalizar-compra",
        "/aviso-legal",
        "/politica-de-cookies",
        "/politica-de-privacidad",
        "/envios-y-devoluciones",
        "/terminos-condiciones",
      ];
      return skip.some((s) => href.includes(s));
    },
    transitions: [
      {
        name: "curtain",
        sync: true,

        leave(data) {
          toggleFooterByNS(data.next.namespace);

          return gsap.to(overlay, {
            y: "0%",
            duration: 0.7,
            ease: "power2.inOut",
          });
        },

        enter({ next }) {
          gsap.set(next.container, { opacity: 0 });
          return gsap.to(next.container, { opacity: 1, duration: 0.2 });
        },

        afterEnter({ next }) {
          initMiniCartDrawerWoocommerce();
          gsap.to(overlay, {
            y: "-100%",
            duration: 0.7,
            ease: "power2.inOut",
          });

          toggleFooterByNS(next.namespace);
        },
      },
    ],
  });

  barba.hooks.afterEnter(({ next }) => {
    lenis.scrollTo(0, { immediate: true });

    jQuery("body").trigger("wc_init");
    document.body.dispatchEvent(new Event("wc-init"));

    initMiniCartDrawerWoocommerce();

    gsap.to(overlay, {
      y: "-100%",
      duration: 0.7,
      ease: "power2.inOut",
    });

    toggleFooterByNS(next.namespace);
  });

  barba.hooks.after(() => {
    runModelRelatedScripts();
    runSharedScripts();

    const current =
      (barba.history &&
        barba.history.current &&
        barba.history.current.namespace) ||
      getCurrentNamespace();
    toggleFooterByNS(current);
  });
}

let appStarted = false;
function startApp() {
  if (appStarted) return;
  appStarted = true;
  initialLoad();
  initBarba();
}

document.addEventListener("DOMContentLoaded", () => {
  secheckcreativegeGate();

  if (isAgeVerified()) {
    startApp();
  } else {
    window.addEventListener("ageGate:granted", startApp, { once: true });
  }
});
