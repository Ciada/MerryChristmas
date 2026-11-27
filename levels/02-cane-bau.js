// Livello 2 — Il cane che fa bau. Abbina ogni verso al cane del suo paese.
// Input: trascina il verso sul cane, oppure tocca il verso e poi il cane.
import { Level } from "./base.js";
import { el, esc, pick, shuffle } from "../js/ui.js";
import { dogSVG } from "../js/characters.js";

const FLAGS = {
  it: `<rect width="10" height="20" fill="#009246"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ce2b37"/>`,
  en: `<rect width="30" height="20" fill="#fff"/><rect x="12.5" width="5" height="20" fill="#ce1124"/><rect y="7.5" width="30" height="5" fill="#ce1124"/>`,
  es: `<rect width="30" height="20" fill="#aa151b"/><rect y="5" width="30" height="10" fill="#f1bf00"/>`,
  fr: `<rect width="10" height="20" fill="#0055a4"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ef4135"/>`,
  de: `<rect width="30" height="7" fill="#1f1f1f"/><rect y="6.6" width="30" height="7" fill="#dd0000"/><rect y="13.3" width="30" height="6.7" fill="#ffce00"/>`,
  jp: `<rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="6" fill="#bc002d"/>`,
  ru: `<rect width="30" height="7" fill="#fff"/><rect y="6.6" width="30" height="7" fill="#0039a6"/><rect y="13.3" width="30" height="6.7" fill="#d52b1e"/>`,
};

const DOGS = [
  { c: "it", name: "Italia", sound: "bau bau", fur: "#f3ece1", ear: "#b27a4e", spot: "#d9b48c" },
  { c: "en", name: "Inghilterra", sound: "woof woof", fur: "#dda46a", ear: "#a8683a" },
  { c: "es", name: "Spagna", sound: "guau guau", fur: "#c98b5a", ear: "#7a4a2a" },
  { c: "fr", name: "Francia", sound: "ouaf ouaf", fur: "#efe3d6", ear: "#d8c3ad" },
  { c: "de", name: "Germania", sound: "wau wau", fur: "#a8a29b", ear: "#6f6861" },
  { c: "jp", name: "Giappone", sound: "wan wan", fur: "#e7b479", ear: "#c98744", spot: "#f6e9d9" },
  { c: "ru", name: "Russia", sound: "gav gav", fur: "#d3d7dd", ear: "#6d7480", spot: "#8b929c" },
];

