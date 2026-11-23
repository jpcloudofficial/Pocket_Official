export const feature = {
  id: "onboarding",
  title: "Onboarding",
  html: "onboarding.html",
  css: "onboarding.css"
};

export function initializeFeature() {
  document.documentElement.dataset.feature = feature.id;
}
