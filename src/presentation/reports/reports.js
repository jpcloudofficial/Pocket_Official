(() => {
    window.PocketFeatures = window.PocketFeatures || {};
        const REPORT_COLORS = ['#16a34a', '#ea580c', '#2563eb'],
            REPORT_RANGES = [['weekly', 'Weekly'], ['monthly', 'Monthly'], ['yearly', 'Yearly'], ['custom', 'Custom']],
            REPORT_RANGE_DATE_FORMAT = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' });
        const reportDate = value => {
            const [year, month, day] = value.split('-').map(Number);
            return new Date(year, month - 1, day)
        };
        const reportDayLabel = value => new Intl.DateTimeFormat('en-PH', {
            month: 'short',
            day: 'numeric'
        }).format(reportDate(value));
        const reportDateRangeLabel = (start, end) => {
            const startDate = reportDate(start),
                endDate = reportDate(end),
                first = REPORT_RANGE_DATE_FORMAT.format(startDate),
                last = REPORT_RANGE_DATE_FORMAT.format(endDate);
            return startDate.getFullYear() === endDate.getFullYear() ?
                `${first} – ${last} ${endDate.getFullYear()}` :
                `${first} ${startDate.getFullYear()} – ${last} ${endDate.getFullYear()}`
        };
        const reportTick = value => peso(Math.round(value));
        function reportPeriod(range = U.reportRange, fromValue = U.reportFrom, toValue = U.reportTo) {
            const now = new Date(),
                endToday = today();
            let start, end = endToday;
            if (range === 'weekly') {
                const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
                start = iso(weekStart)
            } else if (range === 'yearly') {
                start = iso(new Date(now.getFullYear(), 0, 1))
            } else if (range === 'custom') {
                start = fromValue || iso(new Date(now.getFullYear(), now.getMonth(), 1));
                end = toValue || endToday
            } else {
                start = iso(new Date(now.getFullYear(), now.getMonth(), 1))
            }
            const valid = /^\d{4}-\d\d-\d\d$/.test(start) && /^\d{4}-\d\d-\d\d$/.test(end) && start <= end;
            if (!valid) return { start, end, valid: false, buckets: [] };
            const days = Math.round((reportDate(end) - reportDate(start)) / 86400000) + 1,
                bucketMode = range === 'yearly' || (range === 'custom' && days > 180) ?
                    'month' : range === 'custom' && days > 35 ? 'week' : 'day',
                buckets = [];
            if (bucketMode === 'month') {
                let cursor = new Date(reportDate(start).getFullYear(), reportDate(start).getMonth(), 1);
                while (iso(cursor) <= end) {
                    const bucketStart = iso(cursor),
                        bucketEnd = iso(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0)),
                        first = bucketStart < start ? start : bucketStart,
                        last = bucketEnd > end ? end : bucketEnd;
                    buckets.push({
                        start: first,
                        end: last,
                        label: new Intl.DateTimeFormat('en-PH', { month: 'short', year: days > 365 ? '2-digit' : undefined }).format(cursor)
                    });
                    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
                }
            } else if (bucketMode === 'week') {
                let cursor = reportDate(start);
                while (iso(cursor) <= end) {
                    const bucketEnd = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 6),
                        last = iso(bucketEnd) > end ? end : iso(bucketEnd);
                    buckets.push({ start: iso(cursor), end: last, label: reportDayLabel(iso(cursor)) });
                    cursor = new Date(bucketEnd.getFullYear(), bucketEnd.getMonth(), bucketEnd.getDate() + 1)
                }
            } else {
                let cursor = reportDate(start);
                while (iso(cursor) <= end) {
                    const value = iso(cursor);
                    buckets.push({ start: value, end: value, label: reportDate(value).getDate().toString() });
                    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1)
                }
            }
            return { start, end, valid, buckets }
        }
        function openReportFilters() {
            const rangeOptions = REPORT_RANGES.map(([value, label]) =>
                    `<option value="${value}"${U.reportRange === value ? ' selected' : ''}>${label}</option>`
                ).join(''),
                accountOptions = [['', 'All accounts'], ...D.acc.map(account => [account.id, account.name])]
                    .map(([value, label]) => `<option value="${esc(value)}"${U.ra === value ? ' selected' : ''}>${esc(label)}</option>`)
                    .join(''),
                categoryOptions = [['', 'All categories'], ...D.cats.map(category => [category.id, category.name])]
                    .map(([value, label]) => `<option value="${esc(value)}"${U.rc === value ? ' selected' : ''}>${esc(label)}</option>`)
                    .join(''),
                startValue = U.reportFrom || iso(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
                endValue = U.reportTo || today();
            ov(`<div class="report-filter-screen">
${window.PocketFormScreenHeader({ back: 'close', close: 'dismiss' })}
<div class="report-filter-screen-content">
<div class="report-filter-intro"><small>SEE THE BIGGER PICTURE</small><h2>Report filters</h2><p>Choose what to include in your reports.</p></div>
<div class="report-filter-sheet-fields report-filter-fields-card">
<label><span>Date range</span><select name="reportRange" aria-label="Report date range">${rangeOptions}</select></label>
<label><span>Account</span><select name="reportAccount" aria-label="Filter reports by account">${accountOptions}</select></label>
<label class="report-filter-sheet-category"><span>Category</span><select name="reportCategory" aria-label="Filter reports by category">${categoryOptions}</select></label>
<div class="report-filter-custom-range"${U.reportRange === 'custom' ? '' : ' hidden'}><label><span>From</span><input name="reportFrom" type="date" value="${esc(startValue)}"></label><label><span>To</span><input name="reportTo" type="date" value="${esc(endValue)}"></label></div>
</div>
<section class="report-filter-preview" aria-live="polite"><strong id="report-filter-preview-range"></strong><small id="report-filter-preview-description"></small></section>
<small id="report-filter-error" class="report-filter-error" hidden></small>
<div class="report-filter-sheet-actions"><button type="button" class="b1 pocket-fab-action pocket-fab-action-primary" onclick="PocketReports.applyFilters()">Apply filters</button><button type="button" class="b2 pocket-fab-action" onclick="cl()">Cancel</button></div>
</div>
</div>`);
            $('#ov').classList.add('report-filter-open');
            wireRenderedSelects($('#ovc'));
            const rangeSelect = $('#ovc [name="reportRange"]'),
                customRange = $('#ovc .report-filter-custom-range'),
                fromInput = $('#ovc [name="reportFrom"]'),
                toInput = $('#ovc [name="reportTo"]'),
                updatePreview = () => {
                    const period = reportPeriod(rangeSelect.value, fromInput.value, toInput.value),
                        accountId = $('#ovc [name="reportAccount"]').value,
                        categoryId = $('#ovc [name="reportCategory"]').value,
                        accountName = accountId ? A(accountId)?.name || 'Selected account' : '',
                        categoryName = categoryId ? C(categoryId)?.name || 'Selected category' : '',
                        filters = [
                            accountName ? `Account: ${accountName}` : 'All accounts',
                            categoryName ? `Category: ${categoryName}` : 'All categories'
                        ];
                    $('#report-filter-preview-range').textContent = period.valid ?
                        reportDateRangeLabel(period.start, period.end) : 'Choose a valid date range.';
                    $('#report-filter-preview-description').textContent = accountName || categoryName ?
                        filters.join(' · ') : 'All your accounts and categories are included.'
                };
            rangeSelect.addEventListener('change', event => {
                customRange.hidden = event.target.value !== 'custom';
                updatePreview()
            });
            ['reportAccount', 'reportCategory'].forEach(name =>
                $('#ovc [name="' + name + '"]').addEventListener('change', updatePreview));
            [fromInput, toInput].forEach(input => {
                input.addEventListener('input', updatePreview);
                input.addEventListener('change', updatePreview)
            });
            updatePreview()
        }
        function applyReportFilters() {
            const sheet = $('#ovc'),
                range = sheet.querySelector('[name="reportRange"]').value,
                from = sheet.querySelector('[name="reportFrom"]').value,
                to = sheet.querySelector('[name="reportTo"]').value,
                error = $('#report-filter-error');
            if (range === 'custom' && from && to && from > to) {
                error.textContent = 'The start date must be on or before the end date.';
                error.hidden = false;
                return
            }
            U.reportRange = range;
            U.ra = sheet.querySelector('[name="reportAccount"]').value;
            U.rc = sheet.querySelector('[name="reportCategory"]').value;
            if (range === 'custom') {
                U.reportFrom = from;
                U.reportTo = to
            }
            cl();
            render()
        }
        const reportRangeTransactions = (transactions, start, end) => transactions.filter(transaction =>
            transaction.date >= start && transaction.date <= end
        );
        function reportClick(bucket, type, category = U.rc || '', account = U.ra || '') {
            const args = [bucket.start, bucket.end, type, category, account].map(value => `'${esc(value)}'`).join(',');
            return `tabindex="0" role="button" onclick="PocketReports.openTransactions(${args})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();PocketReports.openTransactions(${args})}"`;
        }
        function reportEmpty(message = 'No transactions in this period.') {
            return `<div class="empty report-empty">${message}</div>`
        }
        function reportLegend(series) {
            return `<div class="report-legend">${series.map(item => `<span><i style="--report-color:${item.color}"></i>${esc(item.name)}</span>`).join('')}</div>`
        }
        const chartConfigAttribute = config => `data-chart-config="${esc(JSON.stringify(config))}"`;
        function reportLineChart(buckets, series, emptyMessage, area = false) {
            if (!buckets.length || !series.some(item => item.values.some(value => value !== 0))) return reportEmpty(emptyMessage);
            const config = { kind: 'line', buckets, series, area };
            return `<div class="report-line-chart"><canvas class="report-line-canvas" role="img" aria-label="Line chart" ${chartConfigAttribute(config)}>Line chart</canvas></div>${reportLegend(series)}`
        }
        function reportBarChart(buckets, series, emptyMessage, options = {}) {
            if (!buckets.length || !series.some(item => item.values.some(value => value !== 0))) return reportEmpty(emptyMessage);
            const compact = options.compact === true,
                width = 640, height = compact ? 340 : 270, left = compact ? 18 : 64, right = 16, top = 18, bottom = 40,
                values = series.flatMap(item => item.values),
                high = Math.max(1, ...values), low = Math.min(0, ...values),
                y = value => top + (high - value) / (high - low || 1) * (height - top - bottom),
                baseline = y(0), groupWidth = (width - left - right) / buckets.length,
                barWidth = Math.max(2, groupWidth * .66 / series.length),
                tickIndexes = new Set([0, ...Array.from({ length: 4 }, (_, index) =>
                    Math.round((buckets.length - 1) * (index + 1) / 5)), buckets.length - 1]);
            let svg = `<svg viewBox="0 0 ${width} ${height}" class="ch report-chart" role="img" aria-label="${compact ? 'Grouped income and expenses chart' : 'Bar chart'}">`;
            if (!compact) {
                for (let index = 0; index <= 4; index++) {
                    const value = low + (high - low) * (4 - index) / 4, yy = y(value);
                    svg += `<line x1="${left}" x2="${width-right}" y1="${yy}" y2="${yy}" class="report-gridline"/><text x="${left-8}" y="${yy+4}" text-anchor="end">${reportTick(value)}</text>`
                }
            }
            buckets.forEach((bucket, bucketIndex) => {
                if (tickIndexes.has(bucketIndex)) svg += `<text x="${left+(bucketIndex+.5)*groupWidth}" y="${height-12}" text-anchor="middle">${esc(bucket.label)}</text>`;
                series.forEach((item, seriesIndex) => {
                    const value = item.values[bucketIndex], x = left + bucketIndex * groupWidth +
                        (groupWidth - barWidth * series.length) / 2 + seriesIndex * barWidth,
                        yy = y(value), actualHeight = Math.abs(baseline - yy),
                        tooltip = `${item.name}: ${peso(value)} · ${fd(bucket.start)}${bucket.start !== bucket.end ? ` – ${fd(bucket.end)}` : ''}`;
                    svg += `<g class="report-mark" ${reportClick(bucket, item.type || '', item.category || U.rc || '')}><title>${esc(tooltip)}</title><rect x="${x}" y="${value ? Math.min(baseline,yy) : baseline-2}" width="${Math.max(1,barWidth-3)}" height="${Math.max(4,actualHeight)}" rx="3" fill="${item.color}"/></g>`
                })
            });
            return compact ? `${reportLegend(series)}${svg}</svg>` : svg + '</svg>' + reportLegend(series)
        }
        function reportAccountBars(accounts, endDate, emptyMessage) {
            if (!accounts.length) return reportEmpty(emptyMessage);
            const values = accounts.map(account => ({ account, value: bal(account, endDate) })),
                max = Math.max(1, ...values.map(item => Math.abs(item.value))),
                width = 640, left = 174, right = 100, rowHeight = 38,
                height = Math.max(100, values.length * rowHeight + 20),
                baseline = left + (width - left - right) / 2,
                half = (width - left - right) / 2;
            let svg = `<svg viewBox="0 0 ${width} ${height}" class="ch report-account-chart" role="img" aria-label="Horizontal bar chart of account balances">`;
            svg += `<line x1="${baseline}" x2="${baseline}" y1="8" y2="${height-8}" class="report-gridline"/>`;
            values.forEach(({ account, value }, index) => {
                const y = 16 + index * rowHeight,
                    barWidth = Math.abs(value) / max * half,
                    x = value < 0 ? baseline - barWidth : baseline,
                    bucket = { start: endDate, end: endDate },
                    tooltip = `${account.name}: ${peso(value)} · Balance on ${fd(endDate)}`;
                svg += `<g class="report-mark" ${reportClick(bucket, '', '', account.id)}><title>${esc(tooltip)}</title><text x="${left-12}" y="${y+14}" text-anchor="end">${esc(account.name)}</text><rect x="${x}" y="${y}" width="${Math.max(value ? 2 : 0,barWidth)}" height="22" rx="5" fill="${value < 0 ? 'var(--ex)' : account.color}"/><text x="${value < 0 ? x-6 : x+barWidth+6}" y="${y+15}" text-anchor="${value < 0 ? 'end' : 'start'}">${esc(peso(value))}</text></g>`
            });
            return svg + '</svg>'
        }
        function reportBudgetAmount(categoryId, start, end) {
            let total = 0, cursor = new Date(reportDate(start).getFullYear(), reportDate(start).getMonth(), 1);
            while (iso(cursor) <= end) {
                const monthStart = iso(cursor),
                    monthlyAmount = budgetAmountForMonth(categoryId, ym(monthStart)),
                    monthEnd = iso(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0)),
                    overlapStart = monthStart < start ? start : monthStart,
                    overlapEnd = monthEnd > end ? end : monthEnd,
                    overlapDays = Math.floor((reportDate(overlapEnd) - reportDate(overlapStart)) / 86400000) + 1,
                    daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
                total += monthlyAmount * overlapDays / daysInMonth;
                cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
            }
            return Math.round(total * 100) / 100
        }
        function openReportTransactions(from, to, type, category, account) {
            U.tf = from;
            U.tt = to;
            U.ty = type || '';
            U.c = category || '';
            U.a = account || '';
            U.q = '';
            window.PocketFeatures.tx.resetPage();
            go('tx')
        }

        const reportChartCard = (title, chart, key, className = '') =>
            `<section class="card report-card${className ? ` ${className}` : ''}" data-report-chart="${key}"><h3>${title}</h3>${chart}</section>`;
        function buildReportChartModel() {
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
                incomeExpenses = reportBarChart(buckets, [
                    { ...incomeSeries, color: '#b8ef76' },
                    { ...expenseSeries, color: '#f2d28f' }
                ], 'No income or expenses in this period.', { compact: true }),
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
            const totalExpenses = categoryEntries.reduce((total, entry) => total + entry.value, 0),
                highestCategoryExpense = categoryEntries[0]?.value || 0,
                expenseBreakdown = categoryEntries.length ? categoryEntries.map((entry, index) => {
                    const width = highestCategoryExpense ? Math.max(3, entry.value / highestCategoryExpense * 100) : 0,
                        color = index === 0 ? '#f2d28f' : 'var(--in)',
                        onclick = `PocketReports.openTransactions('${esc(period.start)}','${esc(period.end)}','expense','${esc(entry.id)}','${esc(U.ra || '')}')`;
                    return `<button type="button" class="report-expense-category" style="--category-width:${width}%;--category-color:${color}" aria-label="Show ${esc(entry.name)} expenses, ${peso(entry.value)}" onclick="${onclick}"><span class="report-expense-category-label"><span>${esc(entry.name)}</span><b>${peso(entry.value)}</b></span><span class="report-expense-category-track" aria-hidden="true"><span></span></span></button>`
                }).join('') : reportEmpty();
            const budgetCategoryIds = [...new Set(Object.values(D.budgets).flatMap(monthBudgets => Object.keys(monthBudgets)))],
                budgetCategories = budgetCategoryIds.filter(id => !U.rc || id === U.rc).map(id => ({
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
                cashFlowChart = reportLineChart(buckets, cashFlowSeries);
            return {
                period,
                totalExpenses,
                expenseBreakdown,
                charts: {
                    incomeExpenses: reportChartCard('Income vs. expenses', incomeExpenses, 'incomeExpenses', 'report-income-expenses'),
                    spendingTrend: reportChartCard('Monthly Spending Trends', spendingTrend, 'spendingTrend'),
                    budgetVsActual: reportChartCard('Budget vs. Actual', budgetVsActual, 'budgetVsActual'),
                    savingsGrowth: reportChartCard('Savings Growth', savingsGrowth, 'savingsGrowth'),
                    accountDistribution: reportChartCard('Account Distribution', accountDistribution, 'accountDistribution'),
                    cashFlow: reportChartCard('Cash Flow', cashFlowChart, 'cashFlow')
                }
            }
        }
        function dashboardReportCharts(widgets) {
            const chartKeys = ['incomeExpenses', 'budgetVsActual', 'savingsGrowth', 'accountDistribution', 'cashFlow'],
                selectedCharts = chartKeys.filter(key => widgets[key]);
            if (!selectedCharts.length) return '';
            const model = buildReportChartModel();
            if (!model.period.valid) return '<div class="empty card">The selected Reports date range is invalid.</div>';
            return selectedCharts.map(key => model.charts[key]).join('')
        }
        V.rep = () => {
            const model = buildReportChartModel(),
                { period, charts, totalExpenses, expenseBreakdown } = model,
                rangeLabel = REPORT_RANGES.find(([value]) => value === U.reportRange)?.[1] || 'Monthly',
                selectedReportFilters = [U.ra ? A(U.ra)?.name : '', U.rc ? C(U.rc)?.name : ''].filter(Boolean),
                activeReportFilterCount = Number(!!U.ra) + Number(!!U.rc);
            return `${window.PocketPageHeader({ eyebrow: 'MAKE SENSE OF YOUR MONEY', title: 'Reports' })}
<div class="card report-filter-toolbar"><div class="report-filter-toolbar-copy"><small>${rangeLabel} overview${selectedReportFilters.length ? ` · ${selectedReportFilters.map(esc).join(' · ')}` : ''}</small><b>${period.valid ? reportDateRangeLabel(period.start, period.end) : 'Choose a valid date range.'}</b></div><button type="button" class="b2" aria-label="Open report filters${activeReportFilterCount ? `, ${activeReportFilterCount} active` : ''}" onclick="PocketReports.openFilters()">Filters${ic('arrow-down')}</button></div>
${period.valid ? `<div class="g g2 report-grid">
${charts.incomeExpenses}
<section class="card report-card report-expense-card"><div class="report-expense-total"><small>Total expenses</small><strong>${peso(totalExpenses)}</strong></div><div class="report-expense-breakdown-heading"><h3>Expense breakdown</h3><span>By category</span></div><div class="report-expense-categories">${expenseBreakdown}</div></section>
${charts.spendingTrend}
${charts.budgetVsActual}
${charts.savingsGrowth}
${charts.accountDistribution}
${charts.cashFlow}
</div>` : `<div class="empty card">The start date must be on or before the end date.</div>`}`
        };

    window.PocketReports = {
        openFilters: openReportFilters,
        applyFilters: applyReportFilters,
        openTransactions: openReportTransactions,
        dashboardCharts: dashboardReportCharts
    };
    V.rep.destroyCharts = () => window.PocketReportCharts.destroy();
    V.rep.afterRender = root => window.PocketReportCharts.render(root);
    window.PocketFeatures['rep'] = V.rep;
})();
