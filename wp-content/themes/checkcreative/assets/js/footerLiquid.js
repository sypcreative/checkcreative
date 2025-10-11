/* footer-liquid.js — blobs desde el inicio, borde nítido, rastro rosa */

import * as THREE from "three";

document.addEventListener("DOMContentLoaded", () => {
  /* === AJUSTES ================================================= */
  const NUM_BLOBS = 6;
  const BLOB_R = 45;
  const CURSOR_R = 10;
  const TRAIL_MAX = 100;
  const SEG_SPACING = 2;
  const LEAD_CLEARANCE = 6;
  const SHRINK_FACTOR = 0.97;
  const TTL_FRAMES = 120;
  const FALLBACK_H = 260;
  const THRESHOLD = 0.6; // ← umbral para “encender” el píxel
  /* ============================================================ */

  const wrapper = document.getElementById("footer-liquid");
  if (!wrapper) return;

  /* THREE ------------------------------------------------------- */
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.domElement.style.display = "block";
  wrapper.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  /* UNIFORMS ---------------------------------------------------- */
  const MAX_META = NUM_BLOBS + 1 + TRAIL_MAX; // cursor + blobs + trail
  const metas = Array.from({ length: MAX_META }, () => new THREE.Vector3());
  const uniforms = {
    u_res: { value: new THREE.Vector2() },
    u_meta: { value: metas },
  };

  /* SHADERS ----------------------------------------------------- */
  const vs = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `;

  const fs = /* glsl */ `
    precision mediump float;
    #define N ${MAX_META}

    uniform vec2  u_res;
    uniform vec3  u_meta[N];
    varying vec2  vUv;

    // Calcula el campo metaball
    float field(vec2 p) {
      float f = 0.0;
      for (int i = 0; i < N; i++) {
        vec3 m = u_meta[i];
        if (m.z <= 0.0) continue;                     // ← cambio: break → continue
        f += m.z * m.z / dot(p - m.xy, p - m.xy + 1e-4);
      }
      return f;
    }

    void main() {
      if (field(vUv * u_res) < ${THRESHOLD}) discard; // umbral reducido
      gl_FragColor = vec4(0.87, 0.03, 0.56, 1.0);     // rosa #de078f
    }
  `;

  scene.add(
    new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: vs,
        fragmentShader: fs,
        transparent: true,
      })
    )
  );

  /* BLOBS ------------------------------------------------------- */
  const blobs = [];
  function spawnBlobs() {
    blobs.length = 0;
    for (let i = 0; i < NUM_BLOBS; i++) {
      blobs.push({
        x0: Math.random(),
        y0: 0.25 + 0.5 * Math.random(),
        ampX: 0.05 + 0.05 * Math.random(),
        ampY: 0.05 + 0.05 * Math.random(),
        speed: 0.3 + 0.7 * Math.random(),
        r: BLOB_R * (0.7 + 0.6 * Math.random()),
      });
    }
  }

  /* RESIZE ------------------------------------------------------ */
  function resize() {
    const w = wrapper.clientWidth || 1;
    const h = wrapper.clientHeight || FALLBACK_H;
    renderer.setSize(w, h);
    uniforms.u_res.value.set(w, h);
    spawnBlobs();
  }
  resize();
  new ResizeObserver(resize).observe(wrapper);

  /* CURSOR + TRAIL --------------------------------------------- */
  const cursor = metas[0];
  const trail = [];
  let lastX = null,
    lastY = null;
  const cvs = renderer.domElement;

  cvs.addEventListener("pointermove", (e) => {
    const rect = cvs.getBoundingClientRect();
    const x = e.offsetX,
      y = rect.height - e.offsetY;

    cursor.set(x, y, CURSOR_R); // actualiza el metaball del cursor

    // Generar segmentos para la estela
    if (lastX === null) {
      lastX = x;
      lastY = y;
      return;
    }
    let dx = x - lastX,
      dy = y - lastY,
      dist = Math.hypot(dx, dy);
    if (dist < LEAD_CLEARANCE) return;
    const dirX = dx / dist,
      dirY = dy / dist;
    let px = lastX + dirX * LEAD_CLEARANCE,
      py = lastY + dirY * LEAD_CLEARANCE;
    dist -= LEAD_CLEARANCE;
    while (dist >= SEG_SPACING) {
      if (trail.length >= TRAIL_MAX) trail.shift();
      trail.push({ x: px, y: py, r: CURSOR_R, ttl: TTL_FRAMES });
      px += dirX * SEG_SPACING;
      py += dirY * SEG_SPACING;
      dist -= SEG_SPACING;
    }
    lastX = x;
    lastY = y;
  });

  cvs.addEventListener("pointerleave", () => {
    lastX = lastY = null;
  });

  /* LOOP -------------------------------------------------------- */
  function animate(t) {
    const time = t * 0.001;
    const res = uniforms.u_res.value;

    /* Mueve los blobs base */
    blobs.forEach((b, i) => {
      metas[i + 1].set(
        (b.x0 + Math.sin(time * b.speed) * b.ampX) * res.x,
        (b.y0 + Math.cos(time * b.speed) * b.ampY) * res.y,
        b.r
      );
    });

    /* Actualiza la estela */
    for (let i = trail.length - 1; i >= 0; i--) {
      const p = trail[i];
      if (p.r > CURSOR_R) p.r = Math.max(CURSOR_R, p.r * SHRINK_FACTOR);
      metas[1 + NUM_BLOBS + i].set(p.x, p.y, p.r);
      if (--p.ttl <= 0) trail.splice(i, 1);
    }

    /* Limpia metas restantes */
    for (let i = 1 + NUM_BLOBS + trail.length; i < MAX_META; i++) {
      metas[i].z = 0;
    }

    uniforms.u_meta.needsUpdate = true;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
});
