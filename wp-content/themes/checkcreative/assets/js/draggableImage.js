import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

export function initDraggableImages() {
  gsap.registerPlugin(Draggable, InertiaPlugin);

  const mm = gsap.matchMedia();

  // Solo desktop (ratón) y >= 1024px
  mm.add("(pointer: fine) and (min-width: 1024px)", () => {
    const clampSkew = gsap.utils.clamp(-20, 20);

    // Guardamos referencias para cleanup
    const cleanups = [];

    gsap.utils.toArray(".img-drag").forEach((Image) => {
      const proxy = document.createElement("div");
      const tracker = InertiaPlugin.track(proxy, "x")[0];
      const skewTo = gsap.quickTo(Image, "skewX");
      const xTo = gsap.quickTo(Image, "x", { duration: 0.5 });
      const yTo = gsap.quickTo(Image, "y", { duration: 0.5 });

      let drag; // se asigna tras crear Draggable

      const updateSkew = () => {
        const vx = tracker.get("x");
        skewTo(clampSkew(vx / -150));
        if (!vx && !(drag && drag.isPressed)) gsap.ticker.remove(updateSkew);
      };

      const align = () =>
        gsap.set(proxy, {
          attr: { class: "proxy" },
          x: gsap.getProperty(Image, "x"),
          y: gsap.getProperty(Image, "y"),
          width: Image.offsetWidth,
          height: Image.offsetHeight,
          position: "absolute",
          pointerEvents: "none",
          top: Image.offsetTop,
          left: Image.offsetLeft,
        });

      align();
      Image.parentNode.append(proxy);

      const onResize = () => align();
      window.addEventListener("resize", onResize, { passive: true });

      [drag] = Draggable.create(proxy, {
        type: "x,y",
        trigger: Image,
        bounds: ".content-drag-area",
        edgeResistance: 0.6,
        inertia: {
          resistance: 100,
          minDuration: 0.5,
          maxDuration: 2,
        },
        onPressInit() {
          align();
          if (xTo.tween) xTo.tween.pause();
          if (yTo.tween) yTo.tween.pause();
          gsap.ticker.add(updateSkew);
        },
        onPress() {
          Image.style.zIndex = proxy.style.zIndex;
        },
        onDrag() {
          xTo(this.x);
          yTo(this.y);
        },
        onThrowUpdate() {
          xTo(this.x);
          yTo(this.y);
        },
      });

      // Registrar cleanup de este elemento
      cleanups.push(() => {
        try {
          if (drag) drag.kill();
          InertiaPlugin.untrack(proxy, "x");
          gsap.ticker.remove(updateSkew);
          window.removeEventListener("resize", onResize);
          // Resetear estilos aplicados
          gsap.set(Image, { clearProps: "x,y,skewX,zIndex" });
          proxy.remove();
        } catch (_) {}
      });
    });

    // Función que GSAP llamará cuando deje de cumplirse el media query (p.ej. pasar a mobile)
    return () => {
      cleanups.forEach((fn) => fn());
    };
  });
}
