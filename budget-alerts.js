(() => {
  'use strict';

  const DATA_KEY = 'pera.v1';
  const STYLE_ID = 'pocket-monthly-budget-alerts-style';
  const PANEL_ID = 'pocket-monthly-budget-alerts';
  const main = document.querySelector('#m');
  if (!main) return;

  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  const loadData = () => {
    try {
      const data = JSON.parse(localStorage.getItem(DATA_KEY) || 'null');
      return data && Array.isArray(data.tx) && Array.isArray(data.cats) && data.budgets ? data : null;
    } catch {
      return null;
    }
  };

  const installStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${PANEL_ID}{display:grid;gap:8px;margin:14px 0}
      #${PANEL_ID}[hidden]{display:none}
      #${PANEL_ID} .pocket-budget-alert{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border:1px solid var(--bd);border-radius:12px;background:var(--cd);color:var(--tx)}
      #${PANEL_ID} .pocket-budget-alert[data-level="near"]{border-color:#d97706;background:color-mix(in srgb,#d97706 10%,var(--cd))}
      #${PANEL_ID} .pocket-budget-alert[data-level="reached"]{border-color:#ea580c;background:color-mix(in srgb,#ea580c 10%,var(--cd))}
      #${PANEL_ID} .pocket-budget-alert[data-level="over"]{border-color:#dc2626;background:color-mix(in srgb,#dc2626 12%,var(--cd))}
      #${PANEL_ID} .pocket-budget-alert-icon{font-size:18px;line-height:1.2;flex:none}
      #${PANEL_ID} .pocket-budget-alert small{display:block;color:var(--mu);margin-top:2px}
      @media(prefers-reduced-motion:reduce){#${PANEL_ID} *{scroll-behavior:auto!important}}
    `;
    document.head.append(style);
  };

  const getAlerts = data => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const categories = new Map(data.cats.map(category => [category.id, category]));
    return Object.entries(data.budgets)
      .map(([categoryId, budget]) => {
        const limit = Number(budget);
        if (!Number.isFinite(limit) || limit <= 0) return null;
        const spent = data.tx.reduce((total, transaction) => {
          if (transaction.type !== 'expense' || transaction.cat !== categoryId || !String(transaction.date || '').startsWith(monthKey)) return total;
          const amount = Number(transaction.amount);
          return total + (Number.isFinite(amount) ? amount : 0);
        }, 0);
        const percent = spent / limit * 100;
        if (percent < 75) return null;
        const category = categories.get(categoryId);
        const name = category?.name || 'Uncategorized';
        const level = percent > 100 ? 'over' : percent >= 100 ? 'reached' : 'near';
        const title = level === 'over' ? 'Budget exceeded' : level === 'reached' ? 'Budget reached' : 'Nearing monthly budget';
        const detail = level === 'over'
          ? `${Math.round(percent)}% used · ${window.pocketPeso ? window.pocketPeso(spent - limit) : '₱' + (spent - limit).toLocaleString()} over budget`
          : `${Math.round(percent)}% of ${window.pocketPeso ? window.pocketPeso(limit) : '₱' + limit.toLocaleString()} used this month`;
        return { categoryId, name, level, title, detail, spent, percent };
      })
      .filter(Boolean)
      .sort((a, b) => b.percent - a.percent);
  };

  const render = () => {
    installStyles();
    const data = loadData();
    if (!data) return;
    let panel = document.getElementById(PANEL_ID);
    if (!panel) {
      panel = document.createElement('section');
      panel.id = PANEL_ID;
      panel.setAttribute('aria-label', 'Monthly budget alerts');
      panel.setAttribute('aria-live', 'polite');
    }
    const alerts = getAlerts(data);
    panel.innerHTML = alerts.map(alert => `
      <div class="pocket-budget-alert" data-level="${alert.level}">
        <span class="pocket-budget-alert-icon" aria-hidden="true">${alert.level === 'near' ? '⚠' : '!'}</span>
        <span><strong>${escapeHTML(alert.title)}: ${escapeHTML(alert.name)}</strong><small>${escapeHTML(alert.detail)}</small></span>
      </div>
    `).join('');
    panel.hidden = alerts.length === 0;

    const budgetHeading = [...main.querySelectorAll('h2')].find(heading => heading.textContent.trim().toLowerCase() === 'budgets');
    const dashboardHero = main.querySelector(':scope > .hero, :scope > .pocket-carousel');
    const anchor = budgetHeading || dashboardHero;
    if (anchor) {
      const container = budgetHeading ? budgetHeading.parentElement : anchor;
      if (panel.parentElement !== container) {
        if (budgetHeading) container.insertAdjacentElement('afterend', panel);
        else anchor.insertAdjacentElement('beforebegin', panel);
      }
    } else if (panel.parentElement) {
      panel.remove();
    }
  };

  let queued = false;
  const scheduleRender = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; render(); });
  };

  new MutationObserver(scheduleRender).observe(main, { childList: true, subtree: true });
  window.addEventListener('storage', event => { if (!event.key || event.key === DATA_KEY) scheduleRender(); });
  render();
})();
