# ♔ Chess Master — PWA

A fully offline-ready, installable chess Progressive Web App.

## 📁 File Structure

```
chess-pwa/
├── index.html              ← Landing page (stats, install prompt)
├── chess-mode-select.html  ← Mode selection
├── chess-game.html         ← The game (renamed from chess-game(1).html)
├── manifest.json           ← PWA manifest
├── service-worker.js       ← Offline caching
├── offline.html            ← Shown when offline and page not cached
├── generate-icons.html     ← Open in browser → download all icons
├── icons/                  ← Put generated icons here
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   ├── icon-384.png
│   └── icon-512.png
└── screenshots/            ← Optional, for app store listing
    ├── desktop.png
    └── mobile.png
```

---

## 🚀 Deployment (GitHub Pages — Free)

### Step 1 — Generate Icons
1. Open `generate-icons.html` in your browser
2. Click "Download All Icons"
3. Save all downloaded files into an `icons/` folder

### Step 2 — Push to GitHub
1. Create a new repo at github.com (e.g. `chess-master`)
2. Push all files including the `icons/` folder
3. Go to **Settings → Pages → Source: Deploy from branch → main → / (root)**
4. Your game is live at: `https://yourusername.github.io/chess-master/`

### Step 3 — Update manifest.json
Edit `manifest.json` and update `start_url` and `scope` to match your GitHub Pages path:
```json
"start_url": "/chess-master/index.html",
"scope": "/chess-master/"
```
Also update `service-worker.js` — prefix all paths with `/chess-master/`:
```js
const PRECACHE_URLS = [
  '/chess-master/',
  '/chess-master/index.html',
  '/chess-master/chess-mode-select.html',
  ...
];
```

---

## 📱 Installing the App

### Android (Chrome)
- Visit the URL → Chrome shows "Add to Home Screen" banner automatically
- Or tap the 3-dot menu → "Add to Home Screen"

### iPhone / iPad (Safari)
- Visit the URL in Safari
- Tap the Share button (⬆)
- Tap "Add to Home Screen"
- The app shows a hint automatically on first visit

### Desktop (Chrome / Edge)
- Visit the URL → an install icon appears in the address bar
- Click it to install

---

## 💾 Data Storage

All game data is stored in `localStorage` — it persists between sessions and survives app restarts.

**What's stored:**
- `chessStats.games` — total games played
- `chessStats.wins` — total wins
- `chessStats.streak` — current win streak
- `chessStats.bestTime` — fastest game (in seconds)
- `chessStats.pvp` — Player vs Player stats `{ games, wins }`
- `chessStats.ai` — Player vs AI stats `{ games, wins }`

---

## ✨ What's New vs Original

| Feature | Original | PWA Version |
|---------|----------|-------------|
| Installable | ❌ | ✅ |
| Works offline | ❌ | ✅ |
| Game stats | ❌ | ✅ localStorage |
| Pawn promotion dialog | ❌ Auto-queens | ✅ Choose piece |
| Piece rendering | PNG files (external) | ✅ SVG embedded (no files needed) |
| iOS install hint | ❌ | ✅ |
| Android install banner | ❌ | ✅ |
| App shortcuts | ❌ | ✅ Long-press icon |
| SW update notification | ❌ | ✅ |
| URL ?mode= param | ❌ | ✅ (for shortcuts) |
| Offline fallback page | ❌ | ✅ |

---

## 🔧 Local Testing

PWAs require HTTPS or localhost. To test locally:

```bash
# Option 1: Python (simplest)
python3 -m http.server 8080
# Open http://localhost:8080

# Option 2: VS Code Live Server extension
# Right-click index.html → Open with Live Server

# Option 3: npx serve
npx serve .
```

> ⚠️ Service workers do NOT work when opening HTML files directly (file:// URLs).
> Always use a local server for testing.
