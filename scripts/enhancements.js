(() => {
  const PRIVACY_KEY = 'pocket.hideAmounts';
  const main = document.querySelector('#m');
  if (!main) return;

  const icon = name => {
    const paths = {
      edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
      eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
      off: '<path d="m3 3 18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.1 3.8M6.2 6.2C3.6 8 2 12 2 12s3.6 7 10 7a10 10 0 0 0 3-.5"/>',
      bolt: '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8z"/>',
      wallet: '<rect x="3" y="6" width="18" height="14" rx="4"/><path d="M3 11h18M16.5 15.5h1"/>',
      arrow: '<path d="M4 8h16l-3.5-3.5M20 16H4l3.5 3.5"/>'
    };
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ''}</svg>`;
  };
  const dashboardTitle = () => {
    const name = window.pocketApp?.getData?.().name;
    const hour = new Date().getHours(),
      greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    return typeof name === 'string' && name.trim() ? `${greeting}, ${name.trim()}!` : `${greeting}!`;
  };
  const isHidden = () => { try { return localStorage.getItem(PRIVACY_KEY) === '1'; } catch { return false; } };

  const installStyles = () => {
    if (document.querySelector('#pocket-dashboard-style')) return;
    const style = document.createElement('style');
    style.id = 'pocket-dashboard-style';
    style.textContent = `
      .pocket-carousel{display:block;width:100%;overflow:hidden;margin-top:16px;touch-action:pan-y;user-select:none;-webkit-user-select:none}
      .pocket-carousel-track{display:flex;width:100%;transition:transform .35s cubic-bezier(.22,.8,.25,1);will-change:transform}
      .pocket-carousel-track>.hero{position:relative;display:block;flex:0 0 100%;width:100%;min-width:100%;margin:0;padding-right:66px}
      .pocket-carousel-track.is-dragging{transition:none!important}
      .pocket-carousel-controls{display:none!important}
      .pocket-privacy-button{position:absolute;right:14px;top:14px;width:40px;height:40px;padding:0;display:grid;place-items:center;border:1px solid var(--bd);border-radius:11px;background:var(--cd);color:var(--mu);cursor:pointer;z-index:2}
      .pocket-privacy-button svg{display:block}
      .pocket-privacy-header{margin-bottom:10px}
      .pocket-privacy-header>.pocket-privacy-button{position:static;flex:0 0 40px;margin-left:auto}
      .pocket-profile-button{position:relative;display:grid;place-items:center;flex:none;width:38px;height:38px;overflow:hidden;padding:0;border:0;border-radius:50%;background:var(--profile-accent);color:#fff;font:inherit;font-weight:700;cursor:pointer}
      .pocket-profile-button img{position:absolute;inset:0;width:100%;height:100%;border-radius:inherit;object-fit:cover;opacity:0;transition:opacity .15s ease}
      .pocket-profile-button img.is-loaded{opacity:1}
      .pocket-profile-button:focus-visible{outline:2px solid var(--tx);outline-offset:2px}
      .page-menu-toggle{display:flex;flex:none;width:32px;height:32px;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:0;border:0;border-radius:9px;background:transparent;color:var(--mu);cursor:pointer;transition:color .18s ease}
      .page-menu-toggle span{display:block;width:16px;height:2px;border-radius:2px;background:currentColor;transition:transform .2s ease,opacity .16s ease}
      .page-menu-toggle[aria-expanded="true"] span:first-child{transform:translateY(6px) rotate(45deg)}
      .page-menu-toggle[aria-expanded="true"] span:nth-child(2){opacity:0}
      .page-menu-toggle[aria-expanded="true"] span:last-child{transform:translateY(-6px) rotate(-45deg)}
      .page-menu-toggle:focus-visible{outline:2px solid var(--tx);outline-offset:2px}
      .pocket-page-header{flex-wrap:nowrap}
      .pocket-page-heading{flex:1 1 auto;min-width:0}
      h2.pocket-page-title{position:relative;display:block;width:100%;max-width:100%;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .pocket-fab-menu{position:fixed;right:22px;bottom:calc(82px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:8px;z-index:30;transform-origin:bottom right}
      .pocket-fab-menu button{border:0;border-radius:12px;padding:10px 14px;min-width:156px;min-height:48px;background:var(--cd);color:var(--tx);box-shadow:0 8px 22px #0004;display:flex;align-items:center;gap:10px;font-weight:700;cursor:pointer}
      .pocket-fab-menu button .mini{display:grid;place-items:center;width:26px;height:26px;border-radius:8px;background:var(--sq)}
      .pocket-fab-menu button[data-kind="expense"] .mini{color:var(--ex)}
      .pocket-fab-menu button[data-kind="income"] .mini{color:var(--in)}
      .pocket-fab-menu button[data-kind="transfer"] .mini{color:var(--tr)}
      .pocket-account-transfer{position:fixed;right:22px;bottom:82px;z-index:21;width:147px;height:52px;padding:0 16px;border:1px solid var(--bd);border-radius:28px;background:var(--cd);color:var(--tx);box-shadow:0 4px 14px #0004;display:flex;align-items:center;justify-content:flex-start;gap:8px;font:inherit;font-weight:700;cursor:pointer}
      .pocket-account-transfer svg{width:24px;height:24px;flex:none}
      body.pocket-modal-open .pocket-account-transfer{display:none!important}
      .pocket-fab-menu,.pocket-account-transfer{transition:transform .24s ease,opacity .24s ease}
      body.pocket-actions-scroll-hidden .fab,body.pocket-actions-scroll-hidden .pocket-account-transfer,body.pocket-actions-scroll-hidden .pocket-fab-menu{transform:translateX(calc(100% + 80px));opacity:0;pointer-events:none}
      @media(max-width:760px){
        .fab{right:14px}
      }
      .pocket-hidden{display:none!important}
      .fab{z-index:22;transition:opacity .2s ease,transform .2s ease}
      .fab.pocket-fab-open{opacity:0;transform:scale(.7);pointer-events:none}
      .pocket-fab-menu.pocket-fab-opening{animation:pocket-fab-menu-in .2s cubic-bezier(.2,.8,.2,1) both}
      .pocket-fab-menu.pocket-fab-closing{pointer-events:none;animation:pocket-fab-menu-out .18s ease-in both}
      .pocket-fab-menu.pocket-fab-opening button{animation:pocket-fab-action-in .2s cubic-bezier(.2,.8,.2,1) both}
      @keyframes pocket-fab-menu-in{from{opacity:0;transform:scale(.7) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
      @keyframes pocket-fab-menu-out{from{opacity:1;transform:scale(1) translateY(0)}to{opacity:0;transform:scale(.7) translateY(8px)}}
      @keyframes pocket-fab-action-in{from{opacity:0;transform:translateY(8px) scale(.94)}to{opacity:1;transform:translateY(0) scale(1)}}
      #m.pocket-private .pocket-private-amount{user-select:none}
      @media(max-width:760px){.pocket-fab-menu{right:14px;bottom:calc(82px + env(safe-area-inset-bottom,0px))}.pocket-account-transfer{right:14px;bottom:calc(142px + env(safe-area-inset-bottom,0px))}}
      @media(prefers-reduced-motion:reduce){.pocket-carousel-track,.pocket-fab-menu,.pocket-account-transfer,.fab,.page-menu-toggle,.page-menu-toggle span{transition:none!important}}
    `;
    document.head.append(style);
  };

  const pageTitle = () => main.querySelector(':scope > .row.sp h2');
  const setTitle = () => {
    if (main.dataset.view !== 'dash') return;
    const heading = pageTitle();
    if (!heading) return;
    const title = dashboardTitle();
    if (heading.textContent !== title) heading.textContent = title;
  };

  const CATEGORY_RULES = [
    { category: 'Transportation', words: ['jeepney','jeep','bus','taxi','grab','uber','train','mrt','lrt','commute','fare','parking','toll','gasoline','fuel', 'tryc','sidecar'] },
    { category: 'Food & Drinks', words: ['jollibee','mcdonald','mcdo','restaurant','lunch','dinner','breakfast','coffee','cafe','food','meal','eatery','pizza','kfc','chowking'] },
    { category: 'Groceries', words: ['grocery','groceries','supermarket','palengke','vegetable','vegetables','rice','meat','market'] },
    { category: 'Snacks', words: ['snack','milk tea','milktea','boba','donut','doughnut','bakery','pastry','dessert','cookie','chips'] },
    { category: 'Personal Care', words: ['haircut','barber','salon','shampoo','skincare','skin care','toiletries','soap','personal care','nail'] },
    { category: 'Shopping', words: ['shopee','lazada','clothes','clothing','shoes','shirt','dress','online shopping','mall'] },
    { category: 'Household Expenses', words: ['household','cleaning','detergent','furniture','home supplies','cleaning supplies'] },
    { category: 'Bills & Utilities', words: ['electric bill','electricity','meralco','water bill','maynilad','internet','wifi','broadband','phone bill','utility','utilities'] },
    { category: 'Subscriptions', words: ['spotify','netflix','youtube premium','subscription','disney plus','icloud','google one'] },
    { category: 'Entertainment', words: ['movie','cinema','concert','videogame','video game','game','karaoke','bowling','entertainment'] },
    { category: 'Health & Wellness', words: ['pharmacy','medicine','medication','doctor','clinic','hospital','vitamins','dental','checkup','health'] },
    { category: 'Salary', words: ['salary','payroll','paycheck','wage'] },
    { category: 'Allowance', words: ['allowance','pocket money'] },
    { category: 'Freelance / Side Hustle', words: ['freelance','client payment','side hustle','gig','commission'] },
    { category: 'Bonus', words: ['bonus','incentive'] },
    { category: 'Cashback', words: ['cashback','cash back','cash-back','cash reward'] },
    { category: 'Refund', words: ['refund','reimbursement'] }
  ];
  const normalize = value => String(value || '').toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const keywordMatch = (title, word) => ` ${normalize(title)} `.includes(` ${normalize(word)} `);

  const attachAutoCategory = form => {
    if (!form || form.dataset.pocketAutoCategoryReady) return;
    const titleEl = form.querySelector('[name="title"]');
    const typeEl = form.querySelector('[name="type"]');
    const catEl = form.querySelector('[name="cat"]');
    if (!titleEl || !typeEl || !catEl) return;
    form.dataset.pocketAutoCategoryReady = '1';
    let manuallyChanged = false;
    let applying = false;
    catEl.addEventListener('change', () => {
      if (!applying) manuallyChanged = true;
    });
    const infer = () => {
      if (typeEl.value === 'transfer' || !titleEl.value.trim()) return;
      if (manuallyChanged) return;
      const rule = CATEGORY_RULES.find(item => item.words.some(word => keywordMatch(titleEl.value, word)));
      const option = rule && [...catEl.options].find(item => normalize(item.textContent) === normalize(rule.category));
      if (!option || catEl.value === option.value) return;
      applying = true;
      catEl.value = option.value;
      catEl.dispatchEvent(new Event('change', { bubbles: true }));
      applying = false;
    };
    titleEl.addEventListener('input', infer);
    titleEl.addEventListener('change', infer);
    typeEl.addEventListener('change', () => { manuallyChanged = false; infer(); });
  };
  const watchTransactionForm = () => {
    const form = document.querySelector('#f');
    if (form) attachAutoCategory(form);
  };

  const updatePrivacy = () => {
    const hidden = isHidden();
    main.classList.toggle('pocket-private', hidden);
    main.querySelectorAll('.pocket-privacy-button').forEach(button => {
      if (button.getAttribute('aria-pressed') === String(hidden)) return;
      button.innerHTML = icon(hidden ? 'off' : 'eye');
      button.setAttribute('aria-label', hidden ? 'Show amounts' : 'Hide amounts');
      button.title = hidden ? 'Show amounts' : 'Hide amounts';
      button.setAttribute('aria-pressed', String(hidden));
    });
  };
  const makePrivacyButton = () => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'pocket-privacy-button';
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
    if (!track) return;
    track.classList.remove('is-dragging');
    track.style.transform = `translateX(-${slide * 100}%)`;
  };
  const addCarousel = () => {
    let carousel = main.querySelector(':scope > .pocket-carousel');
    let balance = main.querySelector(':scope > .hero:not(.hs)') || main.querySelector('.pocket-carousel-track > .hero:not(.hs)');
    let savings = main.querySelector(':scope > .hero.hs') || main.querySelector('.pocket-carousel-track > .hero.hs');
    if (!balance || !savings) return;
    if (!carousel) {
      carousel = document.createElement('section');
      carousel.className = 'pocket-carousel';
      carousel.setAttribute('aria-label', 'Balance and savings cards. Swipe left or right to switch cards.');
      carousel.append(document.createElement('div'));
      carousel.firstElementChild.className = 'pocket-carousel-track';
      if (balance.parentElement === main) balance.before(carousel);
    }
    let track = carousel.querySelector('.pocket-carousel-track');
    if (!track) { track = document.createElement('div'); track.className = 'pocket-carousel-track'; carousel.append(track); }
    if (balance.parentElement !== track) track.append(balance);
    if (savings.parentElement !== track) track.append(savings);
    if (!track.dataset.pocketSwipeReady) {
      track.dataset.pocketSwipeReady = '1';
      track.addEventListener('touchstart', event => {
        if (event.touches.length !== 1) return;
        dragStart = event.touches[0].clientX;
        track.classList.add('is-dragging');
      }, { passive: true });
      track.addEventListener('touchmove', event => {
        if (dragStart === null || event.touches.length !== 1) return;
        const dx = event.touches[0].clientX - dragStart;
        const width = carousel.getBoundingClientRect().width || window.innerWidth;
        const offset = Math.max(-100, Math.min(0, -slide * 100 + dx / width * 100));
        track.style.transform = `translateX(${offset}%)`;
      }, { passive: true });
      track.addEventListener('touchend', event => {
        if (dragStart === null) return;
        const dx = event.changedTouches[0].clientX - dragStart;
        dragStart = null;
        showSlide(Math.abs(dx) > 48 ? slide + (dx < 0 ? 1 : -1) : slide);
      }, { passive: true });
      track.addEventListener('touchcancel', () => { dragStart = null; showSlide(slide); }, { passive: true });
    }
    showSlide(slide);
  };

  const addPagePrivacyButton = () => {
    if (main.dataset.view !== 'dash') return;
    const target = main.querySelector('.hero:not(.hs)') || pageTitle()?.parentElement;
    if (!target) return;
    let button = main.querySelector('.pocket-privacy-button');
    if (!button) button = makePrivacyButton();
    if (button.parentElement !== target) target.append(button);
  };
  const pageHeader = () => {
    const heading = main.querySelector(':scope > h2, :scope > .row h2, :scope > .cashback-header h2');
    return heading?.closest('.row, .cashback-header') || null;
  };
  const addProfileButton = () => {
    const header = pageHeader();
    if (!header) return;
    header.classList.add('pocket-page-header');
    const heading = header.querySelector('h2');
    if (heading) {
      heading.classList.add('pocket-page-title');
      (heading.parentElement === header ? heading : heading.parentElement).classList.add('pocket-page-heading');
    }
    let button = main.querySelector('.pocket-profile-button');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'pocket-profile-button';
      button.addEventListener('click', () => {
        if (typeof window.go !== 'function') return;
        window.go('prof');
      });
    }
    if (button.parentElement !== header) header.append(button);
    const data = window.pocketApp?.getData?.();
    const name = typeof data?.name === 'string' ? data.name.trim() : '';
    const accent = data?.profileAccent || '#2563eb';
    const initial = name.charAt(0).toUpperCase() || 'P';
    let initials = button.querySelector('.profile-avatar-fallback');
    if (!initials) {
      initials = document.createElement('span');
      initials.className = 'profile-avatar-fallback';
      button.prepend(initials);
    }
    if (initials.textContent !== initial) initials.textContent = initial;
    if (button.style.getPropertyValue('--profile-accent') !== accent) button.style.setProperty('--profile-accent', accent);
    button.setAttribute('aria-label', name ? `Open ${name}'s profile` : 'Open profile');
    button.title = name ? `Profile: ${name}` : 'Profile';
    window.pocketCloud?.refreshProfile?.();
  };

  const PAGE_TABS = ['dash', 'tx', 'acc', 'rep', 'set'];
  let pageSwipeStart = null;
  const wirePageSwipe = () => {
    if (main.dataset.pocketPageSwipeReady) return;
    main.dataset.pocketPageSwipeReady = '1';
    main.addEventListener('touchstart', event => {
      if (event.touches.length !== 1 || !PAGE_TABS.includes(main.dataset.view)) {
        pageSwipeStart = null;
        return;
      }
      const target = event.target;
      if (target.closest('button,a,input,select,textarea,[role="button"],[role="link"],.account-carousel,.account-stack,.pocket-carousel')) {
        pageSwipeStart = null;
        return;
      }
      pageSwipeStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }, { passive: true });
    main.addEventListener('touchmove', event => {
      if (event.touches.length !== 1) pageSwipeStart = null;
    }, { passive: true });
    main.addEventListener('touchend', event => {
      if (!pageSwipeStart || event.changedTouches.length !== 1) {
        pageSwipeStart = null;
        return;
      }
      const dx = event.changedTouches[0].clientX - pageSwipeStart.x;
      const dy = event.changedTouches[0].clientY - pageSwipeStart.y;
      pageSwipeStart = null;
      if (Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
      const current = PAGE_TABS.indexOf(main.dataset.view);
      const next = current + (dx < 0 ? 1 : -1);
      if (next < 0 || next >= PAGE_TABS.length) return;
      event.preventDefault();
      if (typeof window.go === 'function') window.go(PAGE_TABS[next]);
    }, { passive: false });
    main.addEventListener('touchcancel', () => { pageSwipeStart = null; }, { passive: true });
  };

  const removeLegacyDashboardControls = () => {
    main.querySelectorAll('.pocket-carousel-controls,.pocket-title-edit').forEach(element => element.remove());
    [...main.querySelectorAll('.row')].forEach(row => {
      const labels = [...row.querySelectorAll('button')].map(button => button.textContent.trim().toLowerCase());
      if (labels.some(s => s.includes('expense')) && labels.some(s => s.includes('income')) && labels.some(s => s.includes('transfer'))) row.remove();
    });
  };

  const closeMenu = (menu, fab) => {
    menu.setAttribute('aria-hidden', 'true');
    fab.setAttribute('aria-expanded', 'false');
    fab.classList.remove('pocket-fab-open');
    if (menu.classList.contains('pocket-hidden') || menu.classList.contains('pocket-fab-closing')) return;
    window.clearTimeout(menu._pocketOpenTimer);
    menu.classList.remove('pocket-fab-opening');
    menu.classList.add('pocket-fab-closing');
    menu._pocketCloseTimer = window.setTimeout(() => {
      menu.classList.remove('pocket-fab-closing');
      menu.classList.add('pocket-hidden');
      menu._pocketCloseTimer = 0;
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180);
  };
  const openMenu = (menu, fab) => {
    window.clearTimeout(menu._pocketCloseTimer);
    window.clearTimeout(menu._pocketOpenTimer);
    menu.classList.remove('pocket-hidden', 'pocket-fab-closing', 'pocket-fab-opening');
    void menu.offsetWidth;
    menu.classList.add('pocket-fab-opening');
    menu.setAttribute('aria-hidden', 'false');
    fab.setAttribute('aria-expanded', 'true');
    fab.classList.add('pocket-fab-open');
    menu._pocketOpenTimer = window.setTimeout(() => {
      menu.classList.remove('pocket-fab-opening');
      menu._pocketOpenTimer = 0;
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300);
  };
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;
    if (scrollDelta) {
      const fab = document.querySelector('.fab');
      const menu = document.querySelector('.pocket-fab-menu');
      if (fab && menu && !menu.classList.contains('pocket-hidden')) closeMenu(menu, fab);
    }
    if (currentScrollY <= 0) {
      document.body.classList.remove('pocket-actions-scroll-hidden');
    } else if (Math.abs(scrollDelta) >= 4) {
      const scrollingDown = scrollDelta > 0;
      document.body.classList.toggle('pocket-actions-scroll-hidden', scrollingDown);
      if (scrollingDown) {
        const fab = document.querySelector('.fab');
        const menu = document.querySelector('.pocket-fab-menu');
        if (fab && menu) closeMenu(menu, fab);
      }
    }
  }, { passive: true });
  const wireQuickAdd = () => {
    const fab = document.querySelector('.fab');
    if (!fab) return;
    let menu = document.querySelector('.pocket-fab-menu');
    if (!menu) {
      menu = document.createElement('div');
      menu.className = 'pocket-fab-menu pocket-hidden'; menu.setAttribute('aria-hidden', 'true');
      menu.innerHTML = [
        { kind: 'expense', label: 'Expense', icon: 'bolt' },
        { kind: 'income', label: 'Income', icon: 'wallet' },
        { kind: 'transfer', label: 'Transfer', icon: 'arrow' }
      ].map(item => `<button type="button" data-kind="${item.kind}"><span class="mini">${icon(item.icon)}</span><span>${item.label}</span></button>`).join('');
      document.body.append(menu);
    }
    if (!fab.dataset.pocketQuickMenuReady) {
      fab.dataset.pocketQuickMenuReady = '1';
      fab.onclick = event => {
        event.preventDefault(); event.stopPropagation();
        if (main.dataset.view === 'acc') {
          closeMenu(menu, fab);
          if (typeof window.accForm === 'function') window.accForm();
          return;
        }
        if (main.dataset.view === 'rec') {
          closeMenu(menu, fab);
          if (typeof window.recurringForm === 'function') window.recurringForm();
          return;
        }
        if (main.dataset.view === 'cat') {
          closeMenu(menu, fab);
          if (typeof window.catForm === 'function') window.catForm();
          return;
        }
        if (main.dataset.view === 'goal') {
          closeMenu(menu, fab);
          if (typeof window.goalForm === 'function') window.goalForm();
          return;
        }
        if (main.dataset.view === 'bud') {
          closeMenu(menu, fab);
          if (typeof window.budForm === 'function') window.budForm();
          return;
        }
        if (main.dataset.view === 'shop') {
          closeMenu(menu, fab);
          if (typeof window.shoppingListFabAction === 'function') window.shoppingListFabAction();
          return;
        }
        const opening = menu.classList.contains('pocket-hidden');
        if (opening || menu.classList.contains('pocket-fab-closing')) openMenu(menu, fab);
        else closeMenu(menu, fab);
      };
      menu.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
        if (typeof window.quickAdd === 'function') window.quickAdd(button.dataset.kind);
        closeMenu(menu, fab);
      }));
      document.addEventListener('click', event => { if (!menu.contains(event.target) && !fab.contains(event.target)) closeMenu(menu, fab); });
      document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(menu, fab); });
    }
    const accountPage = main.dataset.view === 'acc';
    const recurringPage = main.dataset.view === 'rec';
    const categoryPage = main.dataset.view === 'cat';
    const goalPage = main.dataset.view === 'goal';
    const budgetPage = main.dataset.view === 'bud';
    const shoppingPage = main.dataset.view === 'shop';
    const hideFab = main.dataset.view === 'set' || main.dataset.view === 'rep' || main.dataset.view === 'prof';
    const shoppingFabLabel = shoppingPage && typeof window.shoppingListFabLabel === 'function' ? window.shoppingListFabLabel() : 'Add list';
    const fabLabel = accountPage ? 'Add account' : recurringPage ? 'Add schedule' : categoryPage ? 'New category' : goalPage ? 'New goal' : budgetPage ? 'Add budget' : shoppingPage ? shoppingFabLabel : 'Add transaction';
    fab.classList.toggle('pocket-fab-labeled', accountPage || recurringPage || categoryPage || goalPage || budgetPage || shoppingPage);
    fab.classList.toggle('pocket-hidden', hideFab);
    fab.setAttribute('aria-label', fabLabel);
    fab.title = fabLabel;
    const label = fab.querySelector('.fab-label');
    if (label) label.textContent = fabLabel;
    if (accountPage || recurringPage || categoryPage || goalPage || budgetPage || shoppingPage || hideFab) closeMenu(menu, fab);
    let transferButton = document.querySelector('.pocket-account-transfer');
    if (!transferButton) {
      transferButton = document.createElement('button');
      transferButton.type = 'button';
      transferButton.className = 'pocket-account-transfer pocket-hidden';
      transferButton.setAttribute('aria-label', 'Transfer');
      transferButton.innerHTML = `${icon('arrow')}<span>Transfer</span>`;
      transferButton.addEventListener('click', () => {
        if (typeof window.quickAdd === 'function') window.quickAdd('transfer');
      });
      document.body.append(transferButton);
    }
    transferButton.classList.toggle('pocket-hidden', !accountPage);
  };

  let queued = false;
  const enhance = () => {
    queued = false;
    installStyles();
    if (main.dataset.view !== 'set') {
      if (main.dataset.view === 'dash') setTitle();
      addCarousel();
      addPagePrivacyButton();
      removeLegacyDashboardControls();
    }
    addProfileButton();
    wireQuickAdd();
    wirePageSwipe();
    updatePrivacy();
    watchTransactionForm();
  };
  const observer = new MutationObserver(() => {
    if (!queued) { queued = true; requestAnimationFrame(enhance); }
  });
  observer.observe(main, { childList: true, subtree: true });
  const formRoot = document.querySelector('#ovc');
  if (formRoot) new MutationObserver(watchTransactionForm).observe(formRoot, { childList: true, subtree: true });
  enhance();
})();
