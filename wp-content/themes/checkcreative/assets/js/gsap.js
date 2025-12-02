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

  const yShift = [-70, -80, 90, 130];
  const xShift = [-300, 200, -130, 150];
  const rot = [-6, 4, -3, 5];

  ScrollTrigger.matchMedia({
    // ✅ DESKTOP / TABLET GRANDE
    "(min-width: 769px)": function () {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=20%",
          pin: true,
          scrub: 0.6, // mejor que true
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // pinSpacing: true,   // por si quieres tocar spacing
          //  markers: true,
        },
      });

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
          0 // todas a la vez; pon i * 0.05 si quieres escalonado
        );
      });
    },

    // 📱 MÓVIL
    "(max-width: 768px)": function () {
      // En móvil: SIN pin, SIN scrub, animación “normal” al entrar
      const tlMobile = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "bottom top",
          toggleActions: "play none none reverse",
          pin: false,
          scrub: false,
          invalidateOnRefresh: true,
          // markers: true,
        },
      });

      images.forEach((img, i) => {
        const idx = i % 4;
        tlMobile.fromTo(
          img,
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 0.95,
            opacity: 0,
          },
          {
            x: xShift[idx] * 0.4, // menos exagerado en móvil
            y: yShift[idx] * 0.4,
            rotation: rot[idx],
            scale: 1.03,
            opacity: 1,
            duration: 0.6,
          },
          i * 0.08
        );
      });
    },
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
      scrub: 0.4,
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
                }
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
        a[1] < b[1] ? a : b
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
        "[FooterParallax] No inner/dark found. Skipping this element."
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
        }
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
        "<"
      );
    }
  });

  // Nada de refresh aquí: Barba ya refresca.
}

export function initMasonryGrid() {
  document.querySelectorAll("[data-masonry-list]").forEach((container) => {
    const shuffle = container.dataset.masonryShuffle !== "false";
    let cols, gapPx, colHeights;

    // Take columns and gaps from CSS
    const getVars = () => {
      const cs = getComputedStyle(container);
      cols = parseInt(cs.getPropertyValue("--masonry-col"));
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
        gapPx = parseFloat(rawGap);
      }
    };

    // Set the layout
    const layout = () => {
      getVars();
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

    // Debounce function to use on resize
    const debounce = (fn, delay) => {
      let t;
      return () => {
        clearTimeout(t);
        t = setTimeout(fn, delay);
      };
    };

    const onResize = debounce(layout, 100);
    window.addEventListener("resize", onResize);

    // Return promise if images are loaded
    const imgLoad = () => {
      const imgs = container.querySelectorAll("img");
      return Promise.all(
        Array.from(imgs).map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((r) => img.addEventListener("load", r))
        )
      );
    };

    // When images are ready, set the layout
    imgLoad().then(layout);

    // Constructor with destroy and recalc function
    container._masonry = {
      recalc: () => imgLoad().then(layout),
      destroy: () => {
        window.removeEventListener("resize", onResize);
        const items = Array.from(container.children);
        items.forEach((el) => {
          el.style.position =
            el.style.width =
            el.style.top =
            el.style.left =
              "";
        });
        container.style.position = container.style.height = "";
      },
    };
  });
}

export function initBestProjectCards() {
  const sliders = document.querySelectorAll("[data-init-projects-cards]");

  sliders.forEach((slider) => {
    const list = slider.querySelector("[data-projects-cards-list]");
    const cards = Array.from(
      list.querySelectorAll("[data-projects-cards-project]")
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
      console.log("Not minimum of 7 cards");
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
          releaseClientY - pressClientY
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
                releaseClientY
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

export function initStackingCards() {
  const container = document.querySelector("[data-stacking-cards]");
  if (!container) return;

  const cards = container.querySelectorAll("[data-stacking-cards-item]");
  if (cards.length < 2) return;

  const descs = container.querySelectorAll("[data-stacking-cards-desc]");
  if (!descs.length) return;

  const imgs = container.querySelectorAll("[data-stacking-cards-image]");
  if (!imgs.length) return;

  const spacer = document.querySelector("[data-stacking-cards-spacer]");
  const STEP = -65;
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
        const MAX_SPACER = 1000; // tú ajustas

        const extraScroll = Math.max(
          Math.min(amount - naturalScroll, MAX_SPACER),
          0
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
      "<"
    );

    const nextCard = cards[i + 1];
    if (nextCard) {
      tl.to(nextCard, {
        yPercent: STEP * (i + 1),
        duration: 1.1,
      });
    }
  });

  ScrollTrigger.refresh();
}

export function initScrollLine() {
  const section = document.querySelector("[data-line-scroll]");
  console.log("initScrollLine");
  if (!section) return;

  const path = section.querySelector("#linea-trazo");
  if (!path) return;
  console.log("path", path);
  const length = path.getTotalLength();

  console.log("path", path, "length", length);
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

export function initCSSMarquee() {
  const pixelsPerSecond = 20; // velocidad en px/s
  const marquees = document.querySelectorAll("[data-css-marquee]");

  // Duplicar cada [data-css-marquee-list] dentro de su contenedor
  marquees.forEach((marquee) => {
    marquee.querySelectorAll("[data-css-marquee-list]").forEach((list) => {
      const duplicate = list.cloneNode(true);
      marquee.appendChild(duplicate);
    });
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
    { threshold: 0 }
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
}
