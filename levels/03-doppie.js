// Livello 3 — Collo o colo? Scegli la parola giusta tra due (doppie sì / doppie no).
// 8 domande, ne servono 6 giuste. Se non bastano, si riprova subito.
import { Level } from "./base.js";
import { el, esc, pick, shuffle } from "../js/ui.js";
import { giadaSVG } from "../js/characters.js";

const MOLE = `<svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg" aria-label="Mole Antonelliana">
  <path d="M40 2 L42 40 L38 40 Z" fill="#8a7a66"/>
  <circle cx="40" cy="4" r="2.5" fill="#d9a441"/>
  <rect x="34" y="38" width="12" height="10" fill="#cdbfa8"/>
  <path d="M24 78 C24 56 34 48 40 46 C46 48 56 56 56 78 Z" fill="#9aa7b0"/>
  <path d="M30 78 C31 62 36 54 40 50 M50 78 C49 62 44 54 40 50" stroke="#7d8a94" stroke-width="1.5" fill="none"/>
  <rect x="18" y="78" width="44" height="12" fill="#e4d6bf"/>
  <rect x="12" y="90" width="56" height="26" fill="#efe3cf"/>
  <g fill="#b9a88f">
    <rect x="18" y="96" width="6" height="14"/><rect x="30" y="96" width="6" height="14"/>
    <rect x="44" y="96" width="6" height="14"/><rect x="56" y="96" width="6" height="14"/>
    <rect x="22" y="81" width="4" height="7"/><rect x="38" y="81" width="4" height="7"/><rect x="54" y="81" width="4" height="7"/>
  </g>
</svg>`;

const CSS = `
.dp-wrap { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; padding:56px 16px 12px; gap:14px; }
.dp-card {
  width:100%; max-width:420px; background:var(--paper); border-radius:24px; box-shadow:var(--shadow);
  padding:18px 16px 20px; text-align:center; animation: card-in .45s cubic-bezier(.2,1.3,.4,1) both;
}
.dp-pic { font-size:5.2rem; line-height:1.1; height:120px; display:grid; place-items:center; }
.dp-pic svg { height:118px; }
.dp-text { font-family:var(--font-title); font-size:1.3rem; margin-top:8px; line-height:1.3; }
.dp-options { display:grid; grid-template-columns:1fr 1fr; gap:12px; width:100%; max-width:420px; }
.dp-opt {
  border:0; border-radius:20px; padding:18px 8px; cursor:pointer;
  font-family:var(--font-title); font-weight:700; font-size:1.7rem; letter-spacing:.5px;
  background:#fff; color:var(--ink); box-shadow:0 5px 0 var(--cream-2), var(--shadow-sm);
  transition: transform .1s, background .2s, color .2s;
}
.dp-opt:active { transform: translateY(3px); }
.dp-opt.right { background:var(--green); color:#fff; box-shadow:0 5px 0 #1c3a2b; }
.dp-opt.wrong { background:var(--red); color:#fff; box-shadow:0 5px 0 var(--red-deep); }
.dp-opt:disabled { cursor:default; }
.dp-giada { position:relative; flex:1; min-height:0; width:100%; max-width:420px; display:flex; align-items:flex-end; justify-content:flex-start; }
.dp-giada .g { height:min(100%, 300px); aspect-ratio: 120/200; transition: transform .2s; }
.dp-giada .g.laugh { animation: dp-laugh .5s ease-in-out 2; }
@keyframes dp-laugh { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-5deg) translateY(-4px)} 75%{transform:rotate(5deg) translateY(-4px)} }
.dp-bubble {
  position:absolute; left:min(42%, 160px); bottom:55%; max-width:56%;
  background:#fff; border:3px solid var(--ink); border-radius:18px; padding:10px 14px;
  font-family:var(--font-title); font-weight:600; font-size:1.15rem; line-height:1.2;
  animation: pop-say .35s cubic-bezier(.2,1.6,.4,1);
}
.dp-bubble::after { content:""; position:absolute; left:-11px; bottom:14px; width:16px; height:16px; background:#fff;
  border-left:3px solid var(--ink); border-bottom:3px solid var(--ink); transform: rotate(45deg); }
@keyframes pop-say { from { transform: scale(.4); opacity:0 } to { transform: scale(1); opacity:1 } }
.dp-dots { display:flex; gap:6px; justify-content:center; }
.dp-dots span { width:12px; height:12px; border-radius:50%; background:#e2d7c4; }
.dp-dots span.ok { background:var(--green); } .dp-dots span.ko { background:var(--red); } .dp-dots span.now { box-shadow:0 0 0 3px var(--gold); }
.dp-retry { text-align:center; }
.dp-retry p { font-family:var(--font-title); font-size:1.25rem; margin:0 0 16px; }
`;

