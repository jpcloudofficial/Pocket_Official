(() => {
    window.PocketFeatures = window.PocketFeatures || {};
        V.acc = () => {
            const accounts = accountStackAccounts();
            const stackGap = 68,
                stackHeight = accounts.length ? 160 + (accounts.length - 1) * stackGap : 0,
                totalBalance = D.acc.filter(account => !isSav(account)).reduce((total, account) => total + bal(account), 0),
                savingsBalance = D.acc.filter(isSav).reduce((total, account) => total + bal(account), 0);
            const visibleAccounts = accounts;
            const accountRows = accounts.map(account => {
                const balance = bal(account);
                return `<button type="button" class="accounts-list-row" onclick="accForm('${account.id}')" aria-label="Edit ${esc(account.name)}"><span class="accounts-list-icon">${ic(account.icon || 'wallet')}</span><span class="accounts-list-copy"><b>${esc(account.name)}</b><small>${esc(account.type)}</small></span><b class="accounts-list-balance${balance < 0 ? ' is-negative' : ''}">${pesoBalance(balance)}</b></button>`
            }).join('');
            const cards = visibleAccounts.map((account, index) => {
                const balance = bal(account);
                const isFront = index === visibleAccounts.length - 1;
                const balanceNote = account.type === 'Credit Card' ? 'Liability · not counted in available balance' :
                    isSav(account) ? 'Savings · kept separate from total balance' : `Initial ${pesoBalance(account.initial)}`;
                const actions = isFront ?
                    `<div class="account-stack-actions"><button class="ib" onclick="accForm('${account.id}')" aria-label="Edit ${esc(account.name)}">${ic('pencil')}</button><button class="ib" onclick="delAcc('${account.id}')" aria-label="Delete ${esc(account.name)}">${ic('trash-2')}</button></div>` :
                    '';
                return `<article class="account-stack-card${isFront ? ' is-front' : ''}" data-account-id="${esc(account.id)}" style="--account-accent:${esc(account.color)};--stack-offset:${index * stackGap}px;z-index:${index}"><div class="account-stack-card-heading"><div class="account-stack-name"><span class="account-stack-icon">${ic(account.icon || 'wallet')}</span><span class="account-stack-name-copy"><b>${esc(account.name)}</b><small>${esc(account.type)}</small></span></div><b class="account-stack-balance" style="color:${balance < 0 ? 'var(--ex)' : 'var(--tx)'}">${pesoBalance(balance)}</b></div><div class="account-stack-card-footer"><small>${balanceNote}</small>${actions}</div></article>`
            }).join('');
            const accountCount = `${accounts.length} ${accounts.length === 1 ? 'account' : 'accounts'}`;
            const stackView = accounts.length ?
                `<div class="account-stack-wrap"><div class="account-stack-footer"><small>Swipe sideways to switch accounts.</small></div><div class="account-stack" role="region" aria-label="Account cards. Swipe sideways to switch accounts." tabindex="0" style="height:${stackHeight}px">${cards}</div></div>` :
                '<div class="empty accounts-empty">No accounts yet. Add one to get started.</div>';
            const accountContent = accountViewMode === 'list' ?
                accounts.length ? `<div class="accounts-list">${accountRows}</div>` :
                    '<div class="empty accounts-empty">No accounts yet. Add one to get started.</div>' :
                stackView;
            return `${window.PocketPageHeader({ eyebrow: 'EVERY BALANCE, TOGETHER', title: 'Accounts' })}<div class="accounts-page"><section class="accounts-balance-card" aria-label="Account balance summary"><small>Total balance · ${accountCount}</small><strong>${pesoBalance(totalBalance)}</strong><div><span>Savings</span><b>${pesoBalance(savingsBalance)}</b></div></section><div class="accounts-list-heading"><h3>Your accounts</h3><button type="button" class="accounts-view-toggle" onclick="toggleAccountViewMode()" aria-label="Switch to ${accountViewMode === 'list' ? 'card' : 'list'} view">${accountViewMode === 'list' ? 'List view' : 'Card view'}<span aria-hidden="true">⌄</span></button></div>${accountContent}</div>`
        };

    window.PocketFeatures['acc'] = V.acc;
})();
