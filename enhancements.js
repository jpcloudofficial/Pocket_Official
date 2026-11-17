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

  const storedTitle = () => { try { return localStorage.getItem(TITLE_KEY) || 'My Finance'; } catch { return 'My Finance'; } };
  const isHidden = () => { try { return localStorage.getItem(PRIVACY_KEY) === '1'; } catch { return false; } };

  const styles = () => {
    if (document.querySelector('#pocket-enhancements-style-v4')) return;
    const style = document.createElement('style');
    style.id = 'pocket-enhancements-style-v4';
    style.textContent = `
      .pocket-carousel{overflow:hidden;margin-top:16px;touch-action:pan-y}
      .pocket-carousel-track{display:flex;transition:transform .28s ease;will-change:transform}
      .pocket-carousel-track>.hero{position:relative;flex:0 0 100%;width:100%;min-width:100%;margin:0;padding-right:66px}
      .pocket-privacy-button{position:absolute;right:14px;top:14px;width:40px;height:40px;display:grid;place-items:center;border:1px solid var(--bd);border-radius:11px;background:var(--cd);color:var(--mu);cursor:pointer;z-index:2}
      .pocket-privacy-button svg{display:block}
      .pocket-fab-menu{position:fixed;right:22px;bottom:90px;display:flex;flex-direction:column;gap:10px;z-index:7}
      .pocket-fab-menu button{border:0;border-radius:12px;padding:10px 14px;background:var(--cd);color:var(--tx);box-shadow:0 6px 18px rgba(0,0,0,.24);display:flex;align-items:center;justify-content:flex-start;gap:10px;min-width:148px;font-weight:700;cursor:pointer}
      .pocket-fab-menu button .mini{display:grid;place-items:center;width:26px;height:26px;border-radius:8px;background:var(--sq);color:var(--tx)}
      .pocket-fab-menu button[data-kind="expense"] .mini{color:var(--ex)}
      .pocket-fab-menu button[data-kind="income"] .mini{color:var(--in)}
      .pocket-fab-menu button[data-kind="transfer"] .mini{color:var(--tr)}
      .pocket-hidden{display:none!important}
      #m.pocket-private .hb,#m.pocket-private .hn,#m.pocket-private .av,#m.pocket-private .tx>b{filter:blur(8px);user-select:none}
      @media(prefers-reduced-motion:reduce){.pocket-carousel-track{transition:none}}
    `;
    document.head.append(style);
  };

  const titleHeading = () => main.querySelector('.row.sp h2');
  const setTitle = () => {
    const heading = titleHeading();
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

  const cleanExtraDashboardControls = () => {
    main.querySelectorAll('.pocket-carousel-controls').forEach(element => element.remove());
    [...main.querySelectorAll('.row')].forEach(row => {
      const labels = [...row.querySelectorAll('button')].map(button => button.textContent.trim());
      if (labels.includes('Expense') && labels.includes('Income') && labels.includes('Transfer')) row.remove();
    });
    main.querySelectorAll('.pocket-title-edit').forEach(element => element.remove());
    main.querySelectorAll('.pocket-privacy-button').forEach(button => {
      if (!button.closest('.pocket-carousel-track > .hero')) button.remove();
    });
  };

  let slide = 0;
  const showSlide = index => {
    slide = Math.max(0, Math.min(1, index));
    const track = main.querySelector('.pocket-carousel-track');
    if (track) track.style.transform = `translateX(-${slide * 100}%)`;
  };

  const addCarousel = () => {
    let carousel = main.querySelector('.pocket-carousel');
    if (!carousel) {
      const balance = main.querySelector(':scope > .hero:not(.hs)');
      const savings = main.querySelector(':scope > .hero.hs');
      if (!balance || !savings) return;
      carousel = document.createElement('section');
      carousel.className = 'pocket-carousel';
      carousel.setAttribute('aria-label', 'Balance and savings cards. Swipe horizontally to switch cards.');
      const track = document.createElement('div');
      track.className = 'pocket-carousel-track';
      balance.before(carousel);
      track.append(balance, savings);
      carousel.append(track);
      let startX = null;
      track.addEventListener('touchstart', event => { startX = event.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend', event => {
        if (startX === null) return;
        const delta = event.changedTouches[0].clientX - startX;
        startX = null;
        if (Math.abs(delta) > 45) showSlide(slide + (delta < 0 ? 1 : -1));
      }, { passive: true });
    }
    const cards = main.querySelectorAll('.pocket-carousel-track > .hero');
    cards.forEach(card => {
      if (!card.querySelector('.pocket-privacy-button')) card.append(makePrivacyButton());
    });
    showSlide(slide);
  };

  let queued = false;
  const enhance = () => {
    queued = false;
    styles();
    setTitle();
    addCarousel();
    cleanExtraDashboardControls();
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
