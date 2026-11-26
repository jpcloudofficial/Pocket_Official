(() => {
    const paths = window.PocketLucidePaths,
        aliases = Object.freeze({
            arrow: 'arrow-left-right',
            bank: 'landmark',
            'bar-chart-3': 'chart-no-axes-column-increasing',
            'alert-triangle': 'triangle-exclamation-point',
            chart: 'chart-no-axes-column-increasing',
            cart: 'shopping-cart',
            edit: 'pencil',
            goal: 'target',
            home: 'house',
            more: 'ellipsis',
            'more-horizontal': 'ellipsis',
            off: 'eye-off',
            'trash-2': 'trash'
        }),
        escapeAttribute = value => String(value).replace(/[&<>"']/g, character => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[character]);

    if (!paths) throw new Error('Lucide icon paths were not loaded.');

    const resolveName = name => {
        const key = String(name || '');
        return Object.prototype.hasOwnProperty.call(aliases, key) ? aliases[key] : key
    };

    function render(name, options = {}) {
        const content = paths[resolveName(name)] || paths.circle,
            size = Number.isFinite(options.size) && options.size > 0 ? Math.round(options.size) : 24,
            classes = ['ic', ...String(options.className || '').split(/\s+/).filter(value => /^[a-z0-9_-]+$/i.test(value))]
                .join(' '),
            ariaHidden = options.ariaHidden !== false;
        return `<svg class="${escapeAttribute(classes)}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="${ariaHidden}" focusable="false">${content}</svg>`
    }

    const has = name => Object.prototype.hasOwnProperty.call(paths, resolveName(name));
    window.PocketIcons = Object.freeze({ has, render });
})();
