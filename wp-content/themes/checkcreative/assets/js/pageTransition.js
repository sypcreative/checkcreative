// pageTransition.js
import barba from "@barba/core";
import gsap from "gsap";
import { initLenis } from "./initLenis.js";

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
    clipPath: "inset(100% 0% 0% 0%)",
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
  gsap.set(items, { clipPath: "inset(0% 0% 0% 0%)" });

  tl.to(
    items,
    {
      clipPath: "inset(0% 0% 100% 0%)",
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

  gsap.set(container, { autoAlpha: 1 });

  tl.to(list, {
    clipPath: "inset(0% 0% 0% 0%)",
    y: 0,
    opacity: 1,
    duration,
    stagger: { each: 0.06, from: "start" },
  });

  return tl.then ? tl.then() : tl.finished;
}

function prepEnter(el) {
  gsap.killTweensOf(el);
  gsap.set(el, { autoAlpha: 0 });
}

export function setupBarba({ common = [], byNs = {}, initOnLoad = true } = {}) {
  if (window.__BARBA_MINIMAL__) return;
  window.__BARBA_MINIMAL__ = true;

  let lenis = null;

  const run = (fns, container) =>
    requestAnimationFrame(() => {
      fns.forEach((fn) => {
        if (typeof fn !== "function") return;
        const name = fn.name || "anon";
        try {
          // console.log("%c[Barba] init:", "color:#ff8800", name);
          fn(container);
        } catch (e) {
          console.error("[Barba] ERROR en init:", name, e);
        }
      });
    });

  const runInitsFor = (container) => {
    if (!container) return;

    const ns = container.getAttribute("data-barba-namespace") || "default";
    console.log(
      "%c[Barba] runInitsFor namespace: " + ns,
      "color:#00eaff;font-weight:bold"
    );

    const nsFns = byNs[ns] || [];
    run([...nsFns, ...common], container);
    kickstartVideoAutoplay(container);

    // refrescamos ScrollTrigger tras los inits
    requestAnimationFrame(() => {
      try {
        window.gsap?.ScrollTrigger?.refresh?.(true);
      } catch (e) {
        console.error(e);
      }
    });
  };

  // ✅ SOLO UNA INICIALIZACIÓN GLOBAL
  if (initOnLoad) {
    window.addEventListener(
      "load",
      () => {
        lenis = initLenis();
        const container =
          document.querySelector('[data-barba="container"]') || document;
        runInitsFor(container);
      },
      { once: true }
    );
  }

  barba.init({
    prevent: ({ current, next, el }) => {
      const href = el?.getAttribute("href") || "";
      if (!href) return false;

      // 2) Detectar cambio de idioma → dejar que el navegador recargue
      // try {
      //   // URL destino
      //   const targetUrl = new URL(href, window.location.origin);
      //   const targetSegs = targetUrl.pathname.split("/").filter(Boolean); // ["checkcreative","es","sobre-nosotros"]

      //   // URL actual
      //   const currentSegs = window.location.pathname.split("/").filter(Boolean); // ["checkcreative","en","about"]

      //   // Soportar /checkcreative/es/... y también /es/...
      //   const getLangFromSegs = (segs) => {
      //     if (!segs.length) return null;
      //     // Si el proyecto vive en una subcarpeta (checkcreative), el idioma será el segundo segmento
      //     if (segs[0] === "checkcreative") return segs[1] || null;
      //     // Si está en raíz, el idioma será el primero
      //     return segs[0] || null;
      //   };

      //   const currentLang = getLangFromSegs(currentSegs);
      //   const targetLang = getLangFromSegs(targetSegs);

      //   if (currentLang && targetLang && currentLang !== targetLang) {
      //     // 👉 Es un enlace de cambio de idioma → NO Barba, reload normal
      //     // console.log("[Barba] Cambio de idioma detectado → reload normal");
      //     return true;
      //   }
      // } catch (e) {
      //   // si falla el parseo de URL, seguimos con la lógica normal
      // }

      // 3) Misma página normalizada → no usamos Barba
      const norm = (p) => (p || "").replace(/\/+$/, "") || "/";
      return current && next && norm(current.url.path) === norm(next.url.path);
    },

    transitions: [
      {
        name: "minimal-fade",

        once({ next }) {
          const isFirstVisit = !sessionStorage.getItem("preloaderShown");
          const isHome =
            next?.container?.getAttribute("data-barba-namespace") === "home";

          if (isFirstVisit && isHome) {
            return new Promise((resolve) => {
              initPreloaderMedia({
                onComplete: () => {
                  sessionStorage.setItem("preloaderShown", "true");
                  resolve();
                },
              });
            });
          }

          return new Promise((resolve) => {
            const items = prepRevealEnter(next.container);
            const tl = gsap.timeline({ delay: 0.5, onComplete: resolve });

            tl.to(items, {
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power2.out",
              stagger: { each: 0.06, from: "start" },
            });
          });
        },
        async leave({ current }) {
          if (!current?.container) return;

          const ns =
            current.container.getAttribute("data-barba-namespace") || "";
          if (ns === "home") {
            current.container
              .querySelector(".block-hero-home__video")
              ?.pause?.();
          }

          current.container.style.pointerEvents = "none";

          // 🔥 mata tweens del container viejo
          gsap.killTweensOf(current.container);
          gsap.killTweensOf(current.container.querySelectorAll("*"));

          // 🔥 mata ScrollTriggers
          if (window.gsap?.ScrollTrigger) {
            window.gsap.ScrollTrigger.getAll().forEach((st) => st.kill());
          }

          await animateRevealLeave(current.container, {
            duration: 0.8,
            ease: "power2.out",
          });

          current.container.style.display = "none";
        },

        beforeEnter({ next }) {
          const container = next.container;
          if (!container) return;

          container.style.display = "";
          container.style.position = container.style.position || "relative";
          container.style.zIndex = "1";

          // reutilizamos Lenis si ya existe, si no lo creamos
          if (!lenis) {
            lenis = initLenis();
          }
          lenis.resize();
          lenis.scrollTo(0, { immediate: true });

          // por si acaso hubiera algo colgado de este container
          gsap.killTweensOf(container);
          gsap.killTweensOf(container.querySelectorAll("*"));

          prepEnter(container);
          next.__revealItems = prepRevealEnter(container);
          gsap.set(container, { autoAlpha: 1 });

          runInitsFor(container);
        },

        async enter({ next }) {
          await animateRevealEnter(next.__revealItems, next.container, {
            duration: 0.9,
            ease: "power2.out",
          });

          next.container.style.removeProperty("z-index");
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
  if (!videos.length) return;

  videos.forEach((v) => {
    try {
      v.muted = true;
      v.playsInline = true;
      v.setAttribute("preload", "auto");
      v.load?.();
    } catch {}
  });

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
