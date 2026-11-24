(() => {
    window.PocketFeatures = window.PocketFeatures || {};
        V.rec = () => {
            const frequencyName = frequency => RECURRENCES.find(item => item[0] === frequency)?.[1] || 'Recurring';
            const scheduleDate = value => {
                const [year, month, day] = String(value || '').split('-').map(Number);
                return year && month >= 1 && month <= 12 && day > 0
                    ? `${day} ${MO[month - 1]} ${year}`
                    : 'Unknown date';
            };
            const waitingForFunds = rule => rule.active && rule.type === 'transfer' && rule.next <= today() &&
                A(rule.acc) && !od(A(rule.acc)) && bal(A(rule.acc)) < rule.amount;
            const active = D.recurring.filter(rule => rule.active),
                paused = D.recurring.filter(rule => !rule.active);
            const card = rule => {
                const title = rule.title || 'Transfer',
                    category = rule.type === 'transfer' ? 'Transfer' : C(rule.cat)?.name || 'Uncategorized',
                    accountLabel = rule.type === 'income' ? 'Deposited to' : rule.type === 'transfer' ? 'From account' : 'Paid from',
                    accountName = A(rule.acc)?.name || 'Unknown account',
                    amount = `${rule.type === 'expense' ? '−' : rule.type === 'income' ? '+' : ''}${peso(rule.amount)}`,
                    waiting = waitingForFunds(rule),
                    nextPayment = rule.active ? scheduleDate(rule.next) : `Paused · ${scheduleDate(rule.next)}`;
                return `<article class="card recurring-card"><div class="recurring-card-heading"><span class="recurring-card-icon">${ic(rule.type === 'transfer' ? 'arrow-left-right' : rule.type === 'income' ? 'wallet' : 'zap')}</span><div class="recurring-card-title"><b>${esc(title)}</b><small>${esc(frequencyName(rule.frequency))} · ${esc(category)}</small></div><details class="recurring-card-menu"><summary aria-label="Manage ${esc(title)}" title="Manage schedule">${dashboardIcon('more')}</summary><div class="recurring-card-menu-items"><button type="button" onclick="recurringForm('${rule.id}');this.closest('details').open=false">Edit schedule</button><button type="button" onclick="deleteRecurring('${rule.id}');this.closest('details').open=false">Delete schedule</button></div></details></div><b class="recurring-card-amount">${amount}</b><div class="recurring-card-details"><div class="recurring-card-detail"><span>Next payment</span><b class="${waiting ? 'is-waiting' : ''}">${waiting ? 'Waiting for funds' : nextPayment}</b></div><div class="recurring-card-detail"><span>${accountLabel}</span><b>${esc(accountName)}</b></div>${rule.type === 'transfer' ? `<div class="recurring-card-detail"><span>To account</span><b>${esc(A(rule.to)?.name || 'Unknown account')}</b></div>` : ''}<small class="recurring-card-start">Starts ${scheduleDate(rule.start)}</small></div><button type="button" class="recurring-toggle" onclick="toggleRecurring('${rule.id}')">${rule.active ? 'Pause schedule' : 'Resume schedule'}</button></article>`
            };
            const sectionHeading = (title, schedules) => `<div class="recurring-section-heading"><b>${title}</b><small>${schedules.length} schedule${schedules.length === 1 ? '' : 's'}</small></div>`;
            const emptyState = `<div class="card recurring-empty"><span class="recurring-empty-icon">${ic('repeat')}</span><div><b>${paused.length ? 'No active schedules' : 'No schedules yet'}</b><small>${paused.length ? 'Resume a paused schedule or add a new one.' : 'Add one for a regular bill, subscription, salary, or transfer.'}</small></div></div>`;
            return `<div class="row recurring-header"><div class="recurring-heading-copy"><small>LESS TO REMEMBER</small><h2>Recurring</h2><p>Set schedules for regular expenses, income, and transfers.</p></div></div>${sectionHeading('Active', active)}<div class="recurring-list">${active.length ? active.map(card).join('') : emptyState}</div>${paused.length ? `${sectionHeading('Paused', paused)}<div class="recurring-list">${paused.map(card).join('')}</div>` : ''}<small class="recurring-note">Due items are added while Pocket is open. Missed schedules catch up next time.</small>`
        };

    window.PocketFeatures['rec'] = V.rec;
})();
