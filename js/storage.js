// Salvataggio progressi in localStorage (con fallback in memoria se non disponibile)
const KEY = "ilnostroanno.v1";
const defaults = () => ({ completed: [], sound: true, finaleSeen: false, introSeen: [] });

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    return { ...defaults(), ...JSON.parse(raw) };
  } catch {
    return defaults();
  }
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* modalità privata: pazienza */ }
}

export const Save = {
  get: () => state,
  isDone: (id) => state.completed.includes(id),
  isUnlocked: (id) => id === 1 || state.completed.includes(id - 1),
  /** primo livello non ancora completato (o null se tutti fatti) */
  current(total) {
    for (let i = 1; i <= total; i++) if (!state.completed.includes(i)) return i;
    return null;
  },
  complete(id) {
    if (!state.completed.includes(id)) {
      state.completed.push(id);
      state.completed.sort((a, b) => a - b);
      persist();
      return true; // prima volta
    }
    return false;
  },
  introSeen: (id) => state.introSeen.includes(id),
  markIntro(id) { if (!state.introSeen.includes(id)) { state.introSeen.push(id); persist(); } },
  setSound(on) { state.sound = !!on; persist(); },
  setFinaleSeen() { state.finaleSeen = true; persist(); },
  reset() { const sound = state.sound; state = { ...defaults(), sound }; persist(); },
};
