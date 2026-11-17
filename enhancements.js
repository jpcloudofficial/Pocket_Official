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

  const storedTitle = () => {
    try { return localStorage.getItem(TITLE_KEY) || 'My Finance'; }
    catch { return 'My Finance'; }
  };
  const isHidden = () => {
    try { return localStorage.getItem(PRIVACY_KEY) === '1'; }
    catch { return false; }
  };

  const installStyles = () => {
    if (document.querySelector('#pocket-enhancements-style')) return;
    const style = document.createElement('style');
    style.id = 'pocket-enhancements-style';
    style.textContent = `
      .pocket-carousel{overflow:hidden;margin-top:16px;touch-action:pan-y}
      .pocket-carousel-track{display:flex;transition:transform .28s ease;will-change:transform}
      .pocket-carousel-track>.hero{flex:0 0 100%;width:100%;min-width:100%;margin:0;position:relative;padding-right:66px}
      .pocket-carousel-controls{display:flex;align-items:center;justify-content:center;gap:8px;margin:9px 0 0}
      .pocket-carousel-controls button{border:1px solid var(--bd);background:var(--cd);color:var(--mu);border-radius:99px;padding:5px 11px;font-size:12px;cursor:pointer}
      .pocket-carousel-controls button[aria-current="true"]{background:var(--tx);border-color:var(--tx);color:var(--bg)}
      .pocket-privacy-button{position:absolute;right:14px;top:14px;width:38px;height:38px;display:inline-grid;place-items:center;border:1px solid var(--bd);border-radius:11px;background:var(--cd);color:var(--mu);cursor:pointer;z-index:1}
      .pocket-privacy-button svg{display:block}
      #m.pocket-private .hb,#m.pocket-private .hn,#m.pocket-private .av,#m.pocket-private .tx> b{filter:blur(8px);user-select:none}
      @media(prefers-reduced-motion:reduce){.pocket-carousel-track{transition:none}}
    `;
    document.head.append(style);
  };

  const titleHeading = () => main.querySelector('.row.sp h2');
  const customizeTitle = () => {
    const answer = window.prompt('Choose a dashboard title (up to 32 characters):', storedTitle());
    if (answer === null) return;
    const title = answer.trim().slice(0, 32) || 'My Finance';
    try { localStorage.setItem(TITLE_KEY, title); } catch {}
    const heading = titleHeading();
    if (heading) heading.textContent = title;
  };

  const personalizeHeading = () => {
    const heading = titleHeading();
    if (!heading) return;
    heading.textContent = storedTitle();
  };

  const addSettingsTitleEditor = () => {
    const settingsHeading = [...main.querySelectorAll('h2')].find(h => h.textContent.trim() === 'Settings');
    if (!settingsHeading || settingsHeading.parentElement.querySelector('.pocket-title-setting')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'b2 pocket-title-setting';
    button.style.marginTop = '12px';
    button.innerHTML = `${icon('edit')} Customize dashboard title`;
    button.addEventListener('click', customizeTitle);
    settingsHeading.after(button);
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

  const createPrivacyButton = () => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pocket-privacy-button';
    button.addEventListener('click', event => {
      event.stopPropagation();
      const next = !isHidden();
      try { localStorage.setItem(PRIVACY_KEY, next ? '1' : '0'); } catch {}
      updatePrivacy();
    });
    return button;
  };

  const placePrivacyButtons = () => {
    const slides = main.querySelectorAll('.pocket-carousel-track > .hero');
    if (!slides.length) return;
    slides.forEach(slide => {
      let button = slide.querySelector('.pocket-privacy-button');
      if (!button) {
        button = createPrivacyButton();
        slide.append(button);
      }
    });
    updatePrivacy();
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
      const controls = document.createElement('div');
      controls.className = 'pocket-carousel-controls';
      controls.innerHTML = '<button type="button" data-slide="0">Balance</button><button type="button" data-slide="1">Savings</button>';
      carousel.after(controls);
      controls.addEventListener('click', event => {
        const button = event.target.closest('[data-slide]');
        if (button) showSlide(Number(button.dataset.slide));
      });

      let startX = null;
      track.addEventListener('touchstart', event => { startX = event.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend', event => {
        if (startX === null) return;
        const delta = event.changedTouches[0].clientX - startX;
        startX = null;
        if (Math.abs(delta) > 45) {
          showSlide((carousel.dataset.slide === '1' ? 1 : 0) + (delta < 0 ? 1 : -1));
          carousel.dataset.swiped = '1';
          setTimeout(() => { delete carousel.dataset.swiped; }, 350);
        }
      }, { passive: true });
      track.addEventListener('click', event => {
        if (carousel.dataset.swiped === '1') {
          event.preventDefault();
          event.stopPropagation();
          delete carousel.dataset.swiped;
        }
      }, true);
    }
    placePrivacyButtons();
    showSlide(Number(carousel.dataset.slide || 0));
  };

  const showSlide = index => {
    const carousel = main.querySelector('.pocket-carousel');
    if (!carousel) return;
    const slide = Math.max(0, Math.min(1, index));
    carousel.dataset.slide = String(slide);
    const track = carousel.querySelector('.pocket-carousel-track');
    if (track) track.style.transform = `translateX(-${slide * 100}%)`;
    const controls = carousel.nextElementSibling;
    if (controls?.classList.contains('pocket-carousel-controls')) {
      controls.querySelectorAll('[data-slide]').forEach(button => {
        button.setAttribute('aria-current', String(Number(button.dataset.slide) === slide));
      });
    }
  };

  let queued = false;
  const enhance = () => {
    queued = false;
    installStyles();
    if (main.querySelector('.row.sp h2')?.textContent.trim() === 'Settings') {
      addSettingsTitleEditor();
    } else {
      personalizeHeading();
      addCarousel();
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
