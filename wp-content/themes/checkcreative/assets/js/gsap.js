import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, Draggable, SplitText);

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initDescriptionPin(scope = document) {
  if (prefersReducedMotion()) return;
  const section = scope.querySelector(".block-description");
  if (!section) return;

  const allImages = section.querySelectorAll(".block-description__img");
  if (!allImages.length) return;

  const heading = section.querySelector("[data-highlight-text]");

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  // 👉 En móvil animamos menos imágenes
  const images = isMobile
    ? Array.from(allImages) // solo 2 primeras
    : Array.from(allImages);

  gsap.set(images, {
    willChange: "transform",
    transformOrigin: "50% 50%",
    force3D: true,
  });

  gsap.set(section, {
    transformStyle: "preserve-3d",
  });

  const yShift = [-70, -80, 90, 130];
  const xShift = [-300, 200, -130, 150];
  const rot = [-6, 4, -3, 5];
  const yShiftMob = [-80, -80, 90, 130];
  const xShiftMob = [-120, 190, -120, 140];

  const SECTION_DURATION = 1; // Duración lógica de toda la animación

  // 🔥 UN SOLO TIMELINE PARA TODO (sin matchMedia)
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: isMobile ? "top 20%" : "top top",
      end: isMobile ? "+=40%" : "+=50%", // un poco menos scroll en mobile
      pin: isMobile ? false : true,
      scrub: isMobile ? 0.1 : 0.6, // scrub más suave
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // markers: true,
    },
  });

  // 🎞️ Imágenes
  images.forEach((img, i) => {
    const idx = i % 4;
    tl.to(
      img,
      {
        x: isMobile ? `+=${xShiftMob[idx]}` : `+=${xShift[idx]}`,
        y: isMobile ? `+=${yShiftMob[idx]}` : `+=${yShift[idx]}`,
        rotation: `+=${rot[idx]}`,
        scale: 1.06,
        opacity: 1,
        duration: SECTION_DURATION,
      },
      0, // todas empiezan desde el inicio del timeline
    );
  });

  // ✨ Texto highlight sincronizado
  if (heading) {
    const fadedValue = heading.getAttribute("data-highlight-fade") || 0.2;
    const staggerValue = heading.getAttribute("data-highlight-stagger") || 0.1;

    const split = new SplitText(heading, {
      type: "words, chars",
      autoSplit: true,
    });

    // Estado inicial: ya empezamos “bajitas” de opacidad
    gsap.set(split.chars, {
      autoAlpha: fadedValue,
    });

    tl.to(
      split.chars,
      {
        autoAlpha: 1,
        ease: "linear",
        stagger: {
          each: staggerValue,
          amount: SECTION_DURATION,
        },
      },
      0,
    );
  }

  // Refresh al cargar
  const onLoadRefresh = () => ScrollTrigger.refresh();
  window.addEventListener("load", onLoadRefresh, { once: true });
}

export function initHeroParallax(scope = document) {
  if (prefersReducedMotion()) return;
  const section = scope.querySelector(".block-hero-home");
  if (!section) return;

  const video = section.querySelector(".block-hero-home__video");
  const title = section.querySelector(".block-hero-home__title");
  if (!video) return;

  // Preparación para rendimiento y evitar bordes al mover
  //   gsap.set(video, {
  //     yPercent: -15, // arranca un poco arriba
  //     scale: 1.1, // zoom leve para cubrir al mover
  //     willChange: "transform",
  //     transformOrigin: "50% 50%",
  //   });

  if (title) {
    gsap.set(title, { willChange: "transform" });
  }

  // Timeline de parallax durante el scroll del hero
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom top", // efecto mientras el hero sale de pantalla
      scrub: 0.6,
      markers: false,
    },
  });

  // Vídeo baja ~20% en total (de -10% a +10%)
  //   tl.to(video, { yPercent: 50 }, 0);

  // Contra-parallax suave del título (sube un poco)
  if (title) {
    tl.fromTo(title, { yPercent: 0 }, { yPercent: -40 }, 0);
  }

  // Si el video tarda en cargar, refresca los triggers
  const refresh = () => ScrollTrigger.refresh();
  video.addEventListener("loadeddata", refresh, { once: true });
  window.addEventListener("load", refresh, { once: true });
}

