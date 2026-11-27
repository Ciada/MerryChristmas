// Motore del gioco: routing a hash, avvio livelli, vittoria, card ricordo
import { CONTENT } from "../content.js";
import { Save } from "./storage.js";
import { Sfx } from "./audio.js";
import { celebrate } from "./fx.js";
import { el, esc, onLongPress, showMemoryCard } from "./ui.js";
import { renderMap } from "./map.js";
import { renderGallery } from "./gallery.js";
import { renderFinale } from "./finale.js";
import { loadLevel } from "../levels/index.js";

const app = document.getElementById("app");
const TOTAL = CONTENT.levels.length;
let cleanup = null;
let celebrateOnMap = null;

// iOS: l'audio si sblocca solo dopo un tocco
window.addEventListener("pointerdown", () => Sfx.unlock(), { once: true });
// niente zoom con doppio tap / pinch su iOS
document.addEventListener("gesturestart", (e) => e.preventDefault());

function go(hash) {
  if (location.hash === hash) route();
  else location.hash = hash;
}

function clearScreen() {
  if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } }
  cleanup = null;
  document.querySelectorAll(".overlay").forEach((o) => o.remove());
  app.innerHTML = "";
}

async function route() {
  const h = location.hash || "#/";
  clearScreen();
  let m;
  if ((m = h.match(/^#\/livello\/(\d+)$/))) {
    const id = +m[1];
    if (id < 1 || id > TOTAL || !Save.isUnlocked(id)) return go("#/");
    return playLevel(id);
  }
  if (h === "#/finale") {
    if (Save.current(TOTAL) !== null) return go("#/");
    cleanup = renderFinale(app, { onGallery: () => go("#/ricordi"), onBack: () => go("#/") });
    return;
  }
  if (h === "#/ricordi") {
    cleanup = renderGallery(app, {
      onBack: () => history.length > 1 ? history.back() : go("#/"),
      onReset: () => { Save.reset(); go("#/"); },
    });
    return;
  }
  const cel = celebrateOnMap; celebrateOnMap = null;
  cleanup = renderMap(app, {
    celebrateId: cel,
    onPlay: (id) => (id ? go(`#/livello/${id}`) : route()),
    onFinale: () => go("#/finale"),
    onGallery: () => go("#/ricordi"),
  });
}

async function playLevel(id) {
  const level = CONTENT.levels.find((l) => l.id === id);
  const screen = el(`<section class="screen level-screen paper-bg">
    <div class="level-bar">
      <button class="icon-btn" data-act="back" aria-label="Mappa">←</button>
      <h1 class="level-title"><small>Livello ${id} di ${TOTAL}</small>${esc(level.title)}</h1>
      <button class="icon-btn" data-act="sound" aria-label="Suono">${Save.get().sound ? "🔊" : "🔇"}</button>
    </div>
    <div class="level-stage">
      <div class="level-hud" hidden><div class="pill"></div></div>
    </div>
  </section>`);
  app.appendChild(screen);
  const stageWrap = screen.querySelector(".level-stage");
  const hudBox = screen.querySelector(".level-hud");
  const hudPill = hudBox.querySelector(".pill");
  const stage = document.createElement("div");
  stage.style.cssText = "position:absolute;inset:0";
  stageWrap.appendChild(stage);

  let instance = null;
  let alive = true;
  cleanup = () => { alive = false; instance?.destroy(); };

  screen.querySelector("[data-act=back]").addEventListener("click", () => { Sfx.tap(); go("#/"); });
  const sb = screen.querySelector("[data-act=sound]");
  sb.addEventListener("click", () => {
    Save.setSound(!Save.get().sound);
    sb.textContent = Save.get().sound ? "🔊" : "🔇";
    Sfx.tap();
  });

  const ctx = {
    level,
    content: CONTENT,
    sfx: Sfx,
    hud(text) {
      if (text == null || text === "") { hudBox.hidden = true; return; }
      hudBox.hidden = false;
      hudPill.textContent = text;
    },
    win() {
      if (!alive) return;
      const first = Save.complete(id);
      Sfx.win();
      celebrate();
      setTimeout(() => {
        if (!alive) return;
        showMemoryCard(level, {
          onNext: () => {
            celebrateOnMap = first ? id : null;
            go(id === TOTAL && first ? "#/finale" : "#/");
          },
          onReplay: () => { ctx.hud(""); instance.reset(); },
        });
      }, 1300);
    },
  };

  // trucco per i test: tieni premuto il titolo 3 secondi per vincere subito
  onLongPress(screen.querySelector(".level-title"), 3000, () => instance?.onWin());

  try {
    const LevelClass = await loadLevel(id);
    if (!alive) return;
    instance = new LevelClass();
    instance.init(stage, ctx);
  } catch (err) {
    console.error(err);
    stage.innerHTML = `<p style="padding:24px;text-align:center">Ops, il livello non si è caricato.<br><small>${esc(err.message)}</small></p>`;
    return;
  }

  // popup introduttivo (il livello parte quando si preme "Gioca")
  const backdrop = el(`<div class="intro-backdrop"></div>`);
  const intro = el(`<div class="intro-toast">
    <h2>${esc(level.title)}</h2>
    <p>${esc(level.intro)}</p>
    <button class="btn">${esc(CONTENT.ui.play)} ▶</button>
  </div>`);
  stageWrap.append(backdrop, intro);
  intro.querySelector("button").addEventListener("click", () => {
    Sfx.unlock(); Sfx.tap();
    backdrop.remove(); intro.remove();
    Save.markIntro(id);
    if (alive) instance.start();
  });
}

window.addEventListener("hashchange", route);
route();
