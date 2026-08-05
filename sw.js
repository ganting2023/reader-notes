const CACHE_NAME = 'miracle-v15-zero-config';
const ASSETS = [
  '/reader-notes/',
  '/reader-notes/index.html',
  '/reader-notes/manifest.json',
  '/reader-notes/icon-192.png',
  '/reader-notes/icon-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
    if (e.request.method === 'GET' && e.request.url.startsWith(self.location.origin)) {
      const clone = resp.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
    }
    return resp;
  }).catch(() => cached)));
});
