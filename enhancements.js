(() => {
  const TITLE_KEY = 'pocket.dashboardTitle';
  const PRIVACY_KEY = 'pocket.hideAmounts';
  const main = document.querySelector('#m');
  if (!main) return;

  const icon = name => {
    const paths = {
      edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
      eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
      off: '<path d="m3 3 18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.1 3.8M6.2 6.2C3.6 8 2 12 2 12s3.6 7 10 7a10 10 0 0 0 3-.5"/>'
    };
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ''}</svg>`;
  };
  const storedTitle = () => { try { return localStorage.getItem(TITLE_KEY) || 'My Finance'; } catch { return 'My Finance'; } };
  const isHidden = () => { try { return localStorage.getItem(PRIVACY_KEY) === '1'; } catch { return false; } };

  const addStyles = () => {
    if (document.querySelector('#pocket-autocategory-style')) return;
    const style = document.createElement('style');
    style.id = 'pocket-autocategory-style';
    style.textContent = `
      .pocket-category-hint{display:block;color:var(--mu);font-size:12px;margin:6px 2px 0;min-height:17px}
      .pocket-category-hint[data-active="true"]{color:var(--in)}
      .pocket-category-hint[data-manual="true"]{color:var(--mu)}
    `;
    document.head.append(style);
  };

  const dashboardTitle = () => main.querySelector(':scope > .row.sp h2');
  const setTitle = () => {
    const heading = dashboardTitle();
    if (!heading || heading.textContent.trim() === 'Settings') return;
    if (heading.textContent !== storedTitle()) heading.textContent = storedTitle();
  };

  // Local keyword rules for automatic categorization.
  const CATEGORY_RULES = [
    { category: 'Transportation', words: ['jeepney','jeep','bus','taxi','grab','uber','train','mrt','lrt','commute','fare','parking','toll','gasoline','fuel'] },
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
    { category: 'Refund', words: ['refund','reimbursement','cashback'] }
  ];
  const normalize = value => String(value || '').toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const keywordMatch = (title, word) => {
    const full = ` ${normalize(title)} `;
    const target = ` ${normalize(word)} `;
    return full.includes(target);
  };

  const attachAutoCategory = form => {
    if (!form || form.dataset.pocketAutoCategoryReady) return;
    const titleEl = form.querySelector('[name="title"]');
    const typeEl = form.querySelector('[name="type"]');
    const catEl = form.querySelector('[name="cat"]');
    if (!titleEl || !typeEl || !catEl) return;
    form.dataset.pocketAutoCategoryReady = '1';

    const hint = document.createElement('small');
    hint.className = 'pocket-category-hint';
    hint.setAttribute('aria-live', 'polite');
    catEl.insertAdjacentElement('afterend', hint);

    let manuallyChanged = false;
    let applying = false;

    const updateHint = message => {
      hint.textContent = message || '';
      hint.dataset.active = message ? 'true' : 'false';
      if (message) hint.dataset.manual = 'true';
      else delete hint.dataset.manual;
    };

    catEl.addEventListener('change', () => {
      if (!applying) {
        manuallyChanged = true;
        updateHint('Category selected manually.');
      }
    });

    const infer = () => {
      const type = typeEl.value;
      const title = titleEl.value.trim();
      if (type === 'transfer' || !title) {
        hint.textContent = '';
        delete hint.dataset.active;
        delete hint.dataset.manual;
        return;
      }
      if (manuallyChanged) return;
      const rule = CATEGORY_RULES.find(item => item.words.some(word => keywordMatch(title, word)));
      if (!rule) {
        hint.textContent = '';
        delete hint.dataset.active;
        return;
      }
      const option = [...catEl.options].find(item => normalize(item.textContent) === normalize(rule.category));
      if (!option) {
        hint.textContent = '';
        delete hint.dataset.active;
        return;
      }
      applying = true;
      catEl.value = option.value;
      applying = false;
      hint.textContent = `Suggested: ${option.textContent} · change if needed`;
      hint.dataset.active = 'true';
      delete hint.dataset.manual;
    };

    titleEl.addEventListener('input', infer);
    titleEl.addEventListener('change', infer);
    typeEl.addEventListener('change', () => {
      manuallyChanged = false;
      infer();
    });
  };

  const watchTransactionForm = () => {
    addStyles();
    const form = document.querySelector('#f');
    if (form) attachAutoCategory(form);
  };

  const addTitleSetting = () => {
    const heading = [...main.querySelectorAll('h2')].find(item => item.textContent.trim() === 'Settings');
    if (!heading || main.querySelector('.pocket-title-setting')) return;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'b2 pocket-title-setting'; button.style.marginTop = '12px';
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
      const track = document.createElement('div');
      track.className = 'pocket-carousel-track';
      carousel.append(track);
      if (balance.parentElement === main) balance.before(carousel);
    }
    let track = carousel.querySelector('.pocket-carousel-track');
    if (!track) { track = document.createElement('div'); track.className = 'pocket-carousel-track'; carousel.append(track); }
    if (balance.parentElement !== track) track.append(balance);
    if (savings.parentElement !== track) track.append(savings);
    track.style.width = '100%';
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
    [balance, savings].forEach(card => { if (!card.querySelector('.pocket-privacy-button')) card.append(makePrivacyButton()); });
    showSlide(slide);
  };

  const removeLegacyDashboardControls = () => {
    main.querySelectorAll('.pocket-carousel-controls,.pocket-title-edit').forEach(element => element.remove());
    [...main.querySelectorAll('.row')].forEach(row => {
      const labels = [...row.querySelectorAll('button')].map(button => button.textContent.trim().toLowerCase());
      if (labels.some(s => s.includes('expense')) && labels.some(s => s.includes('income')) && labels.some(s => s.includes('transfer'))) row.remove();
    });
  };

  const closeMenu = (menu, fab) => {
    menu.classList.add('pocket-hidden'); menu.setAttribute('aria-hidden', 'true');
    fab.setAttribute('aria-expanded', 'false'); fab.classList.remove('pocket-fab-open');
  };

  const wireQuickAdd = () => {
    const fab = document.querySelector('.fab');
    if (!fab || fab.dataset.pocketQuickMenuReady) return;
    fab.dataset.pocketQuickMenuReady = '1';
    const menu = document.createElement('div');
    menu.className = 'pocket-fab-menu pocket-hidden'; menu.setAttribute('aria-hidden', 'true');
    menu.innerHTML = [
      { kind: 'expense', label: 'Expense', icon: 'bolt' },
      { kind: 'income', label: 'Income', icon: 'wallet' },
      { kind: 'transfer', label: 'Transfer', icon: 'arrow' }
    ].map(item => `<button type="button" data-kind="${item.kind}"><span class="mini">${icon(item.icon)}</span><span>${item.label}</span></button>`).join('');
    document.body.append(menu);
    fab.onclick = event => {
      event.preventDefault(); event.stopPropagation();
      const opening = menu.classList.contains('pocket-hidden');
      menu.classList.toggle('pocket-hidden', !opening); menu.setAttribute('aria-hidden', String(!opening));
      fab.setAttribute('aria-expanded', String(opening)); fab.classList.toggle('pocket-fab-open', opening);
    };
    menu.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      if (typeof window.quickAdd === 'function') window.quickAdd(button.dataset.kind);
      closeMenu(menu, fab);
    }));
    document.addEventListener('click', event => { if (!menu.contains(event.target) && !fab.contains(event.target)) closeMenu(menu, fab); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(menu, fab); });
  };

  let queued = false;
  const enhance = () => {
    queued = false;
    const settingsPage = [...main.querySelectorAll('h2')].some(item => item.textContent.trim() === 'Settings');
    if (settingsPage) addTitleSetting();
    else {
      setTitle();
      addCarousel();
      removeLegacyDashboardControls();
    }
    wireQuickAdd();
    updatePrivacy();
    watchTransactionForm();
  };

  const observer = new MutationObserver(() => {
    if (!queued) { queued = true; requestAnimationFrame(enhance); }
  });

  observer.observe(main, { childList: true, subtree: true });
  const formObserver = new MutationObserver(watchTransactionForm);
  const formRoot = document.querySelector('#ovc');
  if (formRoot) formObserver.observe(formRoot, { childList: true, subtree: true });
  enhance();
})();
