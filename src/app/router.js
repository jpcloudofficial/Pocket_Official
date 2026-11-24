export const FEATURES = {
  onboarding: {
    html: 'src/presentation/onboarding/onboarding.html',
    css: 'src/presentation/onboarding/onboarding.css',
    js: 'src/presentation/onboarding/onboarding.js',
  },
  dash: {
    html: 'src/presentation/dashboard/dashboard.html',
    css: 'src/presentation/dashboard/dashboard.css',
    js: 'src/presentation/dashboard/dashboard.js',
  },
  tx: {
    html: 'src/presentation/transactions/transactions.html',
    css: 'src/presentation/transactions/transactions.css',
    js: 'src/presentation/transactions/transactions.js',
  },
  cash: {
    html: 'src/presentation/cashback/cashback.html',
    css: 'src/presentation/cashback/cashback.css',
    js: 'src/presentation/cashback/cashback.js',
  },
  rec: {
    html: 'src/presentation/recurring/recurring.html',
    css: 'src/presentation/recurring/recurring.css',
    js: 'src/presentation/recurring/recurring.js',
  },
  acc: {
    html: 'src/presentation/accounts/accounts.html',
    css: 'src/presentation/accounts/accounts.css',
    js: 'src/presentation/accounts/accounts.js',
  },
  bud: {
    html: 'src/presentation/budgets/budgets.html',
    css: 'src/presentation/budgets/budgets.css',
    js: 'src/presentation/budgets/budgets.js',
  },
  goal: {
    html: 'src/presentation/goals/goals.html',
    css: 'src/presentation/goals/goals.css',
    js: 'src/presentation/goals/goals.js',
  },
  shop: {
    html: 'src/presentation/shopping-lists/shopping-lists.html',
    css: 'src/presentation/shopping-lists/shopping-lists.css?v=20261124-shopping-design-2',
    js: 'src/presentation/shopping-lists/shopping-lists.js?v=20261124-shopping-design-2',
  },
  rep: {
    html: 'src/presentation/reports/reports.html',
    css: 'src/presentation/reports/reports.css',
    js: 'src/presentation/reports/reports.js',
  },
  cat: {
    html: 'src/presentation/categories/categories.html',
    css: 'src/presentation/categories/categories.css',
    js: 'src/presentation/categories/categories.js',
  },
  prof: {
    html: 'src/presentation/profile/profile.html',
    css: 'src/presentation/profile/profile.css',
    js: 'src/presentation/profile/profile.js',
  },
  set: {
    html: 'src/presentation/settings/settings.html',
    css: 'src/presentation/settings/settings.css?v=20261124-settings-design-2',
    js: 'src/presentation/settings/settings.js',
  },
};

const ROUTES = Object.fromEntries(
  Object.entries(FEATURES).map(([id, feature]) => [id, feature.html]),
);

export function createRouter() {
  let currentView = null;

  function initialize() {
    window.addEventListener('pocket:viewchange', event => navigate(event.detail.view));
  }

  async function navigate(view) {
    if (!ROUTES[view] || currentView === view) return;
    currentView = view;
    document.documentElement.dataset.feature = view;
  }

  return { initialize, navigate, routes: ROUTES };
}
