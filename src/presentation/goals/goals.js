export const feature = {
  id: "goal",
  title: "Goals",
  html: "goals.html",
  css: "goals.css"
};

export function initializeFeature() {
  document.documentElement.dataset.feature = feature.id;
}
