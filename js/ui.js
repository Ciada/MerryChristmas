// Piccoli helper UI: creazione elementi, toast, foto con segnaposto, card ricordo
import { CONTENT } from "../content.js";

/** Crea un elemento da una stringa HTML (primo nodo). */
export function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export function toast(msg) {
  document.querySelectorAll(".toast").forEach((t) => t.remove());
  const t = el(`<div class="toast" role="status">${esc(msg)}</div>`);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

/** Foto con fallback elegante se il file manca. */
export function photoEl(src, label = "") {
  const box = el(`<div class="photo"></div>`);
  const ph = () => {
    box.innerHTML = `<div class="photo-placeholder"><div class="ph-icon">📷</div><div>${esc(label || "foto in arrivo")}</div></div>`;
  };
  if (!src) { ph(); return box; }
  const img = new Image();
  img.alt = label;
  img.decoding = "async";
  img.onerror = ph;
  img.src = src;
  box.appendChild(img);
  return box;
}

export function polaroid(memory, { small = false, levelLabel = "" } = {}) {
  const p = el(`<div class="polaroid"></div>`);
  p.appendChild(photoEl(memory?.photo, small ? "" : "foto in arrivo"));
  if (levelLabel) p.appendChild(el(`<div class="lvl">${esc(levelLabel)}</div>`));
  p.appendChild(el(`<div class="caption">${esc(memory?.caption || "")}</div>`));
  return p;
}

/** Card ricordo dopo la vittoria. */
export function showMemoryCard(level, { onNext, onReplay } = {}) {
  const ui = CONTENT.ui;
  const ov = el(`<div class="overlay" role="dialog" aria-modal="true">
    <div class="memory-card">
      <div class="kicker">${esc(ui.cardTitle)} · ${level.id}/15</div>
      <h2>${esc(level.title)}</h2>
      <div class="slot"></div>
      <div class="actions">
        <button class="btn ghost small" data-act="replay">↺ ${esc(ui.replay)}</button>
        <button class="btn green" data-act="next">${esc(ui.next)} →</button>
      </div>
    </div>
  </div>`);
  ov.querySelector(".slot").replaceWith(polaroid(level.memory));
  ov.addEventListener("click", (e) => {
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (!act) return;
    ov.remove();
    if (act === "next") onNext?.();
    else onReplay?.();
  });
  document.body.appendChild(ov);
  return ov;
}

/** Pressione prolungata (ms) su un elemento. Mostra una barretta mentre tieni premuto. */
export function onLongPress(node, ms, cb) {
  let timer = null;
  const start = (e) => {
    clear();
    node.classList.add("holding");
    timer = setTimeout(() => { clear(); cb(); }, ms);
  };
  const clear = () => { clearTimeout(timer); timer = null; node.classList.remove("holding"); };
  node.addEventListener("pointerdown", start);
  ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => node.addEventListener(ev, clear));
  node.addEventListener("contextmenu", (e) => e.preventDefault());
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const rand = (a, b) => a + Math.random() * (b - a);
export const pick = (arr) => arr[(Math.random() * arr.length) | 0];
export function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
