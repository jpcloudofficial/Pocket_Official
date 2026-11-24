(() => {
    window.PocketFeatures = window.PocketFeatures || {};
        V.bud = () => {
            const categoryName = id => C(id)?.name || 'Unknown category',
                month = new Date(new Date().getFullYear(), new Date().getMonth() + budgetMonthOffset, 1),
                monthKey = budgetMonthKey(budgetMonthOffset),
                monthLabel = new Intl.DateTimeFormat('en-PH', { month: 'long', year: 'numeric' }).format(month),
                L = bstat(monthKey).sort((first, second) =>
                    categoryName(first.id).localeCompare(categoryName(second.id), undefined, { sensitivity: 'base' }) ||
                    first.id.localeCompare(second.id)
                ),
                overBudgetNames = overBudgetCategoryNames(monthKey),
                overBudgetList = overBudgetNames.length < 2 ? overBudgetNames[0] :
                    `${overBudgetNames.slice(0, -1).join(', ')} and ${overBudgetNames[overBudgetNames.length - 1]}`,
                budgetAlert = overBudgetNames.length ? `<section class="budgets-overview-alert" role="status"><span class="budgets-overview-alert-icon" aria-hidden="true">${ic('alert-triangle')}</span><div><b>${overBudgetNames.length} budget${overBudgetNames.length === 1 ? '' : 's'} over their limit</b><small>Keep an eye on ${esc(overBudgetList)}.</small></div></section>` : '';
            return `${window.PocketPageHeader({ eyebrow: 'A LITTLE PLAN, MORE CONTROL.', title: 'Budgets' })}<div class="budgets-page"><div class="budgets-month"><button type="button" class="budgets-month-button" onclick="shiftBudgetMonth(-1)" aria-label="Previous month">${ic('chevron-left')}</button><strong aria-live="polite">${esc(monthLabel)}</strong><button type="button" class="budgets-month-button" onclick="shiftBudgetMonth(1)" aria-label="Next month">${ic('chevron-right')}</button></div>${budgetAlert}<div class="budgets-list">${L.length ? L.map(x => {
                const c = C(x.id) || { name: 'Unknown category', color: '#999', icon: 'tag' },
                    col = x.p >= 100 ? 'var(--ex)' : 'var(--in)',
                    percent = Number.isFinite(x.p) ? Math.round(x.p) : '∞',
                    progress = Number.isFinite(x.p) ? Math.min(100, Math.max(0, x.p)) : 100;
                const menu = window.PocketActionMenu.render({
                    owner: 'budget',
                    entityId: x.id,
                    label: `Budget options for ${c.name}`,
                    className: 'budget-card-menu',
                    triggerIcon: ic('more-horizontal'),
                    actions: [
                        { action: 'edit', label: 'Edit budget', icon: ic('pencil') },
                        { action: 'delete', label: 'Remove budget', icon: ic('trash-2'), destructive: true }
                    ]
                });
                return `<article class="card budget-card"><div class="budget-card-heading"><span class="budget-card-icon" style="--budget-icon-color:${esc(c.color)}">${ic(c.icon || 'tag')}</span><b>${esc(c.name)}</b>${menu}</div><div class="budget-card-amounts"><div><small>Spent</small><strong>${peso(x.s)}</strong></div><small>of <b>${peso(x.b)}</b> budget</small></div><div class="bar"><i style="width:${progress}%;background:${col}"></i></div><div class="budget-card-footer"><small>${x.b >= x.s ? `${peso(x.b - x.s)} remaining` : `${peso(x.s - x.b)} over budget`}</small><b style="color:${col}">${percent}%</b></div></article>`
            }).join('') : '<div class="empty card budgets-empty">No budgets yet. Set one for a category to track your spending.</div>'}</div></div>`
        };

    document.addEventListener('pocket:action-menu', event => {
        const { owner, action, entityId } = event.detail || {};
        if (owner !== 'budget') return;
        if (action === 'edit') budForm(entityId);
        else if (action === 'delete') delBudget(entityId);
    });

    window.PocketFeatures['bud'] = V.bud;
})();
