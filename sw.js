const CACHE = 'pera-v6';
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'enhancements.js',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(FILES);

    // Load the small enhancement module after the existing app has rendered.
    for (const request of await cache.keys()) {
      const url = new URL(request.url);
      if (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')) {
        const response = await cache.match(request);
        if (!response) continue;
        const html = await response.text();
        if (!html.includes('src="enhancements.js"')) {
          const updated = html.replace('</body>', '<script src="enhancements.js"></script></body>');
          await cache.put(request, new Response(updated, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          }));
        }
      }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => {
    const network = fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => cached);
    return cached || network;
  }));
});
