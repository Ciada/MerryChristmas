// Finale: busta che si apre, lettera scritta a macchina, premio, galleria
import { CONTENT } from "../content.js";
import { Save } from "./storage.js";
import { Sfx } from "./audio.js";
import { startSnow, celebrate } from "./fx.js";
import { el, esc } from "./ui.js";

export function renderFinale(app, { onGallery, onBack }) {
  const F = CONTENT.finale;
  const s = el(`<section class="screen finale-screen">
    <canvas class="snow-canvas"></canvas>
    <button class="icon-btn" data-act="back" aria-label="Mappa" style="position:absolute;left:12px;top:calc(10px + var(--safe-top));z-index:5">←</button>
    <div class="stage" style="position:relative;z-index:3;display:grid;place-items:center;width:100%">
      <div class="envelope-wrap" role="button" aria-label="Apri la busta">
        <div class="envelope">
          <div class="letter"></div>
          <div class="front"></div>
          <div class="flap"></div>
          <div class="seal">❤</div>
        </div>
        <div class="envelope-label">${esc(F.envelopeLabel)} · tocca per aprire</div>
      </div>
    </div>
  </section>`);
  app.appendChild(s);
  const stopSnow = startSnow(s.querySelector(".snow-canvas"), { count: 50 });
  const stage = s.querySelector(".stage");
  const env = s.querySelector(".envelope-wrap");
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  env.addEventListener("click", () => {
    if (env.classList.contains("open")) return;
    Sfx.unlock(); Sfx.chime();
    env.classList.add("open");
    later(showLetter, 1900);
  }, { once: true });

  function showLetter() {
    stage.innerHTML = "";
    const card = el(`<div class="letter-full">
      <h2>${esc(F.letterTitle)}</h2>
      <div class="body typing"></div>
      <div class="sig" style="opacity:0">${esc(F.signature)}</div>
      <div class="after"></div>
    </div>`);
    stage.appendChild(card);
    const body = card.querySelector(".body");
    const text = F.letter;
    let i = 0;
    const skip = () => { i = text.length; };
    card.addEventListener("click", skip);
    const type = () => {
      i = Math.min(text.length, i + (text[i] === "\n" ? 1 : 2));
      body.textContent = text.slice(0, i);
      card.scrollTop = card.scrollHeight;
      if (i < text.length) later(type, 28);
      else {
        body.classList.remove("typing");
        card.removeEventListener("click", skip);
        card.querySelector(".sig").style.cssText = "opacity:1;transition:opacity 1s";
        later(() => showPrize(card), 1200);
      }
    };
    type();
  }

  function showPrize(card) {
    Save.setFinaleSeen();
    Sfx.win(); celebrate();
    const box = el(`<div class="prize-box">
      <h3>🎁 ${esc(F.prizeTitle)}</h3>
      <div>${esc(F.prizeText)}</div>
      ${F.prizeCode ? `<div class="code">${esc(F.prizeCode)}</div>` : ""}
      <div style="margin-top:16px"><button class="btn green small">${esc(F.galleryButton)}</button></div>
    </div>`);
    box.querySelector("button").addEventListener("click", () => { Sfx.tap(); onGallery(); });
    card.querySelector(".after").appendChild(box);
    setTimeout(() => box.scrollIntoView({ behavior: "smooth", block: "end" }), 100);
  }

  s.querySelector("[data-act=back]").addEventListener("click", () => { Sfx.tap(); onBack(); });

  return () => { stopSnow(); timers.forEach(clearTimeout); };
}
