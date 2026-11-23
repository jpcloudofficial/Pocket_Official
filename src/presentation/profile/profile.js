export const feature = {
  id: "prof",
  title: "Profile",
  html: "profile.html",
  css: "profile.css"
};

export function initializeFeature() {
  document.documentElement.dataset.feature = feature.id;
}
