// assets/js/utils/initLenis.js
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let _lenis; // evita doble init

export function initLenis(options = {}) {
  if (_lenis) return _lenis;

  const lenis = new Lenis({
    duration: 1.2,
    lerp: 0.1,
    smoothWheel: true,
    ...options,
  });

  // RAF loop
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Conecta Lenis con ScrollTrigger
  lenis.on("scroll", () => ScrollTrigger.update());

  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true });
      } else {
        return lenis.scroll;
      }
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: "transform", // evita “bamboleo” con smooth
  });

  // Mantén tamaños sincronizados
  ScrollTrigger.addEventListener("refresh", () => lenis.resize());
  ScrollTrigger.refresh();

  _lenis = lenis;
  return lenis;
}

export function destroyLenis() {
  if (_lenis) {
    _lenis.destroy();
    _lenis = undefined;
  }
}
