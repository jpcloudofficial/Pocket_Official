export const feature = {
  id: "tx",
  title: "Transactions",
  html: "transactions.html",
  css: "transactions.css"
};

export function initializeFeature(){
  document.documentElement.dataset.feature = feature.id;
}
