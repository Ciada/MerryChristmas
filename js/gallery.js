// Galleria delle card ricordo raccolte
import { CONTENT } from "../content.js";
import { Save } from "./storage.js";
import { Sfx } from "./audio.js";
import { el, esc, polaroid } from "./ui.js";

export function renderGallery(app, { onBack, onReset }) {
  const s = el(`<section class="screen gallery-screen paper-bg">
    <div class="level-bar">
      <button class="icon-btn" data-act="back" aria-label="Indietro">←</button>
      <h1 class="level-title">${esc(CONTENT.ui.galleryTitle)}</h1>
      <span style="width:44px"></span>
    </div>
    <div class="gallery-grid"></div>
  </section>`);
  const grid = s.querySelector(".gallery-grid");
  const done = CONTENT.levels.filter((l) => Save.isDone(l.id));
  if (!done.length) {
    grid.appendChild(el(`<div class="gallery-empty">Ancora nessun ricordo.<br>Gioca il primo livello! ❄️</div>`));
  }
  for (const lv of done) {
    const extras = lv.id === 12 && lv.extraPhotos ? lv.extraPhotos : [lv.memory?.photo];
    extras.forEach((photo, i) => {
      grid.appendChild(polaroid({ photo, caption: i === 0 ? lv.memory?.caption : "" }, { small: true, levelLabel: `${lv.id} · ${lv.title}` }));
    });
  }
  const reset = el(`<button style="grid-column:1/-1;margin-top:20px;background:none;border:0;color:var(--ink-soft);text-decoration:underline;font-size:.85rem;cursor:pointer">${esc(CONTENT.ui.resetProgress)}</button>`);
  reset.addEventListener("click", () => {
    if (confirm("Cancellare tutti i progressi e ricominciare dal livello 1?")) onReset();
  });
  grid.appendChild(reset);
  s.querySelector("[data-act=back]").addEventListener("click", () => { Sfx.tap(); onBack(); });
  app.appendChild(s);
  return () => {};
}
