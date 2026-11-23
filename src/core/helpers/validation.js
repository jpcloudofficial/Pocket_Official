export function isValidId(value) {
  return typeof value === 'string' && /^[\w-]{1,40}$/.test(value);
}

export function isValidHexColor(value) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}
