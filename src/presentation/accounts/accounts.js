export const feature = {
  id: "acc",
  title: "Accounts",
  html: "accounts.html",
  css: "accounts.css"
};

export function initializeFeature() {
  document.documentElement.dataset.feature = feature.id;
}
