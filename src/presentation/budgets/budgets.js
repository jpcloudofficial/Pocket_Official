export const feature = {
  id: "bud",
  title: "Budgets",
  html: "budgets.html",
  css: "budgets.css"
};

export function initializeFeature() {
  document.documentElement.dataset.feature = feature.id;
}
