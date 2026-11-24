(() => {
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);

  window.PocketPageHeader = ({ eyebrow = '', title, description = '' } = {}) => {
    if (typeof title !== 'string' || !title.trim()) {
      throw new TypeError('Page headers require a non-empty title.');
    }

    const eyebrowMarkup = typeof eyebrow === 'string' && eyebrow.trim()
      ? `<small class="pocket-unified-page-eyebrow">${escapeHtml(eyebrow)}</small>`
      : '';
    const descriptionMarkup = typeof description === 'string' && description.trim()
      ? `<p class="pocket-unified-page-description">${escapeHtml(description)}</p>`
      : '';

    return `<header class="pocket-page-header pocket-unified-page-header"><div class="pocket-page-heading pocket-unified-page-heading">${eyebrowMarkup}<h2 class="pocket-page-title page-menu-title">${escapeHtml(title)}</h2>${descriptionMarkup}</div></header>`;
  };
})();
