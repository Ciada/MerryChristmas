// Registro dei livelli: id -> file in levels/
// I livelli non ancora pronti usano placeholder.js (si superano con un pulsante).
export const LEVEL_FILES = {
  1: "01-boop.js",
  2: "02-cane-bau.js",
};

export async function loadLevel(id) {
  const file = LEVEL_FILES[id] || "placeholder.js";
  const mod = await import(`./${file}`);
  return mod.default;
}
