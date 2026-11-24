(() => {
    window.PocketFeatures = window.PocketFeatures || {};

    V.set = () => {
        const actionRow = (label, action, trailingIcon = 'arrow-right', className = '') =>
            `<button type="button" class="settings-action-row${className ? ` ${className}` : ''}" onclick="${action}"><span>${label}</span>${ic(trailingIcon)}</button>`;

        return `${window.PocketPageHeader({ eyebrow: 'MAKE POCKET YOURS', title: 'Settings' })}<div class="g g2 settings-grid">
<section class="card settings-card settings-preferences"><h3>Preferences</h3><div class="settings-preference-list">
<div class="settings-preference-row"><span>Currency</span><b>Philippine Peso (₱)</b></div>
<div class="settings-preference-row"><span>Date format</span><select aria-label="Date format" onchange="D.dateFormat=this.value;save();render()">${DATE_FORMATS.map(format => `<option value="${format}"${currentDateFormat() === format ? ' selected' : ''}>${dateFormatLabel(format)}</option>`).join('')}</select></div>
<div class="settings-preference-row"><span>Financial period</span><select aria-label="Financial period" onchange="D.financialPeriod=this.value;U.reportRange=this.value;save();render()">${[['weekly', 'Weekly'], ['monthly', 'Monthly'], ['yearly', 'Yearly']].map(([value, label]) => `<option value="${value}"${D.financialPeriod === value ? ' selected' : ''}>${label}</option>`).join('')}</select></div>
<div class="settings-preference-row"><span>Theme</span><button type="button" class="settings-theme-toggle" aria-label="Toggle theme, currently ${D.theme === 'dark' ? 'Dark' : 'Light'}" onclick="D.theme=D.theme==='dark'?'light':'dark';save();render()"><span>${D.theme === 'dark' ? 'Dark' : 'Light'}</span><span class="settings-chevron" aria-hidden="true"></span></button></div>
</div><button type="button" class="b2 settings-cta dashboard-layout-setting" onclick="dashboardSettingsForm()">Customize dashboard</button></section>
<section class="card settings-card"><h3>Manage</h3><div class="settings-action-list">
${actionRow('Accounts', "go('acc')")}
${actionRow('Categories', "go('cat')")}
${actionRow('Budgets', "go('bud')")}
${actionRow('Savings goals', "go('goal')")}
${actionRow('Recurring transactions', "go('rec')")}
${actionRow('Cashback', "go('cash')")}
</div></section>
<section class="card settings-card"><h3>Getting started</h3><p class="settings-note">Review setup tips or explore Pocket with sample data. Demo changes do not affect your data.</p><div class="settings-cta-list">
<button type="button" class="b2 settings-cta" onclick="showSetupInstructions()">Setup instructions</button>
<button type="button" class="b2 settings-cta" onclick="startDemoMode()">Explore demo mode</button>
</div></section>
<section class="card settings-card"><h3>Export</h3><div class="settings-action-list">
${actionRow('Transactions CSV', "showText('Transactions (CSV)',csv())", 'arrow-down')}
${actionRow('Report CSV', "showText('Monthly report (CSV)',repCsv())", 'arrow-down')}
${actionRow('Export all data (JSON)', 'exportAllData()', 'arrow-down')}
</div></section>
<section class="card settings-card"><h3>Back up &amp; restore</h3><p class="settings-note">Data is saved in this browser. Download a backup and keep it somewhere safe. Pocket does not upload it to the cloud.</p><div class="settings-cta-list">
<button type="button" class="b2 settings-cta" onclick="showText('Backup',JSON.stringify(D))">View / copy backup</button>
<button type="button" class="b2 settings-cta" onclick="showText('Restore backup','',1)">Restore backup</button>
</div></section>
<section class="card settings-card"><h3>Data management</h3><p class="settings-note">These actions can clear or replace local data. You’ll be asked to confirm before they run.</p><div class="settings-action-list settings-danger-actions">
${actionRow('Clear transaction history', 'clearTransactionHistory()', 'arrow-right', 'is-danger')}
${actionRow('Reset all amounts', "ask('Reset all amounts to ₱0? This clears every transaction, sets all account balances to ₱0 and empties savings goals.',()=>zero(D),'Reset')", 'arrow-right', 'is-danger')}
</div></section>
</div>`;
    };

    window.PocketFeatures['set'] = V.set;
})();
