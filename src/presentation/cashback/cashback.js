(() => {
    window.PocketFeatures = window.PocketFeatures || {};
        const cashbackSection = () => {
            const recentClaims = status => D.cashbacks.map((claim, index) => ({
                claim,
                index,
                date: status === 'received' ? claim.receivedDate || claim.created : claim.created
            })).filter(({ claim }) => claim.status === status)
                .sort((first, second) =>
                    (second.date || '').localeCompare(first.date || '') || second.index - first.index
                ).map(({ claim }) => claim),
                pending = recentClaims('pending'),
                received = recentClaims('received');
            const claimCard = claim => {
                const expense = D.tx.find(item => item.id === claim.expenseId);
                const transactionType = expense?.type === 'transfer' ? 'Transfer' : 'Expense';
                const timingLabel = claim.status === 'received' ? 'Received' : 'Added';
                const timingDate = claim.status === 'received' ? claim.receivedDate : claim.created;
                const title = claim.expenseTitle || expense?.title || 'Linked transaction';
                const formatDate = value => {
                    const [year, month, day] = String(value || '').split('-').map(Number);
                    return year && month >= 1 && month <= 12 && day ? `${day} ${MO[month - 1]} ${year}` : 'Unknown date';
                };
                const actions = claim.status === 'pending'
                    ? `<div class="cashback-card-actions"><button type="button" onclick="markCashbackReceived('${claim.id}')">Mark as received</button></div>`
                    : '';
                return `<article class="card cashback-card"><div class="cashback-card-heading"><span class="cashback-card-icon" aria-hidden="true">${ic('gift')}</span><div class="cashback-card-title"><b>${esc(title)}</b><small>${transactionType} · ${formatDate(claim.expenseDate || expense?.date || claim.created)}</small></div><b class="cashback-amount">${peso(claim.amount)}</b></div><div class="cashback-card-meta"><div><small>Deposit account</small><b>${esc(A(claim.account)?.name || 'Unknown account')}</b></div><div><small>${timingLabel}</small><b>${formatDate(timingDate)}</b></div></div>${actions}</article>`
            };
            const receivedTotal = received.reduce((total, claim) => total + claim.amount, 0),
                pendingTotal = pending.reduce((total, claim) => total + claim.amount, 0);
            const sectionHeading = (title, claims) => {
                const menu = claims.length ? `<details class="cashback-section-menu"><summary aria-label="Manage ${title.toLowerCase()} cashback claims">${ic('more-horizontal')}</summary><div class="cashback-section-menu-options">${claims.map(claim => {
                    const expense = D.tx.find(item => item.id === claim.expenseId),
                        claimTitle = claim.expenseTitle || expense?.title || 'Linked transaction';
                    return `<div class="cashback-section-menu-item"><div class="cashback-section-menu-item-label"><b>${esc(claimTitle)}</b><span>${peso(claim.amount)}</span></div><div class="cashback-section-menu-actions"><button type="button" aria-label="Edit cashback for ${esc(claimTitle)}" onclick="this.closest('details').open=false;editCashback('${claim.id}')">${ic('pencil')}Edit</button><button type="button" aria-label="Delete cashback for ${esc(claimTitle)}" onclick="this.closest('details').open=false;deleteCashback('${claim.id}')">${ic('trash-2')}Delete</button></div></div>`
                }).join('')}</div></details>` : '';
                return `<div class="cashback-section-heading"><h3 class="cashback-subtitle">${title}</h3><span class="cashback-count">${claims.length}</span>${menu}</div>`
            };
            return `<div class="cashback-header"><div class="cashback-heading-copy"><small class="cashback-eyebrow">EVERY PESO COMES BACK</small><h2>Cashback</h2></div></div><section class="card cashback-summary"><small>Total received</small><b>${peso(receivedTotal)}</b><span>${peso(pendingTotal)} pending</span></section>${sectionHeading('Pending', pending)}<div class="g g2 cashback-list">${pending.length ? pending.map(claimCard).join('') : '<div class="empty card cashback-empty">Add a claim from an expense or transfer in Transactions.</div>'}</div>${sectionHeading('Received', received)}<div class="g g2 cashback-list">${received.length ? received.map(claimCard).join('') : '<div class="empty card cashback-empty">Cashback marked received will appear here as income.</div>'}</div>`
        };

        V.cash = () => cashbackSection();

    window.PocketFeatures['cash'] = V.cash;
})();
