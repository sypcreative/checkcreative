import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger, Draggable, SplitText);

export function initDescriptionPin() {
  const section = document.querySelector(".block-description");
  if (!section) return;

  const images = section.querySelectorAll(".block-description__img");
  if (!images.length) return;

  gsap.set(images, {
    willChange: "transform",
    transformOrigin: "50% 50%",
  });

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=180%",
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      markers: false,
    },
  });

  const yShift = [-70, -80, 90, 130];
  const xShift = [-300, 200, -130, 150];
  const rot = [-6, 4, -3, 5];

  images.forEach((img, i) => {
    const idx = i % 4;
    tl.to(
      img,
      {
        x: `+=${xShift[idx]}`,
        y: `+=${yShift[idx]}`,
        rotation: `+=${rot[idx]}`,
        scale: 1.06,
        opacity: 1,
      },
      0 // que todas empiecen a la vez; cambia por i*0.05 si quieres escalonado
    );
  });

  // Si las imágenes tardan en cargar (ACF), refresca triggers
  const onLoadRefresh = () => ScrollTrigger.refresh();
  window.addEventListener("load", onLoadRefresh, { once: true });
}

export function initHeroParallax() {
  const section = document.querySelector(".block-hero-home");
  if (!section) return;

  const video = section.querySelector(".block-hero-home__video");
  const title = section.querySelector(".block-hero-home__title");

  if (!video) return;

  // Preparación para rendimiento y evitar bordes al mover
  gsap.set(video, {
    yPercent: -15, // arranca un poco arriba
    scale: 1.1, // zoom leve para cubrir al mover
    willChange: "transform",
    transformOrigin: "50% 50%",
  });

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
  tl.to(video, { yPercent: 50 }, 0);

  // Contra-parallax suave del título (sube un poco)
  if (title) {
    tl.fromTo(title, { yPercent: 0 }, { yPercent: -40 }, 0);
  }

  // Si el video tarda en cargar, refresca los triggers
  const refresh = () => ScrollTrigger.refresh();
  video.addEventListener("loadeddata", refresh, { once: true });
  window.addEventListener("load", refresh, { once: true });

  // Respeta 'reduce motion' del usuario
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mq.matches) {
    ScrollTrigger.getAll().forEach((st) => st.disable());
    gsap.set([video, title], { clearProps: "transform" });
  }
}

export function initBestProjectsPin() {
  const section = document.querySelector(".block-best-projects");
  if (!section) return;

  const content = section.querySelector(".block-best-projects__content");
  if (!content) return;

  const items = gsap.utils.toArray(".block-best-projects__item");
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

// !! SI USO __item height: 100svh; USAR ESTA FUNCTION

// export function initBestProjectsPin() {
//   const section = document.querySelector(".block-best-projects");
//   if (!section) return;

//   const content = section.querySelector(".block-best-projects__content");
//   if (!content) return;

//   const items = gsap.utils.toArray(".block-best-projects__item");
//   if (!items.length) return;

//   const getScrollLen = () => {
//     const total = content.scrollHeight;
//     const vh = window.innerHeight;
//     return Math.max(1, total - vh);
//   };

//   const tl = gsap.timeline({
//     defaults: { ease: "none" },
//     scrollTrigger: {
//       trigger: section,
//       start: "top top",
//       end: () => `+=${getScrollLen()}`,
//       pin: true,
//       scrub: 0.6,
//       snap: {
//         snapTo: (value) =>
//           gsap.utils.snap(1 / Math.max(1, items.length - 1), value),
//         duration: 0.25,
//         ease: "power1.inOut",
//       },
//       invalidateOnRefresh: true,
//       onUpdate: (self) => focusNearest(self),
//       anticipatePin: 1,
//       markers: false,
//     },
//   });

//   tl.to(content, {
//     y: () => -(content.scrollHeight - window.innerHeight),
//   });

//   // Efecto de enfoque al elemento más cercano al centro de la pantalla
//   const focusNearest = () => {
//     const center = window.innerHeight / 2;

//     items.forEach((item) => {
//       const rect = item.getBoundingClientRect();
//       const itemCenter = rect.top + rect.height / 2;
//       const dist = Math.abs(itemCenter - center);

//       // Mapear distancia -> escala/opacidad:
//       // cuando dist=0 => scale 1.08 / opacity 1
//       // cuando dist= center => scale ~0.9 / opacity ~0.6
//       const scale = gsap.utils.clamp(0.9, 1.08, 1.08 - (dist / center) * 0.18);
//       const opacity = gsap.utils.clamp(0.6, 1, 1 - (dist / center) * 0.4);

//       gsap.to(item, { scale, opacity, duration: 0.2, overwrite: true });
//     });
//   };

//   // Recalcular al redimensionar
//   ScrollTrigger.addEventListener("refreshInit", () => {
//     gsap.set(content, { clearProps: "y" });
//   });
//   ScrollTrigger.refresh();
// }

export function initAboutHero() {
  const section = document.querySelector(".block-hero-about");
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
    0
  );

  tl.fromTo(
    image,
    { yPercent: -5, scale: 1.05 },
    { yPercent: 0, scale: 1, ease: "power2.out", duration: 1 },
    0
  );
}

