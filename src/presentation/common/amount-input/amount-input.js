(() => {
    const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);

    window.PocketAmountInput = {
        render({
            name = '',
            id,
            value = '',
            placeholder = '0.00',
            className = '',
            type = 'number',
            inputMode = type === 'number' ? 'decimal' : '',
            step = type === 'number' ? '0.01' : undefined,
            min,
            max,
            ariaLabel,
            ariaDescribedBy,
            onInput
        }) {
            const inputAttributes = [
                name ? `name="${escapeHtml(name)}"` : '',
                id ? `id="${escapeHtml(id)}"` : '',
                `type="${escapeHtml(type)}"`,
                inputMode ? `inputmode="${escapeHtml(inputMode)}"` : '',
                step != null ? `step="${escapeHtml(step)}"` : '',
                min != null ? `min="${escapeHtml(min)}"` : '',
                max != null ? `max="${escapeHtml(max)}"` : '',
                ariaLabel ? `aria-label="${escapeHtml(ariaLabel)}"` : '',
                ariaDescribedBy ? `aria-describedby="${escapeHtml(ariaDescribedBy)}"` : '',
                onInput ? `oninput="${escapeHtml(onInput)}"` : ''
            ].filter(Boolean).join(' ');
            const wrapperClass = ['div-pocket-amount-input', className]
                .filter(Boolean)
                .map(escapeHtml)
                .join(' ');
            return `<div class="${wrapperClass}"><span aria-hidden="true">₱</span><input ${inputAttributes} value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}"></div>`;
        }
    };
})();