const CSS = `
.dog-wrap { position:absolute; inset:0; display:flex; flex-direction:column; padding: 50px 12px 12px; gap:10px; }
.dog-grid { flex:1; min-height:0; display:grid; grid-template-columns:1fr 1fr; grid-auto-rows:minmax(0,1fr); gap:8px; }
.dog-grid > .dog-card:last-child:nth-child(odd) { grid-column: 1 / -1; justify-self:center; width: calc(50% - 4px); }
.dog-card {
  position:relative; border:0; border-radius:20px; background:var(--paper); box-shadow: var(--shadow-sm);
  display:flex; flex-direction:column; align-items:center; justify-content:flex-end; padding:6px 6px 8px; min-height:0;
  transition: transform .15s ease, box-shadow .15s ease, background .2s;
  cursor:pointer;
}
.dog-card.target { box-shadow: 0 0 0 3px var(--gold), var(--shadow-sm); }
.dog-card.hover { transform: scale(1.04); box-shadow: 0 0 0 4px var(--green), var(--shadow); }
.dog-card.matched { background: #eef5ef; }
.dog-card .dog { flex:1; min-height:0; width:100%; display:flex; justify-content:center; }
.dog-card .dog svg { height:100%; max-width:100%; }
.dog-card .bubble {
  min-width:70%; min-height:30px; padding:4px 10px; border-radius:14px; margin-bottom:2px;
  border:2px dashed #d8ccb8; color:var(--ink); font-family:var(--font-title); font-weight:600; font-size:1rem;
  display:flex; align-items:center; justify-content:center; position:relative; background:#fff;
}
.dog-card .bubble::after { content:""; position:absolute; bottom:-7px; left:50%; width:10px; height:10px; background:#fff;
  border-right:2px dashed #d8ccb8; border-bottom:2px dashed #d8ccb8; transform: translateX(-50%) rotate(45deg); }
.dog-card.matched .bubble { border-style:solid; border-color: var(--green); }
.dog-card.matched .bubble::after { border-style:solid; border-color: var(--green); }
.dog-card .bubble.say { animation: pop-say .4s cubic-bezier(.2,1.6,.4,1); }
@keyframes pop-say { from { transform: scale(.4); } to { transform: scale(1); } }
.dog-card .country { display:flex; align-items:center; gap:6px; font-size:.85rem; font-weight:800; color: var(--ink-soft); }
.dog-card .country svg { width:24px; height:16px; border-radius:3px; box-shadow: 0 0 0 1px rgba(0,0,0,.12); }
.chips { display:flex; flex-wrap:wrap; justify-content:center; gap:8px; min-height:140px; align-content:center;
  background: rgba(255,255,255,.5); border-radius:18px; padding:10px; }
.chip {
  border:0; border-radius:999px; padding:10px 16px; background: var(--red); color:#fff; cursor:grab;
  font-family:var(--font-title); font-weight:600; font-size:1.05rem; box-shadow: 0 3px 0 var(--red-deep);
  touch-action:none; transition: transform .12s, opacity .2s;
}
.chip.selected { background: var(--gold); color: var(--ink); box-shadow: 0 3px 0 #a37a2a; transform: translateY(-3px) scale(1.06); }
.chip.dragging { opacity:.3; }
.chip.ghost { position:fixed; z-index:700; pointer-events:none; transform: translate(-50%,-60%) scale(1.12) rotate(-4deg); opacity:.95; }
.chips .done-msg { font-family:var(--font-title); color: var(--green); font-size:1.1rem; }
.italy-pop { position:absolute; inset:0; z-index:15; display:grid; place-items:center; padding:20px;
  background: rgba(42,30,22,.35); animation: fade-in .2s ease; }
.italy-pop .box { background:var(--paper); border-radius:24px; padding:18px; text-align:center; box-shadow: var(--shadow);
  width:min(100%, 340px); animation: card-in .5s cubic-bezier(.2,1.3,.4,1) both; }
.italy-pop .say { position:relative; background:#fff; border:3px solid var(--ink); border-radius:18px; padding:12px 14px;
  font-family:var(--font-title); font-weight:600; font-size:1.25rem; line-height:1.25; margin-bottom:14px; }
.italy-pop .say::after { content:""; position:absolute; bottom:-12px; left:50%; width:18px; height:18px; background:#fff;
  border-right:3px solid var(--ink); border-bottom:3px solid var(--ink); transform: translateX(-50%) rotate(45deg); }
.italy-pop .dogbig { width:150px; margin:0 auto; }
.italy-pop .tap { font-size:.85rem; color: var(--ink-soft); margin-top:8px; }
`;

export default class CaneBau extends Level {
  build() {
    this.texts = this.ctx.content.dogs || {};
    this.matched = new Set();
    this.selected = null;
    this.blocked = false;

    this.stage.appendChild(el(`<style>${CSS}</style>`));
    const wrap = el(`<div class="dog-wrap"><div class="dog-grid"></div><div class="chips"></div></div>`);
    this.stage.appendChild(wrap);
    this.grid = wrap.querySelector(".dog-grid");
    this.chipsBox = wrap.querySelector(".chips");

    for (const d of shuffle(DOGS)) {
      const card = el(`<button class="dog-card" data-c="${d.c}" aria-label="Cane ${esc(d.name)}">
        <div class="bubble">&nbsp;</div>
        <div class="dog">${dogSVG({ fur: d.fur, ear: d.ear, spot: d.spot })}</div>
        <div class="country"><svg viewBox="0 0 30 20">${FLAGS[d.c]}</svg>${esc(d.name)}</div>
      </button>`);
      card._dog = d;
      this.listen(card, "click", () => this.onCardTap(card));
      this.grid.appendChild(card);
    }
    for (const d of shuffle(DOGS)) {
      const chip = el(`<button class="chip" data-c="${d.c}">${esc(d.sound)}</button>`);
      this.setupChip(chip);
      this.chipsBox.appendChild(chip);
    }
    this.updateHud();
  }

  updateHud() { this.hud(`🐶 ${this.matched.size}/${DOGS.length}`); }

