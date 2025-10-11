export default function initFooterResize() {
  return;
  const footer = document.getElementById("site-footer");
  const root = document.documentElement; // <html>
  if (!footer) {
    console.warn("[footer-resize] No se encontró #site-footer");
    return;
  }

  function setFooterSize() {
    root.style.setProperty("--footer-h", `${footer.offsetHeight}px`);
  }

  const SHIFT_PX = 150;
  function setFooterShift() {
    const docH = root.scrollHeight;
    const winH = window.innerHeight;
    const footerH = footer.offsetHeight;
    const scrollY = window.scrollY;

    const revealStart = docH - winH - footerH;

    let progress = (scrollY - revealStart) / footerH;
    progress = Math.min(Math.max(progress, 0), 1);

    const px = (1 - progress) * SHIFT_PX;
    root.style.setProperty("--footer-shift", `${px}px`);
  }

  window.addEventListener(
    "load",
    () => {
      setFooterSize();
      setFooterShift();
    },
    { once: true }
  );
  window.addEventListener("resize", () => {
    setFooterSize();
    setFooterShift();
  });
  window.addEventListener("scroll", setFooterShift);

  new ResizeObserver(() => {
    setFooterSize();
    setFooterShift();
  }).observe(footer);
}

const FOOTER_SELECTORS = ["#site-footer", "#footer-spacer"];
const footerState = {
  cached: false,
  nodes: [],
  anchorParent: null,
  anchorNext: null,
};

export function cacheFooterNodes() {
  if (footerState.cached) return;

  const firstEl = document.querySelector(FOOTER_SELECTORS[0]);
  if (firstEl) {
    footerState.anchorParent = firstEl.parentNode;
    footerState.anchorNext = firstEl.nextSibling;
  }

  FOOTER_SELECTORS.forEach((sel) => {
    const el = document.querySelector(sel);
    if (el) {
      footerState.nodes.push({
        el,
        parent: el.parentNode,
        next: el.nextSibling,
      });
    }
  });

  footerState.cached = true;
}

export function hideFooter() {
  footerState.nodes.forEach(({ el }) => {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
}

export function showFooter() {
  if (!footerState.anchorParent) return;

  footerState.nodes.forEach(({ el }) => {
    if (!el) return;
    if (!document.body.contains(el)) {
      if (
        footerState.anchorNext &&
        footerState.anchorParent.contains(footerState.anchorNext)
      ) {
        footerState.anchorParent.insertBefore(el, footerState.anchorNext);
      } else {
        footerState.anchorParent.appendChild(el);
      }
    }
  });
}

export function toggleFooterByNS(ns) {
  cacheFooterNodes();
  const hide = ns === "contacto" || ns === "contact";
  hide ? hideFooter() : showFooter();
}

export function getCurrentNamespace() {
  const c = document.querySelector('[data-barba="container"]');
  return c ? c.dataset.barbaNamespace : "";
}
