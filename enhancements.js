(() => {
  const TITLE_KEY = 'pocket.dashboardTitle';
  const PRIVACY_KEY = 'pocket.hideAmounts';
  const main = document.querySelector('#m');
  if (!main) return;

  const icon = name => {
    const paths = {
      edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
      eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
      off: '<path d="m3 3 18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.1 3.8M6.2 6.2C3.6 8 2 12 2 12s3.6 7 10 7a10 10 0 0 0 3-.5"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      wallet: '<rect x="3" y="6" width="18" height="14" rx="4"/><path d="M3 11h18M16.5 15.5h1"/>',
      bolt: '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8z"/>',
      arrow: '<path d="M4 8h16l-3.5-3.5M20 16H4l3.5 3.5"/>'
    };
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
  };

  const storedTitle = () => {
    try { return localStorage.getItem(TITLE_KEY) || 'My Finance'; }
    catch { return 'My Finance'; }
  };
  const isHidden = () => {
    try { return localStorage.getItem(PRIVACY_KEY) === '1'; }
    catch { return false; }
  };

  const installStyles = () => {
    if (document.querySelector('#pocket-enhancements-style-v4')) return;
    const style = document.createElement('style');
    style.id = 'pocket-enhancements-style-v4';
    style.textContent = `
      .pocket-fab-menu {
        position: fixed;
        right: 20px;
        bottom: calc(82px + env(safe-area-inset-bottom, 0px));
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 30;
        pointer-events: auto;
      }
      .pocket-fab-menu button {
        border: 0;
        border-radius: 12px;
        padding: 10px 14px;
        min-width: 156px;
        background: var(--cd);
        color: var(--tx);
        box-shadow: 0 8px 22px rgba(0,0,0,.26);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        font-weight: 700;
        cursor: pointer;
      }
      .pocket-fab-menu button .mini {
        display: grid;
        place-items: center;
        width: 26px;
        height: 26px;
        border-radius: 8px;
        background: var(--sq);
      }
      .pocket-fab-menu button[data-kind="expense"] .mini { color: var(--ex); }
      .pocket-fab-menu button[data-kind="income"] .mini { color: var(--in); }
      .pocket-fab-menu button[data-kind="transfer"] .mini { color: var(--tr); }
      .pocket-hidden { display: none !important; }
      .fab { z-index: 22; }
      @media (max-width: 760px) {
        .pocket-fab-menu { right: 16px; bottom: calc(94px + env(safe-area-inset-bottom, 0px)); }
      }
    `;
    document.head.append(style);
  };

  const setTitle = () => {
    const heading = main.querySelector('.row.sp h2');
    if (heading) heading.textContent = storedTitle();
  };

  const updatePrivacy = () => {
    const hidden = isHidden();
    main.classList.toggle('pocket-private', hidden);
    main.querySelectorAll('.pocket-privacy-button').forEach(button => {
      button.innerHTML = icon(hidden ? 'off' : 'eye');
      button.setAttribute('aria-label', hidden ? 'Show amounts' : 'Hide amounts');
      button.title = hidden ? 'Show amounts' : 'Hide amounts';
      button.setAttribute('aria-pressed', String(hidden));
    });
  };

  const makePrivacyButton = () => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pocket-privacy-button';
    button.addEventListener('click', event => {
      event.stopPropagation();
      try { localStorage.setItem(PRIVACY_KEY, isHidden() ? '0' : '1'); } catch {}
      updatePrivacy();
    });
    return button;
  };

  const wireQuickAddMenu = () => {
    const fab = document.querySelector('.fab');
    if (!fab || fab.dataset.pocketQuickMenuReady) return;
    fab.dataset.pocketQuickMenuReady = '1';

    const menu = document.createElement('div');
    menu.className = 'pocket-fab-menu pocket-hidden';
    menu.setAttribute('aria-hidden', 'true');
    menu.innerHTML = [
      { kind: 'expense', label: 'Expense', icon: 'bolt' },
      { kind: 'income', label: 'Income', icon: 'wallet' },
      { kind: 'transfer', label: 'Transfer', icon: 'arrow' }
    ].map(item => `
      <button type="button" data-kind="${item.kind}">
        <span class="mini">${icon(item.icon)}</span>
        <span>${item.label}</span>
      </button>
    `).join('');
    document.body.append(menu);

    const toggle = () => {
      const hidden = menu.classList.toggle('pocket-hidden');
      menu.setAttribute('aria-hidden', String(hidden));
      fab.setAttribute('aria-expanded', String(!hidden));
    };

    fab.onclick = event => {
      event.preventDefault();
      event.stopPropagation();
      toggle();
    };

    menu.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        const kind = button.dataset.kind;
        if (typeof window.quickAdd === 'function') {
          window.quickAdd(kind);
        } else if (typeof window.txForm === 'function') {
          window.txForm();
          const formType = document.querySelector('#f [name="type"]');
          if (formType && kind) {
            formType.value = kind;
            if (typeof formType.onchange === 'function') formType.onchange();
          }
        }
        menu.classList.add('pocket-hidden');
        menu.setAttribute('aria-hidden', 'true');
        fab.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', event => {
      if (!menu.contains(event.target) && !fab.contains(event.target)) {
        menu.classList.add('pocket-hidden');
        menu.setAttribute('aria-hidden', 'true');
        fab.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        menu.classList.add('pocket-hidden');
        menu.setAttribute('aria-hidden', 'true');
        fab.setAttribute('aria-expanded', 'false');
      }
    });
  };

  const addCarousel = () => {
    const balance = main.querySelector(':scope > .hero:not(.hs)');
    const savings = main.querySelector(':scope > .hero.hs');
    if (!balance || !savings) return;

    let carousel = main.querySelector('.pocket-carousel');
    if (!carousel) {
      carousel = document.createElement('section');
      carousel.className = 'pocket-carousel';
      const track = document.createElement('div');
      track.className = 'pocket-carousel-track';
      track.append(balance, savings);
      carousel.append(track);
      balance.before(carousel);
    }
  };

  let queued = false;
  const enhance = () => {
    queued = false;
    installStyles();
    setTitle();
    addCarousel();
    wireQuickAddMenu();
    updatePrivacy();
  };

  const observer = new MutationObserver(() => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(enhance);
    }
  });
  observer.observe(main, { childList: true, subtree: true });
  enhance();
})();
