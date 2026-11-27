# Il nostro anno 🎄

Mini gioco web a livelli, regalo di Natale. Sito statico: HTML + CSS + JavaScript (moduli ES), nessun build step, nessun backend.

## Provarlo in locale

I moduli JavaScript non funzionano aprendo `index.html` con doppio clic: serve un piccolo server locale.
Dalla cartella del progetto:

```powershell
python -m http.server 5173
```

poi apri <http://localhost:5173>. (In alternativa: `npx serve .`)

**Dal telefono sulla stessa Wi‑Fi:** avvia `python -m http.server 5173 --bind 0.0.0.0` e apri
`http://<IP-del-PC>:5173` (l'IP lo trovi con `ipconfig`, voce "Indirizzo IPv4").

Sul PC puoi simulare il telefono: F12 → icona "dispositivo" → 390×844.

## Trucchi per i test

| Dove | Come | Effetto |
|---|---|---|
| Dentro un livello | tieni premuto il **titolo del livello** 3 secondi | vinci il livello |
| Mappa | tieni premuto il **titolo "Il nostro anno"** 3 secondi | salta il livello corrente |
| Galleria ricordi | link in fondo "Ricomincia da capo" | azzera i progressi |

Livello 1 da tastiera: Spazio/Invio = boop.

## Modificare testi e foto

- **Tutti i testi** (titoli, didascalie, lettera finale, premio): [`content.js`](content.js).
- **Foto**: in `assets/photos/` con i nomi indicati in `content.js` (vedi `assets/photos/LEGGIMI.txt`).
  Se una foto manca compare un segnaposto, quindi puoi aggiungerle quando vuoi.

## Struttura

```
index.html          pagina unica
content.js          TESTI E FOTO (da modificare)
css/style.css       stile globale
js/main.js          motore: routing, avvio livelli, vittoria, card ricordo
js/map.js           mappa a sentiero innevato
js/finale.js        busta + lettera + premio
js/gallery.js       galleria dei ricordi
js/characters.js    personaggi SVG (Giada, lui, cani)
js/fx.js            neve e coriandoli
js/audio.js         suoni sintetizzati (WebAudio)
js/storage.js       salvataggio in localStorage
levels/base.js      interfaccia comune dei livelli (init / start / reset / destroy / onWin)
levels/index.js     registro id → file
levels/NN-nome.js   un file per livello
```

Per aggiungere un livello: crea `levels/03-doppie.js` (classe che estende `Level`, vedi commento in `levels/base.js`)
e registralo in `levels/index.js`. I livelli non registrati mostrano un segnaposto con il pulsante "Supera livello".

## Pubblicare su GitHub Pages

1. Crea un repository su GitHub (meglio **privato** se il piano lo consente, vedi nota sotto) e carica il progetto:
   ```powershell
   git remote add origin https://github.com/<utente>/<repo>.git
   ```
   ```powershell
   git push -u origin main
   ```
2. Su GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Ogni push su `main` avvia l'action `.github/workflows/deploy.yml` che pubblica il sito.
   Il link sarà `https://<utente>.github.io/<repo>/`.

> **Privacy:** un sito GitHub Pages è pubblico per chiunque abbia il link, e su un repository pubblico
> anche le foto in `assets/photos/` sono visibili a tutti. Il sito ha `noindex`, ma non è una protezione vera.
> Usa un nome di repo poco ovvio e valuta se mettere solo foto che ti va bene rendere pubbliche.
