(() => {
    const nav = document.querySelector('#pocket-navbar');
    const buttons = Array.from(document.querySelectorAll('#pocket-navbar button[data-view]'));
    const iconNames = {
        dash: 'house',
        tx: 'activity',
        acc: 'wallet',
        rep: 'chart-no-axes-column-increasing',
        set: 'settings'
    };
    if (!window.PocketIcons) throw new Error('Pocket icon renderer is not available.');
    buttons.forEach(button => {
        button.innerHTML = window.PocketIcons.render(iconNames[button.dataset.view], { size: 24 });
    });
    const setActivePage = view => {
        const activeIndex = buttons.findIndex(button => button.dataset.view === view);
        buttons.forEach((button, index) => {
            if (index === activeIndex) button.setAttribute('aria-current', 'page');
            else button.removeAttribute('aria-current');
        });
        if (activeIndex >= 0) {
            nav.style.setProperty('--active-index', activeIndex);
            nav.dataset.active = 'true';
        } else {
            nav.removeAttribute('data-active');
        }
    };

    nav.addEventListener('click', event => {
        const button = event.target.closest('button[data-view]');
        if (button) window.parent.postMessage({ type: 'pocket-navbar-navigate', view: button.dataset.view }, '*');
    });
    window.addEventListener('message', event => {
        if (event.source !== window.parent || event.data?.type !== 'pocket-navbar-state') return;
        if (event.data.theme === 'dark' || event.data.theme === 'light') {
            document.documentElement.dataset.theme = event.data.theme;
        }
        setActivePage(event.data.view);
    });
    window.parent.postMessage({ type: 'pocket-navbar-ready' }, '*');
})();
