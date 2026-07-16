/* Fire Pump Sizer — offline cache for team / iPad use */
const CACHE = 'fire-pump-sizer-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/styles.css',
  './assets/app.js',
  './assets/chart.umd.min.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first for same-origin; network fallback then cache
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (!res || res.status !== 200 || res.type === 'error') return res;
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy));
        return res;
      }).catch(() => {
        if (req.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return undefined;
      });
    })
  );
});
