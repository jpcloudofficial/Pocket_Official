export const feature = {
  id: "shop",
  title: "Shopping Lists",
  html: "shopping-lists.html",
  css: "shopping-lists.css"
};

export function initializeFeature() {
  document.documentElement.dataset.feature = feature.id;
}
