export function closeModal() {
  const overlay = document.querySelector('#ov');
  if (overlay) {
    overlay.hidden = true;
    document.body.classList.remove('pocket-modal-open');
  }
}
