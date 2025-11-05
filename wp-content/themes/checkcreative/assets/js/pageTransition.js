// // pageTransition.js
// import barba from "@barba/core";
// import gsap from "gsap";
// import { initLenis } from "./initLenis.js";

// function fadeOutGSAP(el, d = 0.7, ease = "power1.out") {
//   return new Promise((resolve) => {
//     gsap.killTweensOf(el);
//     gsap.to(el, {
//       autoAlpha: 0,
//       duration: d,
//       ease,
//       overwrite: "auto",
//       onComplete: resolve,
//     });
//   });
// }

// function prepEnter(el) {
//   gsap.killTweensOf(el);
//   gsap.set(el, { autoAlpha: 0 }); // sin !important
// }

// function fadeInGSAP(el, d = 0.7, ease = "power1.out") {
//   return new Promise((resolve) => {
//     gsap.killTweensOf(el);
//     gsap.to(el, {
//       autoAlpha: 1,
//       duration: d,
//       ease,
//       overwrite: "auto",
//       onComplete: resolve,
//     });
//   });
// }

// export function setupBarba({ common = [], byNs = {}, initOnLoad = true } = {}) {
//   console.log("[barba] setupBarba() llamado");
//   if (window.__BARBA_MINIMAL__) {
//     console.log("[barba] abortado por flag __BARBA_MINIMAL__");
//     return;
//   }
//   window.__BARBA_MINIMAL__ = true;

//   const run = (fns) =>
//     requestAnimationFrame(() => {
//       fns.forEach((fn) => {
//         try {
//           fn?.();
//         } catch (e) {
//           console.error(e);
//         }
//       });
//     });

//   const runInitsFor = (container) => {
//     const ns = container?.getAttribute?.("data-barba-namespace") || "default";
//     console.log("Initial namespace:", ns);
//     run([...(byNs[ns] || []), ...common]);
//     if (ns === "home") kickstartVideoAutoplay(container);
//   };

//   // ──────────────────────────────────────────────────────────────
//   // Fallback: ejecutar SIEMPRE en primera carga (con o sin Barba)
//   // ──────────────────────────────────────────────────────────────
//   let __didInitialRun = false;
//   const initialRunFallback = () => {
//     if (__didInitialRun) return;
//     const container =
//       document.querySelector('[data-barba="container"]') || document;
//     runInitsFor(container);
//     initLenis();
//     __didInitialRun = true;
//     console.log("[barba] initialRunFallback ejecutado");
//   };
//   if (document.readyState !== "loading") {
//     initialRunFallback();
//   } else {
//     document.addEventListener("DOMContentLoaded", initialRunFallback, {
//       once: true,
//     });
//   }
//   // ──────────────────────────────────────────────────────────────

//   if (initOnLoad) {
//     barba.hooks.once(({ next }) => {
//       console.log("initOnLoad hook once");
//       const container =
//         next?.container ||
//         document.querySelector('[data-barba="container"]') ||
//         document;
//       runInitsFor(container);
//       initLenis();
//       __didInitialRun = true; // marca que ya hicimos el arranque
//     });
//   }

//   barba.init({
//     prevent: ({ current, next, el }) => {
//       const href = el?.getAttribute("href") || "";
//       if (href.startsWith("#")) return true;
//       const norm = (p) => (p || "").replace(/\/+$/, "") || "/";
//       return current && next && norm(current.url.path) === norm(next.url.path);
//     },
//     transitions: [
//       {
//         name: "minimal-fade",
//         async leave({ current }) {
//           const ns =
//             current.container.getAttribute("data-barba-namespace") || "";
//           if (ns === "home") {
//             current.container
//               .querySelector(".block-hero-home__video")
//               ?.pause?.();
//           }
//           current.container.style.pointerEvents = "none";
//           await fadeOutGSAP(current.container, 0.8); // ← respeta tu duración
//           current.container.style.display = "none"; // quítalo de la pila
//         },
//         beforeEnter({ next }) {
//           next.container.style.display = "";
//           next.container.style.position =
//             next.container.style.position || "relative";
//           next.container.style.zIndex = "1"; // por si el current tapa

