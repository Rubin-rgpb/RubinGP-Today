const CACHE = 'rubin-gp-today-v7-pwa';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './rubin-today-v6-192.png', './rubin-today-v6-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('rubin-gp-today-') && key !== CACHE).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put('./index.html', copy));
      }
      return response;
    }).catch(async () => (await caches.match('./index.html')) || Response.error()));
  } else {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
  }
});
