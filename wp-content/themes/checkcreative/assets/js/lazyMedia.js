export function initLazyMedia(scope = document) {
  const videos = Array.from(scope.querySelectorAll("video[data-autoplay]"));
  if (!videos.length) return () => {};

  const ensureSource = (v) => {
    const src = v.dataset.src;
    if (!src || v.__srcSet) return;

    v.__srcSet = true;

    const source = document.createElement("source");
    source.src = src;
    source.type = v.dataset.type || "video/mp4"; // 👈 respeta el mime del PHP
    v.appendChild(source);

    v.load();
  };

  const tryPlay = async (v) => {
    // Asegura flags típicos de mobile autoplay
    v.muted = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("muted", "");

    try {
      const p = v.play();
      if (p?.then) await p;
      v.__blocked = false;
    } catch (e) {
      // Autoplay bloqueado: dejamos una marca para fallback
      v.__blocked = true;
      // opcional: mostrar controles en mobile si falla
      v.controls = true;
    }
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const v = entry.target;

        if (entry.isIntersecting) {
          ensureSource(v);
          tryPlay(v);
        } else {
          try {
            v.pause();
          } catch (e) {}
        }
      });
    },
    { root: null, rootMargin: "300px 0px", threshold: 0.01 }
  );

  videos.forEach((v) => io.observe(v));

  // Fallback: si autoplay está bloqueado, al primer toque reproducimos
  const onFirstTouch = (e) => {
    const v = e.target.closest?.("video[data-autoplay]");
    if (!v) return;

    ensureSource(v);
    tryPlay(v);
  };

  scope.addEventListener("touchstart", onFirstTouch, { passive: true });

  return () => {
    io.disconnect();
    scope.removeEventListener("touchstart", onFirstTouch);
    videos.forEach((v) => {
      try {
        v.pause();
      } catch (e) {}
    });
  };
}