export default class Doppie extends Level {
  build() {
    const cfg = this.ctx.content.doppie;
    this.cfg = cfg;
    this.need = cfg.need ?? 6;
    this.questions = shuffle(cfg.questions);
    this.i = 0;
    this.score = 0;
    this.results = [];
    this.busy = false;

    this.stage.appendChild(el(`<style>${CSS}</style>`));
    this.wrap = el(`<div class="dp-wrap">
      <div class="dp-dots"></div>
      <div class="dp-card"></div>
      <div class="dp-options"></div>
      <div class="dp-giada"><div class="g">${giadaSVG({ mood: "smile" })}</div></div>
    </div>`);
    this.stage.appendChild(this.wrap);
    this.dots = this.wrap.querySelector(".dp-dots");
    this.card = this.wrap.querySelector(".dp-card");
    this.opts = this.wrap.querySelector(".dp-options");
    this.giada = this.wrap.querySelector(".dp-giada");
    this.g = this.giada.querySelector(".g");

    this.listen(window, "keydown", (e) => {
      if (e.key === "ArrowLeft" || e.key === "1") this.opts.children[0]?.click();
      if (e.key === "ArrowRight" || e.key === "2") this.opts.children[1]?.click();
    });
    this.show();
  }

  updateHud() { this.hud(`✔ ${this.score}/${this.need} · domanda ${Math.min(this.i + 1, this.questions.length)}/${this.questions.length}`); }

  renderDots() {
    this.dots.innerHTML = this.questions.map((_, k) =>
      `<span class="${this.results[k] === true ? "ok" : this.results[k] === false ? "ko" : k === this.i ? "now" : ""}"></span>`).join("");
  }

  show() {
    const q = this.questions[this.i];
    this.updateHud();
    this.renderDots();
    this.card.style.animation = "none"; void this.card.offsetWidth; this.card.style.animation = "";
    this.card.innerHTML = `<div class="dp-pic">${q.pic === "mole" ? MOLE : esc(q.pic)}</div><div class="dp-text">${esc(q.text)}</div>`;
    this.opts.innerHTML = "";
    for (const w of shuffle(q.options)) {
      const b = el(`<button class="dp-opt">${esc(w)}</button>`);
      b.addEventListener("click", () => this.answer(b, w));
      this.opts.appendChild(b);
    }
    this.busy = false;
  }

  answer(btn, word) {
    if (this.busy || this.won) return;
    this.busy = true;
    const q = this.questions[this.i];
    const ok = word === q.answer;
    [...this.opts.children].forEach((b) => { b.disabled = true; if (b.textContent === q.answer) b.classList.add("right"); });
    this.results[this.i] = ok;
    if (ok) {
      this.score++;
      this.ctx.sfx.good();
      this.setGiada("happy", pick(this.cfg.good || ["Esatto!"]));
    } else {
      btn.classList.add("wrong", "shake");
      this.ctx.sfx.wrong();
      this.setGiada("laugh", pick(this.cfg.laughs || ["ahahah di nuovo?!"]));
    }
    this.renderDots();
    this.updateHud();
    this.timeout(() => this.next(), ok ? 950 : 1700);
  }

  setGiada(mood, text) {
    this.g.innerHTML = giadaSVG({ mood });
    this.g.classList.remove("laugh"); void this.g.offsetWidth;
    if (mood === "laugh") this.g.classList.add("laugh");
    this.giada.querySelector(".dp-bubble")?.remove();
    if (text) this.giada.appendChild(el(`<div class="dp-bubble">${esc(text)}</div>`));
  }

  next() {
    this.i++;
    this.setGiada("smile", "");
    if (this.score >= this.need && this.i >= this.questions.length) return this.finish();
    if (this.i >= this.questions.length) return this.retry();
    // vittoria anticipata impossibile da perdere? continua comunque tutte le 8 domande
    this.show();
  }

  finish() {
    this.setGiada("happy", "Bravissimo! 👏");
    this.card.innerHTML = `<div class="dp-pic">🏆</div><div class="dp-text">${this.score} su ${this.questions.length}!</div>`;
    this.opts.innerHTML = "";
    this.hud(`✔ ${this.score}/${this.questions.length}`);
    this.timeout(() => this.onWin(), 700);
  }

  retry() {
    this.setGiada("laugh", "ahahah!");
    this.card.innerHTML = `<div class="dp-retry"><p>${esc(this.cfg.retry || "Riproviamo?")}</p><button class="btn">Riprova ↺</button></div>`;
    this.opts.innerHTML = "";
    this.card.querySelector("button").addEventListener("click", () => { this.ctx.sfx.tap(); this.reset(); });
  }
}
