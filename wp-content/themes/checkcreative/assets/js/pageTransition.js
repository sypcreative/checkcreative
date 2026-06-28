// pageTransition.js
import barba from "@barba/core";
import gsap from "gsap";
import { initLenis } from "./initLenis.js";
import { initLogoRevealLoader } from "./preloader.js";

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

function updateLanguageToggleFromNextHTML(nextHTML) {
  if (!nextHTML) return;

  const doc = new DOMParser().parseFromString(nextHTML, "text/html");
  const nextToggle = doc.querySelector(".language-toggle");
  const currentToggle = document.querySelector(".language-toggle");

  if (nextToggle && currentToggle) {
    currentToggle.innerHTML = nextToggle.innerHTML;
  }
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

function storageGet(key) {
  try {
    return window.sessionStorage.getItem(key);
  } catch {}
  try {
    return window.localStorage.getItem(key);
  } catch {}
  return null;
}

function storageSet(key, val) {
  let ok = false;
  try {
    window.sessionStorage.setItem(key, val);
    ok = true;
  } catch {}
  try {
    window.localStorage.setItem(key, val);
    ok = true;
  } catch {}
  return ok;
}

function getNamespace(next) {
  return (
    next?.namespace ||
    next?.container?.getAttribute("data-barba-namespace") ||
    next?.container?.dataset?.barbaNamespace ||
    ""
  );
}

export function setupBarba({ common = [], byNs = {}, initOnLoad = true } = {}) {
  if (window.__BARBA_MINIMAL__) return;
  window.__BARBA_MINIMAL__ = true;

  let lenis = null;
  let destroyers = []; // 👈 aquí guardaremos todos los cleanups

  // Ejecuta funciones y recoge cleanups
  const run = (fns, container) =>
    requestAnimationFrame(() => {
      fns.forEach((fn) => {
        if (typeof fn !== "function") return;
        const name = fn.name || "anon";
        try {
          // console.log("%c[Barba] init:", "color:#ff8800", name);
          const res = fn(container);

          // 👇 si la función devuelve otra función, la consideramos cleanup
          if (typeof res === "function") {
            destroyers.push(res);
          }
        } catch (e) {
          console.error("[Barba] ERROR en init:", name, e);
        }
      });
    });

  const runInitsFor = (container) => {
    if (!container) return;

    // 🔥 Limpia todo lo de la página anterior
    if (destroyers.length) {
      destroyers.forEach((fn) => {
        try {
          fn && fn();
        } catch (e) {
          console.error("[Barba] error en cleanup:", e);
        }
      });
      destroyers = [];
    }

    const ns = container.getAttribute("data-barba-namespace") || "default";

    const nsFns = byNs[ns] || [];
    run([...nsFns, ...common], container);
    kickstartVideoAutoplay(container);

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

      if (el.closest("[data-barba-prevent]")) return true;

      // Polylang suele usar .lang-item (y a veces .pll-parent-menu-item)
      if (el.closest(".lang-item, .pll-parent-menu-item, .pll-switcher"))
        return true;

      const norm = (p) => (p || "").replace(/\/+$/, "") || "/";
      return current && next && norm(current.url.path) === norm(next.url.path);
    },

    transitions: [
      {
        name: "minimal-fade",

        once({ next }) {
          // ✅ pre-hide SIEMPRE el container en once (evita flash al quitar el overlay)
          prepEnter(next.container); // pone autoAlpha:0 :contentReference[oaicite:2]{index=2}
          next.__revealItems = prepRevealEnter(next.container); // prepara clip/y/opacity :contentReference[oaicite:3]{index=3}

          const ns = getNamespace(next);
          const isHome = ns === "home";
          const isFirstVisit = !storageGet("preloaderShown");

          const runReveal = () =>
            new Promise((resolve) => {
              // ✅ ahora sí: mostramos el container cuando ya está todo preparado
              gsap.set(next.container, { autoAlpha: 1 });

              const items =
                next.__revealItems || prepRevealEnter(next.container);
              const tl = gsap.timeline({ delay: 0.0, onComplete: resolve });

              tl.to(items, {
                clipPath: "inset(0% 0% 0% 0%)",
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power2.out",
                stagger: { each: 0.06, from: "start" },
              });
            });

          // ✅ Preloader solo 1ª visita en HOME
          if (isFirstVisit && isHome) {
            // 🔥 marca el flag ANTES (si el loader peta, no quedas en loop)
            storageSet("preloaderShown", "true");

            return new Promise((resolve) => {
              let done = false;
              const finish = async () => {
                if (done) return;
                done = true;
                await runReveal();
                resolve();
              };

              // ✅ safety: evita quedarte colgada si algo falla
              const safety = setTimeout(() => {
                console.warn("[Preloader] safety timeout → continue");
                finish();
              }, 8500);

              try {
                initLogoRevealLoader({
                  onHideStart: () => {
                    // ⏱ pequeño delay antes de mostrar el contenido
                    revealTimeout = gsap.delayedCall(0.18, () => {
                      runReveal();
                    });
                  },
                  onComplete: () => {
                    clearTimeout(safety);
                    resolve();
                  },
                  onSkip: () => {
                    clearTimeout(safety);
                    // si el usuario skipea, entra ya (sin delay)
                    revealTimeout?.kill?.();
                    runReveal();
                    resolve();
                  },
                });
              } catch (e) {
                console.error("[Preloader] init error:", e);
                clearTimeout(safety);
                finish();
              }
            });
          }

          // ✅ Si no hay preloader, tu reveal normal
          return runReveal();
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

          gsap.killTweensOf(current.container);
          gsap.killTweensOf(current.container.querySelectorAll("*"));

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

          if (!lenis) {
            lenis = initLenis();
          }
          lenis.resize();
          lenis.scrollTo(0, { immediate: true });

          gsap.killTweensOf(container);
          gsap.killTweensOf(container.querySelectorAll("*"));

          prepEnter(container);
          next.__revealItems = prepRevealEnter(container);

          // 👇 aquí ya hacemos el cleanup de la página anterior y luego inits nuevos
          runInitsFor(container);
        },

        async enter({ next }) {
          gsap.set(next.container, { autoAlpha: 1 });

          await animateRevealEnter(next.__revealItems, next.container, {
            duration: 0.9,
            ease: "power2.out",
          });

          next.container.style.removeProperty("z-index");
        },
      },
    ],
  });

  barba.hooks.after((data) => {
    // ✅ actualiza el switcher con el HTML de la siguiente página
    updateLanguageToggleFromNextHTML(data?.next?.html);

    try {
      window.gsap?.ScrollTrigger?.refresh?.(true);
    } catch {}
  });
}