export function initBestProjectsPin(scope = document) {
  if (prefersReducedMotion()) return;
  const section = scope.querySelector(".block-best-projects");
  if (!section) return;

  const content = section.querySelector(".block-best-projects__content");
  if (!content) return;

  const items = gsap.utils.toArray(".block-best-projects__item", section);
  if (!items.length) return;

  const maxScrollY = () =>
    Math.max(1, content.scrollHeight - window.innerHeight);

  // snaps normalizados [0..1] al centro visual de cada item
  let snaps = [];
  function computeSnaps() {
    // mide con el content sin transformar
    gsap.set(content, { y: 0 });

    const vh = window.innerHeight;
    const sectionTop = section.getBoundingClientRect().top; // base de referencia
    const maxY = maxScrollY();

    snaps = items.map((el) => {
      const r = el.getBoundingClientRect();
      const elCenter = r.top + r.height / 2;

      // cuánto tendría que desplazar content (en px) para poner ese centro en el centro del viewport
      const yAtCenter = elCenter - sectionTop - vh / 2;

      // normaliza a progreso 0..1 del ScrollTrigger
      return gsap.utils.clamp(0, 1, yAtCenter / maxY);
    });
  }

  function focusNearest() {
    const center = window.innerHeight / 2;
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const dist = Math.abs(itemCenter - center);
      const scale = gsap.utils.clamp(0.9, 1.08, 1.08 - (dist / center) * 0.18);
      const opacity = gsap.utils.clamp(0.6, 1, 1 - (dist / center) * 0.4);
      gsap.to(item, { scale, opacity, duration: 0.2, overwrite: true });
    });
  }

  computeSnaps();

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${maxScrollY()}`,
      pin: true,
      scrub: 0.6,
      snap: {
        snapTo: (value) => gsap.utils.snap(snaps, value), // usa centros reales
        duration: 0.25,
        ease: "power1.inOut",
      },
      invalidateOnRefresh: true,
      onUpdate: () => focusNearest(),
      anticipatePin: 1,
      // markers: true,
    },
  });

  tl.to(content, { y: () => -maxScrollY() });

  // Recalcula medidas tras resize/refresh (clave para 1ª y 3ª card)
  ScrollTrigger.addEventListener("refreshInit", () => {
    gsap.set(content, { clearProps: "y" });
    computeSnaps();
  });
  ScrollTrigger.refresh();
}

export function initAboutHero(scope = document) {
  const section = scope.querySelector(".block-hero-about");
  if (!section) return;

  const imageWrap = section.querySelector(".block-hero-about__image-wrap");
  const image = section.querySelector(".block-hero-about__image");
  if (!imageWrap || !image) return;

  gsap.set(imageWrap, {
    position: "absolute",
    top: "50%",
    left: "50%",
    xPercent: -50,
    yPercent: -50,
    overflow: "hidden",
    width: "346px",
    height: "auto",
  });

  gsap.set(image, {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top", // 👈 empieza cuando el bloque entra en el viewport
      end: "bottom top",
      scrub: 0.6,
    },
  });

  tl.fromTo(
    imageWrap,
    {
      yPercent: -50,
      width: "346px",
      height: "400px",
    },
    {
      yPercent: 92,
      width: "100vw",
      height: "50vh",
      ease: "power1.out",
    },
    0,
  );

  tl.fromTo(
    image,
    { yPercent: -5, scale: 1.05 },
    { yPercent: 0, scale: 1, ease: "power2.out", duration: 1 },
    0,
  );
}

export function imageParallax(scope = document, options = {}) {
  if (prefersReducedMotion()) return;
  const {
    selector = '[data-parallax], [data-image="parallax"]',
    defaultAmount = 340, // px de desplazamiento total (mitad arriba, mitad abajo)
    defaultAxis = "y", // 'y' | 'x'
    start = "top bottom", // empieza cuando el elemento entra en el viewport
    end = "bottom top", // termina cuando sale
    scrub = 0.6,
    scroller = null, // si usas un scroller custom (Lenis), pásalo aquí
  } = options;

  const $els = Array.from(scope.querySelectorAll(selector));
  if (!$els.length) return [];

  // Integración opcional con Lenis u otro scroller
  if (scroller) {
    ScrollTrigger.scrollerProxy(scroller, {
      scrollTop(value) {
        return arguments.length
          ? scroller.scrollTo(value, { immediate: true })
          : scroller.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.body.style.transform ? "transform" : "fixed",
    });
    // Asegura actualización cuando el scroller emite
    scroller.on("scroll", () => ScrollTrigger.update());
  }

  const triggers = [];

  $els.forEach((el) => {
    // Lee opciones por data-attributes
    const axis = (
      el.getAttribute("data-parallax-axis") || defaultAxis
    ).toLowerCase();
    const amount =
      parseFloat(el.getAttribute("data-parallax-amount")) || defaultAmount;

    // Estado inicial neutro
    gsap.set(el, {
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
    });
    // Calcula desde/hasta: mueve medio hacia arriba y acaba medio hacia abajo (o a la inversa)
    const fromProps = axis === "x" ? { x: -amount / 2 } : { y: -amount / 2 };
    const toProps = axis === "x" ? { x: amount / 2 } : { y: amount / 2 };

    const tween = gsap.fromTo(el, fromProps, {
      ...toProps,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub,
        // scroller, // descomenta si usas un contenedor scrolleable específico
        // markers: true,
        invalidateOnRefresh: true,
      },
    });

    triggers.push(tween.scrollTrigger);
  });

  // Devuelve utilidades por si quieres destruir/reinicializar
  return {
    refresh: () => ScrollTrigger.refresh(),
    kill: () => triggers.forEach((t) => t && t.kill()),
  };
}

export function initGallerySlider(root = document) {
  const container = root.querySelector(".block-single-gallery");
  const viewport = root.querySelector(".gallery-slider__viewport");
  const track = viewport?.querySelector("[data-slider-track]");
  if (!viewport || !track || !container) return;

  const slides = Array.from(track.children);

  const getGap = () => {
    const cs = getComputedStyle(track);
    return parseFloat(cs.gap || cs.columnGap || 0);
  };

  const measure = () => {
    const gap = getGap();
    const trackW = track.scrollWidth;
    const contW = container.clientWidth;
    const minX = Math.min(contW - trackW, 0);
    const maxX = 0;

    let acc = 0;
    const snaps = slides.map((slide) => {
      const x = -acc;
      const clamped = Math.max(Math.min(x, maxX), minX);
      acc += slide.offsetWidth + gap;
      return clamped;
    });

    return { minX, maxX, snaps };
  };

  let state = measure();
  let clampX = gsap.utils.clamp(state.minX, state.maxX);

  gsap.set(track, { x: 0, willChange: "transform" });

  const snapToNearest = () => {
    const currentX = clampX(gsap.getProperty(track, "x"));
    const nearest = gsap.utils.snap(state.snaps, currentX);
    gsap.to(track, {
      x: nearest,
      duration: 0.5,
      ease: "power3.out",
      onUpdate: () => draggable.update(),
    });
  };

  const draggable = Draggable.create(track, {
    type: "x",
    bounds: { minX: state.minX, maxX: state.maxX },
    inertia: false,
    allowContextMenu: false,
    allowNativeTouchScrolling: true,
    dragResistance: 0.15,
    edgeResistance: 0.85,
    cursor: "grab",
    activeCursor: "grabbing",
    onDragEnd() {
      snapToNearest();
    },
  })[0];

  // Click -> snap a esa slide (si no estás arrastrando)
  slides.forEach((slide, i) => {
    slide.addEventListener("click", () => {
      if (draggable.isDragging || draggable.isPressed) return;
      gsap.to(track, {
        x: state.snaps[i],
        duration: 0.5,
        ease: "power3.out",
        onUpdate: () => draggable.update(),
      });
    });
  });

  // -------------------------
  // WHEEL / TRACKPAD SCROLL
  // -------------------------
  let wheelSnapTimer = null;

  const onWheel = (e) => {
    if (draggable.isDragging || draggable.isPressed) return;

    const ax = Math.abs(e.deltaX);
    const ay = Math.abs(e.deltaY);

    // 1) Deadzone: ignora micro movimientos
    const DEAD = 2;
    if (ax < DEAD && ay < DEAD) return;

    // 2) Solo consideramos horizontal si:
    //    - hay deltaX real (trackpad / wheel horizontal), y además domina al vertical
    //    - o el usuario mantiene SHIFT (convierte wheel vertical a horizontal)
    const hasRealHorizontal = ax > 0;
    const intentHorizontal = hasRealHorizontal && ax > ay * 1.2; // ratio anti-amago
    const shiftHorizontal = e.shiftKey && ay > 0;

    // Si no hay intención horizontal, dejamos el scroll normal de la página
    if (!intentHorizontal && !shiftHorizontal) return;

    // Si vamos a mover el slider, consumimos el wheel
    e.preventDefault();

    // delta a aplicar
    const delta = intentHorizontal ? e.deltaX : e.deltaY;

    // 3) Sensibilidad: multiplica por un factor < 1
    const SENS = 0.6; // baja a 0.4 si lo quieres aún menos sensible
    const move = delta * SENS;

    const current = gsap.getProperty(track, "x");
    const next = clampX(current - move); // cambia signo si lo quieres al revés

    gsap.killTweensOf(track);
    gsap.set(track, { x: next });
    draggable.update();

    clearTimeout(wheelSnapTimer);
    wheelSnapTimer = setTimeout(() => {
      snapToNearest();
    }, 140);
  };

  // --- Anti back/forward swipe del navegador (trackpad) ---
  // capture:true para ganarle al gesto del browser
  const stopHistorySwipe = (e) => {
    if (draggable.isDragging || draggable.isPressed) return;

    const ax = Math.abs(e.deltaX || 0);
    const ay = Math.abs(e.deltaY || 0);

    const DEAD = 2;
    if (ax < DEAD && ay < DEAD) return;

    const hasRealHorizontal = ax > 0;
    const intentHorizontal = hasRealHorizontal && ax > ay * 1.2;
    const shiftHorizontal = e.shiftKey && ay > 0;

    // Importante: SOLO preventDefault (NO stopPropagation)
    if (intentHorizontal || shiftHorizontal) {
      e.preventDefault();
    }
  };

  viewport.addEventListener("wheel", stopHistorySwipe, {
    passive: false,
    capture: true,
  });

  // tu handler que mueve el slider
  viewport.addEventListener("wheel", onWheel, { passive: false });

  // -------------------------
  // RESIZE / IMAGES LOAD
  // -------------------------
  const resize = () => {
    state = measure();
    clampX = gsap.utils.clamp(state.minX, state.maxX);

    draggable?.applyBounds({ minX: state.minX, maxX: state.maxX });

    const current = clampX(gsap.getProperty(track, "x"));
    gsap.set(track, { x: current });
    draggable?.update();
  };

  const imgs = Array.from(track.querySelectorAll("img"));

  // 1) Recalcula en los próximos frames (por si Elementor/Fonts/layout tardan)
  requestAnimationFrame(resize);
  requestAnimationFrame(resize);
  setTimeout(resize, 200);

  // 2) Si ya están cargadas, también recalcula
  if (imgs.some((img) => img.complete)) resize();

  // 3) Espera a que todas carguen (incluye error para no colgarse)
  const waitImgs = Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((r) => {
            img.addEventListener("load", r, { once: true });
            img.addEventListener("error", r, { once: true });
          }),
    ),
  );

  waitImgs.then(resize);

  // 4) Mantén listeners por si hay lazy-load tardío
  imgs.forEach((img) => img.addEventListener("load", resize));
}

export function initHighlightText(scope = document) {
  let splitHeadingTargets = scope.querySelectorAll("[data-highlight-text]");
  splitHeadingTargets.forEach((heading) => {
    if (heading.closest(".block-description")) return;

    const scrollStart =
      heading.getAttribute("data-highlight-scroll-start") || "top 90%";
    const scrollEnd =
      heading.getAttribute("data-highlight-scroll-end") || "center 40%";
    const fadedValue = heading.getAttribute("data-highlight-fade") || 0.2; // Opacity of letter
    const staggerValue = heading.getAttribute("data-highlight-stagger") || 0.1; // Smoother reveal

    new SplitText(heading, {
      type: "words, chars",
      autoSplit: true,
      onSplit(self) {
        let ctx = gsap.context(() => {
          let tl = gsap.timeline({
            scrollTrigger: {
              scrub: 0.4,
              trigger: heading,
              start: scrollStart,
              end: scrollEnd,
            },
          });
          tl.from(self.chars, {
            autoAlpha: fadedValue,
            stagger: staggerValue,
            ease: "linear",
          });
        });
        return ctx; // return our animations so GSAP can clean them up when onSplit fires
      },
    });
  });
}

export function stampCC(scope = document) {
  const text = scope.querySelector(
    ".block-single-objective__circle-stamp__text",
  );
  const circle = scope.querySelector(
    ".block-single-objective__circle-stamp",
  );

  if (!text || !circle) return;

  const radius = circle.offsetWidth / 2 - 12; // ajusta margen interior

  const chars = text.textContent.split("");
  text.textContent = ""; // limpiamos el contenido original

  chars.forEach((char, i) => {
    const span = document.createElement("span");
    span.className = "block-single-objective__rounded-text__char";
    span.textContent = char;

    const angle = (360 / chars.length) * i;

    span.style.transform = `
      rotate(${angle}deg)
      translate(${radius}px)
      rotate(90deg)
    `;

    circle.appendChild(span);
  });
}

export function initDirectionalListHover(scope = document) {
  const directionMap = {
    top: "translateY(-100%)",
    bottom: "translateY(100%)",
    left: "translateX(-100%)",
    right: "translateX(100%)",
  };

  scope.querySelectorAll("[data-directional-hover]").forEach((container) => {
    const type = container.getAttribute("data-type") || "all";

    // 👇 preview fijo dentro del container
    const preview = container.querySelector(".directional-hover-preview");
    const previewImg = preview?.querySelector("img");

    if (preview) {
      gsap.set(preview, {
        xPercent: -50,
        yPercent: -50,
        scale: 1,
      });
    }

    const movePreview = (event) => {
      if (!preview) return;

      const rect = container.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      gsap.to(preview, {
        x,
        y,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    container
      .querySelectorAll("[data-directional-hover-item]")
      .forEach((item) => {
        const tile = item.querySelector("[data-directional-hover-tile]");
        if (!tile) return;

        item.addEventListener("mouseenter", (e) => {
          const dir = getDirection(e, item, type);

          // ⭐ Cambiar imagen del preview según el item
          if (preview && previewImg) {
            const imgSrc = item.getAttribute("data-hover-image");
            if (imgSrc) {
              previewImg.src = imgSrc;
              movePreview(e);

              gsap.killTweensOf(preview);
              gsap.fromTo(
                preview,
                { opacity: 0, scale: 0.9 },
                {
                  opacity: 1,
                  scale: 1,
                  duration: 0.3,
                  ease: "power2.out",
                },
              );
            }
          }

          // tu efecto del tile
          tile.style.transition = "none";
          tile.style.transform = directionMap[dir] || "translate(0, 0)";
          void tile.offsetHeight;
          tile.style.transition = "";
          tile.style.transform = "translate(0%, 0%)";
          item.setAttribute("data-status", `enter-${dir}`);
        });

        item.addEventListener("mousemove", (e) => {
          movePreview(e);
        });

        item.addEventListener("mouseleave", (e) => {
          const dir = getDirection(e, item, type);
          item.setAttribute("data-status", `leave-${dir}`);
          tile.style.transform = directionMap[dir] || "translate(0, 0)";

          if (preview) {
            gsap.to(preview, {
              opacity: 0,
              scale: 0.9,
              duration: 0.25,
              ease: "power2.inOut",
            });
          }
        });
      });

    function getDirection(event, el, type) {
      const { left, top, width: w, height: h } = el.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;

      if (type === "y") return y < h / 2 ? "top" : "bottom";
      if (type === "x") return x < w / 2 ? "left" : "right";

      const distances = {
        top: y,
        right: w - x,
        bottom: h - y,
        left: x,
      };

      return Object.entries(distances).reduce((a, b) =>
        a[1] < b[1] ? a : b,
      )[0];
    }
  });
}

export function initFooterParallax() {
  const elements = document.querySelectorAll("[data-footer-parallax]");

  if (!elements.length) {
    return;
  }

  const elementsArray = Array.from(elements);

  // 1) Matar SOLO los ScrollTriggers cuyo trigger sea uno de estos footers
  ScrollTrigger.getAll().forEach((st) => {
    const trig = st.trigger;
    if (trig && elementsArray.includes(trig)) {
      st.kill();
    }
  });

  // 2) Crear nuevos ScrollTriggers para este container
  elementsArray.forEach((el, index) => {
    const inner = el.querySelector("[data-footer-parallax-inner]");
    const dark = el.querySelector("[data-footer-parallax-dark]");

    if (!inner && !dark) {
      console.warn(
        "[FooterParallax] No inner/dark found. Skipping this element.",
      );
      return;
    }

    // 🔥 MUY IMPORTANTE: matar cualquier tween anterior en estos elementos
    if (inner) gsap.killTweensOf(inner);
    if (dark) gsap.killTweensOf(dark);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "clamp(top bottom)",
        end: "clamp(top top)",
        scrub: 0.4,
        //   markers: true, // quita luego
        invalidateOnRefresh: true,
      },
    });

    if (inner) {
      tl.fromTo(
        inner,
        { yPercent: -25 },
        {
          yPercent: 0,
          ease: "linear",
          overwrite: "auto",
        },
      );
    }

    if (dark) {
      tl.fromTo(
        dark,
        { opacity: 0.5 },
        {
          opacity: 0,
          ease: "linear",
          overwrite: "auto",
        },
        "<",
      );
    }
  });

  // Nada de refresh aquí: Barba ya refresca.
}

export function initMasonryGrid(scope = document) {
  const containers = scope.querySelectorAll("[data-masonry-list]");

  // 🛑 Guard: no hay masonry en esta vista
  if (!containers.length) {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[Masonry] No data-masonry-list found, skipping");
    }
    return;
  }

  containers.forEach((container) => {
    const shuffle = container.dataset.masonryShuffle !== "false";
    let cols, gapPx, colHeights;

    /* ------------------------------
       Read CSS vars safely
    ------------------------------ */
    const getVars = () => {
      const cs = getComputedStyle(container);

      cols = parseInt(cs.getPropertyValue("--masonry-col"));

      // 🛑 Guard crítico
      if (!cols || Number.isNaN(cols)) {
        console.warn("[Masonry] Invalid --masonry-col on element:", container);
        return false;
      }

      const rawGap = cs.getPropertyValue("--masonry-gap").trim();

      if (rawGap.endsWith("px")) {
        gapPx = parseFloat(rawGap);
      } else if (rawGap.endsWith("em")) {
        gapPx = parseFloat(rawGap) * parseFloat(cs.fontSize);
      } else if (rawGap.endsWith("rem")) {
        gapPx =
          parseFloat(rawGap) *
          parseFloat(getComputedStyle(document.documentElement).fontSize);
      } else {
        gapPx = parseFloat(rawGap) || 0;
      }

      return true;
    };

    /* ------------------------------
       Layout
    ------------------------------ */
    const layout = () => {
      if (!getVars()) return;

      const wCalc = `(100% - ${cols - 1}*var(--masonry-gap)) / ${cols}`;
      colHeights = Array(cols).fill(0);

      container.style.position = "relative";

      const items = Array.from(container.children);

      items.forEach((el) => {
        el.style.position = "absolute";
        el.style.width = `calc(${wCalc})`;
      });

      items.forEach((el, i) => {
        const h = el.offsetHeight;
        const idx = shuffle
          ? colHeights.indexOf(Math.min(...colHeights))
          : i % cols;

        el.style.top = `${colHeights[idx]}px`;
        el.style.left = `calc(${wCalc}*${idx} + var(--masonry-gap)*${idx})`;
        colHeights[idx] += h + gapPx;
      });

      container.style.height = `${Math.max(...colHeights)}px`;
    };

    /* ------------------------------
       Debounce helpers
    ------------------------------ */
    const debounce = (fn, delay) => {
      let t;
      return () => {
        clearTimeout(t);
        t = setTimeout(fn, delay);
      };
    };

    const onResize = debounce(layout, 100);
    window.addEventListener("resize", onResize);

    /* ------------------------------
       Image load watcher
    ------------------------------ */
    const debouncedLayout = debounce(layout, 50);
    const imgLoad = () => {
      container.querySelectorAll("img").forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", debouncedLayout, { once: true });
          img.addEventListener("error", debouncedLayout, { once: true });
        }
      });
    };

    /* ------------------------------
       Init
    ------------------------------ */
    layout();
    imgLoad();

    /* ------------------------------
       Public API (cleanup friendly)
    ------------------------------ */
    container._masonry = {
      recalc: () => {
        layout();
        imgLoad();
      },
      destroy: () => {
        window.removeEventListener("resize", onResize);

        Array.from(container.children).forEach((el) => {
          el.style.position =
            el.style.width =
            el.style.top =
            el.style.left =
              "";
        });

        container.style.position = "";
        container.style.height = "";
      },
    };
  });

  return () => {
    containers.forEach((c) => c._masonry?.destroy());
  };
}

export function initBestProjectCards(scope = document) {
  const sliders = scope.querySelectorAll("[data-init-projects-cards]");

  sliders.forEach((slider) => {
    const list = slider.querySelector("[data-projects-cards-list]");
    const cards = Array.from(
      list.querySelectorAll("[data-projects-cards-project]"),
    );
    const total = cards.length;
    let activeIndex = 0;

    const sliderWidth = slider.offsetWidth;
    const threshold = 0.1;

    // Generate draggers inside each card and store references
    const draggers = [];
    cards.forEach((card) => {
      const dragger = document.createElement("div");
      dragger.setAttribute("data-projects-cards-dragger", "");
      card.appendChild(dragger);
      draggers.push(dragger);
    });

    // Set initial drag status
    slider.setAttribute("data-projects-drag-status", "grab");

    function getConfig(i, currentIndex) {
      let diff = i - currentIndex;
      if (diff > total / 2) diff -= total;
      else if (diff < -total / 2) diff += total;

      switch (diff) {
        case 0:
          return { x: 0, y: 0, rot: 0, s: 1, o: 1, z: 5 };
        case 1:
          return { x: 25, y: 1, rot: 10, s: 0.9, o: 1, z: 4 };
        case -1:
          return { x: -25, y: 1, rot: -10, s: 0.9, o: 1, z: 4 };
        case 2:
          return { x: 45, y: 5, rot: 15, s: 0.8, o: 1, z: 3 };
        case -2:
          return { x: -45, y: 5, rot: -15, s: 0.8, o: 1, z: 3 };
        default:
          const dir = diff > 0 ? 1 : -1;
          return { x: 55 * dir, y: 5, rot: 20 * dir, s: 0.6, o: 0, z: 2 };
      }
    }

    function renderCards(currentIndex) {
      cards.forEach((card, i) => {
        const cfg = getConfig(i, currentIndex);
        let status;

        if (cfg.x === 0) status = "active";
        else if (cfg.x === 25) status = "2-after";
        else if (cfg.x === -25) status = "2-before";
        else if (cfg.x === 45) status = "3-after";
        else if (cfg.x === -45) status = "3-before";
        else status = "hidden";

        card.setAttribute("data-projects-cards-item-status", status);
        card.style.zIndex = cfg.z;

        gsap.to(card, {
          duration: 0.6,
          ease: "elastic.out(1.2, 1)",
          xPercent: cfg.x,
          yPercent: cfg.y,
          rotation: cfg.rot,
          scale: cfg.s,
          opacity: cfg.o,
        });
      });
    }

    renderCards(activeIndex);

    if (total < 2) {
      return;
    }

    let pressClientX = 0;
    let pressClientY = 0;

    Draggable.create(draggers, {
      type: "x",
      edgeResistance: 0.8,
      bounds: { minX: -sliderWidth / 2, maxX: sliderWidth / 2 },
      inertia: false,

      onPress() {
        pressClientX = this.pointerEvent.clientX;
        pressClientY = this.pointerEvent.clientY;
        slider.setAttribute("data-projects-drag-status", "grabbing");
      },

      onDrag() {
        const rawProgress = this.x / sliderWidth;
        const progress = Math.min(1, Math.abs(rawProgress));
        const direction = rawProgress > 0 ? -1 : 1;
        const nextIndex = (activeIndex + direction + total) % total;

        cards.forEach((card, i) => {
          const from = getConfig(i, activeIndex);
          const to = getConfig(i, nextIndex);
          const mix = (prop) => from[prop] + (to[prop] - from[prop]) * progress;

          gsap.set(card, {
            xPercent: mix("x"),
            yPercent: mix("y"),
            rotation: mix("rot"),
            scale: mix("s"),
            opacity: mix("o"),
          });
        });
      },

      onRelease() {
        slider.setAttribute("data-projects-drag-status", "grab");

        const releaseClientX = this.pointerEvent.clientX;
        const releaseClientY = this.pointerEvent.clientY;
        const dragDistance = Math.hypot(
          releaseClientX - pressClientX,
          releaseClientY - pressClientY,
        );

        const raw = this.x / sliderWidth;
        let shift = 0;
        if (raw > threshold) shift = -1;
        else if (raw < -threshold) shift = 1;

        if (shift !== 0) {
          activeIndex = (activeIndex + shift + total) % total;
          renderCards(activeIndex);
        }

        gsap.to(this.target, {
          x: 0,
          duration: 0.3,
          ease: "power1.out",
        });

        if (dragDistance < 4) {
          // Temporarily allow clicks to pass through
          this.target.style.pointerEvents = "none";

          // Allow the DOM to register pointer-through
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const el = document.elementFromPoint(
                releaseClientX,
                releaseClientY,
              );
              if (el) {
                const evt = new MouseEvent("click", {
                  view: window,
                  bubbles: true,
                  cancelable: true,
                });
                el.dispatchEvent(evt);
              }

              // Restore pointer events
              this.target.style.pointerEvents = "auto";
            });
          });
        }
      },
    });
  });
}

export function initStackingCards(scope = document) {
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  const container = scope.querySelector("[data-stacking-cards]");
  if (!container) return;

  const cards = container.querySelectorAll("[data-stacking-cards-item]");
  if (cards.length < 2) return;

  const descs = container.querySelectorAll("[data-stacking-cards-desc]");
  if (!descs.length) return;

  const imgs = container.querySelectorAll("[data-stacking-cards-image]");
  if (!imgs.length) return;

  const cta = container.querySelector("[data-stacking-cards-cta]");

  const spacer = scope.querySelector("[data-stacking-cards-spacer]");
  // desktop/base
  const BASE_STEP = -65;
  const BASE_HEIGHT = 430;
  const MOBILE_HEIGHT = 420;

  const STEP = isMobile
    ? BASE_STEP * (BASE_HEIGHT / MOBILE_HEIGHT) // ≈ -75.5
    : BASE_STEP;
  const SCROLL_PER_CARD = 0.9;

  const getScrollAmount = () =>
    (cards.length - 1) * window.innerHeight * SCROLL_PER_CARD;

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: container,
      start: "top 12%",
      end: () => "+=" + getScrollAmount(),
      scrub: 0.4,
      pin: true,
      pinSpacing: false,
      invalidateOnRefresh: true,
      onRefresh: (self) => {
        const amount = getScrollAmount();

        const containerHeight = container.offsetHeight;
        const viewport = window.innerHeight;

        // scroll "natural" que ya consumiría esa sección sin pin
        const naturalScroll = Math.max(containerHeight - viewport, 0);

        // solo el extra que queremos añadir por el efecto
        const MAX_SPACER = 1100; // tú ajustas

        const extraScroll = Math.max(
          Math.min(amount - naturalScroll, MAX_SPACER),
          0,
        );

        if (spacer) {
          spacer.style.height = extraScroll + "px";
        }

        self.end = self.start + amount;
      },
      // markers: true,
    },
  });

  cards.forEach((card, i) => {
    const desc = descs[i];
    const img = imgs[i];

    desc.setAttribute("aria-hidden", "true");

    if (desc) {
      const fadedValue =
        parseFloat(desc.getAttribute("data-highlight-fade")) || 0.2;
      const staggerValue =
        parseFloat(desc.getAttribute("data-highlight-stagger")) || 0.06;

      const split = new SplitText(desc, {
        type: "words,chars",
        autoSplit: true,
      });

      tl.from(split.chars, {
        autoAlpha: fadedValue,
        stagger: staggerValue,
        duration: 0.4,
        ease: "linear",
      });
    }

    tl.from(
      img,
      {
        height: 0,
        duration: 0.8,
        ease: "power4.inOut",
      },
      "<",
    );

    const nextCard = cards[i + 1];
    if (nextCard) {
      tl.to(nextCard, {
        yPercent: STEP * (i + 1),
        duration: 1.1,
      });
    }
  });
  if (cta && cards.length) {
    const lastIndex = cards.length - 1;

    tl.to(
      cta,
      {
        yPercent: STEP * lastIndex,
      },
      0, // para que se vaya recolocando durante toda la animación
    );
  }

  ScrollTrigger.refresh();
}

export function initTabSystem(scope = document) {
  const wrappers = scope.querySelectorAll('[data-tabs="wrapper"]');

  wrappers.forEach((wrapper) => {
    const contentItems = wrapper.querySelectorAll('[data-tabs="content-item"]');

    const autoplay = wrapper.dataset.tabsAutoplay === "true";
    const autoplayDuration =
      parseInt(wrapper.dataset.tabsAutoplayDuration) || 5000;

    let activeContent = null; // keep track of active item/link
    let isAnimating = false;
    let progressBarTween = null; // to stop/start the progress bar

    function startProgressBar(index) {
      if (progressBarTween) progressBarTween.kill();
      const bar = contentItems[index].querySelector(
        '[data-tabs="item-progress"]',
      );
      if (!bar) return;

      // In this function, you can basically do anything you want, that should happen as a tab is active
      // Maybe you have a circle filling, some other element growing, you name it.
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      progressBarTween = gsap.to(bar, {
        scaleX: 1,
        duration: autoplayDuration / 1000,
        ease: "power1.inOut",
        onComplete: () => {
          if (!isAnimating) {
            const nextIndex = (index + 1) % contentItems.length;
            switchTab(nextIndex); // once bar is full, set next to active – this is important
          }
        },
      });
    }

    function switchTab(index) {
      if (isAnimating || contentItems[index] === activeContent) return;

      isAnimating = true;
      if (progressBarTween) progressBarTween.kill(); // Stop any running progress bar here

      const outgoingContent = activeContent;
      const outgoingBar = outgoingContent?.querySelector(
        '[data-tabs="item-progress"]',
      );

      const incomingContent = contentItems[index];
      const incomingBar = incomingContent.querySelector(
        '[data-tabs="item-progress"]',
      );

      outgoingContent?.classList.remove("active");
      incomingContent.classList.add("active");

      const tl = gsap.timeline({
        defaults: { duration: 0.65, ease: "power3" },
        onComplete: () => {
          activeContent = incomingContent;
          isAnimating = false;
          if (autoplay) startProgressBar(index); // Start autoplay bar here
        },
      });

      // Wrap 'outgoing' in a check to prevent warnings on first run of the function
      // Of course, during first run (on page load), there's no 'outgoing' tab yet!
      if (outgoingContent) {
        outgoingContent.classList.remove("active");
        tl.set(outgoingBar, { transformOrigin: "right center" })
          .to(outgoingBar, { scaleX: 0, duration: 0.3 }, 0)
          .to(
            outgoingContent.querySelector('[data-tabs="item-details"]'),
            { height: 0 },
            0,
          );
      }

      incomingContent.classList.add("active");
      tl.fromTo(
        incomingContent.querySelector('[data-tabs="item-details"]'),
        { height: 0 },
        { height: "auto" },
        0,
      ).set(incomingBar, { scaleX: 0, transformOrigin: "left center" }, 0);
    }

    // Activate first tab when section enters viewport (only if autoplay, to avoid
    // the progress bar ticking while the section is offscreen)
    if (autoplay) {
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top 85%",
        once: true,
        onEnter: () => switchTab(0),
      });
    } else {
      switchTab(0);
    }

    // switch tabs on click
    contentItems.forEach((item, i) =>
      item.addEventListener("click", () => {
        if (item === activeContent) return; // ignore click if current one is already active
        switchTab(i);
      }),
    );
  });
}

export function initScrollLine(scope = document) {
  const section = scope.querySelector("[data-line-scroll]");
  if (!section) return;

  const path = section.querySelector("#linea-trazo");
  if (!path) return;
  const length = path.getTotalLength();

  // Estado inicial “oculto”
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;

  gsap.to(path, {
    strokeDashoffset: 0,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top 70%", // cuando la sección entra en viewport
      end: "bottom 70%", // hasta casi salir
      scrub: 0.4, // ligado al scroll
      // markers: true,
    },
  });
}

export function initCSSMarquee(scope = document) {
  const pixelsPerSecond = 20; // velocidad en px/s
  const marquees = scope.querySelectorAll("[data-css-marquee]");

  // Duplicar cada [data-css-marquee-list] — guard para evitar clones al re-navegar
  marquees.forEach((marquee) => {
    if (marquee.querySelectorAll("[data-css-marquee-list]").length < 2) {
      marquee.querySelectorAll("[data-css-marquee-list]").forEach((list) => {
        marquee.appendChild(list.cloneNode(true));
      });
    }
  });

  // IntersectionObserver para pausar si no está en viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target
          .querySelectorAll("[data-css-marquee-list]")
          .forEach((list) => {
            list.style.animationPlayState = entry.isIntersecting
              ? "running"
              : "paused";
          });
      });
    },
    { threshold: 0 },
  );

  // Calcular ancho y fijar duración en función de la velocidad
  marquees.forEach((marquee) => {
    marquee.querySelectorAll("[data-css-marquee-list]").forEach((list) => {
      const width = list.offsetWidth;
      list.style.animationDuration = width / pixelsPerSecond + "s";
      list.style.animationPlayState = "paused";
    });

    observer.observe(marquee);
  });

  return () => observer.disconnect();
}

export function initContactGallery(scope = document) {
  const wrapper = scope.querySelector("[data-contact-gallery]");
  if (!wrapper) return;

  const images = wrapper.querySelectorAll(".block-contact__image");
  if (images.length <= 1) return;

  const TRANSITION_TIME = 1.1; // cuánto tarda en subir
  const DISPLAY_TIME = 3; // tiempo que cada imagen se queda en pantalla

  // Todas apiladas
  gsap.set(images, {
    position: "absolute",
    inset: 0,
  });

  // Estado inicial:
  // - primera: en pantalla (0, zIndex 2)
  // - resto: abajo (100, zIndex 1)
  images.forEach((img, index) => {
    gsap.set(img, {
      yPercent: index === 0 ? 0 : 100,
      zIndex: index === 0 ? 2 : 1,
    });
  });

  let currentIndex = 0;
  let currentCall = null;

  function goToNext() {
    const current = images[currentIndex];
    const nextIndex = (currentIndex + 1) % images.length;
    const next = images[nextIndex];

    // Preparamos la siguiente: abajo y por encima
    gsap.set(next, {
      yPercent: 100,
      zIndex: 3, // por encima de la actual
    });

    gsap.to(next, {
      yPercent: 0,
      duration: TRANSITION_TIME,
      ease: "power2.inOut",
      onComplete: () => {
        // Ahora next ya tapa completamente a current

        // teleport de la anterior hacia abajo, fuera de vista
        gsap.set(current, {
          yPercent: 100,
          zIndex: 1,
        });

        // normalizamos zIndex: todas al fondo, y la actual visible arriba
        images.forEach((img) => gsap.set(img, { zIndex: 1 }));
        gsap.set(next, { zIndex: 2 });

        currentIndex = nextIndex;

        // siguiente cambio tras DISPLAY_TIME
        currentCall = gsap.delayedCall(DISPLAY_TIME, goToNext);
      },
    });
  }

  // arrancamos tras dejar visible un rato la primera
  currentCall = gsap.delayedCall(DISPLAY_TIME, goToNext);

  return () => {
    if (currentCall) currentCall.kill();
    gsap.killTweensOf(images);
  };
}

export function initCSSMarqueeTestimonies(scope = document) {
  const pixelsPerSecond = 70;
  const marquees = scope.querySelectorAll("[data-css-marquee-testimonies]");
  const cleanups = [];

  marquees.forEach((marquee) => {
    const track = marquee.querySelector(".block-testimonies__marquee-track");
    const list = marquee.querySelector("[data-css-marquee-list-testimonies]");
    if (!track || !list) return;

    // Evitar duplicados
    if (
      track.querySelectorAll("[data-css-marquee-list-testimonies]").length < 2
    ) {
      track.appendChild(list.cloneNode(true));
    }

    const lists = () =>
      marquee.querySelectorAll("[data-css-marquee-list-testimonies]");

    let isInViewport = false;
    let isHovering = false;

    const updatePlayState = () => {
      const state = isInViewport && !isHovering ? "running" : "paused";
      lists().forEach((l) => (l.style.animationPlayState = state));
    };

    const setDuration = () => {
      const width = list.scrollWidth;
      if (!width) {
        requestAnimationFrame(setDuration);
        return;
      }

      const duration = width / pixelsPerSecond;
      lists().forEach((l) => {
        l.style.animationDuration = `${duration}s`;
      });
    };

    setDuration();
    window.addEventListener("resize", setDuration, { passive: true });

    // Hover
    marquee.addEventListener("mouseenter", () => {
      isHovering = true;
      updatePlayState();
    });

    marquee.addEventListener("mouseleave", () => {
      isHovering = false;
      updatePlayState();
    });

    // Viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInViewport = entry.isIntersecting;
          updatePlayState();
        });
      },
      { threshold: 0 },
    );

    observer.observe(marquee);

    // Estado inicial
    updatePlayState();

    cleanups.push(() => {
      window.removeEventListener("resize", setDuration);
      observer.disconnect();
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

export function initBoldFullScreenNavigation() {
  // Guard: el header persiste entre páginas, evitar acumulación de listeners
  document
    .querySelectorAll('[data-navigation-toggle="toggle"]')
    .forEach((toggleBtn) => {
      if (toggleBtn._navToggleAttached) return;
      toggleBtn._navToggleAttached = true;
      toggleBtn.addEventListener("click", () => {
        const navStatusEl = document.querySelector("[data-navigation-status]");
        if (!navStatusEl) return;
        if (navStatusEl.getAttribute("data-navigation-status") === "not-active") {
          navStatusEl.setAttribute("data-navigation-status", "active");
        } else {
          navStatusEl.setAttribute("data-navigation-status", "not-active");
        }
      });
    });

  document
    .querySelectorAll('[data-navigation-toggle="close"]')
    .forEach((closeBtn) => {
      if (closeBtn._navCloseAttached) return;
      closeBtn._navCloseAttached = true;
      closeBtn.addEventListener("click", () => {
        const navStatusEl = document.querySelector("[data-navigation-status]");
        if (!navStatusEl) return;
        navStatusEl.setAttribute("data-navigation-status", "not-active");
      });
    });

  // Cleanup: cerrar nav al navegar con Barba
  return () => {
    const navStatusEl = document.querySelector("[data-navigation-status]");
    if (navStatusEl) navStatusEl.setAttribute("data-navigation-status", "not-active");
  };
}
