// assets/js/utils/initLenis.js
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let _lenis; // evita doble init
let _tickerCallback; // guardamos la ref para poder hacer remove luego

export function initLenis(options = {}) {
  if (_lenis) return _lenis;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  // 👉 Si quieres probar SIN Lenis en móvil, descomenta:
  //   if (isMobile) {
  //     return null;
  //   }

  const lenis = new Lenis({
    // En móvil un poco menos “gomoso”
    duration: isMobile ? 0.7 : 1.2,
    lerp: isMobile ? 0.25 : 0.1,

    smoothWheel: !isMobile, // rueda solo desktop
    smoothTouch: false, // MUY importante para que el gesto táctil no se sienta raro

    ...options,
  });

  // Conecta Lenis con ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);

  // Usamos el ticker de GSAP como loop global
  _tickerCallback = (time) => {
    // gsap.ticker da segundos, Lenis quiere ms
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(_tickerCallback);

  // Evita correcciones de lag que pueden pegar “saltos”
  gsap.ticker.lagSmoothing(0);

  // scrollerProxy para que ScrollTrigger lea el scroll de Lenis
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
    // Volvemos a "transform" como tenías antes, que te funcionaba bien en desktop
    pinType: "transform",
    // Si alguna vez quieres probar el auto:
    // pinType: document.body.style.transform ? "transform" : "fixed",
  });

  ScrollTrigger.addEventListener("refresh", () => lenis.resize());
  ScrollTrigger.refresh();

  _lenis = lenis;
  return lenis;
}

export function destroyLenis() {
  if (!_lenis) return;

  if (_tickerCallback) {
    gsap.ticker.remove(_tickerCallback);
    _tickerCallback = null;
  }

  _lenis.destroy();
  _lenis = undefined;
}
