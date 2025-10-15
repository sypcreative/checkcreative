import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function initDescriptionPin() {
  const section = document.querySelector(".block-description");
  if (!section) return;

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "+=150%", // ~200vh de “estadía”
    pin: true,
    pinSpacing: true, // empuja lo demás hacia abajo (¡no se salta nada!)
    pinType: "transform", // evita left raros si hay containers/transforms
    pinReparent: true,
    anticipatePin: 1,
    markers: false,
  });

  // Si hay imágenes que cargan tarde:
  window.addEventListener("load", () => ScrollTrigger.refresh());
}
