(() => {
    window.PocketFeatures = window.PocketFeatures || {};
        V.goal = () =>
            `${window.PocketPageHeader({ eyebrow: 'MAKE ROOM FOR WHAT MATTERS', title: 'Savings goals' })}<p class="savings-goals-description">Track goals separately from your account balances.</p><div class="g g2 savings-goal-list">${D.goals.length ? D.goals.map(g => {
                const p = Math.min(100, g.current / g.target * 100),
                    percentage = Math.round(p),
                    mo = Math.max(1, Math.ceil((new Date(g.date) - new Date()) / 2629e6)),
                    account = A(g.acc),
                    menu = window.PocketActionMenu.render({
                        owner: 'goal',
                        entityId: g.id,
                        label: `Goal options for ${g.name}`,
                        className: 'goal-card-menu',
                        triggerIcon: ic('more-horizontal'),
                        actions: [
                            { action: 'edit', label: 'Edit', icon: ic('pencil') },
                            { action: 'delete', label: 'Delete', icon: ic('trash-2'), destructive: true }
                        ]
                    });
                return `<article class="card goal-card"><div class="goal-card-heading"><span class="goal-card-icon">${ic('target')}</span><b>${esc(g.name)}</b>${menu}</div><div class="goal-balance-row"><strong class="goal-amount">${peso(g.current)}</strong><b class="goal-percentage">${percentage}%</b></div><small class="goal-target-label">of ${peso(g.target)} target</small><div class="bar"><i style="width:${p}%;background:var(--in)"></i></div><small class="goal-meta">By ${fd(g.date)}${account ? ` · ${esc(account.name)}` : ''}</small><small class="goal-estimate">${p < 100 ? `${peso((g.target - g.current) / mo)} per month to stay on track` : 'Goal reached'}</small><button type="button" class="goal-fund-button" onclick="fundGoal('${g.id}')">${ic('plus')}<span>Add money</span></button></article>`;
            }).join('') : '<div class="empty card">No goals yet. Create one to start saving toward it.</div>'}</div>`;

    document.addEventListener('pocket:action-menu', event => {
        const { owner, action, entityId } = event.detail || {};
        if (owner !== 'goal') return;
        if (action === 'edit') goalForm(entityId);
        else if (action === 'delete') {
            ask('Delete this goal?', () => {
                D.goals = D.goals.filter(goal => goal.id !== entityId);
            });
        }
    });

        window.fundGoal = id => openForm('Add money to goal', () => [{
            k: 'amt',
            l: 'Amount',
            t: 'number',
            placeholder: '0.00',
            req: 1,
            pos: 1
        }], {}, value => {
            D.goals.find(goal => goal.id === id).current += +value.amt
        });

    window.PocketFeatures['goal'] = V.goal;
})();
