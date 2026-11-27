// =====================================================================
//  Interfaccia comune dei livelli
// =====================================================================
//  Ogni file in levels/ esporta di default una classe che estende Level:
//
//    export default class MioLivello extends Level {
//      build()  { ...crea DOM e stato dentro this.stage... }
//      start()  { ...opzionale: parte dopo il popup di introduzione... }
//    }
//
//  Il motore chiama:
//    init(stage, ctx)  -> salva riferimenti e chiama build()
//    start()           -> dopo che il giocatore preme "Gioca"
//    reset()           -> pulisce tutto e ricostruisce (rigioca / riprova)
//    destroy()         -> uscita dal livello
//  Il livello chiama:
//    this.onWin()      -> livello superato (una volta sola)
//
//  Helper che si puliscono da soli su reset/destroy:
//    this.timeout(fn, ms), this.interval(fn, ms), this.listen(el, ev, fn, opts),
//    this.loop(fn(dt, now))  // requestAnimationFrame con dt in secondi
//  ctx: { level, content, sfx, win(), hud(text) }
// =====================================================================

export class Level {
  constructor() {
    this._timers = new Set();
    this._intervals = new Set();
    this._listeners = [];
    this._rafs = new Set();
    this.won = false;
  }

  init(stage, ctx) {
    this.stage = stage;
    this.ctx = ctx;
    this.build();
  }

  build() {}
  start() {}

  onWin() {
    if (this.won) return;
    this.won = true;
    this.ctx.win();
  }

  reset() {
    this._clearAll();
    this.won = false;
    this.stage.innerHTML = "";
    this.build();
    this.start();
  }

  destroy() {
    this._clearAll();
  }

  hud(text) { this.ctx.hud(text); }

  timeout(fn, ms) {
    const id = setTimeout(() => { this._timers.delete(id); fn(); }, ms);
    this._timers.add(id);
    return id;
  }
  interval(fn, ms) { const id = setInterval(fn, ms); this._intervals.add(id); return id; }
  listen(target, ev, fn, opts) {
    target.addEventListener(ev, fn, opts);
    this._listeners.push([target, ev, fn, opts]);
  }
  loop(fn) {
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (fn(dt, now) === false) { this._rafs.delete(handle); return; }
      handle.id = requestAnimationFrame(tick);
    };
    const handle = { id: requestAnimationFrame(tick) };
    this._rafs.add(handle);
    return handle;
  }

  _clearAll() {
    this._timers.forEach(clearTimeout); this._timers.clear();
    this._intervals.forEach(clearInterval); this._intervals.clear();
    this._rafs.forEach((h) => cancelAnimationFrame(h.id)); this._rafs.clear();
    for (const [t, ev, fn, opts] of this._listeners) t.removeEventListener(ev, fn, opts);
    this._listeners = [];
  }
}