// 			 // refrescos varios
//           const lenis = initLenis();
//           lenis.resize();
//           lenis.scrollTo(0, { immediate: true });

//           prepEnter(next.container); // autoAlpha:0
//           runInitsFor(next.container);
//         },
//         async enter({ next }) {
//           await fadeInGSAP(next.container, 0.7); // ← respeta tu duración
//           next.container.style.removeProperty("z-index");

//           window.gsap?.ScrollTrigger?.refresh?.(true);
//         },
//       },
//     ],
//   });

//   barba.hooks.after(() => {
//     try {
//       window.gsap?.ScrollTrigger?.refresh?.(true);
//     } catch {}
//   });
// }

// function kickstartVideoAutoplay(root = document) {
//   const v = root.querySelector(".block-hero-home__video");
//   if (!v) return;
//   v.muted = true;
//   v.playsInline = true;
//   v.setAttribute("preload", "auto");
//   try {
//     v.load();
//   } catch {}
//   const p = v.play?.();
//   if (p && typeof p.then === "function") {
//     p.catch(() => {
//       const resume = () => {
//         v.play().finally(() => v.removeEventListener("pointerdown", resume));
//       };
//       v.addEventListener("pointerdown", resume, { once: true });
//     });
//   }
// }

// pageTransition.js
import barba from "@barba/core";
import gsap from "gsap";
import { initLenis } from "./initLenis.js";

/* ─────────────────────────────────────────────
   NUEVO: utilidades para máscara + selección
   ───────────────────────────────────────────── */
const REVEAL_SELECTORS = [
  "[data-reveal]",
  "h1, h2, h3, h4, .display",
  "p, .lead, li",
  "img, picture, figure",
].join(", ");

function inViewport(el, margin = 0) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const vw = window.innerWidth || document.documentElement.clientWidth;
  return (
    r.bottom > -margin &&
    r.right > -margin &&
    r.top < vh + margin &&
    r.left < vw + margin
  );
}

function getRevealItems(container, margin = 64) {
  return Array.from(container.querySelectorAll(REVEAL_SELECTORS))
    .filter((el) => el.getAttribute("data-reveal") !== "off")
    .filter((el) => inViewport(el, margin));
}

function prepRevealEnter(container) {
  const items = getRevealItems(container, 64);
  gsap.set(items, {
    clipPath: "inset(100% 0% 0% 0%)", // oculto desde abajo
    //  yPercent: 20,
    y: (i, el) => (el.matches("img, picture, figure") ? 0 : 20),
    opacity: (i, el) => (el.matches("img, picture, figure") ? 1 : 0.001),
    willChange: "transform, clip-path",
  });
  return items;
}

function animateRevealLeave(
  container,
  { duration = 0.7, ease = "power2.out" } = {}
) {
  const items = getRevealItems(container, 0);
  if (!items.length) return Promise.resolve();

  const tl = gsap.timeline({ defaults: { ease } });
  gsap.set(items, { clipPath: "inset(0% 0% 0% 0%)" }); // asegúrate de estado abierto

  tl.to(
    items,
    {
      clipPath: "inset(0% 0% 100% 0%)", // se cierra hacia arriba
      y: -12,
      opacity: (i, el) => (el.matches("img, picture, figure") ? 1 : 0.001),
      duration,
      stagger: { each: 0.04, from: "start" },
    },
    0
  );

  tl.to(
    container,
    { opacity: 0, duration: duration * 0.6, ease: "power1.out" },
    0
  );

  return tl.then ? tl.then() : tl.finished;
}

function animateRevealEnter(
  items,
  container,
  { duration = 0.9, ease = "power2.out" } = {}
) {
  const list = items && items.length ? items : prepRevealEnter(container);
  const tl = gsap.timeline({ defaults: { ease } });

  // asegúrate de que el container se ve mientras revelamos los hijos
  gsap.set(container, { autoAlpha: 1 });

  tl.to(list, {
    clipPath: "inset(0% 0% 0% 0%)", // abrir máscara
    y: 0,
    opacity: 1,
    duration,
    stagger: { each: 0.06, from: "start" },
  });

  return tl.then ? tl.then() : tl.finished;
}

