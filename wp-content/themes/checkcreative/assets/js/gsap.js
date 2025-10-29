import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

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
  tl.to(video, { yPercent: 30 }, 0);

  // Contra-parallax suave del título (sube un poco)
  if (title) {
    tl.fromTo(title, { yPercent: 0 }, { yPercent: -8 }, 0);
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

  gsap.registerPlugin(ScrollTrigger);

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