function kickstartVideoAutoplay(root = document) {
  const videos = Array.from(
    root.querySelectorAll(
      ".block-hero-home__video, .gallery-slider__video, .masonry-item__visual video"
    )
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

export function initActiveNavBarba() {
  const navRoots = document.querySelectorAll(".nav-rail, .fullscreen-menu");

  const normalizePath = (href) => {
    try {
      const u = new URL(href, window.location.origin);
      let p = u.pathname || "/";
      // quitar trailing slash excepto home
      if (p.length > 1) p = p.replace(/\/$/, "");
      return p;
    } catch (e) {
      return null;
    }
  };

  const setActive = () => {
    const current = normalizePath(window.location.href);

    navRoots.forEach((root) => {
      // limpia
      root
        .querySelectorAll("li.is-active")
        .forEach((li) => li.classList.remove("is-active"));

      // encuentra mejor match por pathname
      const links = [...root.querySelectorAll("a[href]")];

      let best = null;
      let bestLen = -1;

      links.forEach((a) => {
        const p = normalizePath(a.getAttribute("href"));
        if (!p) return;

        // match exacto
        if (p === current) {
          best = a;
          bestLen = p.length;
          return;
        }

        // match por prefijo para singles (ej /proyectos/slug -> /proyectos)
        if (current.startsWith(p + "/") && p.length > bestLen) {
          best = a;
          bestLen = p.length;
        }
      });

      if (best) {
        const li = best.closest("li");
        if (li) li.classList.add("is-active");
      }
    });

    // HOME / logo (si quieres)
    const brand = document.querySelector(".nav-rail__brand");
    if (brand) {
      brand.classList.toggle(
        "is-active",
        normalizePath(window.location.href) === "/"
      );
    }
  };

  // primera carga
  setActive();

  // con Barba: después de cada navegación
  if (window.barba && window.barba.hooks) {
    window.barba.hooks.after(() => setActive());
  } else {
    // fallback sin barba
    window.addEventListener("popstate", setActive);
  }
}