  // ---------- input ----------
  setupChip(chip) {
    let start = null, ghost = null, hoverCard = null;
    const cardAt = (x, y) => document.elementFromPoint(x, y)?.closest?.(".dog-card");

    this.listen(chip, "pointerdown", (e) => {
      if (this.blocked) return;
      e.preventDefault();
      start = { x: e.clientX, y: e.clientY, id: e.pointerId };
      try { chip.setPointerCapture(e.pointerId); } catch {}
    });
    this.listen(chip, "pointermove", (e) => {
      if (!start || e.pointerId !== start.id) return;
      if (!ghost && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8) {
        ghost = chip.cloneNode(true);
        ghost.classList.add("ghost");
        ghost.classList.remove("selected");
        document.body.appendChild(ghost);
        chip.classList.add("dragging");
        this.select(null);
      }
      if (ghost) {
        ghost.style.left = e.clientX + "px";
        ghost.style.top = e.clientY + "px";
        const c = cardAt(e.clientX, e.clientY);
        if (c !== hoverCard) {
          hoverCard?.classList.remove("hover");
          hoverCard = c && !c.classList.contains("matched") ? c : null;
          hoverCard?.classList.add("hover");
        }
      }
    });
    const end = (e, cancelled) => {
      if (!start || e.pointerId !== start.id) return;
      start = null;
      hoverCard?.classList.remove("hover"); hoverCard = null;
      if (ghost) {
        ghost.remove(); ghost = null;
        chip.classList.remove("dragging");
        const c = !cancelled && cardAt(e.clientX, e.clientY);
        if (c) this.tryMatch(chip, c);
      } else if (!cancelled) {
        this.ctx.sfx.tap();
        this.select(this.selected === chip ? null : chip);
      }
    };
    this.listen(chip, "pointerup", (e) => end(e, false));
    this.listen(chip, "pointercancel", (e) => end(e, true));
    // tastiera: Invio/Spazio seleziona
    this.listen(chip, "keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this.select(this.selected === chip ? null : chip); }
    });
  }

  select(chip) {
    this.selected?.classList.remove("selected");
    this.selected = chip;
    chip?.classList.add("selected");
    this.grid.querySelectorAll(".dog-card:not(.matched)").forEach((c) => c.classList.toggle("target", !!chip));
  }

  onCardTap(card) {
    if (this.blocked || card.classList.contains("matched")) return;
    if (!this.selected) {
      // nessun verso scelto: il cane abbaia un "?"
      this.say(card, "?");
      return;
    }
    const chip = this.selected;
    this.select(null);
    this.tryMatch(chip, card);
  }

  // ---------- logica ----------
  tryMatch(chip, card) {
    if (this.won || card.classList.contains("matched")) return;
    const d = card._dog;
    if (chip.dataset.c === d.c) {
      this.matched.add(d.c);
      card.classList.add("matched");
      card.classList.remove("target");
      chip.remove();
      this.ctx.sfx.bark();
      this.say(card, d.sound, true);
      this.setDog(card, d.c === "it" ? "sideeye" : "happy");
      this.updateHud();
      if (d.c === "it") this.italyMoment();
      this.checkWin();
    } else {
      this.ctx.sfx.wrong();
      card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
      this.setDog(card, "confused");
      this.say(card, pick(this.texts.wrongLines || ["?"]));
      this.timeout(() => { if (!card.classList.contains("matched")) { this.setDog(card, "normal"); this.say(card, " "); } }, 1100);
    }
  }

  setDog(card, expr) {
    const d = card._dog;
    card.querySelector(".dog").innerHTML = dogSVG({ fur: d.fur, ear: d.ear, spot: d.spot, expr });
  }

  say(card, text, keep = false) {
    const b = card.querySelector(".bubble");
    b.textContent = text;
    b.classList.remove("say"); void b.offsetWidth; b.classList.add("say");
    if (!keep && text === "?") this.timeout(() => { if (!card.classList.contains("matched")) b.textContent = " "; }, 800);
  }

  italyMoment() {
    this.blocked = true;
    const d = DOGS[0];
    const pop = el(`<div class="italy-pop" role="dialog">
      <div class="box">
        <div class="say">${esc(this.texts.italyLine || "Sì, in Italia facciamo BAU. Fattene una ragione.")}</div>
        <div class="dogbig">${dogSVG({ fur: d.fur, ear: d.ear, spot: d.spot, expr: "sideeye" })}</div>
        <div class="tap">tocca per continuare</div>
      </div>
    </div>`);
    this.stage.appendChild(pop);
    const close = () => {
      if (!pop.isConnected) return;
      pop.remove();
      this.blocked = false;
      this.checkWin();
    };
    this.timeout(() => this.listen(pop, "click", close), 600);
    this.timeout(close, 5000);
  }

  checkWin() {
    if (this.matched.size === DOGS.length && !this.blocked) {
      this.chipsBox.innerHTML = `<div class="done-msg">Tutti i cani sono felici! 🐾</div>`;
      this.timeout(() => this.onWin(), 700);
    }
  }
}
