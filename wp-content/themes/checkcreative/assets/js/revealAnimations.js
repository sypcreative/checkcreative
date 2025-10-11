import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText, ScrollTrigger);

let splitInstances = [];
let navTimelines = [];
/**
 * Aplica animación por líneas con SplitText a todos los elementos con data-anim="lines"
 */
export function animateLinesText() {
  const elements = document.querySelectorAll('[data-anim="lines"]');

  elements.forEach((element) => {
    element.style.visibility = "hidden";
    const split = new SplitText(element, {
      type: "lines",
      linesClass: "line++",
      lineThreshold: 0.1,
      mask: true,
    });

    const computed = window.getComputedStyle(element);
    const indent = computed.textIndent;

    if (indent && indent !== "0px" && split.lines.length > 0) {
      split.lines[0].style.paddingLeft = indent;
      element.style.textIndent = "0";
    }

    split.lines.forEach((line) => {
      const span = document.createElement("span");
      span.innerHTML = line.innerHTML;
      line.innerHTML = "";
      line.appendChild(span);
    });

    const innerSpans = split.lines.map((line) => line.firstElementChild);

    // Estado inicial
    gsap.set(innerSpans, { y: "100%" });

    element.style.visibility = "visible";

    ScrollTrigger.create({
      trigger: element,
      start: "top 90%",
      onEnter: () => {
        gsap.to(innerSpans, {
          y: "0%",
          duration: 1.1,
          stagger: 0.2,
          ease: "power4.out",
        });
      },
      onLeaveBack: () => {
        gsap.set(innerSpans, { y: "100%" }); // Reset al salir por arriba
      },
      markers: false, // Pon a true si estás depurando
    });

    // Puedes devolver esto si necesitas limpiar luego:
    // return () => { split.revert(); ScrollTrigger.getById(...)?.kill(); };
  });
}

export function animateLinesNavbar() {
  const elements = document.querySelectorAll('[data-anim="nav-links"]');

  if (navTimelines.length) {
    gsap.set(elements, { autoAlpha: 1 });
    navTimelines.forEach((tl) => tl.restart());
    return navTimelines;
  }

  splitInstances.forEach((s) => s.revert());
  splitInstances = [];
  navTimelines.forEach((tl) => tl.kill());
  navTimelines = [];

  elements.forEach((element, index) => {
    element.style.visibility = "hidden";

    const split = new SplitText(element, {
      type: "lines",
      linesClass: "line++",
      lineThreshold: 0.1,
      mask: true,
    });

    splitInstances.push(split);

    split.lines.forEach((line) => {
      const span = document.createElement("span");
      span.innerHTML = line.innerHTML;
      line.innerHTML = "";
      line.appendChild(span);
    });

    const innerSpans = split.lines.map((l) => l.firstElementChild);

    gsap.set(element, { autoAlpha: 1 });
    gsap.set(innerSpans, { y: "100%" });

    const tl = gsap.timeline({ delay: index * 0.2 });
    tl.to(innerSpans, {
      y: "0%",
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.05,
    });

    navTimelines.push(tl);
  });

  return navTimelines;
}

export function resetLinesNavbar() {
  // Ocultamos los enlaces rapidamente para el cierre
  const elements = document.querySelectorAll('[data-anim="nav-links"]');
  gsap.set(elements, { autoAlpha: 0 });

  navTimelines.forEach((tl) => tl.kill());
  navTimelines = [];

  splitInstances.forEach((s) => s.revert());
  splitInstances = [];
}

export function initMobileNavbar() {
  const toggler = document.querySelector(".navbar-toggler");
  const mobileMenu = document.getElementById("mobileNavbar");
  const mobileNavLinks = document.querySelectorAll("#mobileNavbar .nav-link");

  if (!toggler || !mobileMenu) return;

  let isOpen = false;

  gsap.set(mobileMenu, { autoAlpha: 1, y: "-100%", display: "none" });

  toggler.addEventListener("click", () => {
    isOpen = !isOpen;

    if (isOpen) {
      resetLinesNavbar();

      gsap.set(mobileMenu, { display: "flex" });
      gsap.to(mobileMenu, {
        y: "0%",
        duration: 0.5,
        ease: "power3.out",
        onComplete: () => {
          setTimeout(() => {
            animateLinesNavbar();
          }, 300);
        },
      });
    } else {
      gsap.to(mobileMenu, {
        y: "-100%",
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(mobileMenu, { display: "none" });
          resetLinesNavbar();
        },
      });
    }

    toggler.setAttribute("aria-expanded", isOpen);
  });

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (isOpen) {
        gsap.to(mobileMenu, {
          y: "-100%",
          duration: 0.4,
          ease: "power3.in",
          onComplete: () => {
            gsap.set(mobileMenu, { display: "none" });
            isOpen = false;
            toggler.setAttribute("aria-expanded", "false");
            resetLinesNavbar();
          },
        });
      }
    });
  });
}

/**
 * Inicializa la animación de imágenes flotantes en el bloque Quote
 */
export function initQuoteImagesAnimation() {
  const imgs = document.querySelectorAll(".block-quote .quote-img");

  if (!imgs.length) return;

  imgs.forEach((img) => {
    gsap.fromTo(
      img,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: img,
          start: "top 80%",
          toggleActions: "play none none reverse",
          //   markers: true,
        },
      }
    );
  });
}
