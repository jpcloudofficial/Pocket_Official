(() => {
    const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);

    const closeMenus = () => document.querySelectorAll('.pocket-action-menu .div-pocket-menu-options:not([hidden])')
        .forEach(options => {
            options.hidden = true;
            options.closest('.pocket-action-menu')
                ?.querySelector('.pocket-action-menu-trigger')
                ?.setAttribute('aria-expanded', 'false');
        });

    window.PocketActionMenu = {
        render({ owner, entityId = '', label, actions, optionsHtml, className = '', triggerIcon }) {
            if (!owner || !label || !triggerIcon ||
                (!Array.isArray(actions) && typeof optionsHtml !== 'string')) {
                throw new TypeError('Action menus require an owner, label, trigger icon, and options.');
            }

            const content = Array.isArray(actions)
                ? actions.map(action => `<button type="button" class="pocket-action-menu-option${action.destructive ? ' is-destructive' : ''}" data-action="${escapeHtml(action.action)}" data-entity-id="${escapeHtml(entityId)}">${action.icon || ''}<span>${escapeHtml(action.label)}</span></button>`).join('')
                : optionsHtml;
            return `<div class="pocket-action-menu ${escapeHtml(className)}" data-menu-owner="${escapeHtml(owner)}"><button type="button" class="pocket-action-menu-trigger" aria-label="${escapeHtml(label)}" aria-expanded="false">${triggerIcon}</button><div class="div-pocket-menu-options" hidden>${content}</div></div>`;
        }
    };

    document.addEventListener('click', event => {
        const target = event.target instanceof Element ? event.target : null,
            trigger = target?.closest('.pocket-action-menu-trigger');
        if (trigger) {
            const menu = trigger.closest('.pocket-action-menu'),
                options = menu?.querySelector('.div-pocket-menu-options');
            if (!menu || !options) return;
            const shouldOpen = options.hidden;
            closeMenus();
            if (shouldOpen) {
                options.hidden = false;
                trigger.setAttribute('aria-expanded', 'true');
            }
            return;
        }

        const button = target?.closest('.pocket-action-menu-option');
        const menu = button?.closest('.pocket-action-menu');
        if (button && menu) {
            closeMenus();
            document.dispatchEvent(new CustomEvent('pocket:action-menu', {
                detail: {
                    owner: menu.dataset.menuOwner,
                    action: button.dataset.action,
                    entityId: button.dataset.entityId
                }
            }));
            return;
        }

        if (!target?.closest('.pocket-action-menu')) closeMenus();
    });

    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        const openOptions = document.querySelector('.pocket-action-menu .div-pocket-menu-options:not([hidden])');
        if (!openOptions) return;
        const trigger = openOptions.closest('.pocket-action-menu')
            ?.querySelector('.pocket-action-menu-trigger');
        closeMenus();
        trigger?.focus();
    });
})();
