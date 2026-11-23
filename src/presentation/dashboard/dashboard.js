export const feature = {
  id: "dash",
  title: "Dashboard",
  html: "dashboard.html",
  css: "dashboard.css"
};

export function initializeFeature() {
  document.documentElement.dataset.feature = feature.id;
}
