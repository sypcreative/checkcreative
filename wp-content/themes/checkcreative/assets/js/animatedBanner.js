const SPEED = 60;

export function initAnimatedBanner(selector = ".animated-banner") {
  const banners = document.querySelectorAll(selector);

  banners.forEach((banner) => {
    const track = banner.querySelector(".animated-banner__track");
    if (!track || !track.firstElementChild) return;

    const unitTpl = track.firstElementChild.cloneNode(true);
    let offset = 0;
    let lastTime = performance.now();

    while (track.scrollWidth < banner.offsetWidth * 2) {
      track.appendChild(unitTpl.cloneNode(true));
    }

    const getUnitWidth = (el) => {
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return el.getBoundingClientRect().width + gap;
    };

    function loop(now) {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      offset += SPEED * dt;
      track.style.transform = `translateX(${-offset}px)`;

      const first = track.firstElementChild;
      const w = getUnitWidth(first);

      if (offset >= w) {
        offset -= w;
        track.appendChild(first);
      }

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  });
}
