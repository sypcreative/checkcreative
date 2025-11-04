// pageTransition.js
import barba from "@barba/core";
import gsap from "gsap";
import { initLenis } from "./initLenis.js";

function fadeOutGSAP(el, d = 0.7, ease = "power1.out") {
  return new Promise((resolve) => {
    gsap.killTweensOf(el);
    gsap.to(el, {
      autoAlpha: 0,
      duration: d,
      ease,
      overwrite: "auto",
      onComplete: resolve,
    });
  });
}

function prepEnter(el) {
  gsap.killTweensOf(el);
  gsap.set(el, { autoAlpha: 0 }); // sin !important
}

function fadeInGSAP(el, d = 0.7, ease = "power1.out") {
  return new Promise((resolve) => {
    gsap.killTweensOf(el);
    gsap.to(el, {
      autoAlpha: 1,
      duration: d,
      ease,
      overwrite: "auto",
      onComplete: resolve,
    });
  });
}

export function setupBarba({ common = [], byNs = {}, initOnLoad = true } = {}) {
  console.log("[barba] setupBarba() llamado");
  if (window.__BARBA_MINIMAL__) {
    console.log("[barba] abortado por flag __BARBA_MINIMAL__");
    return;
  }
  window.__BARBA_MINIMAL__ = true;

  const run = (fns) =>
    requestAnimationFrame(() => {
      fns.forEach((fn) => {
        try {
          fn?.();
        } catch (e) {
          console.error(e);
        }
      });
    });

  const runInitsFor = (container) => {
    const ns = container?.getAttribute?.("data-barba-namespace") || "default";
    console.log("Initial namespace:", ns);
    run([...(byNs[ns] || []), ...common]);
    if (ns === "home") kickstartVideoAutoplay(container);
  };

  // ──────────────────────────────────────────────────────────────
  // Fallback: ejecutar SIEMPRE en primera carga (con o sin Barba)
  // ──────────────────────────────────────────────────────────────
  let __didInitialRun = false;
  const initialRunFallback = () => {
    if (__didInitialRun) return;
    const container =
      document.querySelector('[data-barba="container"]') || document;
    runInitsFor(container);
    initLenis();
    __didInitialRun = true;
    console.log("[barba] initialRunFallback ejecutado");
  };
  if (document.readyState !== "loading") {
    initialRunFallback();
  } else {
    document.addEventListener("DOMContentLoaded", initialRunFallback, {
      once: true,
    });
  }
  // ──────────────────────────────────────────────────────────────

  if (initOnLoad) {
    barba.hooks.once(({ next }) => {
      console.log("initOnLoad hook once");
      const container =
        next?.container ||
        document.querySelector('[data-barba="container"]') ||
        document;
      runInitsFor(container);
      initLenis();
      __didInitialRun = true; // marca que ya hicimos el arranque
    });
  }

  barba.init({
    prevent: ({ current, next, el }) => {
      const href = el?.getAttribute("href") || "";
      if (href.startsWith("#")) return true;
      const norm = (p) => (p || "").replace(/\/+$/, "") || "/";
      return current && next && norm(current.url.path) === norm(next.url.path);
    },
    transitions: [
      {
        name: "minimal-fade",
        async leave({ current }) {
          const ns =
            current.container.getAttribute("data-barba-namespace") || "";
          if (ns === "home") {
            current.container
              .querySelector(".block-hero-home__video")
              ?.pause?.();
          }
          current.container.style.pointerEvents = "none";
          await fadeOutGSAP(current.container, 0.8); // ← respeta tu duración
          current.container.style.display = "none"; // quítalo de la pila
        },
        beforeEnter({ next }) {
          next.container.style.display = "";
          next.container.style.position =
            next.container.style.position || "relative";
          next.container.style.zIndex = "1"; // por si el current tapa
          prepEnter(next.container); // autoAlpha:0
          runInitsFor(next.container);
        },
        async enter({ next }) {
          await fadeInGSAP(next.container, 0.7); // ← respeta tu duración
          next.container.style.removeProperty("z-index");
          // refrescos varios
          const lenis = initLenis();
          lenis.resize();
          lenis.scrollTo(0, { immediate: true });
          window.gsap?.ScrollTrigger?.refresh?.(true);
        },
      },
    ],
  });

  barba.hooks.after(() => {
    try {
      window.gsap?.ScrollTrigger?.refresh?.(true);
    } catch {}
  });
}

function kickstartVideoAutoplay(root = document) {
  const v = root.querySelector(".block-hero-home__video");
  if (!v) return;
  v.muted = true;
  v.playsInline = true;
  v.setAttribute("preload", "auto");
  try {
    v.load();
  } catch {}
  const p = v.play?.();
  if (p && typeof p.then === "function") {
    p.catch(() => {
      const resume = () => {
        v.play().finally(() => v.removeEventListener("pointerdown", resume));
      };
      v.addEventListener("pointerdown", resume, { once: true });
    });
  }
}
