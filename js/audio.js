// Suoni sintetizzati con WebAudio: nessun file audio, nessun copyright.
import { Save } from "./storage.js";

let ctx = null;
function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone({ freq = 440, to = null, type = "sine", dur = 0.15, vol = 0.18, delay = 0 }) {
  if (!Save.get().sound) return;
  const a = ac(); if (!a) return;
  const t0 = a.currentTime + delay;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(a.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

function noise({ dur = 0.12, vol = 0.12, delay = 0, freq = 1200 }) {
  if (!Save.get().sound) return;
  const a = ac(); if (!a) return;
  const t0 = a.currentTime + delay;
  const buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq; f.Q.value = 1.2;
  const g = a.createGain(); g.gain.value = vol;
  src.connect(f).connect(g).connect(a.destination);
  src.start(t0);
}

export const Sfx = {
  unlock() { ac(); }, // da chiamare al primo tocco (iOS)
  tap() { tone({ freq: 660, dur: 0.06, vol: 0.08, type: "triangle" }); },
  boop() {
    tone({ freq: 520 + Math.random() * 120, to: 260, dur: 0.18, vol: 0.22, type: "sine" });
    tone({ freq: 1040, to: 700, dur: 0.08, vol: 0.06, type: "triangle", delay: 0.02 });
  },
  pop() { tone({ freq: 880, to: 1320, dur: 0.09, vol: 0.12, type: "triangle" }); },
  wrong() {
    tone({ freq: 300, to: 200, dur: 0.18, vol: 0.12, type: "square" });
  },
  bark() {
    tone({ freq: 380, to: 180, dur: 0.12, vol: 0.2, type: "sawtooth" });
    noise({ dur: 0.1, vol: 0.08, freq: 900 });
    tone({ freq: 400, to: 190, dur: 0.12, vol: 0.18, type: "sawtooth", delay: 0.17 });
  },
  good() {
    tone({ freq: 784, dur: 0.1, vol: 0.13, type: "triangle" });
    tone({ freq: 1175, dur: 0.16, vol: 0.13, type: "triangle", delay: 0.08 });
  },
  /** jingle di vittoria con campanelle */
  win() {
    const notes = [659, 659, 659, 0, 659, 659, 659, 0, 659, 784, 523, 587, 659];
    let t = 0;
    for (const n of notes) {
      if (n) {
        tone({ freq: n, dur: 0.22, vol: 0.14, type: "triangle", delay: t });
        tone({ freq: n * 2, dur: 0.12, vol: 0.04, type: "sine", delay: t });
      }
      t += n ? 0.13 : 0.1;
    }
    tone({ freq: 1568, dur: 0.6, vol: 0.05, type: "sine", delay: t });
  },
  chime() {
    [1046, 1318, 1568, 2093].forEach((f, i) => tone({ freq: f, dur: 0.5, vol: 0.07, type: "sine", delay: i * 0.09 }));
  },
};
