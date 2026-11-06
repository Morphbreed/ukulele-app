# Ukulele Noten-Drill

Kleine Web-App zum Üben des Notenlesens auf der Ukulele (Stimmung G C E A, hohes G).
Die App zeigt eine zufällige Note der C-Dur-Tonleiter (C4–C5, 1. Lage), hört über das
Mikrofon zu und prüft, ob die richtige Note in der richtigen Oktave gespielt wurde.

Abhängigkeiten (alle per npm gebündelt, keine externen Dienste zur Laufzeit):
- [pitchy](https://www.npmjs.com/package/pitchy) – Tonhöhenerkennung
- [vexflow](https://www.npmjs.com/package/vexflow) – Notenschrift
- [vite](https://vite.dev) – Build

## Lokal starten

```sh
npm install
npm run dev
```

Dann die angezeigte `http://localhost:5173` öffnen (Mikrofon funktioniert nur über HTTPS oder `localhost`).

## Auf GitHub Pages veröffentlichen

```sh
npm run deploy
```

Baut die App und pusht `dist/` auf den Branch `gh-pages`. GitHub Pages ist auf diesen Branch
eingestellt, die App ist danach unter <https://morphbreed.github.io/ukulele-app/> erreichbar.
