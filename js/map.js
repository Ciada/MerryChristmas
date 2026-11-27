// Mappa: sentiero innevato che sale verso le stelle (livello 1 in basso, finale in cima)
import { CONTENT } from "../content.js";
import { Save } from "./storage.js";
import { Sfx } from "./audio.js";
import { startSnow, confetti } from "./fx.js";
import { el, esc, toast, onLongPress } from "./ui.js";

const TOTAL = CONTENT.levels.length;
const SPACING = 132;
const PAD_TOP = 150;
const PAD_BOTTOM = 100;

export function renderMap(app, { onPlay, onFinale, onGallery, celebrateId = null }) {
  const doneCount = Save.get().completed.length;
  const screen = el(`<section class="screen map-screen">
    <header class="map-header">
      <button class="icon-btn" data-act="gallery" aria-label="Ricordi">🖼️</button>
      <div class="titles">
        <h1 class="map-title">${esc(CONTENT.gameTitle)}</h1>
        <p class="map-sub">${doneCount ? `${doneCount}/${TOTAL} ricordi raccolti ❄` : esc(CONTENT.gameSubtitle)}</p>
      </div>
      <button class="icon-btn" data-act="sound" aria-label="Suono">${Save.get().sound ? "🔊" : "🔇"}</button>
    </header>
    <div class="map-scroll"><div class="map-inner"></div></div>
    <canvas class="snow-canvas"></canvas>
  </section>`);
  app.appendChild(screen);

  const scroll = screen.querySelector(".map-scroll");
  const inner = screen.querySelector(".map-inner");
  const W = Math.min(scroll.clientWidth || window.innerWidth, 480);
  const H = PAD_TOP + TOTAL * SPACING + PAD_BOTTOM;
  inner.style.height = H + "px";
  inner.style.width = W + "px";
  scroll.style.background =
    "linear-gradient(to bottom, #161c36 0%, #26305a 14%, #56688f 32%, #a9b9c9 48%, #e4e8e4 62%, #f3ece0 80%, #f6efe2 100%) local";

  // posizioni dei nodi: k = 0 (livello 1, in basso) ... TOTAL (finale, in cima)
  const pts = [];
  for (let k = 0; k <= TOTAL; k++) {
    const y = H - PAD_BOTTOM - k * SPACING + (k === TOTAL ? -10 : 0);
    const x = k === TOTAL ? W / 2 : W / 2 + Math.sin(k * 0.95 + 0.4) * W * 0.27;
    pts.push({ x, y });
  }

  // decorazioni SVG: stelle in cielo, alberi lungo il sentiero, sentiero
  const svgParts = [];
  for (let i = 0; i < 70; i++) {
    const y = Math.random() * H * 0.42;
    const r = Math.random() * 1.6 + 0.4;
    svgParts.push(`<circle cx="${(Math.random() * W).toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="#fff" opacity="${(0.35 + Math.random() * 0.6).toFixed(2)}"/>`);
  }
  // luna
  svgParts.push(`<circle cx="${W * 0.82}" cy="70" r="22" fill="#fbf1cf"/><circle cx="${W * 0.82 + 9}" cy="64" r="20" fill="#1c2340"/>`);
  // montagnette innevate in lontananza
  const mY = H * 0.5;
  svgParts.push(`<path d="M0 ${mY} L${W * 0.18} ${mY - 120} L${W * 0.34} ${mY - 40} L${W * 0.55} ${mY - 170} L${W * 0.78} ${mY - 60} L${W} ${mY - 130} L${W} ${mY + 60} L0 ${mY + 60} Z" fill="#8ea2bd" opacity=".55"/>`);
  svgParts.push(`<path d="M${W * 0.55 - 34} ${mY - 120} L${W * 0.55} ${mY - 170} L${W * 0.55 + 38} ${mY - 116} L${W * 0.55 + 14} ${mY - 126} L${W * 0.55 - 4} ${mY - 112} Z" fill="#fff" opacity=".8"/>`);

  for (let k = 0; k < TOTAL; k++) {
    const p = pts[k];
    const side = p.x > W / 2 ? -1 : 1;
    const tx = W / 2 + side * W * (0.3 + Math.random() * 0.12);
    const ty = p.y + (Math.random() * 40 - 20);
    svgParts.push(tree(tx, ty, 0.8 + Math.random() * 0.5, k));
    if (Math.random() < 0.6) svgParts.push(tree(tx + side * 34, ty + 28, 0.6 + Math.random() * 0.3, k + 99));
  }

  const d = smoothPath(pts);
  const lastDone = Save.current(TOTAL) ? Save.current(TOTAL) - 1 : TOTAL;
  const dDone = lastDone > 0 ? smoothPath(pts.slice(0, lastDone + 1)) : "";
  svgParts.push(`<path d="${d}" fill="none" stroke="#fff" stroke-width="22" stroke-linecap="round" opacity=".85"/>`);
  svgParts.push(`<path d="${d}" fill="none" stroke="#cbbfa9" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>`);
  if (dDone) svgParts.push(`<path d="${dDone}" fill="none" stroke="#d9a441" stroke-width="5" stroke-dasharray="1 11" stroke-linecap="round"/>`);

  inner.appendChild(el(`<svg class="map-path" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${svgParts.join("")}</svg>`));

  // nodi
  const current = Save.current(TOTAL);
  CONTENT.levels.forEach((lv, k) => {
    const p = pts[k];
    const done = Save.isDone(lv.id);
    const unlocked = Save.isUnlocked(lv.id);
    const cls = done ? "done" : unlocked ? "current" : "locked";
    const badge = done ? "★" : unlocked ? "" : "🔒";
    const b = el(`<button class="node ${cls}" style="left:${p.x}px;top:${p.y}px" aria-label="Livello ${lv.id}: ${esc(lv.title)}">
      <span class="num">${lv.id}</span>${badge ? `<span class="badge">${badge}</span>` : ""}
    </button>`);
    b.addEventListener("click", () => {
      Sfx.unlock();
      if (!unlocked) { Sfx.wrong(); b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); toast(CONTENT.ui.locked); return; }
      Sfx.tap();
      onPlay(lv.id);
    });
    inner.appendChild(b);
    const dark = p.y < H * 0.45;
    inner.appendChild(el(`<div class="node-label ${dark ? "on-dark" : ""} ${unlocked ? "" : "locked"}" style="left:${p.x}px;top:${p.y + 42}px">${esc(lv.title)}</div>`));
  });

  // nodo finale
  const fp = pts[TOTAL];
  const finaleOpen = current === null;
  const fb = el(`<button class="node finale ${finaleOpen ? "current" : "locked"}" style="left:${fp.x}px;top:${fp.y}px" aria-label="Finale">
    <span class="num">${finaleOpen ? "🎁" : "⭐"}</span>${finaleOpen ? "" : `<span class="badge">🔒</span>`}
  </button>`);
  fb.addEventListener("click", () => {
    Sfx.unlock();
    if (!finaleOpen) { Sfx.wrong(); toast("Il finale si apre dopo il livello 15 ✨"); return; }
    Sfx.chime();
    onFinale();
  });
  inner.appendChild(fb);
  inner.appendChild(el(`<div class="node-label on-dark" style="left:${fp.x}px;top:${fp.y + 54}px">${esc(CONTENT.ui.finaleNode)}</div>`));

  // scroll al livello corrente
  const focusK = current ? current - 1 : TOTAL;
  requestAnimationFrame(() => {
    scroll.scrollTop = Math.max(0, pts[focusK].y - scroll.clientHeight * 0.55);
    if (celebrateId) {
      const r = scroll.getBoundingClientRect();
      const target = pts[Math.min(celebrateId, TOTAL)];
      const sx = (r.left + (r.width - W) / 2 + target.x) / window.innerWidth;
      const sy = (r.top + target.y - scroll.scrollTop) / window.innerHeight;
      setTimeout(() => { confetti({ x: sx, y: sy, amount: 50, spread: 0.7 }); Sfx.pop(); }, 350);
    }
  });

  // pulsanti header
  screen.querySelector("[data-act=gallery]").addEventListener("click", () => { Sfx.tap(); onGallery(); });
  const sb = screen.querySelector("[data-act=sound]");
  sb.addEventListener("click", () => {
    Save.setSound(!Save.get().sound);
    sb.textContent = Save.get().sound ? "🔊" : "🔇";
    Sfx.unlock(); Sfx.tap();
  });

  // trucco per i test: tieni premuto il titolo 3 secondi -> completa il livello corrente
  onLongPress(screen.querySelector(".map-title"), 3000, () => {
    const c = Save.current(TOTAL);
    if (!c) return toast("Tutto già completato!");
    Save.complete(c);
    toast(`(test) Livello ${c} saltato`);
    onPlay(null); // ridisegna la mappa
  });

  const stopSnow = startSnow(screen.querySelector(".snow-canvas"), { count: 60 });
  return () => stopSnow();
}

function tree(x, y, s, seed) {
  const g = seed % 3 === 0 ? "#2f5d46" : seed % 3 === 1 ? "#3d6e52" : "#28503d";
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})">
    <ellipse cx="0" cy="34" rx="20" ry="4" fill="rgba(74,52,38,.12)"/>
    <rect x="-3" y="22" width="6" height="12" fill="#7a5136"/>
    <path d="M0 -30 L18 0 L9 0 L22 24 L-22 24 L-9 0 L-18 0 Z" fill="${g}"/>
    <path d="M0 -30 L8 -16 L3 -18 L0 -14 L-4 -18 L-8 -16 Z M-12 4 L-4 2 L0 6 L5 2 L13 5 L10 0 L-10 0 Z" fill="#fff" opacity=".9"/>
  </g>`;
}

/** Curva morbida (Catmull-Rom -> Bezier) attraverso i punti */
function smoothPath(p) {
  if (p.length < 2) return "";
  let d = `M${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}
