const ROUTES = {
  onboarding: 'src/presentation/onboarding/onboarding.html',
  dash: 'src/presentation/dashboard/dashboard.html',
  tx: 'src/presentation/transactions/transactions.html',
  cash: 'src/presentation/cashback/cashback.html',
  rec: 'src/presentation/recurring/recurring.html',
  acc: 'src/presentation/accounts/accounts.html',
  bud: 'src/presentation/budgets/budgets.html',
  goal: 'src/presentation/goals/goals.html',
  shop: 'src/presentation/shopping-lists/shopping-lists.html',
  rep: 'src/presentation/reports/reports.html',
  cat: 'src/presentation/categories/categories.html',
  prof: 'src/presentation/profile/profile.html',
  set: 'src/presentation/settings/settings.html',
};

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
