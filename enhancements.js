(() => {
  const TITLE_KEY = 'pocket.dashboardTitle';
  const PRIVACY_KEY = 'pocket.hideAmounts';
  const main = document.querySelector('#m');
  if (!main) return;

  const paths = {
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    off: '<path d="m3 3 18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.1 3.8M6.2 6.2C3.6 8 2 12 2 12s3.6 7 10 7a10 10 0 0 0 3-.5"/>',
    wallet: '<rect x="3" y="6" width="18" height="14" rx="4"/><path d="M3 11h18M16.5 15.5h1"/>',
    bolt: '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8z"/>',
    arrow: '<path d="M4 8h16l-3.5-3.5M20 16H4l3.5 3.5"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ''}</svg>`;
  const storedTitle = () => {
    try { return localStorage.getItem(TITLE_KEY) || 'My Finance'; }
    catch { return 'My Finance'; }
  };
  const isHidden = () => {
    try { return localStorage.getItem(PRIVACY_KEY) === '1'; }
    catch { return false; }
  };

  const installStyles = () => {
    if (document.querySelector('#pocket-enhancements-style-v7')) return;
    const style = document.createElement('style');
    style.id = 'pocket-enhancements-style-v7';
    style.textContent = `
      .pocket-carousel{overflow:hidden;margin-top:16px;touch-action:pan-y;user-select:none;-webkit-user-select:none}
      .pocket-carousel-track{display:flex;width:100%;transition:transform .42s cubic-bezier(.22,.8,.25,1);will-change:transform}
      .pocket-carousel-track>.hero{position:relative;flex:0 0 100%;width:100%;min-width:100%;margin:0;padding-right:66px}
      .pocket-carousel-track.is-dragging{transition:none!important;cursor:grabbing}
      .pocket-carousel-controls{display:none!important}
      .pocket-privacy-button{position:absolute;right:14px;top:14px;width:40px;height:40px;display:grid;place-items:center;border:1px solid var(--bd);border-radius:11px;background:var(--cd);color:var(--mu);cursor:pointer;z-index:2;transition:transform .18s ease,background-color .18s ease,color .18s ease}
      .pocket-privacy-button svg{display:block;transition:transform .2s ease}
      .pocket-privacy-button:hover{transform:translateY(-2px)}
      .pocket-privacy-button:active{transform:scale(.9)}
      .pocket-fab-menu{position:fixed;right:20px;bottom:calc(82px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:8px;z-index:30;pointer-events:auto}
      .pocket-fab-menu button{border:0;border-radius:12px;padding:10px 14px;min-width:156px;min-height:48px;background:var(--cd);color:var(--tx);box-shadow:0 8px 22px #0004;display:flex;align-items:center;justify-content:flex-start;gap:10px;font-weight:700;cursor:pointer;transform-origin:bottom right;animation:pocket-pop-in .22s cubic-bezier(.2,.8,.2,1) both;transition:transform .14s ease,background-color .14s ease,box-shadow .14s ease}
      .pocket-fab-menu button:nth-child(2){animation-delay:.035s}
      .pocket-fab-menu button:nth-child(3){animation-delay:.07s}
      .pocket-fab-menu button:hover{transform:translateX(-3px);box-shadow:0 10px 26px #0005}
      .pocket-fab-menu button:active{transform:scale(.96)}
      .pocket-fab-menu button .mini{display:grid;place-items:center;width:26px;height:26px;border-radius:8px;background:var(--sq)}
      .pocket-fab-menu button[data-kind="expense"] .mini{color:var(--ex)}
      .pocket-fab-menu button[data-kind="income"] .mini{color:var(--in)}
      .pocket-fab-menu button[data-kind="transfer"] .mini{color:var(--tr)}
      .pocket-hidden{display:none!important}
      .fab{z-index:22;transition:opacity .2s ease,transform .2s cubic-bezier(.2,.8,.2,1)}
      .fab:active{transform:scale(.92)}
      .fab.pocket-fab-open{opacity:0;transform:scale(.65) rotate(45deg);pointer-events:none}
      .b1,.b2,.chip,.ib{transition:transform .14s ease,filter .14s ease,background-color .14s ease}
      .b1:active,.b2:active,.chip:active,.ib:active{transform:scale(.96)}
      #m.pocket-private .hb,#m.pocket-private .hn,#m.pocket-private .av,#m.pocket-private .tx>b{filter:blur(8px);user-select:none}
      @keyframes pocket-pop-in{from{opacity:0;transform:translateY(12px) scale(.94)}to{opacity:1;transform:translateY(0) scale(1)}}
      @media(max-width:760px){.pocket-fab-menu{right:16px;bottom:calc(94px + env(safe-area-inset-bottom,0px))}}
      @media(prefers-reduced-motion:reduce){.pocket-carousel-track,.pocket-fab-menu button,.fab,.pocket-privacy-button,.pocket-privacy-button svg,.b1,.b2,.chip,.ib{transition:none!important;animation:none!important}}
    `;
    document.head.append(style);
  };

  const dashboardTitle = () => main.querySelector(':scope > .row.sp h2');
  const setTitle = () => {
    const heading = dashboardTitle();
    if (!heading || heading.textContent.trim() === 'Settings') return;
    const title = storedTitle();
    if (heading.textContent !== title) heading.textContent = title;
  };
  const addTitleSetting = () => {
    const heading = [...main.querySelectorAll('h2')].find(item => item.textContent.trim() === 'Settings');
    if (!heading || main.querySelector('.pocket-title-setting')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'b2 pocket-title-setting';
    button.style.marginTop = '12px';
    button.innerHTML = `${icon('edit')} Customize dashboard title`;
    button.addEventListener('click', () => {
      const answer = window.prompt('Choose a dashboard title (up to 32 characters):', storedTitle());
      if (answer === null) return;
      try { localStorage.setItem(TITLE_KEY, answer.trim().slice(0, 32) || 'My Finance'); } catch {}
      setTitle();
    });
    heading.after(button);
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

  let slide = 0;
  let dragStart = null;
  const showSlide = next => {
    slide = Math.max(0, Math.min(1, next));
    const track = main.querySelector('.pocket-carousel-track');
    if (track) {
      track.classList.remove('is-dragging');
      track.style.transform = `translateX(-${slide * 100}%)`;
    }
  };
  const addCarousel = () => {
    let carousel = main.querySelector(':scope > .pocket-carousel');
    if (!carousel) {
      const balance = main.querySelector(':scope > .hero:not(.hs)');
      const savings = main.querySelector(':scope > .hero.hs');
      if (!balance || !savings) return;
      carousel = document.createElement('section');
      carousel.className = 'pocket-carousel';
      carousel.setAttribute('aria-label', 'Balance and savings cards. Swipe left or right to switch cards.');
      const track = document.createElement('div');
      track.className = 'pocket-carousel-track';
      track.append(balance, savings);
      carousel.append(track);
      balance.before(carousel);

      track.addEventListener('touchstart', event => {
        dragStart = event.touches[0].clientX;
        track.classList.add('is-dragging');
      }, { passive: true });
      track.addEventListener('touchmove', event => {
        if (dragStart === null) return;
        const dx = event.touches[0].clientX - dragStart;
        const width = carousel.getBoundingClientRect().width || window.innerWidth;
        const dragPercent = dx / width * 100;
        const offset = Math.max(-100, Math.min(0, -slide * 100 + dragPercent));
        track.style.transform = `translateX(${offset}%)`;
      }, { passive: true });
      track.addEventListener('touchend', event => {
        if (dragStart === null) return;
        const dx = event.changedTouches[0].clientX - dragStart;
        dragStart = null;
        if (Math.abs(dx) > 48) showSlide(slide + (dx < 0 ? 1 : -1));
        else showSlide(slide);
      }, { passive: true });
      track.addEventListener('touchcancel', () => {
        dragStart = null;
        showSlide(slide);
      }, { passive: true });
    }
    const cards = main.querySelectorAll('.pocket-carousel-track > .hero');
    cards.forEach(card => {
      if (!card.querySelector('.pocket-privacy-button')) card.append(makePrivacyButton());
    });
    showSlide(slide);
  };

  const removeLegacyDashboardControls = () => {
    main.querySelectorAll('.pocket-carousel-controls').forEach(element => element.remove());
    main.querySelectorAll('.pocket-title-edit').forEach(element => element.remove());
    [...main.querySelectorAll('.row')].forEach(row => {
      const buttons = [...row.querySelectorAll('button')];
      const labels = buttons.map(button => button.textContent.trim().toLowerCase());
      if (labels.some(label => label.includes('expense')) && labels.some(label => label.includes('income')) && labels.some(label => label.includes('transfer'))) row.remove();
    });
  };

  const closeMenu = (menu, fab) => {
    menu.classList.add('pocket-hidden');
    menu.setAttribute('aria-hidden', 'true');
    fab.setAttribute('aria-expanded', 'false');
    fab.classList.remove('pocket-fab-open');
  };
  const wireQuickAdd = () => {
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
    ].map(item => `<button type="button" data-kind="${item.kind}"><span class="mini">${icon(item.icon)}</span><span>${item.label}</span></button>`).join('');
    document.body.append(menu);
    fab.onclick = event => {
      event.preventDefault();
      event.stopPropagation();
      const opening = menu.classList.contains('pocket-hidden');
      menu.classList.toggle('pocket-hidden', !opening);
      menu.setAttribute('aria-hidden', String(!opening));
      fab.setAttribute('aria-expanded', String(opening));
      fab.classList.toggle('pocket-fab-open', opening);
    };
    menu.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      const kind = button.dataset.kind;
      if (typeof window.quickAdd === 'function') window.quickAdd(kind);
      closeMenu(menu, fab);
    }));
    document.addEventListener('click', event => {
      if (!menu.contains(event.target) && !fab.contains(event.target)) closeMenu(menu, fab);
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(menu, fab); });
  };

  let queued = false;
  const enhance = () => {
    queued = false;
    installStyles();
    const settingsPage = [...main.querySelectorAll('h2')].some(item => item.textContent.trim() === 'Settings');
    if (settingsPage) addTitleSetting();
    else {
      setTitle();
      addCarousel();
      removeLegacyDashboardControls();
    }
    wireQuickAdd();
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
