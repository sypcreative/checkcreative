// lenis.js
import Lenis from "@studio-freight/lenis";

const lenis = new Lenis({
  wrapper: window,
  content: document.documentElement,
  smooth: true,
  gestureOrientation: "vertical",
  prevent: (event) => event.target.closest("[	]"),
  lerp: 0.1,
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

export function toggleScrollLock(lock) {
  if (lock) {
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
  } else {
    lenis?.start();
    document.documentElement.style.overflow = "";
  }
}

requestAnimationFrame(raf);
window.lenis = lenis;

export default lenis;
