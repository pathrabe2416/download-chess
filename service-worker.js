/* ============================================================
   Chess Master — Service Worker
   Strategy : Cache-first for all game assets (offline-ready)
   On update: New SW waits, activates on next launch (skipWaiting
   is intentionally NOT used — avoids mid-game disruption)
   ============================================================ */

const CACHE_NAME   = 'chess-master-v1';
const CACHE_STATIC = 'chess-static-v1';

/* All files the game needs to run fully offline */
const PRECACHE_URLS = [
  './',
  './index.html',
  './chess-mode-select.html',
  './chess-game.html',
  './manifest.json',
  /* Piece images */
  './pieces/white_king.svg',
  './pieces/white_queen.svg',
  './pieces/white_rook.svg',
  './pieces/white_bishop.svg',
  './pieces/white_knight.svg',
  './pieces/white_pawn.svg',
  './pieces/black_king.svg',
  './pieces/black_queen.svg',
  './pieces/black_rook.svg',
  './pieces/black_bishop.svg',
  './pieces/black_knight.svg',
  './pieces/black_pawn.svg',
  /* Icons */
  './icons/icon-192.png',
  './icons/icon-512.png',
  /* Offline fallback */
  './offline.html'
];

/* ── Install: pre-cache everything ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => {
        console.log('[SW] Pre-cache complete');
        /* Do NOT call self.skipWaiting() — we don't want to
           disrupt an active game session mid-play. The new
           SW activates on the next app launch. */
      })
      .catch(err => console.warn('[SW] Pre-cache failed for some assets:', err))
  );
});

/* ── Activate: clean up old caches ── */
self.addEventListener('activate', event => {
  const VALID_CACHES = [CACHE_STATIC, CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => !VALID_CACHES.includes(key))
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch: cache-first, network fallback ── */
self.addEventListener('fetch', event => {
  /* Only intercept GET requests to same origin */
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;

        /* Not in cache — fetch from network and store */
        return fetch(event.request)
          .then(response => {
            /* Only cache valid responses */
            if (!response || response.status !== 200 || response.type === 'opaque') {
              return response;
            }
            const toCache = response.clone();
            caches.open(CACHE_STATIC)
              .then(cache => cache.put(event.request, toCache));
            return response;
          })
          .catch(() => {
            /* Network failed — return offline page for navigation */
            if (event.request.destination === 'document') {
              return caches.match('./offline.html');
            }
          });
      })
  );
});

/* ── Message: allow app to trigger SW update check ── */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    /* Only skip waiting if explicitly requested by the app
       (e.g. user taps "Update available — reload") */
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CHECK_VERSION') {
    event.source.postMessage({
      type: 'VERSION',
      version: CACHE_STATIC
    });
  }
});
