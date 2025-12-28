import { gsap } from "gsap";

export function initBasicCustomCursor() {
  gsap.set(".cursor", { xPercent: -50, yPercent: -50 });

  let xTo = gsap.quickTo(".cursor", "x", { duration: 0.6, ease: "power3" });
  let yTo = gsap.quickTo(".cursor", "y", { duration: 0.6, ease: "power3" });

  window.addEventListener("mousemove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });
}

export function initDynamicCustomTextCursor() {
  if (
    window.matchMedia("(pointer: coarse)").matches ||
    window.innerWidth < 1024
  ) {
    return;
  }
  let cursorItem = document.querySelector(".cursor-text");
  let cursorParagraph = cursorItem.querySelector("p");
  let targets = document.querySelectorAll("[data-cursor]");
  let xOffset = 6;
  let yOffset = 140;
  let cursorIsOnRight = false;
  let currentTarget = null;
  let lastText = "";

  // Position cursor relative to actual cursor position on page load
  gsap.set(cursorItem, { xPercent: xOffset, yPercent: yOffset });

  // Use GSAP quick.to for a more performative tween on the cursor
  let xTo = gsap.quickTo(cursorItem, "x", { ease: "power3" });
  let yTo = gsap.quickTo(cursorItem, "y", { ease: "power3" });

  // Function to get the width of the cursor element including a buffer
  const getCursorEdgeThreshold = () => {
    return cursorItem.offsetWidth + 16; // Cursor width + 16px margin
  };

  // On mousemove, call the quickTo functions to the actual cursor position
  window.addEventListener("mousemove", (e) => {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let scrollY = window.scrollY;
    let cursorX = e.clientX;
    let cursorY = e.clientY + scrollY; // Adjust cursorY to account for scroll

    // Default offsets
    let xPercent = xOffset;
    let yPercent = yOffset;

    // Adjust X offset dynamically based on cursor width
    let cursorEdgeThreshold = getCursorEdgeThreshold();
    if (cursorX > windowWidth - cursorEdgeThreshold) {
      cursorIsOnRight = true;
      xPercent = -100;
    } else {
      cursorIsOnRight = false;
    }

    // Adjust Y offset if in the bottom 10% of the current viewport
    if (cursorY > scrollY + windowHeight * 0.9) {
      yPercent = -120;
    }

    if (currentTarget) {
      let newText = currentTarget.getAttribute("data-cursor");
      if (newText !== lastText) {
        // Only update if the text is different
        cursorParagraph.innerHTML = newText;
        lastText = newText;

        // Recalculate edge awareness whenever the text changes
        cursorEdgeThreshold = getCursorEdgeThreshold();
      }
    }

    gsap.to(cursorItem, {
      xPercent: xPercent,
      yPercent: yPercent,
      duration: 0.9,
      ease: "power3",
    });
    xTo(cursorX);
    yTo(cursorY - scrollY);
  });

  // Add a mouse enter listener for each link that has a data-cursor attribute
  targets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      currentTarget = target; // Set the current target

      let newText = target.getAttribute("data-cursor");

      // Update only if the text changes
      if (newText !== lastText) {
        cursorParagraph.innerHTML = newText;
        lastText = newText;

        // Recalculate edge awareness whenever the text changes
        let cursorEdgeThreshold = getCursorEdgeThreshold();
      }
    });
  });
}

export function initPlayHoverCursor(scope = document) {
  const isTouch =
    window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  if (isTouch) return () => {};

  const cursor = document.querySelector(".play-hover-cursor");
  if (!cursor) return () => {};

  const targets = Array.from(scope.querySelectorAll("[data-play-hover]"));
  if (!targets.length) return () => {};

  let active = false;
  let rafId = null;

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const pos = { x: mouse.x, y: mouse.y };

  const lerp = (a, b, n) => a + (b - a) * n;

  // 🎛️ Tuning
  const EASE = 0.03; // cuanto persigue (0.12 más lento / 0.25 más pegado)
  const FREEZE_DIST = 0.1; // px: si estamos ya muy cerca, paramos SIN snap

  const setTransform = (x, y) => {
    cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(1)`;
  };

  const render = () => {
    if (!active) {
      rafId = null;
      return;
    }

    const dx = mouse.x - pos.x;
    const dy = mouse.y - pos.y;
    const dist = Math.hypot(dx, dy);

    // ✅ Si está casi en el sitio, congelamos (NO snap al ratón)
    if (dist < FREEZE_DIST) {
      rafId = null;
      return;
    }

    pos.x = lerp(pos.x, mouse.x, EASE);
    pos.y = lerp(pos.y, mouse.y, EASE);

    setTransform(pos.x, pos.y);
    rafId = requestAnimationFrame(render);
  };

  const kick = () => {
    if (!rafId && active) rafId = requestAnimationFrame(render);
  };

  const onMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    kick();
  };

  const enter = (e) => {
    active = true;
    cursor.classList.add("is-active");

    // opcional: empieza cerca del ratón al entrar para que no “salte”
    if (e?.clientX != null) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      pos.x = mouse.x;
      pos.y = mouse.y;
      setTransform(pos.x, pos.y);
    }

    kick();
  };

  const leave = () => {
    active = false;
    cursor.classList.remove("is-active");
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  };

  targets.forEach((el) => {
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
  });

  window.addEventListener("mousemove", onMove);

  return () => {
    window.removeEventListener("mousemove", onMove);
    targets.forEach((el) => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    });
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    cursor.classList.remove("is-active");
  };
}
