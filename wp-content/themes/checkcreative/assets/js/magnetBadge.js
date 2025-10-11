export function initMagneticBadges() {
  const MAX_DISTANCE = 120;
  const MAX_TRANSLATE = 24;
  const EASING = 0.18; // 0–1, más bajo = más suave

  const elements = document.querySelectorAll(".magnetic-badge");
  if (!elements.length) return;

  const magnets = [...elements].map((el) => ({
    el,
    cx: 0,
    cy: 0,
    tx: 0,
    ty: 0,
    x: 0,
    y: 0,
  }));

  const measureCenters = () => {
    magnets.forEach((m) => {
      const prev = m.el.style.transform;
      m.el.style.transform = "translate3d(0,0,0)";
      const r = m.el.getBoundingClientRect();
      m.cx = r.left + r.width / 2;
      m.cy = r.top + r.height / 2;
      m.el.style.transform = prev;
    });
  };

  const mouse = { x: 0, y: 0 };
  document.addEventListener(
    "pointermove",
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    },
    { passive: true }
  );

  const update = () => {
    magnets.forEach((m) => {
      const dx = mouse.x - m.cx;
      const dy = mouse.y - m.cy;
      const d = Math.hypot(dx, dy);

      if (d < MAX_DISTANCE) {
        const strength = 1 - d / MAX_DISTANCE;
        const mag = strength * MAX_TRANSLATE;
        const nx = dx / (d || 1);
        const ny = dy / (d || 1);
        m.tx = nx * mag;
        m.ty = ny * mag;
      } else {
        m.tx = 0;
        m.ty = 0;
      }

      m.x += (m.tx - m.x) * EASING;
      m.y += (m.ty - m.y) * EASING;
      m.el.style.transform = `translate3d(${m.x}px, ${m.y}px, 0)`;
    });

    requestAnimationFrame(update);
  };

  measureCenters();
  window.addEventListener("resize", measureCenters, { passive: true });
  window.addEventListener("scroll", measureCenters, { passive: true });

  requestAnimationFrame(update);
}
