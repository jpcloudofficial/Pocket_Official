export const feature = {
  id: "rep",
  title: "Reports",
  html: "reports.html",
  css: "reports.css"
};

export function initializeFeature() {
  document.documentElement.dataset.feature = feature.id;
}
