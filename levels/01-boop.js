// Livello 1 — Boop! Tocca il nasino 10 volte. Il naso si sposta (sempre di più).
import { Level } from "./base.js";
import { el, pick, rand } from "../js/ui.js";
import { PAL } from "../js/characters.js";

const CSS = `
.boop-wrap { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.boop-face { width:min(96%, 440px); max-height:92%; touch-action:none; cursor:pointer; }
.boop-face .squash { transform-box: fill-box; transform-origin: center; transition: transform .14s cubic-bezier(.3,1.6,.5,1); }
.boop-face .squash.hit { transform: scale(1.35, .62); transition-duration: .06s; }
.boop-face .cheek { transition: opacity .5s ease; }
.boop-face.wiggle { animation: boop-wiggle .4s ease; }
@keyframes boop-wiggle { 0%,100%{transform:rotate(0)} 30%{transform:rotate(-3deg)} 70%{transform:rotate(3deg)} }
.boop-word {
  position:absolute; pointer-events:none; font-family:var(--font-title); font-weight:700;
  color:var(--red); font-size:2.4rem; -webkit-text-stroke: 2px #fff; paint-order: stroke fill;
  text-shadow: 0 3px 0 rgba(122,31,43,.25); white-space:nowrap;
  animation: boop-pop .9s cubic-bezier(.2,1.4,.4,1) forwards;
}
@keyframes boop-pop {
  0% { opacity:0; transform: translate(-50%,-50%) scale(.3) rotate(var(--r)); }
  25% { opacity:1; transform: translate(-50%,-120%) scale(1.15) rotate(var(--r)); }
  100% { opacity:0; transform: translate(-50%,-230%) scale(1) rotate(var(--r)); }
}
.boop-heart { position:absolute; pointer-events:none; font-size:1.4rem; animation: boop-heart 1.1s ease-out forwards; }
@keyframes boop-heart { from { opacity:1; transform: translate(-50%,-50%) scale(.6);} to { opacity:0; transform: translate(calc(-50% + var(--dx)), calc(-50% - 90px)) scale(1.2);} }
.boop-hint { position:absolute; left:50%; bottom:6%; transform:translateX(-50%); font-family:var(--font-title);
  color:var(--ink-soft); font-size:1rem; white-space:nowrap; }
`;

const NOSE_HOME = { x: 150, y: 218 };
const NOSE_AREA = { x0: 108, x1: 192, y0: 206, y1: 242 };

