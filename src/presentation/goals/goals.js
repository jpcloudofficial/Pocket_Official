(() => {
    window.PocketFeatures = window.PocketFeatures || {};
        V.goal = () =>
            `<div class="row sp savings-goals-heading"><div class="savings-heading-copy"><small>MAKE ROOM FOR WHAT MATTERS</small><h2>Savings goals</h2></div></div><p class="savings-goals-description">Track goals separately from your account balances.</p><div class="g g2 savings-goal-list">${D.goals.length ? D.goals.map(g => {
                const p = Math.min(100, g.current / g.target * 100),
                    percentage = Math.round(p),
                    mo = Math.max(1, Math.ceil((new Date(g.date) - new Date()) / 2629e6)),
                    account = A(g.acc);
                return `<article class="card goal-card"><div class="goal-card-heading"><span class="goal-card-icon">${ic('target')}</span><b>${esc(g.name)}</b><details class="budget-card-menu"><summary aria-label="Goal options for ${esc(g.name)}">${ic('more-horizontal')}</summary><div class="budget-card-menu-options"><button type="button" onclick="goalForm('${g.id}')">${ic('pencil')}Edit</button><button type="button" onclick="ask('Delete this goal?',()=>D.goals=D.goals.filter(x=>x.id!=='${g.id}'))">${ic('trash-2')}Delete</button></div></details></div><div class="goal-balance-row"><strong class="goal-amount">${peso(g.current)}</strong><b class="goal-percentage">${percentage}%</b></div><small class="goal-target-label">of ${peso(g.target)} target</small><div class="bar"><i style="width:${p}%;background:var(--in)"></i></div><small class="goal-meta">By ${fd(g.date)}${account ? ` · ${esc(account.name)}` : ''}</small><small class="goal-estimate">${p < 100 ? `${peso((g.target - g.current) / mo)} per month to stay on track` : 'Goal reached'}</small><button type="button" class="goal-fund-button" onclick="fund('${g.id}')">${ic('plus')}<span>Add money</span></button></article>`;
            }).join('') : '<div class="empty card">No goals yet. Create one to start saving toward it.</div>'}</div>`;

    window.PocketFeatures['goal'] = V.goal;
})();
