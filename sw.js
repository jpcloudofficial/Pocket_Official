const CACHE = 'pera-v181';
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'src/app/app.css?v=20261124-modular-pages-2',
  'src/app/app.js',
  'src/app/router.js',
  'src/app/component-loader.js',
  'src/app/pocket-app-legacy.js',
  'src/presentation/common/navigation/navbar.css',
  'src/presentation/common/navigation/navbar.html',
  'src/presentation/common/navigation/navbar.js',
  'src/presentation/common/enhancements.css',
  'src/presentation/common/fab/fab.css',
  'src/presentation/common/fab/fab.html',
  'src/presentation/common/amount-input/amount-input.css',
  'src/presentation/common/amount-input/amount-input.js',
  'src/presentation/common/page-header.js',
  'src/presentation/onboarding/onboarding.html',
  'src/presentation/onboarding/onboarding.css',
  'src/presentation/onboarding/onboarding.js',
  'src/presentation/dashboard/dashboard.html',
  'src/presentation/dashboard/dashboard.css',
  'src/presentation/dashboard/dashboard.js',
  'src/presentation/transactions/transactions.html',
  'src/presentation/transactions/transactions.css',
  'src/presentation/transactions/transactions.js',
  'src/presentation/cashback/cashback.html',
  'src/presentation/cashback/cashback.css',
  'src/presentation/cashback/cashback.js',
  'src/presentation/recurring/recurring.html',
  'src/presentation/recurring/recurring.css',
  'src/presentation/recurring/recurring.js',
  'src/presentation/accounts/accounts.html',
  'src/presentation/accounts/accounts.css',
  'src/presentation/accounts/accounts.js',
  'src/presentation/budgets/budgets.html',
  'src/presentation/budgets/budgets.css',
  'src/presentation/budgets/budgets.js',
  'src/presentation/goals/goals.html',
  'src/presentation/goals/goals.css',
  'src/presentation/goals/goals.js',
  'src/presentation/shopping-lists/shopping-lists.html',
  'src/presentation/shopping-lists/shopping-lists.css?v=20261124-shopping-design-2',
  'src/presentation/shopping-lists/shopping-lists.js?v=20261124-shopping-design-2',
  'src/presentation/reports/reports.html',
  'src/presentation/reports/reports.css',
  'src/presentation/reports/reports.js',
  'src/presentation/categories/categories.html',
  'src/presentation/categories/categories.css',
  'src/presentation/categories/categories.js',
  'src/presentation/profile/profile.html',
  'src/presentation/profile/profile.css',
  'src/presentation/profile/profile.js',
  'src/presentation/settings/settings.html',
  'src/presentation/settings/settings.css?v=20261124-settings-design-2',
  'src/presentation/settings/settings.js',
  'src/infrastructure/charts/chart.umd.min.js',
  'src/presentation/common/enhancements.js',
  'src/infrastructure/browser/privacy-mask.js',
  'src/infrastructure/browser/page-title-sync.js',
  'src/infrastructure/firebase/firebase-sync.js',
  'assets/icons/app-icon-dark.png',
  'assets/icons/icon-192.png?v=20261123-pocket-icon-2',
  'assets/icons/icon-512.png?v=20261123-pocket-icon-2',
  'assets/icons/icon-maskable-512.png?v=20261123-pocket-icon-2',
  'assets/icons/apple-touch-icon.png?v=20261123-pocket-icon-2',
  'assets/icons/pocket-mark.svg',
  'assets/dashboard-icons/settings.svg',
  'assets/dashboard-icons/chart.svg',
  'assets/dashboard-icons/wallet.svg',
  'assets/dashboard-icons/activity.svg',
  'assets/dashboard-icons/home.svg',
  'assets/dashboard-icons/repeat.svg',
  'assets/dashboard-icons/gift.svg',
  'assets/dashboard-icons/bank.svg',
  'assets/dashboard-icons/cart.svg',
  'assets/dashboard-icons/goal.svg',
  'assets/dashboard-icons/more.svg',
  'assets/dashboard-icons/eye.svg',
  'assets/dashboard-icons/search.svg'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(FILES);

    // Repair quick-add SVGs when an older enhancement script has icon names
    // without matching path definitions (otherwise the icon squares render empty).
    const scriptRequest = new Request(new URL('src/presentation/common/enhancements.js', self.registration.scope));
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