function faceSVG() {
  const P = PAL;
  return `<svg class="boop-face" viewBox="0 0 300 360" xmlns="http://www.w3.org/2000/svg" aria-label="il suo faccino">
  <!-- spalle e camicia -->
  <path d="M40 360 C44 318 92 300 150 300 C208 300 256 318 260 360 Z" fill="${P.shirt}"/>
  <path d="M118 300 L150 330 L182 300" fill="none" stroke="${P.shirtShade}" stroke-width="7" stroke-linejoin="round"/>
  <rect x="132" y="270" width="36" height="36" fill="${P.skinShade}"/>
  <!-- orecchie -->
  <ellipse cx="60" cy="196" rx="15" ry="22" fill="${P.skin}"/>
  <ellipse cx="240" cy="196" rx="15" ry="22" fill="${P.skin}"/>
  <!-- testa -->
  <ellipse cx="150" cy="186" rx="92" ry="104" fill="${P.skin}"/>
  <!-- capelli spettinati -->
  <path d="M58 168 C46 86 98 50 154 52 C214 54 258 90 244 168 C238 132 226 112 208 100 C200 112 184 112 172 100 C160 112 140 114 128 100 C114 112 98 112 92 102 C74 116 62 140 58 168 Z" fill="${P.luiHair}"/>
  <path d="M112 60 q-8 -20 10 -28 M150 54 q2 -22 22 -24 M188 62 q12 -18 30 -12 M86 84 q-18 -4 -18 -18" stroke="${P.luiHair}" stroke-width="12" fill="none" stroke-linecap="round"/>
  <!-- sopracciglia -->
  <path class="brow" d="M90 122 q20 -10 40 -3 M170 119 q20 -7 40 3" stroke="${P.luiHair}" stroke-width="7" fill="none" stroke-linecap="round"/>
  <!-- guance -->
  <circle class="cheek" cx="92" cy="232" r="20" fill="${P.cheek}" opacity=".45"/>
  <circle class="cheek" cx="208" cy="232" r="20" fill="${P.cheek}" opacity=".45"/>
  <!-- occhi aperti -->
  <g class="eyes-open">
    <circle cx="112" cy="168" r="20" fill="#fff"/>
    <circle cx="188" cy="168" r="20" fill="#fff"/>
    <g class="pupil" data-cx="112" data-cy="168"><circle r="14.5" fill="${P.ink}"/><circle cx="5" cy="-5" r="5" fill="#fff"/></g>
    <g class="pupil" data-cx="188" data-cy="168"><circle r="14.5" fill="${P.ink}"/><circle cx="5" cy="-5" r="5" fill="#fff"/></g>
  </g>
  <!-- occhi felici ^^ -->
  <g class="eyes-happy" style="display:none" stroke="${P.ink}" stroke-width="6" fill="none" stroke-linecap="round">
    <path d="M96 172 q16 -20 32 0"/><path d="M172 172 q16 -20 32 0"/>
  </g>
  <!-- occhiali -->
  <g fill="none" stroke="${P.glasses}" stroke-width="7">
    <rect x="70" y="134" width="76" height="66" rx="22"/>
    <rect x="154" y="134" width="76" height="66" rx="22"/>
    <path d="M146 156 q4 -7 8 0" />
    <path d="M72 158 L48 154 M228 158 L252 154"/>
  </g>
  <!-- bocca -->
  <path class="mouth-smile" d="M134 266 q16 14 32 0" stroke="${P.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse class="mouth-o" cx="150" cy="268" rx="9" ry="11" fill="#8a3b36" stroke="${P.ink}" stroke-width="3" style="display:none"/>
  <!-- NASO (si sposta) -->
  <g class="nose" transform="translate(${NOSE_HOME.x} ${NOSE_HOME.y})">
    <g class="squash">
      <circle r="34" fill="transparent"/>
      <ellipse cx="0" cy="2" rx="17" ry="14" fill="${P.skinShade}"/>
      <ellipse cx="-2" cy="0" rx="15" ry="12" fill="#f3c2a8"/>
      <ellipse cx="-6" cy="-4" rx="5" ry="3.5" fill="#fff" opacity=".6"/>
    </g>
  </g>
</svg>`;
}

