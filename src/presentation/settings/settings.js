export const feature = {
  id: "set",
  title: "Settings",
  html: "settings.html",
  css: "settings.css"
};

export function initializeFeature(){
  document.documentElement.dataset.feature = feature.id;
}
