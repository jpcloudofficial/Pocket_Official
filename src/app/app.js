import { createRouter, FEATURES } from './router.js';
import { createComponentLoader } from './component-loader.js';
import { cashbackDepositAccount } from '../domain/policies/cashback-policy.js';

const componentLoader = createComponentLoader();
const router = createRouter();
window.PocketDomain = window.PocketDomain || {};
window.PocketDomain.cashback = { depositAccount: cashbackDepositAccount };

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
  await loadClassicScript('src/presentation/common/lucide-paths.js');
  await loadClassicScript('src/presentation/common/icons.js');
  await loadClassicScript('src/app/pocket-app-legacy.js');
  await loadClassicScript('src/presentation/common/report-charts.js');

  const featureTemplates = await Promise.all(
    Object.entries(FEATURES).map(async ([id, feature]) => [id, await componentLoader.loadHtml(feature.html)]),
  );
  window.PocketFeatureTemplates = Object.fromEntries(featureTemplates);

  await Promise.all([
    ...Object.values(FEATURES).map(feature => componentLoader.loadStyle(feature.css)),
    ...Object.values(FEATURES).map(feature => componentLoader.loadScript(feature.js)),
    componentLoader.loadStyle('src/presentation/common/action-menu/action-menu.css'),
    componentLoader.loadScript('src/presentation/common/action-menu/action-menu.js'),
    componentLoader.loadStyle('src/presentation/common/dropdowns.css'),
    componentLoader.loadScript('src/presentation/common/dropdowns.js'),
    componentLoader.loadScript('src/presentation/common/page-header.js'),
    componentLoader.loadStyle('src/presentation/common/enhancements.css'),
    componentLoader.loadStyle('src/presentation/common/fab/fab.css'),
    componentLoader.loadStyle('src/presentation/common/amount-input/amount-input.css'),
    componentLoader.loadScript('src/presentation/common/amount-input/amount-input.js'),
    componentLoader.loadScript('src/presentation/common/enhancements.js'),
    componentLoader.loadScript('src/infrastructure/browser/privacy-mask.js'),
    componentLoader.loadScript('src/infrastructure/browser/page-title-sync.js'),
  ]);

  const fabTemplate = await componentLoader.loadHtml('src/presentation/common/fab/fab.html');
  document.body.insertAdjacentHTML('beforeend', fabTemplate);

  router.initialize();
  window.render();
  await import('../infrastructure/firebase/firebase-sync.js');
  window.dispatchEvent(new CustomEvent('pocket:ready'));
}

initialize().catch(error => {
  console.error('Pocket failed to initialize', error);
});
