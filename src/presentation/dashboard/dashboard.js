(() => {
    window.PocketFeatures = window.PocketFeatures || {};
        V.dash = () => {
            const [a, b] = rng(), T = D.tx.filter(t => t.date >= a && t.date <= b), inc = sum(T, 'income'), exp =
                sum(T, 'expense'), tot = D.acc.filter(x => !isSav(x)).reduce((s, x) => s + bal(x), 0), cr = D.acc.filter(x => x.type === 'Credit Card')
                .reduce((s, x) => s + bal(x), 0), av = tot - cr;
            const reportYear = new Date().getFullYear(),
                reportTransactions = D.tx.filter(t => +t.date.slice(0, 4) === reportYear),
                reportMonthly = i => reportTransactions.filter(t => +t.date.slice(5, 7) === i + 1),
                reportIncome = MO.map((_, i) => sum(reportMonthly(i), 'income')),
                reportExpenses = MO.map((_, i) => sum(reportMonthly(i), 'expense')),
                reportBalanceHistory = MO.map((_, i) => D.acc.reduce((total, account) =>
                    total + bal(account, iso(new Date(reportYear, i + 1, 0))), 0));
            const card = (l, v, c, s = '') =>
                `<div class="card"><small>${l}</small><div class="big" style="color:${c||'inherit'}">${peso(v)}</div><small>${s}</small></div>`;
            const accountCard = x => {
                const balance = bal(x);
                const accountType = x.type === 'E-Wallet' ? 'E-wallet' :
                    ['Digital Bank', 'Traditional Bank'].includes(x.type) ? 'Digital bank' : x.type;
                const accountIcon = ['Digital Bank', 'Traditional Bank'].includes(x.type) ? 'bank' : 'wallet';
                return `<button type="button" class="dashboard-account-row" onclick="go('acc')" aria-label="Open ${esc(x.name)}, balance ${esc(pesoBalance(balance))}"><span class="dashboard-account-icon">${dashboardIcon(accountIcon)}</span><span class="dashboard-account-copy"><b>${esc(x.name)}</b><small>${esc(accountType)}</small></span><b class="dashboard-account-balance${balance<0?' is-negative':''}">${pesoBalance(balance)}</b></button>`
            };
            const widgets = D.dashboardWidgets;
            const overBudgetNames = overBudgetCategoryNames(),
                overBudgetList = overBudgetNames.length < 2 ? overBudgetNames[0] :
                    `${overBudgetNames.slice(0, -1).join(', ')} and ${overBudgetNames[overBudgetNames.length - 1]}`,
                budgetAlert = overBudgetNames.length ?
                    `<section class="budgets-overview-alert" role="status"><span class="budgets-overview-alert-icon" aria-hidden="true">${ic('alert-triangle')}</span><div><b>${overBudgetNames.length} budget${overBudgetNames.length === 1 ? '' : 's'} over their limit</b><small>Keep an eye on ${esc(overBudgetList)}.</small></div></section>` :
                    '';
            const summaryWidget = widgets.summary ?
                `<div class="hero dashboard-balance-card"><div class="dashboard-balance-label"><small>Total balance</small></div><div class="hb">${peso(tot,1)}</div><small class="pocket-summary-amounts">Available ${peso(av)}${cr<0?' · Card owed '+peso(-cr):''}</small><div class="two"><div><small>↙ Income</small><div class="hn" style="color:var(--in)">${peso(inc, inc === 0)}</div></div><div><small>↗ Expenses</small><div class="hn" style="color:var(--ex)">${peso(exp, exp === 0)}</div></div></div></div>` :
                '';
            const shortcutsWidget = widgets.shortcuts ?
                `<section class="dashboard-shortcuts dashboard-section" aria-labelledby="dashboard-shortcuts-title"><div class="dashboard-section-heading"><h3 class="sec" id="dashboard-shortcuts-title">Your shortcuts</h3></div><div class="quick-actions-grid"><button class="quick-action" onclick="go('bud')"><span class="quick-action-icon quick-action-budget" aria-hidden="true">${dashboardIcon('chart')}</span><span>Budgets</span></button><button class="quick-action" onclick="go('cash')"><span class="quick-action-icon quick-action-cashback" aria-hidden="true">${dashboardIcon('gift')}</span><span>Cashback</span></button><button class="quick-action" onclick="go('rec')"><span class="quick-action-icon quick-action-recurring" aria-hidden="true">${dashboardIcon('repeat')}</span><span>Recurring</span></button><button class="quick-action" onclick="go('goal')"><span class="quick-action-icon quick-action-savings" aria-hidden="true">${dashboardIcon('goal')}</span><span>Goals</span></button><button class="quick-action" onclick="go('shop')"><span class="quick-action-icon quick-action-shopping" aria-hidden="true">${dashboardIcon('cart')}</span><span>Lists</span></button></div></section>` :
                '';
            const actionsWidget = widgets.actions ?
                `<div class="row end" style="margin-top:18px"><button class="b2" onclick="quickAdd('expense')">${ic('plus')} Expense</button><button class="b2" onclick="quickAdd('income')">${ic('plus')} Income</button><button class="b2" onclick="quickAdd('transfer')">${ic('arrow-left-right')} Transfer</button></div>` :
                '';
            const accountsWidget = widgets.accounts ?
                `<section class="dashboard-section dashboard-accounts"><div class="dashboard-section-heading"><h3 class="sec">My accounts</h3><button type="button" class="dashboard-section-link" onclick="go('acc')">See all <span aria-hidden="true">→</span></button></div>${D.acc.length?`<div class="dashboard-account-card">${D.acc.slice(0,4).map(accountCard).join('')}</div>`:'<div class="empty dashboard-empty">No accounts yet.</div>'}</section>` :
                '';
            const transactionsWidget = widgets.transactions ?
                `<section class="dashboard-section dashboard-transactions"><div class="dashboard-section-heading"><h3 class="sec">Recent transactions</h3><button type="button" class="dashboard-section-link" onclick="go('tx')">See all <span aria-hidden="true">→</span></button></div>${D.tx.length?`<div class="dashboard-recent-card">${sorted().slice(0,3).map(t=>row(t,false,true)).join('')}</div>`:'<div class="empty dashboard-empty">No transactions yet.</div>'}</section>` :
                '';
            const reportCards = [];
            if (widgets.spendingTrend) reportCards.push(`<div class="card"><h3>Spending trend (${reportYear})</h3>${line(reportExpenses,MO,'#ea580c')}</div>`);
            if (widgets.accountBalanceHistory) reportCards.push(`<div class="card"><h3>Account balance history (${reportYear})</h3>${line(reportBalanceHistory,MO,'#2563eb')}</div>`);
            if (widgets.monthlySavings) reportCards.push(`<div class="card"><h3>Monthly savings (${reportYear})</h3>${bars([reportIncome.map((income,i)=>income-reportExpenses[i])],MO,['#16a34a'])}</div>`);
            const reportsWidget = reportCards.length ? D.tx.length ?
                `<div class="g g2">${reportCards.join('')}</div>` :
                `<div class="card dashboard-empty-reports"><span aria-hidden="true">${ic('bar-chart-3')}</span><div><b>Your reports will appear here</b><small>Add your first transaction to see income, expenses, and trends.</small></div></div>` :
                '';
            const emptyDashboard = DASHBOARD_WIDGETS.some(([id]) => widgets[id]) ? '' :
                '<div class="empty card">No dashboard sections are visible. Go to Settings and select Customize Dashboard to add sections.</div>';
            const now = new Date(),
                hour = now.getHours(),
                greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening',
                dashboardTitle = D.name ? `${greeting}, ${D.name}` : greeting,
                dashboardDate = `${new Intl.DateTimeFormat('en-PH', { weekday: 'long' }).format(now)}, ${now.getDate()} ${new Intl.DateTimeFormat('en-PH', { month: 'long' }).format(now)}`.toUpperCase();
            return `${window.PocketPageHeader({ eyebrow: dashboardDate, title: dashboardTitle })}${budgetAlert}${summaryWidget}<button type="button" class="dashboard-add-button" onclick="primaryAdd()">${ic('plus')}<span>Add transaction</span></button>${gettingStartedChecklist()}${shortcutsWidget}${actionsWidget}${accountsWidget}${transactionsWidget}${reportsWidget}${emptyDashboard}`
        };

    window.PocketFeatures['dash'] = V.dash;
})();
