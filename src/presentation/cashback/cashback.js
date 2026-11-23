export const feature = {
  id: "cash",
  title: "Cashback",
  html: "cashback.html",
  css: "cashback.css"
};

export function initializeFeature() {
  document.documentElement.dataset.feature = feature.id;
}
