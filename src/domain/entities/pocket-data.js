export function createEmptyPocketData() {
  return {
    name: '',
    profileAccent: '#16a34a',
    profilePhoto: '',
    theme: 'light',
    dateFormat: 'DD/MM/YYYY',
    financialPeriod: 'monthly',
    acc: [],
    cats: [],
    tx: [],
    recurring: [],
    cashbacks: [],
    budgets: {},
    goals: [],
    shoppingLists: [],
    dashboardWidgets: {},
  };
}
