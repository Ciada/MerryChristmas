// Effetti: neve che cade e coriandoli di festa (canvas)

function fitCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const r = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(r.width * dpr));
  canvas.height = Math.max(1, Math.round(r.height * dpr));
  const c = canvas.getContext("2d");
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { c, w: r.width, h: r.height };
}

/** Neve su un canvas. Ritorna una funzione stop(). */
export function startSnow(canvas, { count = 70 } = {}) {
  let { c, w, h } = fitCanvas(canvas);
  const flakes = Array.from({ length: count }, () => mk(true));
  function mk(anyY) {
    return {
      x: Math.random() * w,
      y: anyY ? Math.random() * h : -10,
      r: 1 + Math.random() * 2.6,
      s: 0.3 + Math.random() * 0.9,
      p: Math.random() * Math.PI * 2,
    };
  }
  let raf, last = performance.now();
  const onResize = () => ({ c, w, h } = fitCanvas(canvas));
  window.addEventListener("resize", onResize);
  function loop(now) {
    const dt = Math.min(50, now - last) / 16.7; last = now;
    c.clearRect(0, 0, w, h);
    c.fillStyle = "rgba(255,255,255,.9)";
    for (const f of flakes) {
      f.y += f.s * dt;
      f.p += 0.02 * dt;
      f.x += Math.sin(f.p) * 0.4 * dt;
      if (f.y > h + 5) Object.assign(f, mk(false));
      c.globalAlpha = 0.5 + f.r / 6;
      c.beginPath(); c.arc(f.x, f.y, f.r, 0, Math.PI * 2); c.fill();
    }
    c.globalAlpha = 1;
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);
  return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
}

/** Esplosione di coriandoli sul canvas globale. */
const COLORS = ["#c0393f", "#2f5d46", "#d9a441", "#f1d48c", "#e9a1a0", "#ffffff", "#8fb39a"];
let parts = [], running = false;
export function confetti({ x = 0.5, y = 0.45, amount = 140, spread = 1 } = {}) {
  const canvas = document.getElementById("fx-canvas");
  const { c, w, h } = fitCanvas(canvas);
  for (let i = 0; i < amount; i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3 * spread;
    const v = 6 + Math.random() * 9;
    parts.push({
      x: x * w, y: y * h,
      vx: Math.cos(a) * v, vy: Math.sin(a) * v,
      rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
      sz: 5 + Math.random() * 6,
      col: COLORS[(Math.random() * COLORS.length) | 0],
      shape: Math.random() < 0.25 ? "star" : Math.random() < 0.5 ? "circle" : "rect",
      life: 0,
    });
  }
  if (running) return;
  running = true;
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(50, now - last) / 16.7; last = now;
    c.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.vy += 0.28 * dt; p.vx *= 0.99; p.vy *= 0.99;
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.life += dt;
      c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = p.col;
      if (p.shape === "rect") c.fillRect(-p.sz / 2, -p.sz / 4, p.sz, p.sz / 2);
      else if (p.shape === "circle") { c.beginPath(); c.arc(0, 0, p.sz / 2.5, 0, 7); c.fill(); }
      else star(c, p.sz / 1.6);
      c.restore();
    }
    parts = parts.filter((p) => p.y < h + 30 && p.life < 400);
    if (parts.length) requestAnimationFrame(loop);
    else { c.clearRect(0, 0, w, h); running = false; }
  }
  requestAnimationFrame(loop);
}

function star(c, r) {
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.45 : r;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  c.closePath(); c.fill();
}

export function celebrate() {
  confetti({ x: 0.2, y: 0.6, amount: 80 });
  confetti({ x: 0.8, y: 0.6, amount: 80 });
  setTimeout(() => confetti({ x: 0.5, y: 0.35, amount: 90 }), 250);
}
