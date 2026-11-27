// Livello segnaposto per i minigiochi non ancora costruiti
import { Level } from "./base.js";
import { el } from "../js/ui.js";
import { giadaSVG } from "../js/characters.js";

export default class Placeholder extends Level {
  build() {
    const node = el(`<div style="height:100%;display:grid;place-items:center;align-content:center;gap:18px;padding:24px;text-align:center">
      <div style="width:130px">${giadaSVG({ mood: "smile" })}</div>
      <p style="font-family:var(--font-title);font-size:1.2rem;margin:0">Questo livello è ancora in costruzione 🛠️</p>
      <button class="btn gold">Supera livello</button>
    </div>`);
    node.querySelector("button").addEventListener("click", () => this.onWin());
    this.stage.appendChild(node);
  }
}
