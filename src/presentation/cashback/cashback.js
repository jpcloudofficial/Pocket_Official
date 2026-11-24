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
                    return year && month >= 1 && month <= 12 && day ? fd(value) : 'Unknown date';
                };
                const actions = claim.status === 'pending'
                    ? `<div class="cashback-card-actions"><button type="button" onclick="PocketFeatures.cash.markReceived('${claim.id}')">Mark as received</button></div>`
                    : '';
                return `<article class="card cashback-card"><div class="cashback-card-heading"><span class="cashback-card-icon" aria-hidden="true">${ic('gift')}</span><div class="cashback-card-title"><b>${esc(title)}</b><small>${transactionType} · ${formatDate(claim.expenseDate || expense?.date || claim.created)}</small></div><b class="cashback-amount">${peso(claim.amount)}</b></div><div class="cashback-card-meta"><div><small>Deposit account</small><b>${esc(A(claim.account)?.name || 'Unknown account')}</b></div><div><small>${timingLabel}</small><b>${formatDate(timingDate)}</b></div></div>${actions}</article>`
            };
            const receivedTotal = received.reduce((total, claim) => total + claim.amount, 0),
                pendingTotal = pending.reduce((total, claim) => total + claim.amount, 0);
            const sectionHeading = (title, claims) => {
                const optionsHtml = claims.map(claim => {
                    const expense = D.tx.find(item => item.id === claim.expenseId),
                        claimTitle = claim.expenseTitle || expense?.title || 'Linked transaction';
                    return `<div class="cashback-section-menu-item"><div class="cashback-section-menu-item-label"><b>${esc(claimTitle)}</b><span>${peso(claim.amount)}</span></div><div class="cashback-section-menu-actions"><button type="button" class="pocket-action-menu-option" data-action="edit" data-entity-id="${esc(claim.id)}" aria-label="Edit cashback for ${esc(claimTitle)}">${ic('pencil')}Edit</button><button type="button" class="pocket-action-menu-option is-destructive" data-action="delete" data-entity-id="${esc(claim.id)}" aria-label="Delete cashback for ${esc(claimTitle)}">${ic('trash-2')}Delete</button></div></div>`
                }).join(''),
                    menu = claims.length ? window.PocketActionMenu.render({
                        owner: 'cashback',
                        label: `Manage ${title.toLowerCase()} cashback claims`,
                        className: 'cashback-section-menu',
                        triggerIcon: ic('more-horizontal'),
                        optionsHtml
                    }) : '';
                return `<div class="cashback-section-heading"><h3 class="cashback-subtitle">${title}</h3><span class="cashback-count">${claims.length}</span>${menu}</div>`
            };
            return `${window.PocketPageHeader({ eyebrow: 'EVERY PESO COMES BACK', title: 'Cashback' })}<section class="card cashback-summary"><small>Total received</small><b>${peso(receivedTotal)}</b><span>${peso(pendingTotal)} pending</span></section>${sectionHeading('Pending', pending)}<div class="g g2 cashback-list">${pending.length ? pending.map(claimCard).join('') : '<div class="empty card cashback-empty">Add a claim from an expense or transfer in Transactions.</div>'}</div>${sectionHeading('Received', received)}<div class="g g2 cashback-list">${received.length ? received.map(claimCard).join('') : '<div class="empty card cashback-empty">Cashback marked received will appear here as income.</div>'}</div>`
        };

        function cashbackForm(transactionId) {
            const transaction = D.tx.find(item =>
                item.id === transactionId && (item.type === 'expense' || item.type === 'transfer')
            );
            if (transactionId && !transaction) return info('The linked transaction could not be found.');
            if (transactionId && D.cashbacks.some(claim => claim.expenseId === transactionId)) {
                go('cash');
                return info('This transaction already has a cashback claim. You can manage it on the Cashback page.');
            }
            const eligibleTransactions = D.tx.filter(item =>
                (item.type === 'expense' || item.type === 'transfer') &&
                !D.cashbacks.some(claim => claim.expenseId === item.id)
            );
            if (!transaction && !eligibleTransactions.length) {
                return info('Add an expense or transfer before tracking cashback.');
            }
            const cashbackCategory = D.cats.find(category => category.g === 'Income' && category.name.toLowerCase() === 'cashback');
            if (!cashbackCategory) return info('Cashback category is unavailable. Reload Pocket to update categories.');
            openForm('Track cashback', () => [
                transaction ? null : {
                    k: 'expenseId',
                    l: 'Transaction',
                    t: 'sel',
                    req: 1,
                    placeholder: 'Choose transaction',
                    picker: {
                        mode: 'search',
                        eyebrow: 'TRACK A RETURN',
                        title: 'Choose transaction',
                        closeLabel: 'Close transaction picker',
                        searchPlaceholder: 'Search transactions',
                        noResults: 'No matching transactions.'
                    },
                    o: eligibleTransactions.map(item => [item.id, `${item.title} · ${fd(item.date)} · ${peso(item.amount)}`])
                },
                { k: 'amount', l: 'Expected cashback (₱)', t: 'number', req: 1, pos: 1 },
                {
                    k: 'account',
                    l: 'Deposit account',
                    t: 'sel',
                    req: 1,
                    help: transaction?.type === 'transfer' ? 'Defaults to the From account for transfers.' : '',
                    o: D.acc.map(account => [account.id, account.name])
                }
            ], {
                expenseId: transactionId || '',
                amount: '',
                account: window.PocketDomain.cashback.depositAccount(transaction)
            }, value => {
                const linkedTransaction = transaction || D.tx.find(item =>
                    item.id === value.expenseId && (item.type === 'expense' || item.type === 'transfer')
                );
                if (!linkedTransaction) return 'Choose a transaction for this cashback.';
                if (D.cashbacks.some(claim => claim.expenseId === linkedTransaction.id)) {
                    return 'This transaction already has a cashback claim.';
                }
                const amount = +value.amount;
                if (amount > linkedTransaction.amount) return 'Cashback can’t exceed the linked transaction amount.';
                D.cashbacks.push({
                    id: uid(),
                    expenseId: linkedTransaction.id,
                    expenseTitle: linkedTransaction.title,
                    expenseDate: linkedTransaction.date,
                    amount,
                    account: value.account,
                    created: today(),
                    status: 'pending',
                    receivedDate: '',
                    incomeId: ''
                });
            }, undefined, 'Add cashback');
            const transactionSelect = document.querySelector('#f [name="expenseId"]'),
                depositAccount = document.querySelector('#f [name="account"]');
            if (transactionSelect && depositAccount) {
                transactionSelect.addEventListener('change', () => {
                    const selectedTransaction = D.tx.find(item => item.id === transactionSelect.value);
                    if (!selectedTransaction) return;
                    depositAccount.value = window.PocketDomain.cashback.depositAccount(selectedTransaction);
                    depositAccount.dispatchEvent(new Event('change', { bubbles: true }))
                })
            }
        }

        function editCashback(id) {
            const claim = D.cashbacks.find(item => item.id === id);
            if (!claim) return info('This cashback claim could not be found.');
            const transaction = D.tx.find(item => item.id === claim.expenseId),
                income = D.tx.find(item => item.id === claim.incomeId || item.cashbackId === claim.id);
            if (claim.status === 'received' && !income) {
                return info('The linked income transaction could not be found.');
            }
            openForm('Edit cashback', () => [
                { k: 'amount', l: 'Expected cashback (₱)', t: 'number', req: 1, pos: 1 },
                {
                    k: 'account',
                    l: 'Deposit account',
                    t: 'sel',
                    req: 1,
                    help: transaction?.type === 'transfer' ? 'Defaults to the From account for transfers.' : '',
                    o: D.acc.map(account => [account.id, account.name])
                }
            ], {
                amount: String(claim.amount),
                account: window.PocketDomain.cashback.depositAccount(transaction, claim.account)
            }, value => {
                const amount = +value.amount;
                if (!A(value.account)) return 'Choose a deposit account.';
                if (transaction && amount > transaction.amount) return 'Cashback can’t exceed the linked transaction amount.';
                claim.amount = amount;
                claim.account = value.account;
                if (transaction) {
                    claim.expenseTitle = transaction.title;
                    claim.expenseDate = transaction.date;
                }
                if (income) {
                    income.amount = amount;
                    income.acc = value.account;
                    income.title = `Cashback — ${claim.expenseTitle || transaction?.title || 'Expense'}`;
                    claim.incomeId = income.id
                }
            }, undefined, 'Save cashback');
        }

        function deleteCashback(id) {
            const claim = D.cashbacks.find(item => item.id === id);
            if (!claim) return info('This cashback claim could not be found.');
            ask('Delete this cashback claim? If received, its linked income transaction will also be deleted.', () => {
                D.tx = D.tx.filter(item => item.id !== claim.incomeId && item.cashbackId !== claim.id);
                D.cashbacks = D.cashbacks.filter(item => item.id !== id)
            });
        }

        function markCashbackReceived(id) {
            const claim = D.cashbacks.find(item => item.id === id);
            if (!claim || claim.status === 'received') return;
            const incomeCategory = D.cats.find(category => category.g === 'Income' && category.name.toLowerCase() === 'cashback');
            if (!incomeCategory || !A(claim.account)) return info('The cashback category or deposit account is unavailable.');
            const expense = D.tx.find(item => item.id === claim.expenseId),
                income = {
                    id: uid(),
                    type: 'income',
                    title: `Cashback — ${claim.expenseTitle || expense?.title || 'Expense'}`,
                    amount: claim.amount,
                    cat: incomeCategory.id,
                    acc: claim.account,
                    to: null,
                    date: today(),
                    time: new Date().toTimeString().slice(0, 5),
                    note: `Cashback received for ${claim.expenseDate || expense?.date || 'linked expense'}`,
                    cashbackId: claim.id
                };
            D.tx.push(income);
            claim.status = 'received';
            claim.receivedDate = today();
            claim.incomeId = income.id;
            save();
            render();
        }

        V.cash = () => cashbackSection();
        Object.assign(V.cash, {
            openForm: cashbackForm,
            editClaim: editCashback,
            deleteClaim: deleteCashback,
            markReceived: markCashbackReceived
        });

    document.addEventListener('pocket:action-menu', event => {
        const { owner, action, entityId } = event.detail || {};
        if (owner !== 'cashback') return;
        if (action === 'edit') window.PocketFeatures.cash.editClaim(entityId);
        else if (action === 'delete') window.PocketFeatures.cash.deleteClaim(entityId);
    });

    window.PocketFeatures['cash'] = V.cash;
})();
