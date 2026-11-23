export const feature = {
  id: "rec",
  title: "Recurring",
  html: "recurring.html",
  css: "recurring.css"
};

export function initializeFeature() {
  document.documentElement.dataset.feature = feature.id;
}
