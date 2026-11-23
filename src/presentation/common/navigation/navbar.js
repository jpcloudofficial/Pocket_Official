(() => {
    const buttons = Array.from(document.querySelectorAll('#pocket-navbar button[data-view]'));
    const setActivePage = view => buttons.forEach(button => {
        if (button.dataset.view === view) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
    });

    document.querySelector('#pocket-navbar').addEventListener('click', event => {
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