export default class Boop extends Level {
  build() {
    const cfg = this.ctx.content.boop || {};
    this.target = cfg.target || 10;
    this.words = cfg.reactions?.length ? cfg.reactions : ["boop!"];
    this.count = 0;
    this.misses = 0;
    this.nose = { ...NOSE_HOME };
    this.goal = { ...NOSE_HOME };
    this.t = 0;

    this.stage.appendChild(el(`<style>${CSS}</style>`));
    this.wrap = el(`<div class="boop-wrap">${faceSVG()}<div class="boop-hint">tocca il nasino 👆</div></div>`);
    this.stage.appendChild(this.wrap);
    this.svg = this.wrap.querySelector("svg");
    this.noseG = this.svg.querySelector(".nose");
    this.squash = this.svg.querySelector(".squash");
    this.pupils = [...this.svg.querySelectorAll(".pupil")];
    this.cheeks = [...this.svg.querySelectorAll(".cheek")];
    this.hint = this.wrap.querySelector(".boop-hint");
    this.updateHud();

    this.listen(this.svg, "pointerdown", (e) => this.onTap(e));
    this.listen(window, "keydown", (e) => {
      if (e.code === "Space" || e.code === "Enter") { e.preventDefault(); this.boop(); }
    });

    // movimento continuo: il naso va verso il suo obiettivo e "balla" un po'
    this.loop((dt) => {
      this.t += dt;
      const lively = this.count / this.target; // 0 → 1
      const amp = 2 + lively * 12;
      const k = 1 - Math.pow(0.001, dt);       // smorzamento indipendente dal framerate
      this.nose.x += (this.goal.x - this.nose.x) * k * 0.9;
      this.nose.y += (this.goal.y - this.nose.y) * k * 0.9;
      const x = this.nose.x + Math.sin(this.t * (2 + lively * 2.5)) * amp;
      const y = this.nose.y + Math.cos(this.t * (1.6 + lively * 2)) * amp * 0.5;
      this.cur = { x, y };
      this.noseG.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      // gli occhi guardano il naso
      for (const p of this.pupils) {
        const cx = +p.dataset.cx, cy = +p.dataset.cy;
        const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) || 1;
        p.setAttribute("transform", `translate(${(cx + (dx / d) * 4).toFixed(1)} ${(cy + (dy / d) * 4).toFixed(1)})`);
      }
    });
  }

  toSvg(e) {
    const pt = this.svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(this.svg.getScreenCTM().inverse());
  }

  onTap(e) {
    if (this.won || this.count >= this.target) return;
    const p = this.toSvg(e);
    const c = this.cur || this.nose;
    if (Math.hypot(p.x - c.x, p.y - c.y) <= 36) {
      this.boop();
    } else {
      this.misses++;
      this.svg.classList.remove("wiggle"); void this.svg.getBoundingClientRect(); this.svg.classList.add("wiggle");
      if (this.misses % 3 === 0) this.hint.textContent = "il nasino è in mezzo! 👃";
    }
  }

  boop() {
    if (this.won || this.count >= this.target) return;
    this.count++;
    this.ctx.sfx.boop();
    if (navigator.vibrate) try { navigator.vibrate(15); } catch {}
    this.hint.textContent = "";

    // naso schiacciato
    this.squash.classList.add("hit");
    this.timeout(() => this.squash.classList.remove("hit"), 110);
    // occhi felici + bocca a "o"
    this.face(true);
    this.timeout(() => this.face(false), 380);
    // guance rosse
    this.cheeks.forEach((c) => c.setAttribute("opacity", "1"));
    this.timeout(() => this.cheeks.forEach((c) => c.setAttribute("opacity", ".45")), 500);

    this.popWord();
    this.updateHud();

    if (this.count >= this.target) {
      this.face(true);
      this.cheeks.forEach((c) => c.setAttribute("opacity", "1"));
      for (let i = 0; i < 8; i++) this.timeout(() => this.heart(), i * 90);
      this.timeout(() => this.onWin(), 700);
      return;
    }
    // nuova posizione del naso: più si va avanti, più si allontana
    const lively = this.count / this.target;
    const rx = (NOSE_AREA.x1 - NOSE_AREA.x0) / 2, ry = (NOSE_AREA.y1 - NOSE_AREA.y0) / 2;
    const cx = (NOSE_AREA.x0 + NOSE_AREA.x1) / 2, cy = (NOSE_AREA.y0 + NOSE_AREA.y1) / 2;
    const a = rand(0, Math.PI * 2);
    const r = 0.35 + lively * 0.65;
    this.goal = { x: cx + Math.cos(a) * rx * r, y: cy + Math.sin(a) * ry * r };
  }

  face(happy) {
    this.svg.querySelector(".eyes-open").style.display = happy ? "none" : "";
    this.svg.querySelector(".eyes-happy").style.display = happy ? "" : "none";
    this.svg.querySelector(".mouth-smile").style.display = happy ? "none" : "";
    this.svg.querySelector(".mouth-o").style.display = happy ? "" : "none";
  }

  screenPos() {
    const c = this.cur || this.nose;
    const pt = this.svg.createSVGPoint(); pt.x = c.x; pt.y = c.y;
    const s = pt.matrixTransform(this.svg.getScreenCTM());
    const r = this.stage.getBoundingClientRect();
    return { x: s.x - r.left, y: s.y - r.top };
  }

  popWord() {
    const { x, y } = this.screenPos();
    const big = this.count === this.target;
    const w = el(`<div class="boop-word" style="left:${x}px;top:${y}px;--r:${rand(-14, 14).toFixed(0)}deg">${big ? "BOOOOP! ❤" : pick(this.words)}</div>`);
    if (big) w.style.fontSize = "3rem";
    this.stage.appendChild(w);
    this.timeout(() => w.remove(), 950);
  }

  heart() {
    const { x, y } = this.screenPos();
    const h = el(`<div class="boop-heart" style="left:${x + rand(-30, 30)}px;top:${y}px;--dx:${rand(-60, 60).toFixed(0)}px">${pick(["❤️", "💕", "💗"])}</div>`);
    this.stage.appendChild(h);
    this.timeout(() => h.remove(), 1150);
  }

  updateHud() { this.hud(`👃 Boop: ${this.count}/${this.target}`); }
}
