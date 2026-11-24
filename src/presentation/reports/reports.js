(() => {
    window.PocketFeatures = window.PocketFeatures || {};
        V.rep = () => {
            const period = reportPeriod(),
                rangeTransactions = period.valid ? reportRangeTransactions(D.tx, period.start, period.end) : [],
                transactions = rangeTransactions.filter(transaction =>
                    transaction.type !== 'transfer' && (!U.ra || transaction.acc === U.ra) &&
                    (!U.rc || transaction.cat === U.rc)
                ),
                buckets = period.buckets,
                bucketTransactions = bucket => transactions.filter(transaction =>
                    transaction.date >= bucket.start && transaction.date <= bucket.end
                ),
                incomeSeries = { name: 'Income', type: 'income', color: REPORT_COLORS[0], values: buckets.map(bucket => sum(bucketTransactions(bucket), 'income')) },
                expenseSeries = { name: 'Expenses', type: 'expense', color: REPORT_COLORS[1], values: buckets.map(bucket => sum(bucketTransactions(bucket), 'expense')) },
                incomeExpenses = reportLineChart(buckets, [incomeSeries, expenseSeries]),
                spendingSeries = { name: 'Expenses', type: 'expense', color: REPORT_COLORS[1], values: expenseSeries.values },
                spendingTrend = reportBarChart(buckets, [spendingSeries]),
                categoryTotals = new Map();
            transactions.filter(transaction => transaction.type === 'expense').forEach(transaction =>
                categoryTotals.set(transaction.cat, (categoryTotals.get(transaction.cat) || 0) + transaction.amount)
            );
            const categoryEntries = [...categoryTotals].map(([id, value]) => {
                const category = C(id);
                return { id, value, name: category?.name || 'Uncategorized', color: category?.color || '#78716c' }
            }).sort((first, second) => second.value - first.value);
            const expenseBreakdown = reportDonutChart(categoryEntries, period);
            const budgetCategories = Object.keys(D.budgets).filter(id => !U.rc || id === U.rc).map(id => ({
                id,
                name: C(id)?.name || 'Uncategorized',
                planned: reportBudgetAmount(id, period.start, period.end),
                actual: transactions.filter(transaction => transaction.type === 'expense' && transaction.cat === id)
                    .reduce((total, transaction) => total + transaction.amount, 0)
            })).filter(category => category.planned || category.actual);
            const budgetBuckets = budgetCategories.map(category => ({
                start: period.start, end: period.end, label: category.name
            }));
            const budgetVsActual = !transactions.some(transaction => transaction.type === 'expense') ?
                reportEmpty() : reportBarChart(budgetBuckets, [
                    { name: 'Planned', color: '#2563eb', type: 'expense', values: budgetCategories.map(category => category.planned) },
                    { name: 'Actual', color: '#ea580c', type: 'expense', values: budgetCategories.map(category => category.actual) }
                ]);
            const savingAccounts = D.acc.filter(account => account.type === 'Savings' && (!U.ra || account.id === U.ra)),
                savingsBuckets = buckets.map(bucket => ({ ...bucket, label: reportDayLabel(bucket.end) })),
                openingSavings = savingAccounts.reduce((total, account) => total + bal(account,
                    iso(new Date(reportDate(period.start).getFullYear(), reportDate(period.start).getMonth(), reportDate(period.start).getDate() - 1))), 0),
                savingsSeries = {
                    name: 'Savings balance',
                    color: '#2563eb',
                    values: [openingSavings, ...savingsBuckets.map(bucket => savingAccounts.reduce((total, account) =>
                        total + bal(account, bucket.end), 0))]
                },
                savingsChartBuckets = [{ start: period.start, end: period.start, label: 'Start' }, ...savingsBuckets],
                savingsGrowth = !savingAccounts.length ? reportEmpty('No savings accounts match this filter.') :
                    reportLineChart(savingsChartBuckets, [savingsSeries], 'No savings balance history available.', true);
            const accounts = D.acc.filter(account => !U.ra || account.id === U.ra),
                accountDistribution = reportAccountBars(accounts, period.end, 'No accounts to show.');
            const cashFlowSeries = [
                { name: 'Inflows', type: 'income', color: REPORT_COLORS[0], values: incomeSeries.values },
                { name: 'Outflows', type: 'expense', color: REPORT_COLORS[1], values: expenseSeries.values },
                { name: 'Net cash flow', type: 'flow', color: REPORT_COLORS[2], values: incomeSeries.values.map((value, index) => value - expenseSeries.values[index]) }
            ],
                cashFlowChart = reportLineChart(buckets, cashFlowSeries),
                rangeLabel = REPORT_RANGES.find(([value]) => value === U.reportRange)?.[1] || 'Monthly',
                selectedReportFilters = [U.ra ? A(U.ra)?.name : '', U.rc ? C(U.rc)?.name : ''].filter(Boolean),
                activeReportFilterCount = Number(!!U.ra) + Number(!!U.rc);
            const chartCard = (title, chart) => `<section class="card report-card"><h3>${title}</h3>${chart}</section>`;
            return `<div class="row sp"><h2>Reports</h2></div>
<div class="card report-filter-toolbar"><div class="report-filter-toolbar-copy"><small>${rangeLabel} overview${selectedReportFilters.length ? ` · ${selectedReportFilters.map(esc).join(' · ')}` : ''}</small><b>${period.valid ? `${fd(period.start)} – ${fd(period.end)}` : 'Choose a valid date range.'}</b></div><button type="button" class="b2" onclick="openReportFilters()">${ic('settings')} Filters${activeReportFilterCount ? `<span class="report-filter-count">${activeReportFilterCount}</span>` : ''}</button></div>
${period.valid ? `<div class="g g2 report-grid">
${chartCard('Income vs. Expenses', incomeExpenses)}
${chartCard('Expense Breakdown', expenseBreakdown)}
${chartCard('Monthly Spending Trends', spendingTrend)}
${chartCard('Budget vs. Actual', budgetVsActual)}
${chartCard('Savings Growth', savingsGrowth)}
${chartCard('Account Distribution', accountDistribution)}
${chartCard('Cash Flow', cashFlowChart)}
</div>` : `<div class="empty card">The start date must be on or before the end date.</div>`}`
        };

    window.PocketFeatures['rep'] = V.rep;
})();
