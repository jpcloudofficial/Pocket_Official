export function formatPeso(amount, forceDecimals = false) {
  const numeric = Number(amount) || 0;
  return `${numeric < 0 ? '-' : ''}₱${Math.abs(numeric).toLocaleString('en-PH', {
    minimumFractionDigits: forceDecimals ? 2 : Number.isInteger(Math.abs(numeric)) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}
