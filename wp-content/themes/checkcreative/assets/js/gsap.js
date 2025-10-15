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