export function imageParallax(options = {}) {
  const {
    selector = '[data-parallax], [data-image="parallax"]',
    defaultAmount = 340, // px de desplazamiento total (mitad arriba, mitad abajo)
    defaultAxis = "y", // 'y' | 'x'
    start = "top bottom", // empieza cuando el elemento entra en el viewport
    end = "bottom top", // termina cuando sale
    scrub = 0.6,
    scroller = null, // si usas un scroller custom (Lenis), pásalo aquí
  } = options;

  const $els = Array.from(document.querySelectorAll(selector));
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
  console.log("Iniciando gallery slider GSAP");
  const container = root.querySelector(".block-single-gallery");
  const viewport = root.querySelector(".gallery-slider__viewport");
  const track = viewport?.querySelector("[data-slider-track]");
  if (!viewport || !track) return;

  const slides = Array.from(track.children);
  const getGap = () => {
    const cs = getComputedStyle(track);
    // Bootstrap gap -> usa "gap" o "columnGap"
    return parseFloat(cs.gap || cs.columnGap || 0);
  };

  // Calcula límites y puntos de snap
  const measure = () => {
    const vw = viewport.clientWidth;
    const gap = getGap();
    const trackW = track.scrollWidth; // robusto con flex + gap
    const contW = container.clientWidth;
    const minX = Math.min(contW - trackW, 0); // hasta dónde puede arrastrar a la izquierda
    const maxX = 0;
    // puntos de snap: alinear cada slide con el borde izquierdo del viewport
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
  const clampX = gsap.utils.clamp(state.minX, state.maxX);

  // Estilos base para rendimiento
  gsap.set(track, { x: 0, willChange: "transform" });

  const draggable = Draggable.create(track, {
    type: "x",
    bounds: { minX: state.minX, maxX: state.maxX },
    inertia: false, // (si quieres inercia, necesitas InertiaPlugin)
    allowContextMenu: false,
    allowNativeTouchScrolling: true,
    dragResistance: 0.15,
    edgeResistance: 0.85,
    cursor: "grab",
    activeCursor: "grabbing",
    onDragEnd() {
      // Snap al punto más cercano
      const endX = clampX(this.x);
      const nearest = gsap.utils.snap(state.snaps, endX);
      gsap.to(track, { x: nearest, duration: 0.5, ease: "power3.out" });
    },
  })[0];

  // Click en slide (si no estás arrastrando) -> centra esa slide
  slides.forEach((slide, i) => {
    slide.addEventListener("click", () => {
      if (draggable.isDragging || draggable.isPressed) return;
      gsap.to(track, { x: state.snaps[i], duration: 0.5, ease: "power3.out" });
    });
  });

  // Recalcular en resize (también útil si cambian fuentes o imágenes cargan)
  const resize = () => {
    state = measure();
    draggable.applyBounds({ minX: state.minX, maxX: state.maxX });
    const current = clampX(gsap.getProperty(track, "x"));
    gsap.set(track, { x: current });
  };
  window.addEventListener("resize", resize);
  // Si las imágenes se cargan más tarde, vuelve a medir
  const imgs = track.querySelectorAll("img");
  imgs.forEach((img) => img.addEventListener("load", resize));
}

export function textAnimations(root = document, { exclude } = {}) {
  const EXCLUDE = new Set(exclude || []);
  const targets = gsap.utils
    .toArray(root.querySelectorAll("[text-anim]"))
    .filter((el) => !EXCLUDE.has(el));
  const titles = gsap.utils
    .toArray(root.querySelectorAll("[title-anim]"))
    .filter((el) => !EXCLUDE.has(el));

  if (!targets.length) return;

  targets.forEach((el) => {
    // Revert si ya estaba spliteado (para evitar capas duplicadas)
    try {
      el.__split?.revert?.();
    } catch {}
    el.__textSweepReady = false;

    const split = new SplitType(el, { types: "lines", lineClass: "ta-line" });
    el.__split = split;

    const lines = Array.from(el.querySelectorAll(".ta-line"));
    lines.forEach((line) => {
      const content = line.textContent;
      // Reemplazo controlado: 2 capas por línea
      line.innerHTML = `
        <span class="ta-base">${content}</span>
        <span class="ta-reveal">${content}</span>
      `;
      // estado inicial
      line.style.setProperty("--reveal", "0");
    });

    // Un solo trigger por bloque, progresión línea a línea
    const total = Math.max(lines.length, 1);
    const segment = 1 / total;

    ScrollTrigger.create({
      trigger: el,
      start: "top 75%",
      end: "top 20%",
      scrub: true,
      // markers: true,
      onUpdate: (st) => {
        const p = st.progress; // 0..1
        lines.forEach((line, i) => {
          const start = i * segment;
          const local = Math.min(1, Math.max(0, (p - start) / segment));
          line.style.setProperty("--reveal", local.toFixed(4));
        });
      },
      // si desmontas/recargas con Barba, limpia
      onKill: () => {
        try {
          split.revert();
        } catch {}
      },
    });

    el.__textSweepReady = true;
  });

  titles.forEach((ttl) => {
    // 1) split limpio
    try {
      ttl.__split?.revert?.();
    } catch {}
    const split = new SplitType(ttl, { types: "lines", lineClass: "ttl-line" });
    ttl.__split = split;

    const lines = split.lines || [];

    // 2) estado inicial (igual que Barba)
    gsap.set(lines, {
      clipPath: "inset(100% 0% 0% 0%)",
      y: 20,
      opacity: 0.001,
      willChange: "transform, clip-path",
      display: "block",
    });

    // 3) timeline de entrada (pausado)
    const tl = gsap.timeline({ paused: true });
    tl.to(lines, {
      clipPath: "inset(0% 0% 0% 0%)",
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      stagger: { each: 0.06, from: "start" },
    });

    // 4) trigger: reproducir al entrar (abajo o arriba),
    //    y **revertir SOLO** cuando salgas por arriba (onLeaveBack)
    ScrollTrigger.create({
      trigger: ttl,
      start: "top 80%",
      end: "bottom 10%", // rango “dentro”
      // no usamos scrub: queremos animación, no mapeo continuo
      onEnter: () => tl.play(), // entrando al hacer scroll hacia abajo
      onEnterBack: () => tl.play(), // entrando de nuevo al subir
      onLeave: () => {}, // saliendo por abajo → mantener revelado (no revertir)
      onLeaveBack: (self) => {
        // saliendo por ARRIBA → revertir
        if (self.direction === -1) tl.reverse();
      },
      onKill: () => {
        try {
          split.revert();
        } catch {}
      },
    });
  });

  ScrollTrigger.refresh();
}

export function initHighlightText() {
  let splitHeadingTargets = document.querySelectorAll("[data-highlight-text]");
  splitHeadingTargets.forEach((heading) => {
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
              scrub: true,
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

export function stampCC() {
  const text = document.querySelector(
    ".block-single-objective__circle-stamp__text"
  );
  const circle = document.querySelector(
    ".block-single-objective__circle-stamp"
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

export function initDirectionalListHover() {
  const directionMap = {
    top: "translateY(-100%)",
    bottom: "translateY(100%)",
    left: "translateX(-100%)",
    right: "translateX(100%)",
  };

  document.querySelectorAll("[data-directional-hover]").forEach((container) => {
    const type = container.getAttribute("data-type") || "all";

    container
      .querySelectorAll("[data-directional-hover-item]")
      .forEach((item) => {
        const tile = item.querySelector("[data-directional-hover-tile]");
        if (!tile) return;

        item.addEventListener("mouseenter", (e) => {
          const dir = getDirection(e, item, type);
          tile.style.transition = "none";
          tile.style.transform = directionMap[dir] || "translate(0, 0)";
          void tile.offsetHeight;
          tile.style.transition = "";
          tile.style.transform = "translate(0%, 0%)";
          item.setAttribute("data-status", `enter-${dir}`);
        });

        item.addEventListener("mouseleave", (e) => {
          const dir = getDirection(e, item, type);
          item.setAttribute("data-status", `leave-${dir}`);
          tile.style.transform = directionMap[dir] || "translate(0, 0)";
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
        a[1] < b[1] ? a : b
      )[0];
    }
  });
}
