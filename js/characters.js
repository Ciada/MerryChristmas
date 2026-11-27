// Personaggi chibi in SVG (disegnati a mano in codice, nessun asset esterno)
// Palette ispirata alla foto di riferimento: carta crema, guance rosa, linee calde.

export const PAL = {
  skin: "#f6d5c1",
  skinShade: "#ecbfa6",
  cheek: "#ee9e98",
  ink: "#3a2a22",
  giadaHair: "#5a3a28",
  giadaHairHi: "#7a5136",
  dress: "#e3a29a",
  dressDot: "#c4544f",
  luiHair: "#3b2a22",
  glasses: "#7b3226",
  shirt: "#bcd9cf",
  shirtShade: "#a3c6ba",
  pants: "#a9533c",
  shoe: "#2f2a28",
};

function eyes(cx1, cx2, cy, mood, r = 6) {
  const P = PAL;
  if (mood === "laugh" || mood === "happy") {
    return `<path d="M${cx1 - r} ${cy + 1} q${r} ${-r * 1.4} ${r * 2} 0" stroke="${P.ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
            <path d="M${cx2 - r} ${cy + 1} q${r} ${-r * 1.4} ${r * 2} 0" stroke="${P.ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  }
  if (mood === "sleep") {
    return `<path d="M${cx1 - r} ${cy} q${r} ${r} ${r * 2} 0" stroke="${P.ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
            <path d="M${cx2 - r} ${cy} q${r} ${r} ${r * 2} 0" stroke="${P.ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  }
  if (mood === "ouch") {
    return `<path d="M${cx1 - r} ${cy - r / 1.5} l${r * 1.6} ${r / 1.5} l${-r * 1.6} ${r / 1.5}" stroke="${P.ink}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M${cx2 + r} ${cy - r / 1.5} l${-r * 1.6} ${r / 1.5} l${r * 1.6} ${r / 1.5}" stroke="${P.ink}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  const one = (cx) => `
    <circle cx="${cx}" cy="${cy}" r="${r + 1.6}" fill="#fff"/>
    <circle cx="${cx}" cy="${cy + 0.5}" r="${r}" fill="${P.ink}"/>
    <circle cx="${cx + r * 0.35}" cy="${cy - r * 0.35}" r="${r * 0.33}" fill="#fff"/>`;
  return one(cx1) + one(cx2);
}

function mouth(cx, cy, mood) {
  const P = PAL;
  if (mood === "laugh") return `<path d="M${cx - 7} ${cy - 1} q7 10 14 0 z" fill="#8a3b36" stroke="${P.ink}" stroke-width="1.6" stroke-linejoin="round"/>`;
  if (mood === "ouch") return `<ellipse cx="${cx}" cy="${cy + 1}" rx="4" ry="5" fill="#8a3b36" stroke="${P.ink}" stroke-width="1.5"/>`;
  if (mood === "sleep") return `<ellipse cx="${cx}" cy="${cy + 1}" rx="2.2" ry="2.6" fill="#8a3b36"/>`;
  return `<path d="M${cx - 5} ${cy} q5 5 10 0" stroke="${P.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
}

/** Giada a figura intera. viewBox 0 0 120 200 */
export function giadaSVG({ mood = "smile", className = "", extra = "" } = {}) {
  const P = PAL;
  return `<svg class="${className}" viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" aria-label="Giada">
  <!-- capelli dietro -->
  <path d="M28 50 C24 22 46 12 60 12 C78 12 98 22 93 52 C96 78 100 96 92 112 C84 118 76 112 74 104 L46 104 C44 112 34 118 27 112 C20 96 24 78 28 50 Z" fill="${P.giadaHair}"/>
  <!-- gambe -->
  <rect x="49" y="146" width="7" height="38" rx="3" fill="${P.skin}"/>
  <rect x="64" y="146" width="7" height="38" rx="3" fill="${P.skin}"/>
  <ellipse cx="51" cy="186" rx="7" ry="3.5" fill="${P.shoe}"/>
  <ellipse cx="69" cy="186" rx="7" ry="3.5" fill="${P.shoe}"/>
  <!-- braccia -->
  <path d="M41 92 C33 104 31 118 33 132" stroke="${P.dress}" stroke-width="9" stroke-linecap="round" fill="none"/>
  <path d="M79 92 C87 104 89 118 87 132" stroke="${P.dress}" stroke-width="9" stroke-linecap="round" fill="none"/>
  <circle cx="33" cy="135" r="4.5" fill="${P.skin}"/>
  <circle cx="87" cy="135" r="4.5" fill="${P.skin}"/>
  <!-- vestito -->
  <path d="M44 86 L76 86 L80 116 L92 152 Q60 160 28 152 L40 116 Z" fill="${P.dress}"/>
  <path d="M52 86 L60 98 L68 86" fill="${P.skin}"/>
  <path d="M40 116 L80 116" stroke="#cf8a82" stroke-width="2"/>
  <g fill="${P.dressDot}">
    <circle cx="48" cy="128" r="1.8"/><circle cx="62" cy="136" r="1.8"/><circle cx="74" cy="126" r="1.8"/>
    <circle cx="55" cy="146" r="1.8"/><circle cx="78" cy="144" r="1.8"/><circle cx="40" cy="146" r="1.8"/>
    <circle cx="66" cy="104" r="1.6"/><circle cx="50" cy="106" r="1.6"/>
  </g>
  <!-- collo + testa -->
  <rect x="55" y="74" width="10" height="14" fill="${P.skinShade}"/>
  <ellipse cx="60" cy="50" rx="29" ry="30" fill="${P.skin}"/>
  <!-- capelli davanti (riga in mezzo) -->
  <path d="M31 50 C30 28 44 18 60 18 C76 18 91 28 89 50 C84 38 74 30 62 26 C61 30 60 32 59 26 C47 30 36 38 31 50 Z" fill="${P.giadaHair}"/>
  <path d="M30 48 C27 66 29 80 26 92" stroke="${P.giadaHair}" stroke-width="7" stroke-linecap="round" fill="none"/>
  <path d="M90 48 C93 66 91 80 94 92" stroke="${P.giadaHair}" stroke-width="7" stroke-linecap="round" fill="none"/>
  <path d="M66 24 C78 28 86 36 88 46" stroke="${P.giadaHairHi}" stroke-width="2" fill="none" opacity=".7"/>
  ${eyes(48, 72, 52, mood, 5.5)}
  ${mood === "smile" || mood === "talk" ? `<path d="M41 45 l-3 -2 M79 45 l3 -2" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/>` : ""}
  <path d="M43 42 q5 -3 10 -1 M67 41 q5 -2 10 1" stroke="${P.giadaHair}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M60 58 q-2 4 1 5" stroke="${P.skinShade}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <circle cx="42" cy="62" r="6" fill="${P.cheek}" opacity=".55"/>
  <circle cx="78" cy="62" r="6" fill="${P.cheek}" opacity=".55"/>
  ${mouth(60, 68, mood)}
  ${extra}
</svg>`;
}

/** Lui a figura intera. viewBox 0 0 120 210 */
export function luiSVG({ mood = "smile", className = "", extra = "" } = {}) {
  const P = PAL;
  return `<svg class="${className}" viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg" aria-label="lui">
  <!-- gambe -->
  <path d="M46 132 L46 192 L58 192 L60 140 L62 192 L74 192 L74 132 Z" fill="${P.pants}"/>
  <ellipse cx="51" cy="195" rx="9" ry="4" fill="${P.shoe}"/>
  <ellipse cx="69" cy="195" rx="9" ry="4" fill="${P.shoe}"/>
  <!-- braccia -->
  <path d="M40 92 C33 108 32 124 33 140" stroke="${P.shirt}" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M80 92 C87 108 88 124 87 140" stroke="${P.shirt}" stroke-width="10" stroke-linecap="round" fill="none"/>
  <circle cx="33" cy="143" r="5" fill="${P.skin}"/>
  <circle cx="87" cy="143" r="5" fill="${P.skin}"/>
  <!-- camicia -->
  <path d="M42 86 L78 86 L80 136 L40 136 Z" fill="${P.shirt}"/>
  <path d="M60 90 L60 136" stroke="${P.shirtShade}" stroke-width="1.6"/>
  <path d="M51 86 L60 94 L69 86" fill="none" stroke="${P.shirtShade}" stroke-width="2.4" stroke-linejoin="round"/>
  <g fill="${P.shirtShade}"><circle cx="62" cy="104" r="1.2"/><circle cx="62" cy="116" r="1.2"/><circle cx="62" cy="128" r="1.2"/></g>
  <!-- testa -->
  <rect x="55" y="74" width="10" height="14" fill="${P.skinShade}"/>
  <ellipse cx="84" cy="54" rx="4" ry="6" fill="${P.skin}"/>
  <ellipse cx="36" cy="54" rx="4" ry="6" fill="${P.skin}"/>
  <ellipse cx="60" cy="50" rx="26" ry="29" fill="${P.skin}"/>
  <!-- capelli spettinati -->
  <path d="M33 46 C30 22 46 12 62 13 C80 13 92 26 87 46 C84 36 80 32 74 30 C72 34 66 34 62 30 C58 34 50 34 46 30 C40 34 36 38 33 46 Z" fill="${P.luiHair}"/>
  <path d="M52 14 l-4 -6 l8 4 M64 13 l2 -7 l4 7 M74 16 l6 -4 l-2 7" fill="${P.luiHair}" stroke="${P.luiHair}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M42 41 q6 -3 12 -1 M66 40 q6 -2 12 1" stroke="${P.luiHair}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  ${eyes(48, 72, 52, mood, 4.6)}
  <!-- occhiali -->
  <g fill="none" stroke="${P.glasses}" stroke-width="2.6">
    <rect x="37" y="43" width="22" height="18" rx="6"/>
    <rect x="61" y="43" width="22" height="18" rx="6"/>
    <path d="M59 50 q1 -2 2 0"/>
    <path d="M37 49 L32 48 M83 49 L88 48"/>
  </g>
  <path d="M60 58 q-3 6 1 7" stroke="${P.skinShade}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <circle cx="42" cy="66" r="5.5" fill="${P.cheek}" opacity=".5"/>
  <circle cx="78" cy="66" r="5.5" fill="${P.cheek}" opacity=".5"/>
  ${mouth(60, 71, mood)}
  ${extra}
</svg>`;
}

/** Cagnolino seduto. viewBox 0 0 100 100.  expr: normal | sideeye | happy | confused */
export function dogSVG({ fur = "#d9a46b", ear = "#9a6337", spot = null, expr = "normal", className = "" } = {}) {
  const ink = PAL.ink;
  let face;
  if (expr === "happy") {
    face = `<path d="M37 44 q4 -5 8 0 M55 44 q4 -5 8 0" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
            <path d="M47 63 q3 8 6 0 z" fill="#e06a76"/>`;
  } else if (expr === "sideeye") {
    face = `<ellipse cx="41" cy="45" rx="6" ry="5" fill="#fff"/><ellipse cx="59" cy="45" rx="6" ry="5" fill="#fff"/>
            <circle cx="45" cy="46" r="3.2" fill="${ink}"/><circle cx="63" cy="46" r="3.2" fill="${ink}"/>
            <path d="M34 42 L48 43 M52 43 L66 42" stroke="${fur === "#3b2f2a" ? "#fff" : ink}" stroke-width="3" stroke-linecap="round"/>
            <path d="M34 36 l12 3 M54 38 l12 -5" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M44 63 L56 61" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"/>`;
  } else if (expr === "confused") {
    face = `<circle cx="41" cy="45" r="4" fill="${ink}"/><circle cx="59" cy="45" r="4" fill="${ink}"/>
            <circle cx="42.4" cy="43.6" r="1.4" fill="#fff"/><circle cx="60.4" cy="43.6" r="1.4" fill="#fff"/>
            <path d="M35 37 l10 2 M55 39 l10 -2" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>
            <path d="M45 63 q5 -3 10 0" stroke="${ink}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  } else {
    face = `<circle cx="41" cy="45" r="4.5" fill="${ink}"/><circle cx="59" cy="45" r="4.5" fill="${ink}"/>
            <circle cx="42.6" cy="43.4" r="1.6" fill="#fff"/><circle cx="60.6" cy="43.4" r="1.6" fill="#fff"/>
            <path d="M45 61 q2.5 3 5 0 q2.5 3 5 0" stroke="${ink}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  }
  return `<svg class="${className}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="94" rx="28" ry="4" fill="rgba(74,52,38,.15)"/>
    <path d="M30 92 C26 70 34 62 50 62 C66 62 74 70 70 92 Z" fill="${fur}"/>
    <ellipse cx="40" cy="91" rx="7" ry="4" fill="${fur}" stroke="rgba(0,0,0,.12)"/>
    <ellipse cx="60" cy="91" rx="7" ry="4" fill="${fur}" stroke="rgba(0,0,0,.12)"/>
    <path d="M70 84 q12 -4 10 -16" stroke="${fur}" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M27 30 C14 34 14 56 22 62 C28 60 30 48 32 38 Z" fill="${ear}"/>
    <path d="M73 30 C86 34 86 56 78 62 C72 60 70 48 68 38 Z" fill="${ear}"/>
    <ellipse cx="50" cy="46" rx="25" ry="22" fill="${fur}"/>
    ${spot ? `<ellipse cx="60" cy="40" rx="9" ry="8" fill="${spot}"/>` : ""}
    <ellipse cx="50" cy="58" rx="12" ry="9" fill="#f6e9d9"/>
    <ellipse cx="50" cy="53" rx="4.5" ry="3.2" fill="${ink}"/>
    <circle cx="33" cy="54" r="4" fill="${PAL.cheek}" opacity=".45"/>
    <circle cx="67" cy="54" r="4" fill="${PAL.cheek}" opacity=".45"/>
    ${face}
  </svg>`;
}
