export function initializeFab(element, onActivate) {
  if (!element) return () => {};
  const handler = event => onActivate?.(event);
  element.addEventListener('click', handler);
  return () => element.removeEventListener('click', handler);
}
