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
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
  };
  const storedTitle = () => { try { return localStorage.getItem(TITLE_KEY) || 'My Finance'; } catch { return 'My Finance'; } };
  const isHidden = () => { try { return localStorage.getItem(PRIVACY_KEY) === '1'; } catch { return false; } };

  const styles = () => {
    if (document.querySelector('#pocket-enhancements-style-v3')) return;
    const style = document.createElement('style');
    style.id = 'pocket-enhancements-style-v3';
    style.textContent = `
      .pocket-carousel{overflow:hidden;margin-top:16px;touch-action:pan-y}
      .pocket-carousel-track{display:flex;transition:transform .28s ease;will-change:transform}
      .pocket-carousel-track>.hero{position:relative;flex:0 0 100%;width:100%;min-width:100%;margin:0;padding-right:66px}
      .pocket-privacy-button{position:absolute;right:14px;top:14px;width:40px;height:40px;display:grid;place-items:center;border:1px solid var(--bd);border-radius:11px;background:var(--cd);color:var(--mu);cursor:pointer;z-index:2}
      .pocket-privacy-button svg{display:block}
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
  const editTitle = () => {
    const answer = window.prompt('Choose a dashboard title (up to 32 characters):', storedTitle());
    if (answer === null) return;
    const title = answer.trim().slice(0, 32) || 'My Finance';
    try { localStorage.setItem(TITLE_KEY, title); } catch {}
    setTitle();
  };
  const addSettingsEditor = () => {
    const heading = [...main.querySelectorAll('h2')].find(item => item.textContent.trim() === 'Settings');
    if (!heading || main.querySelector('.pocket-title-setting')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'b2 pocket-title-setting';
    button.style.marginTop = '12px';
    button.innerHTML = `${icon('edit')} Customize dashboard title`;
    button.addEventListener('click', editTitle);
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
  const showSlide = index => {
    slide = Math.max(0, Math.min(1, index));
    const track = main.querySelector('.pocket-carousel-track');
    if (track) track.style.transform = `translateX(-${slide * 100}%)`;
  };
  const cleanExtraDashboardControls = () => {
    // Remove the separate Balance/Savings pills; swiping the cards remains available.
    main.querySelectorAll('.pocket-carousel-controls').forEach(element => element.remove());
    // Remove the extra Expense/Income/Transfer row previously added below the cards.
    [...main.querySelectorAll('.row')].forEach(row => {
      const labels = [...row.querySelectorAll('button')].map(button => button.textContent.trim());
      if (labels.includes('Expense') && labels.includes('Income') && labels.includes('Transfer')) row.remove();
    });
    // Remove old title/eye controls from the dashboard header.
    main.querySelectorAll('.pocket-title-edit').forEach(element => element.remove());
    main.querySelectorAll('.pocket-privacy-button').forEach(button => {
      if (!button.closest('.pocket-carousel-track > .hero')) button.remove();
    });
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
      track.addEventListener('click', event => {
        if (Math.abs(slide) >= 0 && track.dataset.swiping === '1') {
          event.preventDefault();
          event.stopPropagation();
          delete track.dataset.swiping;
        }
      }, true);
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
    const settingsPage = [...main.querySelectorAll('h2')].some(item => item.textContent.trim() === 'Settings');
    if (settingsPage) addSettingsEditor();
    else {
      setTitle();
      addCarousel();
      cleanExtraDashboardControls();
    }
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
