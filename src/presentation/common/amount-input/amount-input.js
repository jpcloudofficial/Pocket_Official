(() => {
    const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);

    window.PocketAmountInput = {
        render({ name, value = '', placeholder = '0.00' }) {
            return `<div class="pocket-amount-input"><span aria-hidden="true">₱</span><input name="${escapeHtml(name)}" type="text" inputmode="decimal" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}"></div>`;
        }
    };
})();
