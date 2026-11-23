export const feature = {
  id: "cat",
  title: "Categories",
  html: "categories.html",
  css: "categories.css"
};

export function initializeFeature() {
  document.documentElement.dataset.feature = feature.id;
}
