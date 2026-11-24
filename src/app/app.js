import { createRouter, FEATURES } from './router.js';
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

  const featureTemplates = await Promise.all(
    Object.entries(FEATURES).map(async ([id, feature]) => [id, await componentLoader.loadHtml(feature.html)]),
  );
  window.PocketFeatureTemplates = Object.fromEntries(featureTemplates);

  await Promise.all([
    ...Object.values(FEATURES).map(feature => componentLoader.loadStyle(feature.css)),
    ...Object.values(FEATURES).map(feature => componentLoader.loadScript(feature.js)),
    componentLoader.loadScript('src/presentation/common/page-header.js'),
    componentLoader.loadStyle('src/presentation/common/enhancements.css'),
    componentLoader.loadScript('src/presentation/common/enhancements.js'),
    componentLoader.loadScript('src/infrastructure/browser/privacy-mask.js'),
    componentLoader.loadScript('src/infrastructure/browser/page-title-sync.js'),
  ]);

  router.initialize();
  window.render();
  await import('../infrastructure/firebase/firebase-sync.js');
  window.dispatchEvent(new CustomEvent('pocket:ready'));
}

initialize().catch(error => {
  console.error('Pocket failed to initialize', error);
});
