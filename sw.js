const CACHE = 'pera-v91';
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'styles/app.css',
  'scripts/app.js',
  'scripts/enhancements.js?v=20261118-page-swipe-1',
  'scripts/privacy-mask.js',
  'scripts/page-title-sync.js',
  'scripts/firebase-sync.js',
  'assets/icons/apple-touch-icon.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(FILES);

    // Repair quick-add SVGs when an older enhancement script has icon names
    // without matching path definitions (otherwise the icon squares render empty).
    const scriptRequest = new Request(new URL('scripts/enhancements.js?v=20261118-page-swipe-1', self.registration.scope));
    const scriptResponse = await cache.match(scriptRequest);
    if (scriptResponse) {
      const source = await scriptResponse.text();
      const marker = 'pocket-quick-add-icons-fix-v1';
      if (!source.includes(marker)) {
        const iconFix = `\n;(()=>{\n  const marker='${marker}';\n  const paths={\n    expense:'<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8z"/>',\n    income:'<rect x="3" y="6" width="18" height="14" rx="4"/><path d="M3 11h18M16.5 15.5h1"/>',\n    transfer:'<path d="M4 8h16l-3.5-3.5M20 16H4l3.5 3.5"/>'\n  };\n  const repair=()=>document.querySelectorAll('.pocket-fab-menu button[data-kind]').forEach(button=>{\n    const svg=button.querySelector('.mini svg');\n    const path=paths[button.dataset.kind];\n    if(svg&&path&&!svg.innerHTML.trim())svg.innerHTML=path;\n  });\n  const start=()=>{repair();new MutationObserver(repair).observe(document.body,{childList:true,subtree:true});};\n  if(document.body)start();else document.addEventListener('DOMContentLoaded',start,{once:true});\n})();\n`;
        await cache.put(scriptRequest, new Response(source + iconFix, {
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