/* ─────────────────────────────────────────────
   Tus helpers originales (los mantengo)
   ───────────────────────────────────────────── */
// function fadeOutGSAP(el, d = 0.7, ease = "power1.out") {
//   return new Promise((resolve) => {
//     gsap.killTweensOf(el);
//     gsap.to(el, {
//       autoAlpha: 0,
//       duration: d,
//       ease,
//       overwrite: "auto",
//       onComplete: resolve,
//     });
//   });
// }

function prepEnter(el) {
  gsap.killTweensOf(el);
  gsap.set(el, { autoAlpha: 0 }); // sin !important
}

// function fadeInGSAP(el, d = 0.7, ease = "power1.out") {
//   return new Promise((resolve) => {
//     gsap.killTweensOf(el);
//     gsap.to(el, {
//       autoAlpha: 1,
//       duration: d,
//       ease,
//       overwrite: "auto",
//       onComplete: resolve,
//     });
//   });
// }

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
    kickstartVideoAutoplay(container);
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
        name: "minimal-fade", // dejo tu nombre
        async leave({ current }) {
          const ns =
            current.container.getAttribute("data-barba-namespace") || "";
          if (ns === "home") {
            current.container
              .querySelector(".block-hero-home__video")
              ?.pause?.();
          }
          current.container.style.pointerEvents = "none";

          // ── CAMBIO: en vez de solo desvanecer, aplicamos máscara hacia arriba
          await animateRevealLeave(current.container, {
            duration: 0.8,
            ease: "power2.out",
          });
          // Si algo no tiene items visibles, mantenemos tu fallback por seguridad
          // await fadeOutGSAP(current.container, 0.8);

          current.container.style.display = "none";
        },
        beforeEnter({ next }) {
          next.container.style.display = "";
          next.container.style.position =
            next.container.style.position || "relative";
          next.container.style.zIndex = "1";

          const lenis = initLenis();
          lenis.resize();
          lenis.scrollTo(0, { immediate: true });

          // Mantengo tu prepEnter, pero además preparo los hijos para la revelación
          prepEnter(next.container); // autoAlpha:0
          next.__revealItems = prepRevealEnter(next.container);
          // dejamos el container visible para que se vea la apertura de máscara
          gsap.set(next.container, { autoAlpha: 1 });

          runInitsFor(next.container);
        },
        async enter({ next }) {
          // ── CAMBIO: revelamos hijos (máscara desde abajo hacia arriba)
          await animateRevealEnter(next.__revealItems, next.container, {
            duration: 0.9,
            ease: "power2.out",
          });

          next.container.style.removeProperty("z-index");
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
  const videos = Array.from(
    root.querySelectorAll(".block-hero-home__video, .gallery-slider__video")
  );
  console.log("kickstartVideoAutoplay found videos:", videos);
  if (!videos.length) return;

  // Prepara todos
  videos.forEach((v) => {
    try {
      v.muted = true;
      v.playsInline = true;
      v.setAttribute("preload", "auto");
      // Si no quieres precargar tanto, usa "metadata" en vez de "auto"
      v.load?.();
    } catch {}
  });

  // Intenta reproducir todos
  const blocked = [];
  videos.forEach((v) => {
    try {
      const p = v.play?.();
      if (p && typeof p.then === "function") {
        p.catch(() => blocked.push(v));
      }
    } catch {
      blocked.push(v);
    }
  });

  // Si alguno quedó bloqueado, un solo gesto los reactiva todos
  if (blocked.length) {
    const resumeAll = () => {
      blocked.forEach((v) => {
        try {
          v.play?.();
        } catch {}
      });
      document.removeEventListener("pointerdown", resumeAll);
      document.removeEventListener("keydown", resumeAll);
    };
    document.addEventListener("pointerdown", resumeAll, { once: true });
    document.addEventListener("keydown", resumeAll, { once: true });
  }
}
