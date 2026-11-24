(() => {
    window.PocketFeatures = window.PocketFeatures || {};
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

        V.tx = () => {
            const options = (items, selected, allLabel) =>
                `<option value=""${selected ? '' : ' selected'}>${allLabel}</option>` + items.map(item =>
                    `<option value="${esc(item.id)}"${selected === item.id ? ' selected' : ''}>${esc(item.name)}</option>`
                ).join(''),
                typeOptions = [['', 'All types'], ['income', 'Income'], ['expense', 'Expense'], ['transfer', 'Transfer'], ['flow', 'Income and expenses']],
                filtersOpen = transactionFiltersOpen || Boolean(U.ty);
            return `<div class="row sp pocket-privacy-header transaction-page-heading"><div class="transaction-heading-copy"><small>YOUR MONEY, IN MOTION</small><h2>Transactions</h2></div></div>
<div class="f transaction-filters">
  <label class="transaction-search"><img src="assets/dashboard-icons/search.svg" width="24" height="24" alt=""><input aria-label="Search transactions" placeholder="Search transactions" value="${esc(U.q)}" oninput="U.q=this.value;fl()"></label>
  <div class="transaction-filter-row">
    <div class="transaction-filter-chip"><select aria-label="Filter by category" onchange="U.c=this.value;fl()">${options(D.cats, U.c, 'All categories')}</select></div>
    <div class="transaction-filter-chip"><select aria-label="Filter by account" onchange="U.a=this.value;fl()">${options(D.acc, U.a, 'All accounts')}</select></div>
    <button type="button" class="transaction-filters-toggle" id="transaction-filters-toggle" aria-controls="transaction-advanced-filters" aria-expanded="${filtersOpen}" onclick="toggleTransactionFilters()"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg><span>Filters</span></button>
    <div class="transaction-advanced-filters" id="transaction-advanced-filters"${filtersOpen ? '' : ' hidden'}>
      <label>Type<select aria-label="Filter by type" onchange="U.ty=this.value;fl()">${typeOptions.map(([value, label]) => `<option value="${value}"${value === U.ty ? ' selected' : ''}>${label}</option>`).join('')}</select></label>
    </div>
  </div>
  <div class="transaction-date-range">
    <span class="date-input-wrap date-filter${U.tf ? '' : ' is-empty'}"><input type="date" aria-label="From date" value="${esc(U.tf)}" onchange="U.tf=this.value;syncDateInput(this);fl()"><span class="date-input-value">${esc(fd(U.tf))}</span><span class="date-input-placeholder">From date</span></span>
    <span class="transaction-date-separator" aria-hidden="true">→</span>
    <span class="date-input-wrap date-filter${U.tt ? '' : ' is-empty'}"><input type="date" aria-label="To date" value="${esc(U.tt)}" onchange="U.tt=this.value;syncDateInput(this);fl()"><span class="date-input-value">${esc(fd(U.tt))}</span><span class="date-input-placeholder">To date</span></span>
  </div>
</div>
<div id="tl" class="transaction-list">${txList()}</div>
<button type="button" class="transaction-add-button" onclick="primaryAdd()">+ <span>Add transaction</span></button>
<div class="transaction-scroll-month" id="transaction-scroll-month" aria-hidden="true"></div>`
        };

    window.PocketFeatures['tx'] = V.tx;
})();
