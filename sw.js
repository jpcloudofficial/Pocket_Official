const CACHE = 'pera-v8';
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

    // Keep the quick-add popup just above the floating + button on all screen sizes.
    const scriptRequest = new Request(new URL('enhancements.js', self.registration.scope));
    const scriptResponse = await cache.match(scriptRequest);
    if (scriptResponse) {
      const source = await scriptResponse.text();
      const marker = 'pocket-fab-position-fix-v1';
      if (!source.includes(marker)) {
        const fix = `\n;(()=>{\n  const marker='${marker}';\n  const place=()=>{\n    const fab=document.querySelector('.fab');\n    const menu=document.querySelector('.pocket-fab-menu');\n    if(!fab||!menu)return;\n    const rect=fab.getBoundingClientRect();\n    menu.style.position='fixed';\n    menu.style.right=Math.max(12,innerWidth-rect.right)+'px';\n    menu.style.bottom=Math.max(12,innerHeight-rect.top+12)+'px';\n    menu.style.zIndex='20';\n  };\n  const install=()=>{\n    if(!document.getElementById(marker)){\n      const style=document.createElement('style');\n      style.id=marker;\n      style.textContent='.pocket-fab-menu{gap:8px!important}.pocket-fab-menu button{min-height:48px}';\n      document.head.append(style);\n    }\n    place();\n    const fab=document.querySelector('.fab');\n    if(fab&&!fab.dataset.positionFixReady){\n      fab.dataset.positionFixReady='1';\n      fab.addEventListener('click',()=>requestAnimationFrame(place));\n    }\n  };\n  new MutationObserver(install).observe(document.documentElement,{childList:true,subtree:true});\n  addEventListener('resize',place,{passive:true});\n  addEventListener('orientationchange',()=>setTimeout(place,100),{passive:true});\n  install();\n})();\n`;
        await cache.put(scriptRequest, new Response(source + fix, {
          status: scriptResponse.status,
          statusText: scriptResponse.statusText,
          headers: scriptResponse.headers
        }));
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
