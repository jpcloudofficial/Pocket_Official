import { createRouter } from './router.js';
import { createComponentLoader } from './component-loader.js';

const componentLoader = createComponentLoader();
const router = createRouter();

function loadClassicScript(path) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = path;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
}

async function initialize() {
  await loadClassicScript('src/app/pocket-app-legacy.js');

  await Promise.all([
    componentLoader.loadScript('src/presentation/common/enhancements.js'),
    componentLoader.loadScript('src/infrastructure/browser/privacy-mask.js'),
    componentLoader.loadScript('src/infrastructure/browser/page-title-sync.js'),
    componentLoader.loadScript('src/presentation/common/budget-alerts.js'),
  ]);

  await import('../infrastructure/firebase/firebase-sync.js');
  router.initialize();
  window.dispatchEvent(new CustomEvent('pocket:ready'));
}

initialize().catch(error => {
  console.error('Pocket failed to initialize', error);
});
