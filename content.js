// =====================================================================
//  CONTENT.JS — tutti i testi del gioco, modificabili senza toccare la logica
// =====================================================================
//  - Le foto vanno in  assets/photos/  (jpg/png/webp). Se una foto manca,
//    il gioco mostra automaticamente un segnaposto elegante.
//  - "intro"   = frase breve mostrata all'inizio del livello
//  - "memory"  = la card ricordo che compare dopo la vittoria
//  - Usa testi brevi e semplici: lui legge l'italiano ma non è la sua lingua.
// =====================================================================

export const CONTENT = {
  gameTitle: "Il nostro anno",
  gameSubtitle: "Un regalo di Natale per te ❤",
  playerName: "lui",          // come chiamare il giocatore nei testi (es. il suo nome)
  giadaName: "Giada",

  levels: [
    {
      id: 1,
      title: "Boop!",
      intro: "Tocca il nasino. Servono 10 boop!",
      memory: {
        photo: "assets/photos/boop.jpg",
        caption: "Quando ti tocco il naso, tu fai boop. Sempre. ❤",
      },
    },
    {
      id: 2,
      title: "Il cane che fa bau",
      intro: "Trascina ogni verso sul cane del suo paese.",
      memory: {
        photo: "assets/photos/bau.jpg",
        caption: "Sì, in Italia i cani fanno BAU. Fattene una ragione.",
      },
    },
    {
      id: 3,
      title: "Collo o colo?",
      intro: "Scegli la parola giusta. Attento alle doppie! Ne servono 6 su 8.",
      memory: { photo: "assets/photos/doppie.jpg", caption: "Le doppie: messe e tolte a caso, con amore." },
    },
    {
      id: 4,
      title: "Attento ai chiodi",
      intro: "Porta Giada a letto al buio. Occhio ai chiodi!",
      memory: { photo: "assets/photos/chiodi.jpg", caption: "Non ci sono chiodi per terra. Forse." },
    },
    {
      id: 5,
      title: "Intervista davanti a tutta l'Africa",
      intro: "Rispondi all'intervista. Tutta l'Africa ti guarda!",
      memory: { photo: "assets/photos/africa.jpg", caption: "Un ombrello, un microfono, un continente intero." },
    },
    {
      id: 6,
      title: "Gazpacho express",
      intro: "Gli ospiti arrivano! Prepara il gazpacho.",
      memory: { photo: "assets/photos/gazpacho.jpg", caption: "Il summer party e il tuo gazpacho." },
    },
    {
      id: 7,
      title: "Il colpo da maestro",
      intro: "Dì a Giada dove tirare. 3 palle in buca!",
      memory: { photo: "assets/photos/biliardo.jpg", caption: "Mi dicevi dove colpire. E funzionava." },
    },
    {
      id: 8,
      title: "Officina RC",
      intro: "Costruisci la macchinina e guidala al traguardo.",
      memory: { photo: "assets/photos/rc.jpg", caption: "Costruire cose insieme è il nostro gioco preferito." },
    },
    {
      id: 9,
      title: "Salva Giada in montagna",
      intro: "Aiuta Giada ad arrivare in cima!",
      memory: { photo: "assets/photos/montagna.jpg", caption: "La montagna, e io senza fiato." },
    },
    {
      id: 10,
      title: "Strada per il Nivolet",
      intro: "Guida sui tornanti. Attento alle marmotte!",
      memory: { photo: "assets/photos/nivolet.jpg", caption: "Quest'estate, sempre in montagna con te." },
    },
    {
      id: 11,
      title: "Le foglie più belle",
      intro: "Raccogli solo le foglie belle. Ne servono 12.",
      memory: { photo: "assets/photos/foglie.jpg", caption: "Le foglie più belle dell'autunno." },
    },
    {
      id: 12,
      title: "Tramonto in Liguria",
      intro: "Scatta 3 foto perfette al tramonto.",
      memory: { photo: "assets/photos/liguria-1.jpg", caption: "Il mare, gli amici, le foto più belle." },
      extraPhotos: ["assets/photos/liguria-1.jpg", "assets/photos/liguria-2.jpg", "assets/photos/liguria-3.jpg"],
    },
    {
      id: 13,
      title: "A teatro",
      intro: "Giada dorme. Tieni la sua testa sulla tua spalla.",
      memory: { photo: "assets/photos/teatro.jpg", caption: "A teatro mi addormento sempre su di te." },
    },
    {
      id: 14,
      title: "La corona d'alloro",
      intro: "Costruisci la corona con le foglie di alloro.",
      memory: { photo: "assets/photos/laurea.jpg", caption: "Dottore! La corona che ti mancava." },
    },
    {
      id: 15,
      title: "Le stelle di Ceresole",
      intro: "Unisci le stelle. Segui il luccichio.",
      memory: { photo: "assets/photos/ceresole.jpg", caption: "Le stelle sul lago di Ceresole." },
      initials: ["B", "G"],
    },
  ],

  // Testi del livello 2 (puoi cambiarli qui)
  dogs: {
    italyLine: "Sì, in Italia facciamo BAU. Fattene una ragione.",
    wrongLines: ["Ehm… no.", "Non sono io!", "Mai sentito.", "???"],
  },

  // Livello 3 — "pic" è un emoji (oppure "mole" = disegno della Mole Antonelliana)
  // "answer" è la parola giusta tra le due in "options". Servono "need" risposte giuste.
  doppie: {
    need: 6,
    questions: [
      { pic: "🦒", text: "La giraffa ce l'ha lunghissimo.", options: ["collo", "colo"], answer: "collo" },
      { pic: "📎", text: "Serve per attaccare la carta.", options: ["colla", "cola"], answer: "colla" },
      { pic: "mole", text: "Il simbolo di Torino.", options: ["molle", "mole"], answer: "mole" },
      { pic: "❄️", text: "Serve per togliere la neve.", options: ["palla", "pala"], answer: "pala" },
      { pic: "👴", text: "Il papà del papà.", options: ["nonno", "nono"], answer: "nonno" },
      { pic: "💧", text: "Ho caldo, voglio bere: ho ...", options: ["sette", "sete"], answer: "sete" },
      { pic: "💸", text: "Costa tanto, è ...", options: ["carro", "caro"], answer: "caro" },
      { pic: "✒️", text: "Serve per scrivere.", options: ["penna", "pena"], answer: "penna" },
    ],
    laughs: ["ahahah di nuovo?!", "ahah, le doppie!", "ahahah no!", "ahahah amore…", "ahah, ci risiamo!"],
    good: ["Esatto!", "Bravo!", "Perfetto!", "Sììì!"],
    retry: "Quasi! Le doppie sono difficili… riproviamo?",
  },

  // Livello 1
  boop: {
    target: 10,
    reactions: ["boop!", "BOOP!", "b-boop?", "booop", "BOOP!!"],
  },

  // Messaggi generici
  ui: {
    play: "Gioca",
    replay: "Rigioca",
    next: "Avanti",
    back: "Mappa",
    locked: "Ancora chiuso! Finisci prima il livello precedente.",
    winTitle: "Bravo!",
    cardTitle: "Ricordo sbloccato",
    galleryTitle: "I nostri ricordi",
    finaleNode: "Finale",
    resetProgress: "Ricomincia da capo",
  },

  // ---------------------------------------------------------------------
  //  FINALE — scrivi qui la tua lettera (puoi andare a capo con \n)
  // ---------------------------------------------------------------------
  finale: {
    envelopeLabel: "Per te",
    letterTitle: "Amore mio,",
    letter:
      "[Qui scrivo la mia lettera.]\n\n" +
      "Questo è stato il nostro anno: boop, cani che fanno bau, doppie sbagliate, montagne, tramonti e stelle.\n\n" +
      "Grazie per ogni momento.",
    signature: "Giada",
    prizeTitle: "Il tuo regalo",
    prizeText: "[PREMIO FINALE – es. \"Il tuo regalo è nascosto in ___\"]",
    prizeCode: "",            // opzionale: un codice da mostrare in grande (es. "NATALE-2026")
    galleryButton: "Guarda tutti i ricordi",
  },
};
