(() => {
    window.PocketFeatures = window.PocketFeatures || {};
        const TRANSACTION_PAGE_SIZE = 50,
            transactionLongMonthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' }),
            transactionMonthFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' });
        let txPageLimit = TRANSACTION_PAGE_SIZE,
            transactionFiltersOpen = false,
            transactionScrollHideTimer = 0;

        function transactionForm(id) {
            window._dup = '';
            const transaction = id ? D.tx.find(item => item.id === id) : null,
                linkedCashback = transaction && D.cashbacks.find(claim => claim.expenseId === transaction.id);
            openForm(transaction ? 'Edit transaction' : 'Add transaction', values => {
                    const isTransfer = values.type === 'transfer',
                        accounts = D.acc.map(account => [account.id, account.name]);
                    return [{
                            k: 'type',
                            l: 'Type',
                            t: 'sel',
                            cls: 'form-field-full',
                            o: [
                                ['expense', 'Expense'],
                                ['income', 'Income'],
                                ['transfer', 'Transfer']
                            ]
                        }, {
                            k: 'amount',
                            l: 'Amount (₱)',
                            t: 'number',
                            req: 1,
                            pos: 1,
                            cls: 'form-field-full'
                        }, ...((values.type === 'expense' || isTransfer) ? [{
                            k: 'title',
                            l: 'Title',
                            cls: 'form-field-full',
                            req: values.type === 'expense'
                        }, {
                            k: 'cashbackAmount',
                            l: 'Cashback (optional)',
                            t: 'text',
                            cls: 'form-field-full',
                            placeholder: '0.00',
                            help: isTransfer ? 'Deposited to the From account.' : ''
                        }] : [{
                            k: 'title',
                            l: 'Title',
                            cls: 'form-field-full',
                            req: true
                        }]),
                        isTransfer ? {
                            k: 'acc',
                            l: 'From account',
                            t: 'sel',
                            req: 1,
                            cls: 'form-field-full',
                            o: accounts
                        } : null,
                        isTransfer ? {
                            k: 'transferDirection',
                            l: '',
                            t: 'direction',
                            cls: 'form-field-full'
                        } : {
                            k: 'cat',
                            l: 'Category',
                            t: 'sel',
                            req: 1,
                            cls: 'form-field-pair',
                            placeholder: 'Choose category',
                            o: D.cats.filter(category => values.type === 'income' ? category.g === 'Income' : category.g !== 'Income')
                                .map(category => [category.id, category.name])
                        },
                        isTransfer ? {
                            k: 'to',
                            l: 'To account',
                            t: 'sel',
                            req: 1,
                            cls: 'form-field-full',
                            o: accounts
                        } : {
                            k: 'acc',
                            l: 'Account',
                            t: 'sel',
                            req: 1,
                            cls: 'form-field-pair',
                            placeholder: 'Choose account',
                            o: accounts
                        }, {
                            k: 'date',
                            l: 'Date',
                            t: 'date',
                            req: 1,
                            cls: 'form-field-pair'
                        }, {
                            k: 'time',
                            l: 'Time',
                            t: 'time',
                            cls: 'form-field-pair'
                        }, {
                            k: 'note',
                            l: 'Notes (optional)',
                            t: 'area',
                            cls: 'form-field-full'
                        }
                    ]
                },
                transaction ? { ...transaction, cashbackAmount: linkedCashback?.amount || '' } : {
                    type: 'expense',
                    date: today(),
                    time: '',
                    acc: '',
                    to: 'gcash',
                    cashbackAmount: ''
                }, values => {
                    const amount = +values.amount,
                        isTransfer = values.type === 'transfer',
                        title = values.title || 'Transfer',
                        cashbackAmount = +values.cashbackAmount || 0;
                    if (cashbackAmount > 0 && values.type !== 'expense' && !isTransfer) return 'Cashback can only be added to an expense or transfer.';
                    if (cashbackAmount > amount) return 'Cashback can’t exceed the transaction amount.';
                    if (cashbackAmount > 0 && !A(values.acc)) return 'Choose an account for the cashback deposit.';
                    if (linkedCashback && values.type !== 'expense' && !isTransfer) return 'Remove the linked cashback claim before changing this transaction type.';
                    if (linkedCashback && cashbackAmount > 0 && amount < cashbackAmount) return 'This transaction amount is below its cashback claim.';
                    if (isTransfer) {
                        if (values.acc === values.to) return 'Choose two different accounts';
                        const account = A(values.acc),
                            balance = bal(account, today(), id);
                        if (!od(account) && balance < amount) return `Insufficient funds in ${account.name} (${peso(balance)} available)`
                    }
                    const signature = [values.type, amount, values.date, values.acc, title, isTransfer ? values.to : ''].join('|');
                    if (!transaction && window._dup !== signature && D.tx.some(item => item.type === values.type && item.amount === amount && item
                            .date === values.date && item.acc === values.acc && item.title === title && (item.to || '') === (isTransfer ? values
                                .to : ''))) return window._dup = signature,
                        'Looks like a duplicate. Tap Save again to add it anyway.';
                    const savedTransaction = {
                        id: transaction ? transaction.id : uid(),
                        type: values.type,
                        title,
                        amount,
                        cat: isTransfer ? 'c_transfers' : values.cat,
                        acc: values.acc,
                        to: isTransfer ? values.to : null,
                        date: values.date,
                        time: values.time || transaction?.time || (transaction ? '' : new Date().toTimeString().slice(0, 5)),
                        note: values.note,
                        ...(transaction?.cashbackId ? { cashbackId: transaction.cashbackId } : {})
                    };
                    if (linkedCashback) {
                        linkedCashback.expenseTitle = title;
                        linkedCashback.expenseDate = values.date;
                        linkedCashback.account = window.PocketDomain.cashback.depositAccount(savedTransaction, values.acc);
                        if (cashbackAmount > 0) linkedCashback.amount = cashbackAmount;
                        else D.cashbacks = D.cashbacks.filter(claim => claim.id !== linkedCashback.id)
                    }
                    transaction ? Object.assign(transaction, savedTransaction) : D.tx.push(savedTransaction);
                    if (!linkedCashback && (values.type === 'expense' || isTransfer) && cashbackAmount > 0) {
                        D.cashbacks.push({
                            id: uid(),
                            expenseId: savedTransaction.id,
                            expenseTitle: title,
                            expenseDate: values.date,
                            amount: cashbackAmount,
                            account: window.PocketDomain.cashback.depositAccount(savedTransaction, values.acc),
                            created: today(),
                            status: 'pending',
                            receivedDate: '',
                            incomeId: ''
                        })
                    }
                }, 'type')
        }

        function txList() {
            const q = U.q.toLowerCase(),
                L = sorted().filter(t => (!q || t.title.toLowerCase().includes(q)) && (!U.c || t.cat === U.c) && (!U
                        .a || t.acc === U.a || t.to === U.a) && (!U.ty || (U.ty === 'flow' ? t.type !== 'transfer' : t.type === U.ty)) && (!U.tf || t.date >= U
                    .tf) && (!U.tt || t.date <= U.tt));
            if (!L.length) return '<div class="empty transaction-empty">No transactions match. Try clearing a filter or add one.</div>';
            const transactions = L.slice(0, txPageLimit);
            const now = new Date(),
                todayDate = iso(now),
                yesterdayDate = iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)),
                groups = [];
            transactions.forEach(transaction => {
                let group = groups[groups.length - 1];
                if (!group || group.date !== transaction.date) {
                    group = { date: transaction.date, transactions: [] };
                    groups.push(group);
                }
                group.transactions.push(transaction);
            });
            return groups.map(group => {
                const [year, month, day] = group.date.split('-').map(Number),
                    date = new Date(year, month - 1, day),
                    dateLabel = group.date === todayDate ? `Today · ${day} ${MO[month - 1]}` :
                        group.date === yesterdayDate ? `Yesterday · ${day} ${MO[month - 1]}` :
                            `${day} ${transactionLongMonthFormatter.format(date)}`,
                    countLabel = `${group.transactions.length} transaction${group.transactions.length === 1 ? '' : 's'}`;
                return `<section class="transaction-date-group"><div class="transaction-date-group-heading"><h3 class="transaction-date-heading" data-date="${esc(group.date)}">${esc(dateLabel)}</h3><span class="transaction-count">${countLabel}</span></div><div class="transaction-date-card">${group.transactions.map(transaction => row(transaction, 1)).join('')}</div></section>`;
            }).join('') + (L.length > transactions.length ? '<div class="tx-load-more" id="tx-load-more" aria-hidden="true"></div>' : '')
        }

        function refreshList() {
            txPageLimit = TRANSACTION_PAGE_SIZE;
            const list = document.querySelector('#tl');
            if (!list) return;
            list.innerHTML = txList();
            lu()
        }

        function resetPage() {
            txPageLimit = TRANSACTION_PAGE_SIZE
        }

        function toggleFilters() {
            const panel = document.querySelector('#transaction-advanced-filters'),
                button = document.querySelector('#transaction-filters-toggle');
            if (!panel || !button) return;
            panel.hidden = !panel.hidden;
            button.setAttribute('aria-expanded', String(!panel.hidden));
        }

        function closeFilters() {
            const panel = document.querySelector('#transaction-advanced-filters'),
                button = document.querySelector('#transaction-filters-toggle');
            if (!panel || !button || panel.hidden) return;
            panel.hidden = true;
            button.setAttribute('aria-expanded', 'false');
        }

        function updateMonthIndicator() {
            const indicator = document.querySelector('#transaction-scroll-month');
            if (U.v !== 'tx' || !indicator) return;
            const root = document.documentElement,
                contentHeight = Math.max(root.scrollHeight, document.body.scrollHeight),
                scrollRange = contentHeight - window.innerHeight;
            if (scrollRange <= 0) {
                indicator.classList.remove('is-visible');
                return;
            }
            const list = document.querySelector('#tl'),
                filters = document.querySelector('#m .pocket-feature-content > .f'),
                header = document.querySelector('#m .pocket-feature-content > .row:first-child'),
                listBounds = list?.getBoundingClientRect(),
                filtersBottom = filters?.getBoundingClientRect().bottom,
                headerBottom = header?.getBoundingClientRect().bottom || 0;
            if (!listBounds || (filtersBottom !== undefined && filtersBottom > headerBottom)) {
                indicator.classList.remove('is-visible');
                return;
            }
            const x = listBounds.left + 32,
                y = Math.max(listBounds.top + 20, headerBottom + 2),
                row = y < window.innerHeight
                    ? document.elementFromPoint(x, y)?.closest('#tl [data-date]')
                    : null,
                dateMatch = row?.dataset.date?.match(/^(\d{4})-(\d{2})-/);
            if (!dateMatch) {
                indicator.classList.remove('is-visible');
                return;
            }
            const year = Number(dateMatch[1]),
                month = Number(dateMatch[2]),
                dateLabel = transactionMonthFormatter.format(new Date(year, month - 1, 1)),
                thumbHeight = Math.min(window.innerHeight, Math.max(40, window.innerHeight ** 2 / contentHeight)),
                thumbTravel = window.innerHeight - thumbHeight,
                thumbPosition = window.scrollY / scrollRange * thumbTravel + thumbHeight / 2;
            indicator.textContent = dateLabel;
            indicator.style.top = `${Math.max(24, Math.min(window.innerHeight - 24, thumbPosition))}px`;
            indicator.classList.add('is-visible');
            window.clearTimeout(transactionScrollHideTimer);
            transactionScrollHideTimer = window.setTimeout(() => indicator.classList.remove('is-visible'), 700);
        }

        function loadMoreAtBottom() {
            if (U.v !== 'tx' || !document.querySelector('#tx-load-more')) return;
            const contentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
            if (window.scrollY + window.innerHeight < contentHeight - 100) return;
            const list = document.querySelector('#tl');
            if (!list) return;
            txPageLimit += TRANSACTION_PAGE_SIZE;
            list.innerHTML = txList();
            lu()
        }

        function switchType(type) {
            const select = document.querySelector('#f [name="type"]');
            if (!select) return;
            select.value = type;
            select.onchange && select.onchange()
        }

        document.addEventListener('click', event => {
            const panel = document.querySelector('#transaction-advanced-filters'),
                target = event.target;
            if (!panel || panel.hidden || target.closest('.transaction-filter-row') || target.closest('.pocket-select-overlay')) return;
            closeFilters();
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeFilters()
        });
        window.addEventListener('scroll', () => {
            loadMoreAtBottom();
            updateMonthIndicator()
        }, { passive: true });

        V.tx = () => {
            const options = (items, selected, allLabel) =>
                `<option value=""${selected ? '' : ' selected'}>${allLabel}</option>` + items.map(item =>
                    `<option value="${esc(item.id)}"${selected === item.id ? ' selected' : ''}>${esc(item.name)}</option>`
                ).join(''),
                typeOptions = [['', 'All types'], ['income', 'Income'], ['expense', 'Expense'], ['transfer', 'Transfer'], ['flow', 'Income and expenses']],
                filtersOpen = transactionFiltersOpen || Boolean(U.ty);
            return `${window.PocketPageHeader({ eyebrow: 'YOUR MONEY, IN MOTION', title: 'Transactions' })}
<div class="f transaction-filters">
  <label class="transaction-search"><img src="assets/dashboard-icons/search.svg" width="24" height="24" alt=""><input aria-label="Search transactions" placeholder="Search transactions" value="${esc(U.q)}" oninput="U.q=this.value;PocketFeatures.tx.refreshList()"></label>
  <div class="transaction-filter-row">
    <div class="transaction-filter-chip"><select aria-label="Filter by category" onchange="U.c=this.value;PocketFeatures.tx.refreshList()">${options(D.cats, U.c, 'All categories')}</select></div>
    <div class="transaction-filter-chip"><select aria-label="Filter by account" onchange="U.a=this.value;PocketFeatures.tx.refreshList()">${options(D.acc, U.a, 'All accounts')}</select></div>
    <button type="button" class="transaction-filters-toggle" id="transaction-filters-toggle" aria-controls="transaction-advanced-filters" aria-expanded="${filtersOpen}" onclick="PocketFeatures.tx.toggleFilters()"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg><span>Filters</span></button>
    <div class="transaction-advanced-filters" id="transaction-advanced-filters"${filtersOpen ? '' : ' hidden'}>
      <label>Type<select aria-label="Filter by type" onchange="U.ty=this.value;PocketFeatures.tx.refreshList()">${typeOptions.map(([value, label]) => `<option value="${value}"${value === U.ty ? ' selected' : ''}>${label}</option>`).join('')}</select></label>
    </div>
  </div>
  <div class="transaction-date-range">
    <span class="date-input-wrap date-filter${U.tf ? '' : ' is-empty'}"><input type="date" aria-label="From date" value="${esc(U.tf)}" onchange="U.tf=this.value;syncDateInput(this);PocketFeatures.tx.refreshList()"><span class="date-input-value">${esc(fd(U.tf))}</span><span class="date-input-placeholder">From date</span></span>
    <span class="transaction-date-separator" aria-hidden="true">→</span>
    <span class="date-input-wrap date-filter${U.tt ? '' : ' is-empty'}"><input type="date" aria-label="To date" value="${esc(U.tt)}" onchange="U.tt=this.value;syncDateInput(this);PocketFeatures.tx.refreshList()"><span class="date-input-value">${esc(fd(U.tt))}</span><span class="date-input-placeholder">To date</span></span>
  </div>
</div>
<div id="tl" class="transaction-list">${txList()}</div>
<div class="transaction-scroll-month" id="transaction-scroll-month" aria-hidden="true"></div>`
        };

    Object.assign(V.tx, {
        openForm: transactionForm,
        refreshList,
        resetPage,
        toggleFilters,
        switchType,
        loadMoreAtBottom
    });
    window.PocketFeatures['tx'] = V.tx;
})();
