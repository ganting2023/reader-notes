const CACHE_NAME = 'reader-notes-v1';
const ASSETS = [
  '/reader-notes/',
  '/reader-notes/index.html',
  '/reader-notes/manifest.json',
  '/reader-notes/icon-192.png',
  '/reader-notes/icon-512.png'
];

// 安装时缓存核心资源
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// 激活时清理旧缓存
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// 离线优先策略
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(resp => {
        // 只缓存同源 GET 请求
        if (e.request.method === 'GET' && e.request.url.startsWith(self.location.origin)) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return resp;
      }).catch(() => cached);
    })
  );
});
