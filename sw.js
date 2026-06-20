const CACHE = 'copado-bdr-v4';
const ASSETS = [
  '/Copado-BDR/',
  '/Copado-BDR/index.html',
  '/Copado-BDR/manifest.json',
  '/Copado-BDR/icon-192.png',
  '/Copado-BDR/icon-512.png',
  '/Copado-BDR/icon-180.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }))
  );
});