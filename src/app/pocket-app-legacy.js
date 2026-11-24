const K = 'pera.v1',
            ONBOARDING_KEY = 'pera.onboarding.v1',
            VIEW_KEY = 'pera.view.v1',
            $ = s => document.querySelector(s),
            uid = () => Math.random().toString(36).slice(2, 9),
            pad = n => String(n).padStart(2, '0');
const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
        const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()),
            today = () => iso(new Date()),
            fd = s => {
                if (!s) return '';
                const [year, month, day] = s.split('-');
        const format = currentDateFormat();
        return format === 'MM/DD/YYYY' ? `${month}/${day}/${year}` :
            format === 'YYYY-MM-DD' ? `${year}-${month}-${day}` : `${day}/${month}/${year}`;
            };
function syncDateInput(input) {
    const wrap = input.parentElement;
    wrap.classList.toggle('is-empty', !input.value);
    wrap.querySelector('.date-input-value').textContent = fd(input.value)
}
        const peso = (n, f) => (n < 0 ? '−' : '') + '₱' + Math.abs(n).toLocaleString('en-PH', {
            minimumFractionDigits: f ? 2 : Number.isInteger(Math.abs(n)) ? 0 : 2,
            maximumFractionDigits: 2
        });
        const pesoBalance = amount => peso(amount, amount === 0);
        const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;'
        } [c]));
        const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dashboardIcon = name =>
            `<img class="dashboard-icon" src="assets/dashboard-icons/${name}.svg" width="24" height="24" alt="">`;
        const ICONS = ['wallet', 'banknote', 'landmark', 'smartphone', 'piggy-bank', 'credit-card', 'coins', 'tag',
            'bus', 'utensils', 'shopping-cart', 'cookie', 'heart', 'shopping-bag', 'home', 'zap', 'repeat', 'film',
            'activity', 'shield', 'trending-up', 'briefcase', 'laptop', 'gift', 'calendar', 'rotate-ccw',
            'arrow-left-right', 'car', 'book', 'plane', 'target'
        ].map(x => [x, x]);
        const TYPES = ['Cash', 'E-Wallet', 'Digital Bank', 'Traditional Bank', 'Savings', 'Credit Card', 'Other'].map(
            x => [x, x]);
        const SUGGESTED_ACCOUNTS = [
            { key: 'cash', name: 'Cash', type: 'Cash', color: '#16a34a', icon: 'banknote' },
            { key: 'gcash', name: 'GCash', type: 'E-Wallet', color: '#2563eb', icon: 'smartphone' },
            { key: 'maya', name: 'Maya', type: 'E-Wallet', color: '#059669', icon: 'smartphone' },
            { key: 'maribank', name: 'MariBank', type: 'Digital Bank', color: '#f97316', icon: 'landmark' },
            { key: 'tonik', name: 'Tonik', type: 'Digital Bank', color: '#7c3aed', icon: 'landmark' },
            { key: 'savings', name: 'Savings', type: 'Savings', color: '#0ea5e9', icon: 'piggy-bank' }
        ];
        const ONBOARDING_STEPS = ['accounts', 'categories', 'preferences', 'optional'];
        const DASHBOARD_WIDGETS = [
            ['summary', 'Balance summary', true],
            ['shortcuts', 'Dashboard shortcuts (mobile)', true],
            ['actions', 'Quick actions', true],
            ['accounts', 'Accounts', true],
            ['transactions', 'Recent transactions', true],
            ['incomeExpenses', 'Income vs. expenses report', true],
            ['expensesByCategory', 'Expenses by category report', true],
            ['spendingTrend', 'Spending trend report', false],
            ['accountBalanceHistory', 'Account balance history report', false],
            ['monthlySavings', 'Monthly savings report', false]
        ];
        const PROFILE_COLORS = [
            ['Green', '#16a34a'],
            ['Blue', '#2563eb'],
            ['Purple', '#7c3aed'],
            ['Pink', '#db2777'],
            ['Orange', '#ea580c'],
            ['Teal', '#0f766e']
        ];
        const MAX_PROFILE_PHOTO_DATA_URL_LENGTH = 180000;
        const FORM_COLORS = [
            '#2563eb', '#6366f1', '#7c3aed', '#a855f7', '#db2777', '#e11d48',
            '#dc2626', '#ea580c', '#d97706', '#16a34a', '#0f766e', '#0891b2'
        ];
        const defaultDashboardWidgets = () => Object.fromEntries(DASHBOARD_WIDGETS.map(([id, , enabled]) => [id, enabled]));
        let D, onboardingState = null, onboardingActive = false, onboardingPersistenceError = false,
            demoMode = false, demoReturnData = null, demoReturnView = 'dash', demoReturnOnboarding = false,
            accountStackOrder = [], accountStackSignature = '',
            accountViewMode = 'list', budgetMonthOffset = 0, U = {
            v: 'dash',
            ra: '',
            rc: '',
            reportRange: 'yearly',
            reportFrom: '',
            reportTo: '',
            q: '',
            c: '',
            a: '',
            ty: '',
            tf: '',
            tt: ''
        };
        const currentDateFormat = () => DATE_FORMATS.includes(D?.dateFormat) ? D.dateFormat : DATE_FORMATS[0];

        function seed() {
            const now = new Date(),
                y = now.getFullYear(),
                mo = now.getMonth(),
                td = today();
            let s = 7;
            const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
            const cs = [
                ['Transportation', 'bus', '#f59e0b', 'Daily'],
                ['Food & Drinks', 'utensils', '#ef4444', 'Daily'],
                ['Groceries', 'shopping-cart', '#84cc16', 'Daily'],
                ['Snacks', 'cookie', '#f97316', 'Daily'],
                ['Personal Care', 'heart', '#ec4899', 'Daily'],
                ['Shopping', 'shopping-bag', '#a855f7', 'Daily'],
                ['Household Expenses', 'home', '#14b8a6', 'Daily'],
                ['Bills & Utilities', 'zap', '#eab308', 'Daily'],
                ['Subscriptions', 'repeat', '#6366f1', 'Daily'],
                ['Entertainment', 'film', '#d946ef', 'Daily'],
                ['Health & Wellness', 'activity', '#10b981', 'Daily'],
                ['Miscellaneous', 'tag', '#78716c', 'Daily'],
                ['Savings', 'piggy-bank', '#0ea5e9', 'Financial'],
                ['Emergency Fund', 'shield', '#0284c7', 'Financial'],
                ['Investments', 'trending-up', '#059669', 'Financial'],
                ['Debt Payments', 'credit-card', '#dc2626', 'Financial'],
                ['Transfers', 'arrow-left-right', '#2563eb', 'Financial'],
                ['Salary', 'briefcase', '#16a34a', 'Income'],
                ['Allowance', 'wallet', '#22c55e', 'Income'],
                ['Freelance / Side Hustle', 'laptop', '#0d9488', 'Income'],
                ['Bonus', 'gift', '#65a30d', 'Income'],
                ['13th Month Pay', 'calendar', '#15803d', 'Income'],
                ['Refund', 'rotate-ccw', '#0891b2', 'Income'],
                ['Cashback', 'coins', '#0891b2', 'Income'],
                ['Other Income', 'coins', '#4d7c0f', 'Income']
            ];
            const k = n => 'c_' + n.toLowerCase().replace(/[^a-z]/g, '');
            const c0 = iso(new Date(y, mo - 5, 1));
            const acc = [
                ['cash', 'Cash', 'Cash', '#16a34a', 'banknote', 2500],
                ['gcash', 'GCash', 'E-Wallet', '#2563eb', 'smartphone', 1200],
                ['maya', 'Maya', 'E-Wallet', '#059669', 'smartphone', 800],
                ['maribank', 'MariBank', 'Digital Bank', '#f97316', 'landmark', 15000],
                ['one', 'ONE', 'Digital Bank', '#7c3aed', 'landmark', 5000],
                ['savings', 'Savings Account', 'Savings', '#0ea5e9', 'piggy-bank', 20000],
                ['cc', 'Credit Card', 'Credit Card', '#dc2626', 'credit-card', 0]
            ].map(a => ({
                id: a[0],
                name: a[1],
                type: a[2],
                color: a[3],
                icon: a[4],
                initial: a[5],
                created: c0,
                od: 'no'
            }));
            const tx = [],
                add = (m, d, type, title, amt, cat, a, to) => {
                    const dt = new Date(y, mo - m, d);
                    if (dt.getMonth() !== ((mo - m) % 12 + 12) % 12) return;
                    const i = iso(dt);
                    if (i > td) return;
                    tx.push({
                        id: uid(),
                        type,
                        title,
                        amount: amt,
                        cat,
                        acc: a,
                        to: to || null,
                        date: i,
                        time: '',
                        note: ''
                    })
                };
            const J = b => Math.round(b * (.85 + r() * .3) / 5) * 5;
            const ex = [
                [2, 'Jollibee lunch', 'fooddrinks', 'gcash', 250],
                [4, 'Coffee', 'fooddrinks', 'maya', 160],
                [6, 'Grocery run', 'groceries', 'gcash', 1650],
                [7, 'Milk tea', 'snacks', 'cash', 120],
                [9, 'Haircut', 'personalcare', 'cash', 200],
                [10, 'Electric bill', 'billsutilities', 'gcash', 1900],
                [11, 'Internet bill', 'billsutilities', 'maya', 1299],
                [12, 'Spotify', 'subscriptions', 'maya', 149],
                [13, 'Netflix', 'subscriptions', 'maribank', 390],
                [17, 'Movie night', 'entertainment', 'gcash', 480],
                [18, 'Vitamins', 'healthwellness', 'cash', 350],
                [19, 'Cleaning supplies', 'householdexpenses', 'cash', 420],
                [21, 'Online shopping', 'shopping', 'gcash', 1250],
                [24, 'Dinner out', 'fooddrinks', 'maya', 640],
                [26, 'Jeepney & MRT', 'transportation', 'cash', 350],
                [27, 'Water bill', 'billsutilities', 'gcash', 380],
                [3, 'Jeepney fare', 'transportation', 'cash', 180],
                [8, 'Grab ride', 'transportation', 'gcash', 320],
                [15, 'Shopee order', 'shopping', 'cc', 2200]
            ];
            for (let m = 5; m >= 0; m--) {
                add(m, 1, 'income', 'Salary (1st half)', 14000, k('Salary'), 'maribank');
                add(m, 15, 'income', 'Salary (2nd half)', 14000, k('Salary'), 'maribank');
                add(m, 5, 'income', 'Monthly allowance', 3000, k('Allowance'), 'gcash');
                if (m % 2 == 0) add(m, 20, 'income', 'Logo design gig', J(4500), k('Freelance / Side Hustle'), 'maya');
                add(m, 1, 'transfer', 'Transfer', 4000, 'c_transfers', 'maribank', 'gcash');
                add(m, 2, 'transfer', 'Transfer', 2500, 'c_transfers', 'maribank', 'cash');
                add(m, 3, 'transfer', 'Transfer', 3000, 'c_transfers', 'maribank', 'savings');
                add(m, 20, 'transfer', 'Transfer', 1000, 'c_transfers', 'maribank', 'maya');
                add(m, 25, 'transfer', 'Credit card payment', 2000, 'c_transfers', 'maribank', 'cc');
                ex.forEach(e => add(m, e[0], 'expense', e[1], J(e[4]), k(e[2] === 'fooddrinks' ? 'Food & Drinks' : e[2])
                    .replace('c_fooddrinks', 'c_fooddrinks'), e[3]))
            }
            tx.forEach(t => {
                if (t.type === 'expense') t.cat = {
                    fooddrinks: 'c_fooddrinks',
                    billsutilities: 'c_billsutilities',
                    householdexpenses: 'c_householdexpenses',
                    healthwellness: 'c_healthwellness',
                    personalcare: 'c_personalcare'
                } [t.cat.slice(2)] || t.cat
            });
            const ed = iso(new Date(y, mo + 6, 1));
            return {
                name: '',
                profileAccent: PROFILE_COLORS[0][1],
                profilePhoto: '',
                theme: matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light',
                dateFormat: DATE_FORMATS[0],
                financialPeriod: 'monthly',
                acc,
                cats: cs.map(c => ({
                    id: k(c[0]),
                    name: c[0],
                    icon: c[1],
                    color: c[2],
                    g: c[3]
                })),
                tx,
                budgets: {
                    c_transportation: 1500,
                    c_fooddrinks: 3000,
                    c_subscriptions: 500,
                    c_shopping: 1000,
                    c_personalcare: 800
                },
                goals: [
                    ['Emergency Fund', 50000, 20000, 'savings'],
                    ['Driver’s License', 5000, 1800, ''],
                    ['Motorcycle Fund', 80000, 12000, 'maribank'],
                    ['Gadget Fund', 25000, 7500, '']
                ].map(g => ({
                    id: uid(),
                    name: g[0],
                    target: g[1],
                    current: g[2],
                    date: ed,
                    acc: g[3]
                })),
                recurring: [],
                cashbacks: [],
                shoppingLists: [],
                dashboardWidgets: defaultDashboardWidgets()
            }
        }
        const zero = d => {
            d.acc.forEach(a => a.initial = 0);
            d.tx = [];
            d.recurring = [];
            d.cashbacks = [];
            d.goals.forEach(g => g.current = 0);
            d.v3 = 1
        };
        let sf = 0;
        const save = () => {
            if (demoMode) {
                if (demoReturnData) {
                    try {
                        localStorage.setItem(K, JSON.stringify(demoReturnData))
                    } catch (e) {
                        if (!sf) {
                            sf = 1;
                            setTimeout(() => info(
                                'Couldn’t save your data on this device. Storage may be full or blocked (private mode?). Use Settings → Back up so you don’t lose anything.'
                                ), 0)
                        }
                    }
                }
                return
            }
            try {
                localStorage.setItem(K, JSON.stringify(D))
            } catch (e) {
                if (!sf) {
                    sf = 1;
                    setTimeout(() => info(
                        'Couldn’t save your data on this device. Storage may be full or blocked (private mode?). Use Settings → Back up so you don’t lose anything.'
                        ), 0)
                }
            }
            if (window.pocketCloud) window.pocketCloud.queueSave(D)
        };
        function persistOnboardingState() {
            try {
                localStorage.setItem(ONBOARDING_KEY, JSON.stringify(onboardingState));
                onboardingPersistenceError = false;
            } catch (error) {
                console.warn('Unable to save onboarding progress', error);
                onboardingPersistenceError = true
            }
        }
        function createOnboardingState() {
            const categories = D.cats.map(category => ({ ...category }));
            return {
                version: 1,
                completed: false,
                checklistDismissed: false,
                step: 'welcome',
                draft: {
                    accounts: [],
                    categories,
                    categoryIds: categories.map(category => category.id),
                    customCategories: [],
                    theme: D.theme,
                    dateFormat: DATE_FORMATS[0],
                    financialPeriod: 'monthly',
                    budgets: {},
                    goals: []
                }
            }
        }
        function restoreOnboardingState() {
            try {
                const value = JSON.parse(localStorage.getItem(ONBOARDING_KEY) || 'null');
                if (!value || value.version !== 1 || typeof value.completed !== 'boolean') return null;
                const initial = createOnboardingState();
                if (value.completed) {
                    return {
                        ...initial,
                        ...value,
                        completed: true,
                        checklistDismissed: value.checklistDismissed === true,
                        draft: null
                    }
                }
                const draft = value.draft && typeof value.draft === 'object' ? value.draft : {},
                    categories = Array.isArray(draft.categories) ? draft.categories.filter(category =>
                        category && okId(category.id) && typeof category.name === 'string' &&
                        ['Daily', 'Financial', 'Income'].includes(category.g)
                    ) : initial.draft.categories,
                    categoryIds = new Set(categories.map(category => category.id));
                return {
                    ...initial,
                    ...value,
                    version: 1,
                    completed: false,
                    checklistDismissed: false,
                    step: ['welcome', ...ONBOARDING_STEPS, 'complete'].includes(value.step) ? value.step : 'welcome',
                    draft: {
                        ...initial.draft,
                        theme: ['dark', 'light'].includes(draft.theme) ? draft.theme : initial.draft.theme,
                        dateFormat: DATE_FORMATS.includes(draft.dateFormat) ? draft.dateFormat : initial.draft.dateFormat,
                        financialPeriod: ['weekly', 'monthly', 'yearly'].includes(draft.financialPeriod) ?
                            draft.financialPeriod : initial.draft.financialPeriod,
                        categories,
                        categoryIds: Array.isArray(draft.categoryIds) ?
                            draft.categoryIds.filter(id => categoryIds.has(id)) : [...categoryIds],
                        customCategories: Array.isArray(draft.customCategories) ? draft.customCategories.filter(category =>
                            category && okId(category.id) && typeof category.name === 'string' &&
                            ['Daily', 'Income'].includes(category.g)
                        ) : [],
                        accounts: Array.isArray(draft.accounts) ? draft.accounts.filter(account =>
                            account && typeof account.key === 'string' &&
                            (SUGGESTED_ACCOUNTS.some(suggestion => suggestion.key === account.key) ||
                                /^custom-[\w-]{1,40}$/.test(account.key)) &&
                            typeof account.name === 'string' && TYPES.some(([type]) => type === account.type)
                        ).map(account => ({
                            ...account,
                            name: sx(account.name, 40),
                            color: okCol(account.color) ? account.color : '#2563eb',
                            initial: String(account.initial ?? '0')
                        })) : [],
                        budgets: draft.budgets && typeof draft.budgets === 'object' && !Array.isArray(draft.budgets) ?
                            draft.budgets : {},
                        goals: Array.isArray(draft.goals) ? draft.goals.filter(goal =>
                            goal && okId(goal.key) && typeof goal.name === 'string'
                        ).map(goal => ({ ...goal, target: String(goal.target ?? '') })) : []
                    }
                }
            } catch (error) {
                console.warn('Unable to restore onboarding progress', error)
            }
            return null
        }
        const A = id => D.acc.find(a => a.id === id),
            C = id => D.cats.find(c => c.id === id),
            od = a => a.type === 'Credit Card' || a.od === 'yes',
            isSav = a => a.type === 'Savings';

        function bal(a, dt = today(), ex) {
            let b = +a.initial;
            for (const t of D.tx) {
                if (t.date > dt || t.id === ex) continue;
                if (t.acc === a.id) b += t.type === 'income' ? t.amount : -t.amount;
                if (t.type === 'transfer' && t.to === a.id) b += t.amount
            }
            return Math.round(b * 100) / 100
        }
        const sorted = () => D.tx.map((transaction, index) => ({ transaction, index }))
            .sort((a, b) => b.transaction.date.localeCompare(a.transaction.date) ||
                (b.transaction.time || '').localeCompare(a.transaction.time || '') || b.index - a.index)
            .map(({ transaction }) => transaction);
        const sum = (L, ty) => L.filter(t => t.type === ty).reduce((s, t) => s + t.amount, 0);

        function rng() {
            const n = new Date();
            return [iso(new Date(n.getFullYear(), n.getMonth(), 1)), iso(new Date(n.getFullYear(), n.getMonth() + 1, 0))]
        }
        const IP = {
                wallet: '<rect x="3" y="6" width="18" height="14" rx="4"/><path d="M3 11h18M16.5 15.5h1"/>',
                banknote: '<rect x="3" y="7" width="18" height="10" rx="2.5"/><circle cx="12" cy="12" r="2.2"/>',
                landmark: '<path d="M3 9l9-5 9 5H3zM6 12v6M10 12v6M14 12v6M18 12v6M3 20h18"/>',
                smartphone: '<rect x="7" y="2.5" width="10" height="19" rx="3"/><path d="M11 18h2"/>',
                'piggy-bank': '<ellipse cx="11.5" cy="13" rx="8" ry="6"/><path d="M8 18.5V21M15 18.5V21M19.5 12.5l2-.5M9 7.5 10.5 5l2 2"/><circle cx="16" cy="11" r=".5"/>',
                'credit-card': '<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19M6 15h4"/>',
                coins: '<circle cx="9" cy="9" r="6"/><circle cx="16" cy="16" r="5"/>',
                tag: '<path d="M3 3h9l9 9-9 9-9-9z"/><circle cx="7.5" cy="7.5" r="1"/>',
                bus: '<rect x="4" y="3.5" width="16" height="14" rx="3"/><path d="M4 11h16M7 20v-2.5M17 20v-2.5"/><circle cx="8" cy="14.2" r=".6"/><circle cx="16" cy="14.2" r=".6"/>',
                utensils: '<path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 21V3c-2.5 1.5-3 5-3 8h3"/>',
                'shopping-cart': '<path d="M3 4h2.5l2 11h10l2-8H7"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>',
                cookie: '<circle cx="12" cy="12" r="9"/><circle cx="9" cy="9" r=".8"/><circle cx="15" cy="10" r=".8"/><circle cx="10" cy="15" r=".8"/><circle cx="15.5" cy="15.5" r=".8"/>',
                heart: '<path d="M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.2 12 20 12 20z"/>',
                'shopping-bag': '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
                home: '<path d="M3.5 11 12 4l8.5 7M6 9.5V20h12V9.5M10 20v-5h4v5"/>',
                zap: '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8z"/>',
                repeat: '<path d="M4 11V9a3 3 0 0 1 3-3h12l-3-3M20 13v2a3 3 0 0 1-3 3H5l3 3"/>',
                film: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M8 4v16M16 4v16M3 9h5M16 9h5M3 15h5M16 15h5"/>',
                activity: '<path d="M2.5 12h4l3-7 5 14 3-7h4"/>',
                shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/>',
                'trending-up': '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
                briefcase: '<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2M3 13h18"/>',
                laptop: '<rect x="5" y="5" width="14" height="10" rx="2"/><path d="M2.5 19h19"/>',
                gift: '<rect x="3.5" y="9" width="17" height="11" rx="2"/><path d="M3.5 13h17M12 9v11M12 9c-3 0-4.5-1-4.5-2.5S10 4 12 9zM12 9c3 0 4.5-1 4.5-2.5S14 4 12 9z"/>',
                calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
                'rotate-ccw': '<path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4.5h4.5"/>',
                'arrow-left-right': '<path d="M4 8h16l-3.5-3.5M20 16H4l3.5 3.5"/>',
                'arrow-left': '<path d="M19 12H5M12 19l-7-7 7-7"/>',
                'arrow-right': '<path d="M5 12h14M12 5l7 7-7 7"/>',
                'arrow-up': '<path d="M12 19V5M5 12l7-7 7 7"/>',
                'arrow-down': '<path d="M12 5v14M19 12l-7 7-7-7"/>',
                'arrow-down-up': '<path d="M7 20V4M4 7l3-3 3 3M17 4v16m-3-3 3 3 3-3"/>',
                'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
                'arrow-down-left': '<path d="M17 7 7 17M16 17H7V8"/>',
                'chevron-left': '<path d="m15 18-6-6 6-6"/>',
                'chevron-right': '<path d="m9 18 6-6-6-6"/>',
                'more-horizontal': '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
                settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2z"/>',
                car: '<path d="M4 16v-4l2-5h12l2 5v4M4 16h16M4 16v2.5M20 16v2.5"/><circle cx="7.5" cy="13.3" r=".7"/><circle cx="16.5" cy="13.3" r=".7"/>',
                book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
                plane: '<path d="M3 13l18-9-5 17-4-7-9-1z"/>',
                target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>',
                plus: '<path d="M12 5v14M5 12h14"/>',
                pencil: '<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1z"/>',
                'trash-2': '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
                gauge: '<path d="M4 17a8 8 0 1 1 16 0M12 17l4-5"/>',
                'file-text': '<path d="M6 3h8l4 4v14H6V3z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
                'bar-chart-3': '<path d="M5 20V10M12 20V4M19 20v-7"/>',
                save: '<path d="M5 3h11l3 3v15H5V3z"/><path d="M8 3v5h7V3M8 21v-7h8v7"/>',
                upload: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
                download: '<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',
                sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
                moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/>',
                eye: '<path d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="2.5"/>',
                check: '<path d="m5 12 4.5 4.5L19 7"/>',
                circle: '<circle cx="12" cy="12" r="8"/>',
                x: '<path d="m6 6 12 12M18 6 6 18"/>',
                'alert-triangle': '<path d="M12 4 21.5 20h-19L12 4zM12 10v4.5M12 17.5v.1"/>'
            },
            ic = n =>
            `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${IP[n]||'<circle cx="12" cy="12" r="2"/>'}</svg>`,
            ym = d => d.slice(0, 7),
            EM = Object.fromEntries(
                'wallet👛 banknote💵 landmark🏦 smartphone📱 piggy-bank🐷 credit-card💳 coins🪙 tag🏷️ bus🚌 utensils🍴 shopping-cart🛒 cookie🍪 heart💗 shopping-bag🛍️ home🏠 zap⚡ repeat🔁 film🎬 activity🏃 shield🛡️ trending-up📈 briefcase💼 laptop💻 gift🎁 calendar📅 rotate-ccw↩️ arrow-left-right⇄ car🚗 book📖 plane✈️ target🎯 plus➕ pencil✏️ trash-2🗑️ layout-dashboard📊 gauge⏱️ bar-chart-3📊 settings⚙️ sun☀️ moon🌙 file-text📄 save💾 upload⬆️ alert-triangle⚠️ layout-grid▦ receipt🧾 pie-chart◔'
                .split(' ').map(s => {
                    const i = s.search(/[^a-z0-9-]/);
                    return [s.slice(0, i), s.slice(i)]
                })),
            lu = () => {};

        let modalScrollPosition = 0,
            transactionFormReturnToChooser = false;
        function ov(h) {
            document.querySelectorAll('.pocket-select-overlay').forEach(menu => menu.remove());
            $('#ov').classList.remove('report-filter-open');
            $('#ovc').innerHTML = h;
            if (!document.body.classList.contains('pocket-modal-open')) {
                modalScrollPosition = window.scrollY || document.documentElement.scrollTop || 0;
                document.body.style.setProperty('--pocket-modal-scroll-top', `-${modalScrollPosition}px`)
            }
            document.body.classList.add('pocket-modal-open');
            $('#ov').style.display = 'flex';
            lu()
        }
        const cl = () => {
            document.querySelectorAll('.pocket-select-overlay').forEach(menu =>
                menu.closePicker ? menu.closePicker(false) : menu.remove());
            transactionFormReturnToChooser = false;
            $('#ov').style.display = 'none';
            $('#ov').classList.remove('form-open', 'report-filter-open', 'quick-add-open');
            const wasLocked = document.body.classList.contains('pocket-modal-open');
            document.body.classList.remove('pocket-modal-open');
            document.body.style.removeProperty('--pocket-modal-scroll-top');
            if (wasLocked) window.scrollTo(0, modalScrollPosition)
        };
        function closeFormToDashboard() {
            cl();
            go('dash');
        }

        function wireSelectPicker(select, trigger, label) {
            const updateTrigger = () => {
                const text = select.options[select.selectedIndex]?.textContent || '';
                trigger.textContent = text;
                trigger.setAttribute('aria-label', `${label}: ${text}`)
            };
            select.addEventListener('change', updateTrigger);
            trigger.addEventListener('click', () => {
                const overlay = document.createElement('div'),
                    menu = document.createElement('div'),
                    isTransactionFilter = Boolean(trigger.closest('.transaction-filters')),
                    isCashbackTransactionPicker = Boolean(trigger.closest('#f.pocket-cashback-form') && select.name === 'expenseId');
                overlay.className = 'pocket-select-overlay';
                menu.className = 'pocket-select-menu';
                if (isTransactionFilter) menu.classList.add('transaction-filter-menu');
                if (isCashbackTransactionPicker) {
                    overlay.classList.add('cashback-transaction-overlay');
                    menu.classList.add('cashback-transaction-picker');
                    menu.setAttribute('role', 'dialog');
                    menu.setAttribute('aria-modal', 'true');
                    menu.setAttribute('aria-labelledby', 'cashback-transaction-picker-title');
                } else {
                    menu.setAttribute('role', 'listbox');
                    menu.setAttribute('aria-label', label);
                }
                let closing = false;
                const closePicker = (restoreFocus = true) => {
                    window.removeEventListener('scroll', closeOnScroll, true);
                    window.removeEventListener('resize', closeOnResize);
                    if (!overlay.isConnected || closing) return;
                    closing = true;
                    menu.classList.add('is-closing');
                    trigger.setAttribute('aria-expanded', 'false');
                    window.setTimeout(() => overlay.remove(),
                        window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 140);
                    if (restoreFocus && trigger.isConnected) trigger.focus({ preventScroll: true })
                };
                const closeOnScroll = event => {
                    if (!menu.contains(event.target)) closePicker(false)
                };
                const closeOnResize = () => {
                    if (isCashbackTransactionPicker) {
                        menu.style.maxHeight = `${Math.min(window.innerHeight * .76, 640)}px`;
                        return;
                    }
                    closePicker(false)
                };
                overlay.closePicker = closePicker;
                overlay.addEventListener('click', event => {
                    if (event.target === overlay) closePicker()
                });
                let optionsList = menu,
                    searchInput,
                    noResults;
                if (isCashbackTransactionPicker) {
                    const header = document.createElement('div'),
                        heading = document.createElement('div'),
                        eyebrow = document.createElement('small'),
                        title = document.createElement('h2'),
                        closeButton = document.createElement('button'),
                        search = document.createElement('label'),
                        searchIcon = document.createElement('span');
                    header.className = 'cashback-transaction-picker-header';
                    heading.className = 'cashback-transaction-picker-heading';
                    eyebrow.textContent = 'TRACK A RETURN';
                    title.id = 'cashback-transaction-picker-title';
                    title.textContent = 'Choose transaction';
                    closeButton.type = 'button';
                    closeButton.className = 'cashback-transaction-picker-close';
                    closeButton.setAttribute('aria-label', 'Close transaction picker');
                    closeButton.innerHTML = ic('x');
                    search.className = 'cashback-transaction-picker-search';
                    searchIcon.setAttribute('aria-hidden', 'true');
                    searchIcon.innerHTML = ic('search');
                    searchInput = document.createElement('input');
                    searchInput.type = 'search';
                    searchInput.placeholder = 'Search transactions';
                    searchInput.setAttribute('aria-label', 'Search transactions');
                    searchInput.autocomplete = 'off';
                    optionsList = document.createElement('div');
                    optionsList.className = 'cashback-transaction-picker-options';
                    optionsList.setAttribute('role', 'listbox');
                    optionsList.setAttribute('aria-label', label);
                    noResults = document.createElement('p');
                    noResults.className = 'cashback-transaction-picker-empty';
                    noResults.setAttribute('role', 'status');
                    noResults.textContent = 'No matching transactions.';
                    noResults.hidden = true;
                    heading.append(eyebrow, title);
                    header.append(heading, closeButton);
                    search.append(searchIcon, searchInput);
                    menu.append(header, search, optionsList, noResults);
                    closeButton.addEventListener('click', () => closePicker());
                }
                const availableOptions = Array.from(select.options).filter(option => !option.disabled);
                availableOptions.forEach(option => {
                    const item = document.createElement('button');
                    item.type = 'button';
                    item.className = 'pocket-select-option';
                    item.setAttribute('role', 'option');
                    item.setAttribute('aria-selected', String(option.value === select.value));
                    item.textContent = option.textContent;
                    item.addEventListener('click', () => {
                        select.value = option.value;
                        closePicker();
                        select.dispatchEvent(new Event('change', { bubbles: true }))
                    });
                    optionsList.append(item)
                });
                if (isCashbackTransactionPicker) {
                    searchInput.addEventListener('input', () => {
                        const query = searchInput.value.trim().toLocaleLowerCase();
                        let matchCount = 0;
                        optionsList.querySelectorAll('.pocket-select-option').forEach(item => {
                            item.hidden = !item.textContent.toLocaleLowerCase().includes(query);
                            if (!item.hidden) matchCount += 1
                        });
                        noResults.hidden = matchCount > 0
                    })
                }
                menu.addEventListener('keydown', event => {
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        closePicker()
                    } else if (isCashbackTransactionPicker && event.target === searchInput) {
                        if (event.key === 'ArrowDown') {
                            const firstOption = optionsList.querySelector('.pocket-select-option:not([hidden])');
                            if (firstOption) {
                                event.preventDefault();
                                firstOption.focus()
                            }
                        }
                    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
                        const items = Array.from(optionsList.querySelectorAll('.pocket-select-option:not([hidden])')),
                            index = items.indexOf(document.activeElement),
                            next = event.key === 'Home' ? 0 :
                                event.key === 'End' ? items.length - 1 :
                                    (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
                        if (items.length) {
                            event.preventDefault();
                            items[next].focus()
                        }
                    }
                });
                const bounds = trigger.getBoundingClientRect(),
                    viewportWidth = document.documentElement.clientWidth || window.innerWidth,
                    minWidth = isTransactionFilter ? Math.min(220, viewportWidth - 16) : bounds.width,
                    width = Math.min(Math.max(bounds.width, minWidth), viewportWidth - 16),
                    left = Math.max(8, Math.min(bounds.left, viewportWidth - width - 8)),
                    availableHeight = Math.max(80, window.innerHeight - bounds.bottom - 8);
                if (isCashbackTransactionPicker) {
                    menu.style.position = 'relative';
                    menu.style.left = 'auto';
                    menu.style.top = 'auto';
                    menu.style.width = '100%';
                    menu.style.maxHeight = `${Math.min(window.innerHeight * .76, 640)}px`
                } else {
                    menu.style.left = `${left}px`;
                    menu.style.top = `${bounds.bottom + 4}px`;
                    menu.style.width = `${width}px`;
                    menu.style.maxHeight = `${Math.min(220, availableHeight)}px`
                }
                overlay.append(menu);
                document.body.append(overlay);
                window.addEventListener('scroll', closeOnScroll, true);
                window.addEventListener('resize', closeOnResize);
                trigger.setAttribute('aria-expanded', 'true');
                const selectedButton = availableOptions.find(option => option.value === select.value);
                const initialOption = selectedButton && Array.from(optionsList.children)
                    .find(button => button.textContent === selectedButton.textContent) ||
                    (isCashbackTransactionPicker ? optionsList.querySelector('.pocket-select-option') : menu.querySelector('button'));
                if (isCashbackTransactionPicker) {
                    if (window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0) {
                        menu.querySelector('.cashback-transaction-picker-close').focus({ preventScroll: true })
                    } else {
                        searchInput.focus({ preventScroll: true })
                    }
                    if (initialOption) optionsList.scrollTop = initialOption.offsetTop - optionsList.offsetTop
                } else {
                    (initialOption || trigger).focus();
                    if (initialOption) menu.scrollTop = initialOption.offsetTop
                }
            })
        }

        function wireRenderedSelects(root) {
            root.querySelectorAll('select').forEach(select => {
                if (select.hidden) return;
                const selected = select.options[select.selectedIndex],
                    label = select.getAttribute('aria-label') || 'Choose an option',
                    trigger = document.createElement('button');
                trigger.type = 'button';
                trigger.className = 'form-select-trigger';
                trigger.setAttribute('aria-haspopup', 'listbox');
                trigger.setAttribute('aria-expanded', 'false');
                trigger.textContent = selected?.textContent || '';
                trigger.setAttribute('aria-label', `${label}: ${trigger.textContent}`);
                select.hidden = true;
                select.setAttribute('aria-hidden', 'true');
                select.tabIndex = -1;
                select.insertAdjacentElement('afterend', trigger);
                wireSelectPicker(select, trigger, label)
            })
        }

        function ask(msg, fn, ok = 'Delete') {
            window._f = () => {
                cl();
                fn();
                save();
                render()
            };
            ov(`<h3>${msg}</h3><div class="row end"><button class="b2" onclick="cl()">Cancel</button><button class="b1" style="background:var(--ex)" onclick="_f()">${ok}</button></div>`)
        }
        const info = m => ov(`<h3>${m}</h3><div class="row end"><button class="b1" onclick="cl()">OK</button></div>`);

        window.PocketFormScreenHeader = ({ back = 'close', close = 'dashboard', shoppingList = false } = {}) => {
            const backActions = {
                close: { handler: 'cl()', label: 'Back' },
                transaction: { handler: 'backFromTransactionForm()', label: 'Back' },
                shoppingLists: { handler: 'closeShoppingList()', label: 'Back to all lists' }
            };
            const closeActions = {
                dashboard: { handler: 'closeFormToDashboard()', label: 'Close' },
                shoppingDashboard: { handler: 'closeShoppingListToDashboard()', label: 'Go to Dashboard' }
            };
            if (!Object.prototype.hasOwnProperty.call(backActions, back) ||
                !Object.prototype.hasOwnProperty.call(closeActions, close)) {
                throw new TypeError('Form screen headers require supported back and close actions.');
            }
            const headerClass = shoppingList ? ' shopping-list-screen-header' : '',
                backButton = backActions[back],
                closeButton = closeActions[close];
            return `<div class="form-screen-header${headerClass}"><button type="button" class="form-screen-arrow" aria-label="${backButton.label}" onclick="${backButton.handler}">${ic('arrow-left')}</button><span>Pocket</span><button type="button" class="form-screen-close" aria-label="${closeButton.label}" onclick="${closeButton.handler}">${ic('x')}</button></div>`;
        };

        function openForm(title, fn, vals, submit, rr, saveLabel = 'Save') {
            const f = fn(vals).filter(Boolean);
            const isTransactionForm = title === 'Add transaction' || title === 'Edit transaction';
            const isAccountForm = title === 'Add account' || title === 'Edit account';
            const isBudgetForm = title === 'Set budget' || title === 'Edit budget';
            const isCashbackForm = title === 'Track cashback' || title === 'Edit cashback';
            const isRecurringForm = title === 'New recurring transaction' || title === 'Edit recurring transaction';
            const isGoalForm = title === 'New savings goal' || title === 'Edit goal';
            const formCopy = {
                'Add account': ['EVERY PESO HAS A PLACE', ''],
                'Edit account': ['EVERY BALANCE, TOGETHER', 'Update your account details.'],
                'Set budget': ['GIVE YOUR SPENDING A LIMIT', 'Choose a category and decide how much to set aside each month.'],
                'Edit budget': ['GIVE YOUR SPENDING A LIMIT', 'Update your monthly category limit.'],
                'New recurring transaction': ['SET IT ONCE. STAY ON TRACK.', 'Schedule a regular transaction.'],
                'Edit recurring transaction': ['SET IT ONCE. STAY ON TRACK.', 'Update this recurring schedule.'],
                'New savings goal': ['MAKE ROOM FOR WHAT MATTERS', 'Give your goal a name, a target, and a little momentum.'],
                'Edit goal': ['MAKE ROOM FOR WHAT MATTERS', 'Update your goal and its timeline.'],
                'Add money to goal': ['A LITTLE CLOSER EACH TIME', 'Choose how much to add to your savings goal.'],
                'Name your list': ['BUY WITH A PLAN', 'Create a list for your next shopping trip.'],
                'Edit shopping list': ['BUY WITH A PLAN', 'Update the name of this shopping list.'],
                'Add item': ['CHECK IT OFF AS YOU GO', 'Add an item and its estimated cost.'],
                'Edit item': ['CHECK IT OFF AS YOU GO', 'Update this shopping list item.'],
                'Record shopping expense': ['CLOSE THE LOOP', 'Record what you spent on this shopping list.'],
                'New category': ['MAKE IT YOURS', 'Add a category to organize your transactions.'],
                'Edit category': ['MAKE IT YOURS', 'Update this transaction category.'],
                'Add transaction': ['KEEP YOUR MONEY UP TO DATE', 'Enter the details of this transaction.'],
                'Edit transaction': ['KEEP YOUR MONEY UP TO DATE', 'Update the transaction details.'],
                'Track cashback': ['EVERY PESO COMES BACK', 'Track the cashback you expect to receive.'],
                'Edit cashback': ['EVERY PESO COMES BACK', 'Update the expected amount or deposit account.']
            }[title] || ['MAKE IT YOURS', 'Enter the details below.'];
            let displayTitle = title,
                displayEyebrow = formCopy[0],
                displayDescription = formCopy[1],
                displaySaveLabel = saveLabel;
            if (title === 'Add account') {
                displayTitle = 'Add an account';
                displaySaveLabel = 'Save account'
            }
            if (isBudgetForm) {
                displayTitle = title === 'Set budget' ? 'Set a budget' : title;
                displaySaveLabel = 'Save budget'
            }
            if (isRecurringForm) {
                displayDescription = '';
                displaySaveLabel = 'Save schedule'
            }
            if (title === 'Add transaction' || title === 'Edit transaction') {
                const transactionType = vals?.type || 'expense';
                displayTitle = transactionType === 'income' ? 'Add income' : transactionType === 'transfer' ? 'Transfer money' : 'Add expense';
                displayEyebrow = transactionType === 'income' ? 'SOMETHING GOOD CAME IN' : transactionType === 'transfer' ? 'SAME MONEY, A NEW PLACE' : 'TRACK YOUR SPENDING';
                displayDescription = '';
                displaySaveLabel = transactionType === 'income' ? 'Save income' : transactionType === 'transfer' ? 'Save transfer' : 'Save expense';
            }
            const fld = x => {
                const v = vals[x.k] ?? '',
                    selectedOption = x.t === 'sel' && x.o.find(o => o[0] == v),
                    emptyOption = x.t === 'sel' && x.o.find(o => o[0] === ''),
                    label = x.l.replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase(),
                    placeholder = x.t === 'sel' && (x.placeholder || (!selectedOption && !emptyOption ? `Choose ${label}` : '')),
                    optionSelected = option => selectedOption ? option[0] == v : !placeholder && option[0] === '';
                const i = x.t === 'icons' ?
                    isAccountForm ?
                    `<input type="hidden" name="${x.k}" value="${esc(v)}"><div class="account-icon-row"><span class="account-icon-preview">${ic(v||'wallet')}</span><span class="account-icon-name">${esc(String(v||'wallet').split('-').map(part=>part.charAt(0).toUpperCase()+part.slice(1)).join(' '))}</span><button type="button" class="account-icon-trigger" onclick="tg(this)">Change icon <span aria-hidden="true">→</span></button></div><div class="ip" hidden>${ICONS.map(o=>`<button type="button" class="ib${o[0]==v?' sel':''}" onclick="pick(this,'${o[0]}')">${ic(o[0])}</button>`).join('')}</div>` :
                    `<input type="hidden" name="${x.k}" value="${esc(v)}"><button type="button" class="b2 it" onclick="tg(this)"><span>${ic(v||'tag')}</span> Change icon</button><div class="ip" hidden>${ICONS.map(o=>`<button type="button" class="ib${o[0]==v?' sel':''}" onclick="pick(this,'${o[0]}')">${ic(o[0])}</button>`).join('')}</div>` :
                    x.t === 'direction' ?
                    `<div class="transfer-direction" aria-hidden="true"><span>Move to</span>${ic('repeat')}</div>` :
                    x.t === 'sel' && x.k === 'type' && (title === 'Add transaction' || title === 'Edit transaction') ?
                    `<select name="${x.k}" hidden aria-hidden="true" tabindex="-1">${x.o.map(o=>`<option value="${o[0]}"${o[0]==v?' selected':''}>${esc(o[1])}</option>`).join('')}</select><div class="form-type-tabs" role="tablist" aria-label="Transaction type">${x.o.map(o=>`<button type="button" role="tab" aria-selected="${o[0]==v}" class="${o[0]==v?'is-active':''}" onclick="switchTransactionType('${o[0]}')">${esc(o[1])}</button>`).join('')}</div>` :
                    x.t === 'sel' ?
                    `<select name="${x.k}"${x.req?' required':''} hidden aria-hidden="true" tabindex="-1">${placeholder?`<option value=""${!selectedOption?' selected':''}${x.req?' disabled':''}>${esc(placeholder)}</option>`:''}${x.o.map(o=>`<option value="${o[0]}"${optionSelected(o)?' selected':''}>${esc(o[1])}</option>`).join('')}</select><button type="button" class="form-select-trigger" data-select-name="${x.k}" data-select-label="${esc(x.l)}" aria-label="${esc(x.l)}: ${esc(selectedOption?.[1] || (emptyOption && !placeholder ? emptyOption[1] : placeholder) || '')}" aria-haspopup="listbox" aria-expanded="false">${esc(selectedOption?.[1] || (emptyOption && !placeholder ? emptyOption[1] : placeholder) || '')}</button>` :
                    x.t === 'color' ?
                    `<div class="color-picker"><div class="color-swatches" role="group" aria-label="${esc(x.l)} presets">${FORM_COLORS.map(color=>`<button type="button" class="color-swatch" data-color="${color}" style="--form-swatch:${color}" aria-label="${color}" aria-pressed="${String(v).toLowerCase()===color}"></button>`).join('')}</div><div class="color-code-row${isAccountForm?' account-color-code-row':''}"><span class="color-preview" aria-hidden="true" style="--form-swatch:${okCol(v)?v:'#2563eb'}"></span>${isAccountForm?'<div class="account-color-code"><span>Hex color</span>':''}<input class="color-hex-input" name="${x.k}" type="text" value="${esc(v)}" maxlength="7" spellcheck="false" autocapitalize="characters" aria-label="${esc(x.l)} hex code" placeholder="#2563eb">${isAccountForm?'</div>':''}</div>${isAccountForm?'':'<small>Choose a swatch or enter a 6-digit hex code.</small>'}</div>` :
                    x.t === 'date' ?
                    `<span class="date-input-wrap${v ? '' : ' is-empty'}"><input name="${x.k}" type="date" value="${esc(v)}" onchange="syncDateInput(this)"><span class="date-input-value">${esc(fd(v))}</span><span class="date-input-placeholder">${esc(x.placeholder || 'Choose date')}</span></span>` :
                    x.t === 'area' ? `<textarea name="${x.k}" rows="2">${esc(v)}</textarea>` :
                    isBudgetForm && x.k === 'amt' ?
                    `<span class="budget-amount-input"><span aria-hidden="true">₱</span><input name="${x.k}" type="number" step="0.01" value="${esc(v)}" placeholder="0.00" aria-label="Monthly budget amount"></span>` :
                    isGoalForm && (x.k === 'target' || x.k === 'current') ?
                    `<span class="goal-amount-input"><span aria-hidden="true">₱</span><input name="${x.k}" type="number" step="0.01" value="${esc(v)}" placeholder="0.00"></span>` :
                    x.k === 'amount' ?
                    `<span class="amount-input-wrap"><span class="amount-currency">₱</span><input name="${x.k}" type="text" inputmode="decimal" value="${esc(v)}" placeholder="0.00"></span>` :
                    `<input name="${x.k}" type="${x.t||'text'}" value="${esc(v)}" ${x.t==='number'?'step="0.01"':''}${x.placeholder?` placeholder="${esc(x.placeholder)}"`:''}${x.k==='title'?(isRecurringForm?' placeholder="Name this transaction"':vals.type==='income'?' placeholder="Where did it come from?"':vals.type==='transfer'?' placeholder="Name this transfer"':' placeholder="What was it for?"'):''}${x.k==='cashbackAmount'?' placeholder="₱0.00"':''}${x.k==='note'?' placeholder="Add a note..."':''}>`;
                return `<label data-field="${esc(x.k)}"${x.cls?` class="${esc(x.cls)}"`:''}>${isAccountForm&&(x.k==='icon'||x.hideLabel)?'':x.l}${x.req&&!x.noMark?' *':''}${i}${x.help?`<small class="form-field-help">${esc(x.help)}</small>`:''}</label>`
            };
            const formError = '<p class="er" id="er" role="alert" hidden></p>',
                hasCashbackTransactionField = isCashbackForm && f.some(field => field.k === 'expenseId');
            const formFields = isAccountForm ?
                `<div class="form-fields account-form-fields">${f.slice(0, 2).map(fld).join('')}<section class="account-form-card account-balance-card">${f.slice(2, 3).map(fld).join('')}</section><section class="account-form-card account-color-card"><div class="account-color-heading"><span>Account color</span><button type="button" class="account-color-toggle" aria-label="Collapse account color section" aria-expanded="true" aria-controls="account-color-options" onclick="toggleAccountColor(this)">${ic('arrow-up')}</button></div><div class="account-color-fields" id="account-color-options">${f.slice(3).map(x=>fld(x.k==='color'?{...x,hideLabel:true}:x)).join('')}</div></section></div>` :
                isBudgetForm ?
                `<div class="form-fields budget-form-fields"><section class="budget-form-card">${f.map(fld).join('')}</section>${formError}<section class="budget-form-note"><div><b>A plan, not a restriction.</b><p>Budgets are flexible, and you can adjust them whenever your priorities change.</p></div></section></div>` :
                isCashbackForm ?
                `<div class="form-fields">${f.map(field => `${fld(field)}${field.k === 'expenseId' ? formError : ''}`).join('')}</div>` :
                isGoalForm ?
                `<div class="form-fields goal-form-fields">${f.slice(0, 1).map(fld).join('')}<section class="goal-form-amount-card">${f.slice(1, 3).map(fld).join('')}</section>${f.slice(3).map(fld).join('')}</div>` :
                `<div class="form-fields">${f.map(fld).join('')}</div>`;
            const formClasses = [
                isAccountForm ? 'pocket-account-form' : '',
                isBudgetForm ? 'pocket-budget-form' : '',
                isGoalForm ? 'pocket-goal-form' : '',
                isCashbackForm ? 'pocket-cashback-form' : '',
                isRecurringForm ? 'pocket-recurring-form' : '',
                isTransactionForm || title === 'Record shopping expense' ? 'pocket-transaction-form' : ''
            ].filter(Boolean).join(' ');
            const formActions = isBudgetForm || isRecurringForm || isGoalForm ?
                `<button type="button" class="b1" id="sv">${esc(displaySaveLabel)}</button><button type="button" class="b2" onclick="cl()">Cancel</button>` :
                `<button type="button" class="b2" onclick="cl()">Cancel</button><button type="button" class="b1" id="sv">${esc(displaySaveLabel)}</button>`;
            ov(
            `<div id="f"${formClasses ? ` class="${formClasses}"` : ''}>${window.PocketFormScreenHeader({ back: isTransactionForm ? 'transaction' : 'close' })}<div class="form-screen-intro"><small class="form-eyebrow">${esc(displayEyebrow)}</small><h3>${esc(displayTitle)}</h3>${displayDescription?`<p>${esc(displayDescription)}</p>`:''}</div>${formFields}${isBudgetForm || hasCashbackTransactionField ? '' : formError}<div class="row end">${formActions}</div></div>`);
            $('#ov').classList.add('form-open');
            const F = $('#f'),
                el = k => F.querySelector('[name="' + k + '"]'),
                get = () => {
                    const o = {};
                    f.forEach(x => {
                        const field = el(x.k);
                        o[x.k] = field ? field.value.trim() : '';
                    });
                    return o
                },
                er = m => {
                    const error = $('#er');
                    error.textContent = m;
                    error.hidden = false
                };
            F.querySelectorAll('.form-select-trigger').forEach(trigger => {
                if (isCashbackForm && trigger.dataset.selectName === 'expenseId') {
                    trigger.setAttribute('aria-haspopup', 'dialog')
                }
                wireSelectPicker(el(trigger.dataset.selectName), trigger, trigger.dataset.selectLabel)
            });
            F.querySelectorAll('.color-picker').forEach(picker => {
                const input = picker.querySelector('.color-hex-input'),
                    preview = picker.querySelector('.color-preview'),
                    swatches = Array.from(picker.querySelectorAll('.color-swatch')),
                    syncColor = () => {
                        const value = input.value.toLowerCase();
                        swatches.forEach(swatch => swatch.setAttribute('aria-pressed', String(swatch.dataset.color === value)));
                        preview.style.setProperty('--form-swatch', okCol(value) ? value : 'transparent')
                    };
                swatches.forEach(swatch => swatch.addEventListener('click', () => {
                    input.value = swatch.dataset.color;
                    syncColor()
                }));
                input.addEventListener('input', syncColor)
            });
            if (rr) el(rr).onchange = () => openForm(title, fn, {
                ...vals,
                ...get()
            }, submit, rr, saveLabel);
            const go2 = () => {
                const v = get();
                for (const x of f) {
                    if (x.req && !v[x.k]) return er(x.l + ' is required');
                    if (x.t === 'number' && v[x.k] !== '') {
                        const n = +v[x.k];
                        if (isNaN(n)) return er(x.l + ' must be a number');
                        if (!x.neg && n < 0) return er(x.l + ' can’t be negative');
                        if (x.pos && n <= 0) return er(x.l + ' must be greater than 0')
                    }
                    if (x.t === 'color' && !okCol(v[x.k])) return er(x.l + ' must be a 6-digit hex color, such as #2563eb');
                }
                const m = submit(v);
                if (m) return er(m);
                cl();
                save();
                render()
            };
            $('#sv').onclick = go2;
            F.onkeydown = e => {
                if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && !e.target.matches('.form-select-trigger')) {
                    e.preventDefault();
                    go2()
                }
            }
        }

        function txForm(id) {
            window._dup = '';
            const t = id ? D.tx.find(x => x.id === id) : null;
            const linkedCashback = t && D.cashbacks.find(claim => claim.expenseId === t.id);
            openForm(t ? 'Edit transaction' : 'Add transaction', v => {
                    const tr = v.type === 'transfer',
                        ac = D.acc.map(a => [a.id, a.name]);
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
                        }, ...((v.type === 'expense' || v.type === 'transfer') ? [{
                            k: 'title',
                            l: 'Title',
                            cls: 'form-field-full',
                            req: v.type === 'expense'
                        }, {
                            k: 'cashbackAmount',
                            l: 'Cashback (optional)',
                            t: 'text',
                            cls: 'form-field-full'
                        }] : [{
                            k: 'title',
                            l: 'Title',
                            cls: 'form-field-full',
                            req: true
                        }]),
                        tr ? {
                            k: 'acc',
                            l: 'From account',
                            t: 'sel',
                            req: 1,
                            cls: 'form-field-full',
                            o: ac
                        } : null,
                        tr ? {
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
                            o: D.cats.filter(c => v.type === 'income' ? c.g === 'Income' : c.g !== 'Income')
                                .map(c => [c.id, c.name])
                        },
                        tr ? {
                            k: 'to',
                            l: 'To account',
                            t: 'sel',
                            req: 1,
                            cls: 'form-field-full',
                            o: ac
                        } : {
                            k: 'acc',
                            l: 'Account',
                            t: 'sel',
                            req: 1,
                            cls: 'form-field-pair',
                            placeholder: 'Choose account',
                            o: ac
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
                t ? { ...t, cashbackAmount: linkedCashback?.amount || '' } : {
                    type: 'expense',
                    date: today(),
                    time: '',
                    acc: '',
                    to: 'gcash',
                    cashbackAmount: '0.00'
                }, v => {
                    const amt = +v.amount,
                        tr = v.type === 'transfer',
                        title = v.title || 'Transfer';
                    const cashbackAmount = +v.cashbackAmount || 0;
                    if (cashbackAmount > 0 && v.type !== 'expense' && v.type !== 'transfer') return 'Cashback can only be added to an expense or transfer.';
                    if (cashbackAmount > amt) return 'Cashback can’t exceed the transaction amount.';
                    if (cashbackAmount > 0 && !A(tr ? v.to : v.acc)) return 'Choose an account for the cashback deposit.';
                    if (linkedCashback && v.type !== 'expense' && v.type !== 'transfer') return 'Remove the linked cashback claim before changing this transaction type.';
                    if (linkedCashback && cashbackAmount > 0 && amt < cashbackAmount) return 'This transaction amount is below its cashback claim.';
                    if (tr) {
                        if (v.acc === v.to) return 'Choose two different accounts';
                        const a = A(v.acc),
                            b = bal(a, today(), id);
                        if (!od(a) && b < amt) return `Insufficient funds in ${a.name} (${peso(b)} available)`
                    }
                    const sig = [v.type, amt, v.date, v.acc, title, tr ? v.to : ''].join('|');
                    if (!t && window._dup !== sig && D.tx.some(x => x.type === v.type && x.amount === amt && x
                            .date === v.date && x.acc === v.acc && x.title === title && (x.to || '') === (tr ? v
                                .to : ''))) return window._dup = sig,
                        'Looks like a duplicate. Tap Save again to add it anyway.';
                    const o = {
                        id: t ? t.id : uid(),
                        type: v.type,
                        title,
                        amount: amt,
                        cat: tr ? 'c_transfers' : v.cat,
                        acc: v.acc,
                        to: tr ? v.to : null,
                        date: v.date,
                        time: v.time || t?.time || '',
                        note: v.note,
                        ...(t?.cashbackId ? { cashbackId: t.cashbackId } : {})
                    };
                    if (linkedCashback) {
                        linkedCashback.expenseTitle = title;
                        linkedCashback.expenseDate = v.date;
                        linkedCashback.account = tr ? v.to : v.acc;
                        if (cashbackAmount > 0) linkedCashback.amount = cashbackAmount;
                        else D.cashbacks = D.cashbacks.filter(claim => claim.id !== linkedCashback.id)
                    }
                    t ? Object.assign(t, o) : D.tx.push(o);
                    if (!linkedCashback && (v.type === 'expense' || v.type === 'transfer') && cashbackAmount > 0) {
                        D.cashbacks.push({
                            id: uid(),
                            expenseId: o.id,
                            expenseTitle: title,
                            expenseDate: v.date,
                            amount: cashbackAmount,
                            account: tr ? v.to : v.acc,
                            created: today(),
                            status: 'pending',
                            receivedDate: '',
                            incomeId: ''
                        })
                    }
                }, 'type')
        }

        function quickAdd(type, returnToChooser = false) {
            transactionFormReturnToChooser = returnToChooser;
            txForm();
            const t = document.querySelector('#f [name="type"]');
            if (t) {
                t.value = type;
                t.onchange && t.onchange();
            }
        }

        function switchTransactionType(type) {
            const select = document.querySelector('#f [name="type"]');
            if (!select) return;
            select.value = type;
            select.onchange && select.onchange();
        }

        function quickAddChooser() {
            ov(`<div class="quick-add-screen"><div class="form-screen-intro quick-add-intro"><button type="button" class="page-menu-toggle quick-add-page-menu-toggle" aria-label="Open pages menu" aria-expanded="false" aria-haspopup="dialog" aria-controls="page-title-menu">${dashboardIcon('more')}</button><small class="form-eyebrow">KEEP YOUR MONEY UP TO DATE</small><h3>Add transaction</h3><p>What would you like to record?</p></div><div class="quick-add-options"><button type="button" onclick="quickAddFromChooser('expense')"><span class="quick-add-icon expense">${ic('arrow-up-right')}</span><span><b>Expense</b><small>Track a purchase or payment.</small></span>${ic('chevron-right')}</button><button type="button" onclick="quickAddFromChooser('income')"><span class="quick-add-icon income">${ic('arrow-down-left')}</span><span><b>Income</b><small>Record money you received.</small></span>${ic('chevron-right')}</button><button type="button" onclick="quickAddFromChooser('transfer')"><span class="quick-add-icon transfer">${ic('arrow-left-right')}</span><span><b>Transfer</b><small>Move money between accounts.</small></span>${ic('chevron-right')}</button></div><div class="quick-add-footer"><button type="button" class="b2" onclick="cl()">Cancel</button></div></div>`);
            bindPageMenuToggle(document.querySelector('.quick-add-page-menu-toggle'));
            $('#ov').classList.add('quick-add-open')
        }

        function quickAddFromChooser(type) {
            cl();
            quickAdd(type, true);
        }

        function backFromTransactionForm() {
            const returnToChooser = transactionFormReturnToChooser;
            cl();
            if (returnToChooser) quickAddChooser();
        }

        function primaryAdd() {
            if (U.v === 'acc') accForm();
            else if (U.v === 'bud') budForm();
            else if (U.v === 'cash') cashbackForm();
            else if (U.v === 'shop') shoppingListForm();
            else quickAddChooser()
        }

        function dashboardSettingsForm() {
            const options = DASHBOARD_WIDGETS.map(([id, label]) =>
                `<label class="dashboard-widget-option"><input type="checkbox" data-dashboard-widget="${id}"${D.dashboardWidgets[id]?' checked':''}><span>${label}</span></label>`
            ).join('');
            ov(`<h3>Customize Dashboard</h3><small>Choose which sections to show on your Dashboard.</small><div class="dashboard-widget-list">${options}</div><div class="row end"><button class="b2" onclick="cl()">Cancel</button><button class="b1" onclick="saveDashboardSettings()">Save</button></div>`);
        }

        function saveDashboardSettings() {
            D.dashboardWidgets = Object.fromEntries([...document.querySelectorAll('[data-dashboard-widget]')]
                .map(input => [input.dataset.dashboardWidget, input.checked]));
            cl();
            save();
            render()
        }

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
                    o: eligibleTransactions.map(item => [item.id, `${item.title} · ${fd(item.date)} · ${peso(item.amount)}`])
                },
                { k: 'amount', l: 'Expected cashback (₱)', t: 'number', req: 1, pos: 1 },
                { k: 'account', l: 'Deposit account', t: 'sel', req: 1, o: D.acc.map(account => [account.id, account.name]) }
            ], {
                expenseId: transactionId || '',
                amount: '',
                account: transaction ? transaction.type === 'transfer' ? transaction.to : transaction.acc : ''
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
                { k: 'account', l: 'Deposit account', t: 'sel', req: 1, o: D.acc.map(account => [account.id, account.name]) }
            ], {
                amount: String(claim.amount),
                account: claim.account
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
                    claim.incomeId = income.id;
                    income.amount = amount;
                    income.acc = value.account;
                    income.title = `Cashback — ${claim.expenseTitle || transaction?.title || 'Expense'}`;
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
            const expense = D.tx.find(item => item.id === claim.expenseId);
            const income = {
                id: uid(),
                type: 'income',
                title: `Cashback — ${claim.expenseTitle || expense?.title || 'Expense'}`,
                amount: claim.amount,
                cat: incomeCategory.id,
                acc: claim.account,
                to: null,
                date: today(),
                time: '',
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

        const RECURRENCES = [
            ['daily', 'Every day'],
            ['weekly', 'Every week'],
            ['monthly', 'Every month']
        ];
        const dayNumber = date => Number(date.slice(8, 10));
        const shiftDate = (date, frequency, scheduledDay) => {
            const [year, month, day] = date.split('-').map(Number);
            if (frequency === 'daily') return iso(new Date(year, month - 1, day + 1));
            if (frequency === 'weekly') return iso(new Date(year, month - 1, day + 7));
            const nextMonth = new Date(year, month, 1);
            const lastDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
            return iso(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), Math.min(scheduledDay, lastDay)));
        };
        const firstOccurrenceOnOrAfter = (start, frequency, target) => {
            const scheduledDay = dayNumber(start);
            let date = start;
            while (date < target) date = shiftDate(date, frequency, scheduledDay);
            return date;
        };

        function processRecurring() {
            let added = 0;
            for (const rule of D.recurring || []) {
                if (!rule.active || !okD(rule.next) || !A(rule.acc)) continue;
                while (rule.next <= today()) {
                    if (rule.type === 'transfer' && (!A(rule.to) || rule.acc === rule.to)) break;
                    if (rule.type === 'transfer' && !od(A(rule.acc)) && bal(A(rule.acc)) < rule.amount) break;
                    const dueDate = rule.next;
                    const exists = D.tx.some(t => t.recurringId === rule.id && t.recurringDate === dueDate);
                    if (!exists) {
                        D.tx.push({
                            id: uid(),
                            type: rule.type,
                            title: rule.title || 'Transfer',
                            amount: rule.amount,
                            cat: rule.type === 'transfer' ? 'c_transfers' : rule.cat,
                            acc: rule.acc,
                            to: rule.type === 'transfer' ? rule.to : null,
                            date: dueDate,
                            time: rule.time || '',
                            note: rule.note || '',
                            recurringId: rule.id,
                            recurringDate: dueDate
                        });
                        added++;
                    }
                    rule.next = shiftDate(dueDate, rule.frequency, rule.day || dayNumber(rule.start));
                }
            }
            return added;
        }

        function recurringForm(id) {
            const rule = id ? D.recurring.find(item => item.id === id) : null;
            const initial = rule || {
                type: 'expense',
                title: '',
                amount: '',
                frequency: 'monthly',
                start: today(),
                acc: D.acc[0]?.id || '',
                to: D.acc[1]?.id || D.acc[0]?.id || '',
                cat: D.cats.find(category => category.g !== 'Income')?.id || '',
                note: '',
                time: ''
            };
            openForm(rule ? 'Edit recurring transaction' : 'New recurring transaction', v => {
                const transfer = v.type === 'transfer';
                const accounts = D.acc.map(account => [account.id, account.name]);
                return [{
                    k: 'type', l: 'Type', t: 'sel', cls: 'form-field-full', o: [
                        ['expense', 'Expense'], ['income', 'Income'], ['transfer', 'Transfer']
                    ]
                }, {
                    k: 'title', l: 'Title', req: !transfer, cls: 'form-field-full'
                }, {
                    k: 'amount', l: 'Amount (₱)', t: 'number', req: 1, pos: 1, cls: 'form-field-full'
                }, transfer ? {
                    k: 'acc', l: 'From account', t: 'sel', req: 1, o: accounts
                } : {
                    k: 'cat', l: 'Category', t: 'sel', req: 1,
                    o: D.cats.filter(category => v.type === 'income' ? category.g === 'Income' : category.g !== 'Income')
                        .map(category => [category.id, category.name])
                }, transfer ? {
                    k: 'to', l: 'To account', t: 'sel', req: 1, o: accounts
                } : {
                    k: 'acc', l: 'Account', t: 'sel', req: 1, o: accounts
                }, {
                    k: 'frequency', l: 'Repeat', t: 'sel', cls: 'form-field-full', o: RECURRENCES
                }, {
                    k: 'start', l: 'First transaction date', t: 'date', req: 1, cls: 'form-field-full'
                }, {
                    k: 'note', l: 'Notes (optional)', cls: 'form-field-full'
                }];
            }, initial, v => {
                const transfer = v.type === 'transfer';
                const startChanged = rule && (rule.start !== v.start || rule.frequency !== v.frequency);
                if (transfer && v.acc === v.to) return 'Choose two different accounts';
                if (!transfer && !C(v.cat)) return 'Choose a category';
                const next = rule && !startChanged
                    ? rule.next
                    : rule
                        ? firstOccurrenceOnOrAfter(v.start, v.frequency, today())
                        : v.start;
                const updated = {
                    id: rule ? rule.id : uid(),
                    type: v.type,
                    title: v.title || 'Transfer',
                    amount: +v.amount,
                    cat: transfer ? 'c_transfers' : v.cat,
                    acc: v.acc,
                    to: transfer ? v.to : '',
                    frequency: v.frequency,
                    start: v.start,
                    day: dayNumber(v.start),
                    next,
                    time: rule?.time || '',
                    note: v.note,
                    active: rule ? rule.active : true
                };
                if (rule) Object.assign(rule, updated);
                else D.recurring.push(updated);
                processRecurring();
            }, 'type');
        }

        function toggleRecurring(id) {
            const rule = D.recurring.find(item => item.id === id);
            if (!rule) return;
            rule.active = !rule.active;
            if (rule.active && rule.next < today()) {
                rule.next = firstOccurrenceOnOrAfter(rule.start, rule.frequency, today());
            }
            processRecurring();
            save();
            render();
        }

        const deleteRecurring = id => ask('Delete this recurring schedule? Transactions already added will remain.', () => {
            D.recurring = D.recurring.filter(rule => rule.id !== id)
        });
        const editTx = id => txForm(id),
            delTx = id => ask('Delete this transaction? Account balances will be recalculated. Deleting cashback income also removes its linked cashback claim.', () => {
                const transaction = D.tx.find(t => t.id === id);
                D.tx = D.tx.filter(t => t.id !== id);
                if (transaction?.cashbackId) D.cashbacks = D.cashbacks.filter(claim => claim.id !== transaction.cashbackId)
                else D.cashbacks = D.cashbacks.filter(claim => claim.expenseId !== id)
            });

        function openRecentTransaction(id) {
            const transaction = D.tx.find(item => item.id === id);
            if (!transaction) return;
            txPageLimit = TRANSACTION_PAGE_SIZE;
            U.q = '';
            U.c = U.a = U.ty = U.tf = U.tt = '';
            go('tx')
        }

        function row(t, act, recentLink = false) {
            const c = C(t.cat),
                tr = t.type === 'transfer',
                col = tr ? 'var(--tx)' : t.type === 'income' ? 'var(--in)' : 'var(--ex)',
                details = tr ? `${esc(A(t.acc)?.name)} → ${esc(A(t.to)?.name)}` : `${esc(c ? c.name : 'Uncategorized')} · ${esc(A(t.acc)?.name)}`,
                date = `${fd(t.date)}${t.time ? ' ' + t.time : ''}`,
                amount = `${t.type === 'expense' ? '−' : t.type === 'income' ? '+' : ''}${peso(t.amount)}`;
            const cashback = t.type === 'expense' || tr ? D.cashbacks.find(claim => claim.expenseId === t.id) : null;
            const actions = act ? `<div class="tx-actions">${t.type === 'expense' || tr ? `<button class="ib" onclick="${cashback ? "go('cash')" : `cashbackForm('${t.id}')`}" aria-label="${cashback ? 'Manage cashback' : 'Track cashback'}" title="${cashback ? 'Manage cashback' : 'Track cashback'}">${ic('coins')}</button>` : ''}<button class="ib" onclick="editTx('${t.id}')" aria-label="Edit">${ic('pencil')}</button><button class="ib" onclick="delTx('${t.id}')" aria-label="Delete">${ic('trash-2')}</button></div>` : '';
            const transactionDate = new Date(`${t.date}T00:00:00`),
                recentDate = `${transactionDate.getDate()} ${MO[transactionDate.getMonth()]}`,
                recentDetails = tr ?
                    `${recentDate} · ${esc(A(t.acc)?.name || 'Account')} → ${esc(A(t.to)?.name || 'Account')}` :
                    `${recentDate} · ${esc(t.type === 'income' ? A(t.acc)?.name || 'Account' : c?.name || 'Uncategorized')}`,
                metadata = recentLink ? `<span>${recentDetails}</span>` : U.v === 'tx' ?
                    `<span>${details}</span>` : `<span>${details}</span><span>${date}</span>`;
                const transactionPageIcon = tr ? 'repeat' : t.type === 'income' ? 'gift' :
                    c?.name === 'Food & Drinks' ? 'cart' :
                        c?.name === 'Transportation' ? 'activity' :
                            c?.icon === 'shopping-cart' ? 'cart' :
                                c?.icon === 'repeat' ? 'repeat' : '';
                const transactionIcon = recentLink ? dashboardIcon(tr ? 'repeat' : t.type === 'income' ? 'gift' : 'activity') :
                    U.v === 'tx' && transactionPageIcon ? dashboardIcon(transactionPageIcon) :
                        ic(tr ? 'arrow-left-right' : c ? c.icon : 'tag');
            return `<div class="tx tx-list-row${recentLink ? ' recent-link' : ''}" data-date="${esc(t.date)}"${recentLink ? ` role="link" tabindex="0" aria-label="Open ${esc(t.title)} in Transactions" onclick="openRecentTransaction('${t.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openRecentTransaction('${t.id}')}"` : ''}><span class="dot" style="background:var(--sq);color:var(--tx)">${transactionIcon}</span><div class="gr tx-copy"><b>${esc(t.title)}</b><small class="tx-meta">${metadata}</small></div><div class="tx-end"><b class="tx-amount" style="color:${col}">${amount}</b>${actions}</div></div>`
        }

        function bars(S, L, C) {
            const W = 600,
                H = 200,
                T = 10,
                B = 24,
                all = S.flat(),
                hi = Math.max(1, ...all),
                lo = Math.min(0, ...all),
                y = v => T + (hi - v) / (hi - lo) * (H - T - B),
                g = W / L.length,
                w = g * .7 / S.length;
            let s =
                `<svg viewBox="0 0 ${W} ${H}" class="ch"><line x1="0" x2="${W}" y1="${y(0)}" y2="${y(0)}" stroke="var(--bd)"/>`;
            L.forEach((l, i) => {
                S.forEach((a, j) => {
                    const y0 = y(0),
                        y1 = y(a[i]);
                    s += `<rect x="${i*g+g*.15+j*w}" y="${Math.min(y0,y1)}" width="${w-2}" height="${Math.max(1,Math.abs(y1-y0))}" rx="3" fill="${C[j]}"/>`
                });
                s += `<text x="${i*g+g/2}" y="${H-6}" text-anchor="middle">${l}</text>`
            });
            return s + '</svg>'
        }

        function line(a, L, c) {
            const W = 600,
                H = 200,
                T = 14,
                B = 24,
                hi = Math.max(1, ...a),
                lo = Math.min(0, ...a),
                x = i => 20 + i * (W - 40) / Math.max(1, a.length - 1),
                y = v => T + (hi - v) / (hi - lo || 1) * (H - T - B);
            return `<svg viewBox="0 0 ${W} ${H}" class="ch"><polyline fill="none" stroke="${c}" stroke-width="2.5" points="${a.map((v,i)=>x(i)+','+y(v)).join(' ')}"/>${a.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="3" fill="${c}"/><text x="${x(i)}" y="${H-6}" text-anchor="middle">${L[i]}</text>`).join('')}</svg>`
        }

        function catBars(T) {
            const m = {};
            T.filter(t => t.type === 'expense').forEach(t => m[t.cat] = (m[t.cat] || 0) + t.amount);
            const e = Object.entries(m).sort((a, b) => b[1] - a[1]),
                tot = e.reduce((s, x) => s + x[1], 0);
            return e.length ? e.slice(0, 8).map(([id, v]) => {
                const c = C(id) || {
                    name: 'Other',
                    color: '#78716c'
                };
                return `<div style="margin-top:8px"><div class="row sp"><span>${esc(c.name)}</span><b>${peso(v)} <small>${Math.round(v/tot*100)}%</small></b></div><div class="bar"><i style="width:${v/tot*100}%;background:${c.color}"></i></div></div>`
            }).join('') : '<div class="empty">No expenses in this period.</div>'
        }

        function spent(id, key = ym(today())) {
            return D.tx.filter(t => t.type === 'expense' && t.cat === id && ym(t.date) === key).reduce((s, t) => s + t
                .amount, 0)
        }

        function bstat(key = ym(today())) {
            return Object.entries(D.budgets).map(([id, b]) => {
                const s = spent(id, key),
                    p = b > 0 ? s / b * 100 : s > 0 ? Infinity : 0;
                return {
                    id,
                    b,
                    s,
                    p,
                    msg: p > 100 ? 'is over budget' : p >= 100 ? 'has reached its budget' : p >= 75 ?
                        'has used 75% of its budget' : ''
                }
            })
        }
        function overBudgetCategoryNames(key = ym(today())) {
            return bstat(key).filter(item => item.p > 100)
                .map(item => C(item.id)?.name || 'Unknown category')
        }
        const V = Object.fromEntries(
            ['dash', 'tx', 'cash', 'acc', 'bud', 'goal', 'shop', 'rec', 'rep', 'cat', 'prof', 'set']
                .map(view => [view, null])
        );
        let selectedShoppingListId = '';
        function accountPageChanged(carousel) {
            const indicator = $('#account-page-indicator'),
                count = carousel.querySelectorAll('.account-page').length;
            if (!indicator || !count) return;
            const page = Math.min(count, Math.round(carousel.scrollLeft / Math.max(1, carousel.clientWidth)) + 1);
            indicator.textContent = `Swipe · ${page}/${count}`
        }
        function accountStackAccounts() {
            const sortedAccounts = D.acc.slice().sort((first, second) =>
                second.name.localeCompare(first.name, undefined, { sensitivity: 'base' }) || first.id.localeCompare(second.id)
            );
            const signature = JSON.stringify(sortedAccounts.map(({ id, name }) => [id, name]));
            if (signature !== accountStackSignature) {
                accountStackOrder = sortedAccounts.map(account => account.id);
                accountStackSignature = signature
            }
            const byId = new Map(D.acc.map(account => [account.id, account]));
            return accountStackOrder.map(id => byId.get(id));
        }
        function renderAccountStackLayout(restoreFocus, skipAccountId) {
            const stack = $('#m .account-stack');
            const previousPositions = new Map(stack ? Array.from(stack.querySelectorAll('.account-stack-card'))
                .filter(card => card.dataset.accountId !== skipAccountId)
                .map(card => [card.dataset.accountId, card.getBoundingClientRect()]) : []);
            render();
            const nextStack = $('#m .account-stack');
            if (restoreFocus && nextStack) nextStack.focus();
            if (!nextStack || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            nextStack.querySelectorAll('.account-stack-card').forEach(card => {
                if (card.dataset.accountId === skipAccountId) {
                    const distance = Math.max(nextStack.clientWidth, window.innerWidth);
                    card.animate([
                        { transform: `translate3d(${-distance}px,0,0)`, opacity: 0 },
                        { transform: 'translate3d(0,0,0)', opacity: 1 }
                    ], { duration: 260, easing: 'cubic-bezier(.22,.61,.36,1)' });
                    return
                }
                const previous = previousPositions.get(card.dataset.accountId);
                if (!previous) return;
                const current = card.getBoundingClientRect(),
                    x = previous.left - current.left,
                    y = previous.top - current.top;
                if ((!x && !y) || typeof card.animate !== 'function') return;
                card.animate([
                    { transform: `translate3d(${x}px,${y}px,0)` },
                    { transform: 'translate3d(0,0,0)' }
                ], { duration: 260, easing: 'cubic-bezier(.22,.61,.36,1)' })
            })
        }
        function sendAccountCardToBack(restoreFocus, skipAnimation) {
            const stack = $('#m .account-stack'),
                frontCard = stack && stack.querySelector('.account-stack-card.is-front');
            if (accountStackOrder.length < 2 || !stack) return;
            if (!skipAnimation && frontCard && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof frontCard.animate === 'function') {
                const distance = Math.max(stack.clientWidth, window.innerWidth),
                    animation = frontCard.animate([
                        { transform: 'translate3d(0,0,0)', opacity: 1 },
                        { transform: `translate3d(${distance}px,0,0) rotate(12deg)`, opacity: 0 }
                    ], { duration: 180, easing: 'cubic-bezier(.22,.61,.36,1)' });
                animation.onfinish = () => {
                    const outgoingId = frontCard.dataset.accountId;
                    accountStackOrder.unshift(accountStackOrder.pop());
                    renderAccountStackLayout(restoreFocus, outgoingId)
                };
                return
            }
            const outgoingId = frontCard && frontCard.dataset.accountId;
            accountStackOrder.unshift(accountStackOrder.pop());
            renderAccountStackLayout(restoreFocus, outgoingId)
        }
        function toggleAccountViewMode() {
            accountViewMode = accountViewMode === 'list' ? 'cards' : 'list';
            render()
        }
        function wireAccountStack() {
            const stack = $('#m .account-stack');
            if (!stack || stack.dataset.swipeReady) return;
            stack.dataset.swipeReady = '1';
            let pointerStart = null, draggedCard = null, cyclingCard = false;
            stack.addEventListener('pointerdown', event => {
                if (cyclingCard || event.button !== 0 || event.target.closest('button,a,input,select,textarea')) return;
                const targetCard = event.target.closest('.account-stack-card');
                if (!targetCard) return;
                pointerStart = { x: event.clientX, y: event.clientY };
                draggedCard = stack.querySelector('.account-stack-card.is-front');
                stack.setPointerCapture(event.pointerId);
            });
            stack.addEventListener('pointermove', event => {
                if (!pointerStart || !draggedCard) return;
                const dx = event.clientX - pointerStart.x,
                    dy = event.clientY - pointerStart.y;
                if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
                const width = Math.max(1, stack.clientWidth),
                    rotation = Math.max(-8, Math.min(8, dx / width * 10));
                draggedCard.style.transform = `translate3d(${dx}px,0,0) rotate(${rotation}deg)`;
                draggedCard.style.opacity = String(Math.max(.45, 1 - Math.abs(dx) / width * .8))
            });
            stack.addEventListener('pointerup', event => {
                if (!pointerStart) return;
                const dx = event.clientX - pointerStart.x,
                    dy = event.clientY - pointerStart.y,
                    card = draggedCard;
                pointerStart = null;
                draggedCard = null;
                if (Math.abs(dx) >= 48 && Math.abs(dx) >= Math.abs(dy) * 1.25) {
                    if (!card || accountStackOrder.length < 2) {
                        sendAccountCardToBack();
                        return
                    }
                    cyclingCard = true;
                    const finishCycle = () => {
                        card.style.transform = '';
                        card.style.opacity = '';
                        sendAccountCardToBack(undefined, true);
                        cyclingCard = false
                    };
                    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof card.animate !== 'function') {
                        finishCycle();
                        return
                    }
                    const width = Math.max(stack.clientWidth, window.innerWidth),
                        direction = dx < 0 ? -1 : 1,
                        rotation = Math.max(-8, Math.min(8, dx / Math.max(1, stack.clientWidth) * 10)),
                        dragTransform = `translate3d(${dx}px,0,0) rotate(${rotation}deg)`,
                        dragOpacity = String(Math.max(.45, 1 - Math.abs(dx) / Math.max(1, stack.clientWidth) * .8));
                    card.style.transform = dragTransform;
                    card.style.opacity = dragOpacity;
                    const animation = card.animate([
                            { transform: dragTransform, opacity: dragOpacity },
                            { transform: `translate3d(${direction * width}px,0,0) rotate(${direction * 12}deg)`, opacity: 0 }
                        ], { duration: 180, easing: 'cubic-bezier(.22,.61,.36,1)' });
                    animation.onfinish = finishCycle;
                    return
                }
                if (card) {
                    card.style.transform = '';
                    card.style.opacity = ''
                }
            });
            stack.addEventListener('pointercancel', () => {
                if (draggedCard) {
                    draggedCard.style.transform = '';
                    draggedCard.style.opacity = ''
                }
                pointerStart = null;
                draggedCard = null
            });
            stack.addEventListener('keydown', event => {
                if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                    event.preventDefault();
                    sendAccountCardToBack(true)
                }
            })
        }

        const onboardingDraft = () => onboardingState && onboardingState.draft;
        function saveOnboardingProgress() {
            persistOnboardingState();
            if (onboardingActive) render()
        }
        function setOnboardingStep(step) {
            if (!onboardingState || !['welcome', ...ONBOARDING_STEPS, 'complete'].includes(step)) return;
            onboardingState.step = step;
            saveOnboardingProgress()
        }
        function beginOnboarding() {
            if (!onboardingState || onboardingState.completed) return;
            setOnboardingStep('accounts')
        }
        function toggleOnboardingAccount(key, selected) {
            const draft = onboardingDraft(),
                suggestion = SUGGESTED_ACCOUNTS.find(account => account.key === key);
            if (!draft || !suggestion) return;
            if (selected && !draft.accounts.some(account => account.key === key)) {
                draft.accounts.push({ ...suggestion, initial: '0' });
            } else if (!selected) {
                draft.accounts = draft.accounts.filter(account => account.key !== key)
            }
            saveOnboardingProgress()
        }
        function updateOnboardingAccount(key, property, value) {
            const account = onboardingDraft()?.accounts.find(item => item.key === key);
            if (!account || !['name', 'type', 'initial'].includes(property)) return;
            account[property] = value;
            persistOnboardingState()
        }
        function addOnboardingAccount() {
            const draft = onboardingDraft(),
                name = $('#onboarding-account-name')?.value.trim(),
                type = $('#onboarding-account-type')?.value,
                rawBalance = $('#onboarding-account-balance')?.value.trim(),
                initial = rawBalance ? Number(rawBalance) : 0,
                error = $('#onboarding-account-error');
            if (!draft || !error) return;
            if (!name) return error.textContent = 'Enter an account name.';
            if (draft.accounts.some(account => account.name.trim().toLowerCase() === name.toLowerCase())) {
                return error.textContent = 'An account with this name is already selected.';
            }
            if (!TYPES.some(([value]) => value === type)) return error.textContent = 'Choose a valid account type.';
            if (!Number.isFinite(initial) || Math.abs(initial) > 1e12) {
                return error.textContent = 'Enter a valid opening balance up to ₱1,000,000,000,000.';
            }
            draft.accounts.push({
                key: 'custom-' + uid(),
                name: name.slice(0, 40),
                type,
                initial: String(initial),
                color: '#2563eb',
                icon: 'wallet'
            });
            saveOnboardingProgress()
        }
        function onboardingSkipAccounts() {
            const draft = onboardingDraft();
            if (!draft) return;
            draft.accounts = [];
            setOnboardingStep('categories')
        }
        function validateOnboardingAccounts() {
            const accounts = onboardingDraft()?.accounts || [],
                seen = new Set();
            for (const account of accounts) {
                const name = String(account.name || '').trim(),
                    balance = account.initial === '' ? 0 : Number(account.initial);
                if (!name) return 'Enter a name for each selected account.';
                if (seen.has(name.toLowerCase())) return 'Account names must be unique.';
                if (!TYPES.some(([value]) => value === account.type)) return 'Choose a valid type for each account.';
                if (!Number.isFinite(balance) || Math.abs(balance) > 1e12) {
                    return 'Enter valid account balances up to ₱1,000,000,000,000.';
                }
                seen.add(name.toLowerCase())
            }
            return ''
        }
        function toggleOnboardingCategory(id, selected) {
            const draft = onboardingDraft();
            if (!draft || !draft.categories.some(category => category.id === id && category.g !== 'Financial' &&
                !(category.g === 'Income' && category.name.toLowerCase() === 'cashback'))) return;
            const ids = new Set(draft.categoryIds);
            selected ? ids.add(id) : ids.delete(id);
            draft.categoryIds = [...ids];
            saveOnboardingProgress()
        }
        function addOnboardingCategory() {
            const draft = onboardingDraft(),
                nameInput = $('#onboarding-category-name'),
                typeInput = $('#onboarding-category-type'),
                error = $('#onboarding-category-error'),
                name = nameInput?.value.trim(),
                group = typeInput?.value;
            if (!draft || !error) return;
            const names = [...draft.categories, ...draft.customCategories].map(category => category.name.toLowerCase());
            if (!name) return error.textContent = 'Enter a category name.';
            if (name.length > 40) return error.textContent = 'Keep category names under 40 characters.';
            if (names.includes(name.toLowerCase())) return error.textContent = 'A category with this name already exists.';
            if (!['Daily', 'Income'].includes(group)) return error.textContent = 'Choose expense or income.';
            draft.customCategories.push({
                id: 'c_' + uid(),
                name,
                icon: group === 'Income' ? 'coins' : 'tag',
                color: group === 'Income' ? '#16a34a' : '#6366f1',
                g: group
            });
            saveOnboardingProgress()
        }
        function removeOnboardingCategory(id) {
            const draft = onboardingDraft();
            if (!draft) return;
            draft.customCategories = draft.customCategories.filter(category => category.id !== id);
            saveOnboardingProgress()
        }
        function updateOnboardingPreference(key, value) {
            const draft = onboardingDraft();
            if (!draft || !['theme', 'dateFormat', 'financialPeriod'].includes(key)) return;
            if (key === 'theme' && !['dark', 'light'].includes(value)) return;
            if (key === 'dateFormat' && !DATE_FORMATS.includes(value)) return;
            if (key === 'financialPeriod' && !['weekly', 'monthly', 'yearly'].includes(value)) return;
            draft[key] = value;
            saveOnboardingProgress()
        }
        function updateOnboardingBudget(id, value) {
            const draft = onboardingDraft();
            if (!draft || ![...draft.categories, ...draft.customCategories].some(category =>
                category.id === id && category.g === 'Daily'
            )) return;
            draft.budgets[id] = value;
            persistOnboardingState()
        }
        function addOnboardingGoal() {
            const draft = onboardingDraft();
            if (!draft) return;
            draft.goals.push({ key: uid(), name: '', target: '' });
            saveOnboardingProgress()
        }
        function updateOnboardingGoal(key, property, value) {
            const goal = onboardingDraft()?.goals.find(item => item.key === key);
            if (!goal || !['name', 'target'].includes(property)) return;
            goal[property] = value;
            persistOnboardingState()
        }
        function removeOnboardingGoal(key) {
            const draft = onboardingDraft();
            if (!draft) return;
            draft.goals = draft.goals.filter(goal => goal.key !== key);
            saveOnboardingProgress()
        }
        function validateOnboardingOptional(draft) {
            for (const value of Object.values(draft.budgets)) {
                if (value === '') continue;
                const amount = Number(value);
                if (!Number.isFinite(amount) || amount < 0 || amount > 1e12) {
                    return 'Budgets must be valid amounts from ₱0 to ₱1,000,000,000,000.'
                }
            }
            for (const goal of draft.goals.filter(item => item.name.trim() || item.target !== '')) {
                const target = Number(goal.target);
                if (!goal.name.trim() || !Number.isFinite(target) || target <= 0 || target > 1e12) {
                    return 'Each savings goal needs a name and a target greater than ₱0.'
                }
            }
            return ''
        }
        function onboardingSkipOptional() {
            const draft = onboardingDraft();
            if (!draft) return;
            draft.budgets = {};
            draft.goals = [];
            setOnboardingStep('complete')
        }
        function onboardingContinue() {
            const draft = onboardingDraft();
            if (!draft) return;
            const error = $('#onboarding-error');
            if (error) error.textContent = '';
            if (onboardingState.step === 'accounts') {
                const accountError = validateOnboardingAccounts();
                if (accountError) {
                    if (error) error.textContent = accountError;
                    return
                }
                return setOnboardingStep('categories')
            }
            if (onboardingState.step === 'categories') {
                const selectedCategories = draft.categories.filter(category =>
                    category.g === 'Financial' || draft.categoryIds.includes(category.id)
                );
                if (![...selectedCategories, ...draft.customCategories].some(category => category.g === 'Daily')) {
                    if (error) error.textContent = 'Keep at least one expense category.';
                    return
                }
                return setOnboardingStep('preferences')
            }
            if (onboardingState.step === 'preferences') return setOnboardingStep('optional');
            if (onboardingState.step === 'optional') {
                const optionalError = validateOnboardingOptional(draft);
                if (optionalError) {
                    if (error) error.textContent = optionalError;
                    return
                }
                return setOnboardingStep('complete')
            }
        }
        function onboardingBack() {
            if (!onboardingState) return;
            const index = ONBOARDING_STEPS.indexOf(onboardingState.step);
            if (index >= 0) setOnboardingStep(index ? ONBOARDING_STEPS[index - 1] : 'welcome');
            else if (onboardingState.step === 'complete') setOnboardingStep('optional')
        }
        function finishOnboarding() {
            const draft = onboardingDraft();
            if (!draft) return;
            const accountError = validateOnboardingAccounts();
            if (accountError) return info(accountError);
            const optionalError = validateOnboardingOptional(draft);
            if (optionalError) {
                const error = $('#onboarding-error');
                if (error) error.textContent = optionalError;
                return
            }
            const selectedIds = new Set(draft.categoryIds);
            D.acc = draft.accounts.map(account => ({
                id: uid(),
                name: account.name.trim(),
                type: account.type,
                color: account.color,
                icon: account.icon,
                initial: Number(account.initial) || 0,
                created: today(),
                od: 'no'
            }));
            D.cats = [
                ...draft.categories.filter(category => category.g === 'Financial' || selectedIds.has(category.id)),
                ...draft.customCategories
            ];
            if (!D.cats.some(category => category.g === 'Income' && category.name.toLowerCase() === 'cashback')) {
                D.cats.push({ id: 'c_cashback', name: 'Cashback', icon: 'coins', color: '#0891b2', g: 'Income' })
            }
            const activeCategoryIds = new Set(D.cats.map(category => category.id));
            D.budgets = Object.fromEntries(Object.entries(draft.budgets).filter(([id, value]) => {
                const amount = Number(value);
                return activeCategoryIds.has(id) && Number.isFinite(amount) && amount >= 0 && value !== ''
            }).map(([id, value]) => [id, Number(value)]));
            D.goals = draft.goals.filter(goal => goal.name.trim() && Number(goal.target) > 0).map(goal => ({
                id: uid(),
                name: goal.name.trim().slice(0, 80),
                target: Number(goal.target),
                current: 0,
                date: iso(new Date(Date.now() + 18144e6)),
                acc: ''
            }));
            D.theme = draft.theme;
            D.dateFormat = draft.dateFormat;
            D.financialPeriod = draft.financialPeriod;
            onboardingState.completed = true;
            onboardingState.checklistDismissed = false;
            onboardingState.step = 'complete';
            onboardingState.draft = null;
            onboardingActive = false;
            U.v = 'dash';
            U.reportRange = D.financialPeriod;
            persistOnboardingState();
            save();
            render()
        }
        function startDemoMode() {
            if (demoMode) return;
            demoReturnData = JSON.parse(JSON.stringify(D));
            demoReturnView = U.v;
            demoReturnOnboarding = onboardingActive;
            const theme = onboardingDraft()?.theme || D.theme,
                dateFormat = onboardingDraft()?.dateFormat || D.dateFormat,
                financialPeriod = onboardingDraft()?.financialPeriod || D.financialPeriod;
            demoMode = true;
            onboardingActive = false;
            D = seed();
            D.theme = theme;
            D.dateFormat = dateFormat;
            D.financialPeriod = financialPeriod;
            U.v = 'dash';
            U.reportRange = financialPeriod;
            render()
        }
        function exitDemoMode() {
            if (!demoMode || !demoReturnData) return;
            D = demoReturnData;
            demoReturnData = null;
            demoMode = false;
            U.v = demoReturnOnboarding ? 'dash' : demoReturnView;
            onboardingActive = demoReturnOnboarding;
            demoReturnOnboarding = false;
            save();
            render()
        }
        function dismissGettingStarted() {
            if (!onboardingState || !onboardingState.completed) return;
            onboardingState.checklistDismissed = true;
            persistOnboardingState();
            render()
        }
        function startGettingStartedTask(task) {
            if (task === 'accounts') {
                go('acc');
                return accForm()
            }
            if (task === 'transaction') {
                if (!D.acc.length) {
                    go('acc');
                    return accForm()
                }
                return quickAdd('expense')
            }
            if (task === 'budget') {
                go('bud');
                return budForm()
            }
            if (task === 'goal') {
                go('goal');
                return goalForm()
            }
        }
        function gettingStartedChecklist() {
            if (!onboardingState?.completed || onboardingState.checklistDismissed || demoMode) return '';
            const tasks = [
                ['accounts', 'Add an account', D.acc.length > 0, 'Start with Cash, GCash, or a bank account.'],
                ['transaction', 'Record your first transaction', D.tx.length > 0, 'Add an expense or income to see real reports.'],
                ['budget', 'Set a monthly budget', Object.keys(D.budgets).length > 0, 'Choose a category and set a spending limit.'],
                ['goal', 'Create a savings goal', D.goals.length > 0, 'Give a goal a name and target amount.']
            ];
            return `<section class="card getting-started" aria-labelledby="getting-started-title"><div class="row sp"><div><h3 id="getting-started-title">Getting started</h3><small>Your progress stays on this device.</small></div><button type="button" class="ib" aria-label="Dismiss getting started checklist" onclick="dismissGettingStarted()">${ic('x')}</button></div><div class="getting-started-list">${tasks.map(([id, title, done, description]) => `<div class="getting-started-item${done ? ' is-done' : ''}"><span class="getting-started-check" aria-hidden="true">${ic(done ? 'check' : 'circle')}</span><span class="getting-started-copy"><b>${title}</b><small>${description}</small></span><button type="button" class="chip" onclick="startGettingStartedTask('${id}')">${done ? 'View' : 'Start'}</button></div>`).join('')}</div></section>`
        }

        const transactionLongMonthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
        const TRANSACTION_PAGE_SIZE = 50;
        let txPageLimit = TRANSACTION_PAGE_SIZE,
            transactionFiltersOpen = false;

        function fl() {
            txPageLimit = TRANSACTION_PAGE_SIZE;
            $('#tl').innerHTML = txList();
            lu()
        }
        function toggleTransactionFilters() {
            const panel = $('#transaction-advanced-filters'),
                button = $('#transaction-filters-toggle');
            if (!panel || !button) return;
            panel.hidden = !panel.hidden;
            button.setAttribute('aria-expanded', String(!panel.hidden));
        }
        function closeTransactionFilters() {
            const panel = $('#transaction-advanced-filters'),
                button = $('#transaction-filters-toggle');
            if (!panel || !button || panel.hidden) return;
            panel.hidden = true;
            button.setAttribute('aria-expanded', 'false');
        }
        document.addEventListener('click', event => {
            const panel = $('#transaction-advanced-filters'),
                target = event.target;
            if (!panel || panel.hidden || target.closest('.transaction-filter-row') || target.closest('.pocket-select-overlay')) return;
            closeTransactionFilters();
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeTransactionFilters()
        });
        const transactionMonthFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' });
        let transactionScrollHideTimer = 0;
        function updateTransactionMonthIndicator() {
            const indicator = $('#transaction-scroll-month');
            if (U.v !== 'tx' || !indicator) return;
            const root = document.documentElement,
                contentHeight = Math.max(root.scrollHeight, document.body.scrollHeight),
                scrollRange = contentHeight - window.innerHeight;
            if (scrollRange <= 0) {
                indicator.classList.remove('is-visible');
                return;
            }
            const list = $('#tl'),
                filters = $('#m .pocket-feature-content > .f'),
                header = $('#m .pocket-feature-content > .row:first-child'),
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
        function loadMoreTransactionsAtBottom() {
            if (U.v !== 'tx' || !$('#tx-load-more')) return;
            const contentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
            if (window.scrollY + window.innerHeight < contentHeight - 100) return;
            const list = $('#tl');
            if (!list) return;
            txPageLimit += TRANSACTION_PAGE_SIZE;
            list.innerHTML = txList();
            lu()
        }
        window.addEventListener('scroll', () => {
            loadMoreTransactionsAtBottom();
            updateTransactionMonthIndicator()
        }, { passive: true });
        const trForm = () => txFormT();

        function txFormT() {
            txForm();
            const t = document.querySelector('#f [name=type]');
            t.value = 'transfer';
            t.onchange()
        }

        function pick(b, n) {
            const L = b.closest('label');
            L.querySelector('input').value = n;
            const iconButton = L.querySelector('.it span'),
                iconPreview = L.querySelector('.account-icon-preview'),
                iconName = L.querySelector('.account-icon-name');
            if (iconButton) iconButton.innerHTML = ic(n);
            if (iconPreview) iconPreview.innerHTML = ic(n);
            if (iconName) iconName.textContent = n.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
            L.querySelectorAll('.ip .ib').forEach(x => x.classList.remove('sel'));
            b.classList.add('sel');
            L.querySelector('.ip').hidden = true
        }

        function toggleAccountColor(button) {
            const expanded = button.getAttribute('aria-expanded') === 'true',
                content = document.getElementById(button.getAttribute('aria-controls'));
            if (!content) throw new Error('Account color section content is missing');
            content.hidden = expanded;
            button.setAttribute('aria-expanded', String(!expanded));
            button.setAttribute('aria-label', `${expanded ? 'Expand' : 'Collapse'} account color section`);
            button.innerHTML = ic(expanded ? 'arrow-down' : 'arrow-up')
        }

        function tg(b) {
            const g = b.closest('label').querySelector('.ip');
            g.hidden = !g.hidden
        }

        function accForm(id) {
            const a = id ? A(id) : null;
            openForm(a ? 'Edit account' : 'Add account', () => [{
                k: 'name',
                l: 'Account name',
                req: 1,
                placeholder: a ? '' : 'Name your account'
            }, {
                k: 'type',
                l: 'Type',
                t: 'sel',
                o: TYPES
            }, {
                k: 'initial',
                l: a ? 'Current balance (₱)' : 'Initial balance (₱)',
                t: 'number',
                neg: 1,
                req: 1,
                noMark: 1,
                help: 'Enter a negative amount if this money is owed.'
            }, {
                k: 'color',
                l: 'Account color',
                t: 'color'
            }, {
                k: 'icon',
                l: 'Icon',
                t: 'icons'
            }], a ? {
                ...a,
                initial: bal(a)
            } : {
                color: '#2563eb',
                icon: 'wallet',
                type: 'Cash',
                initial: '0'
            }, v => {
                if (D.acc.some(x => x.id !== id && x.name.toLowerCase() === v.name.toLowerCase()))
                return 'An account with this name already exists';
                const o = {
                    ...v,
                    od: a && a.od === 'yes' ? 'yes' : 'no',
                    initial: a ? Math.round((+a.initial + (+v.initial - bal(a))) * 100) / 100 : +v.initial
                };
                a ? Object.assign(a, o) : D.acc.push({
                    id: uid(),
                    created: today(),
                    ...o
                })
            })
        }
        const delAcc = id => D.tx.some(t => t.acc === id || t.to === id) || D.cashbacks.some(claim => claim.account === id) ? info(
            'This account has transactions. Delete or move them first.') : ask('Delete this account?', () => {
            D.acc = D.acc.filter(a => a.id !== id)
        });

        function budForm(id) {
            openForm(id ? 'Edit budget' : 'Set budget', () => [{
                k: 'cat',
                l: 'Category',
                t: 'sel',
                req: 1,
                placeholder: 'Choose category',
                o: D.cats.filter(c => c.g !== 'Income').map(c => [c.id, c.name])
            }, {
                k: 'amt',
                l: 'Monthly budget * (₱)',
                t: 'number',
                req: 1,
                noMark: 1,
                pos: 1
            }], id ? {
                cat: id,
                amt: D.budgets[id]
            } : {}, v => {
                if (id && id !== v.cat) delete D.budgets[id];
                D.budgets[v.cat] = +v.amt
            })
        }
        const delBudget = id => ask('Remove this budget?', () => {
            delete D.budgets[id]
        });
        function shiftBudgetMonth(amount) {
            budgetMonthOffset += amount;
            render()
        }

        function goalForm(id) {
            const g = id ? D.goals.find(x => x.id === id) : null;
            openForm(g ? 'Edit goal' : 'New savings goal', () => [{
                k: 'name',
                l: 'Goal name',
                placeholder: 'What are you saving for?',
                req: 1
            }, {
                k: 'target',
                l: 'Target amount (₱)',
                t: 'number',
                req: 1,
                pos: 1
            }, {
                k: 'current',
                l: 'Current amount (₱)',
                t: 'number'
            }, {
                k: 'date',
                l: 'Target date',
                t: 'date',
                req: 1
            }, {
                k: 'acc',
                l: 'Account (optional)',
                t: 'sel',
                o: [
                    ['', 'None'], ...D.acc.map(a => [a.id, a.name])
                ]
            }], g || {
                current: '',
                date: iso(new Date(Date.now() + 18144e6))
            }, v => {
                const o = {
                    name: v.name,
                    target: +v.target,
                    current: +(v.current || 0),
                    date: v.date,
                    acc: v.acc
                };
                g ? Object.assign(g, o) : D.goals.push({
                    id: uid(),
                    ...o
                })
            }, null, g ? 'Save changes' : 'Create goal')
        }
        function shoppingListForm(id) {
            const list = id ? D.shoppingLists.find(item => item.id === id) : null;
            openForm(list ? 'Edit shopping list' : 'Name your list', () => [{
                k: 'name',
                l: 'List name',
                req: 1
            }], list || { name: '' }, value => {
                if (D.shoppingLists.some(item => item.id !== id && item.name.toLowerCase() === value.name.toLowerCase())) {
                    return 'A shopping list with this name already exists.';
                }
                if (list) list.name = value.name;
                else D.shoppingLists.push({ id: uid(), name: value.name, created: today(), items: [] });
            }, null, list ? 'Save changes' : 'Create list');
        }
        function shoppingItemForm(listId, itemId) {
            const list = D.shoppingLists.find(item => item.id === listId);
            if (!list) return info('This shopping list could not be found.');
            const existingItem = itemId ? list.items.find(item => item.id === itemId) : null;
            if (itemId && !existingItem) return info('This shopping list item could not be found.');
            openForm(existingItem ? 'Edit item' : 'Add item', () => [{
                k: 'name',
                l: 'Item name',
                req: 1
            }, {
                k: 'estimatedAmount',
                l: 'Estimated amount (₱)',
                t: 'number'
            }], existingItem ? {
                name: existingItem.name,
                estimatedAmount: existingItem.estimatedAmount || ''
            } : {
                name: '',
                estimatedAmount: ''
            }, value => {
                const itemData = {
                    name: value.name,
                    estimatedAmount: Math.max(0, Number(value.estimatedAmount) || 0)
                };
                if (existingItem) Object.assign(existingItem, itemData);
                else list.items.push({ id: uid(), ...itemData, checked: false });
            });
        }
        function shoppingListEstimate(list) {
            return list.items.reduce((total, item) => total + (Number(item.estimatedAmount) || 0), 0);
        }
        function recordShoppingListExpense(listId) {
            const list = D.shoppingLists.find(item => item.id === listId);
            if (!list) return info('This shopping list could not be found.');
            const linkedExpense = D.tx.find(transaction =>
                transaction.id === list.expenseTransactionId && transaction.type === 'expense'
            );
            if (linkedExpense) return editTx(linkedExpense.id);
            const shoppingCategory = D.cats.find(category =>
                category.g !== 'Income' && category.name.toLowerCase() === 'shopping'
            );
            openForm('Record shopping expense', () => [{
                k: 'amount',
                l: 'Actual total (₱)',
                t: 'number',
                req: 1,
                pos: 1,
                cls: 'form-field-full'
            }, {
                k: 'cat',
                l: 'Category',
                t: 'sel',
                req: 1,
                cls: 'form-field-pair',
                placeholder: 'Choose category',
                o: D.cats.filter(category => category.g !== 'Income')
                    .map(category => [category.id, category.name])
            }, {
                k: 'acc',
                l: 'Account',
                t: 'sel',
                req: 1,
                cls: 'form-field-pair',
                placeholder: 'Choose account',
                o: D.acc.map(account => [account.id, account.name])
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
            }], {
                amount: '',
                cat: shoppingCategory?.id || '',
                acc: '',
                date: today(),
                time: ''
            }, value => {
                const currentList = D.shoppingLists.find(item => item.id === listId);
                if (!currentList) return 'This shopping list could not be found.';
                if (D.tx.some(transaction =>
                    transaction.id === currentList.expenseTransactionId && transaction.type === 'expense'
                )) return 'This shopping list already has a linked expense.';
                if (!C(value.cat) || C(value.cat).g === 'Income') return 'Choose an expense category';
                if (!A(value.acc)) return 'Choose an account';
                const transaction = {
                    id: uid(),
                    type: 'expense',
                    title: currentList.name,
                    amount: +value.amount,
                    cat: value.cat,
                    acc: value.acc,
                    to: null,
                    date: value.date,
                    time: value.time,
                    note: ''
                };
                D.tx.push(transaction);
                currentList.expenseTransactionId = transaction.id;
            }, null, 'Record expense');
        }
        function openShoppingList(id) {
            selectedShoppingListId = id;
            render();
        }
        function closeShoppingList() {
            selectedShoppingListId = '';
            render();
        }
        function closeShoppingListToDashboard() {
            selectedShoppingListId = '';
            go('dash');
        }
        function shoppingListFabAction() {
            if (selectedShoppingListId) shoppingItemForm(selectedShoppingListId);
            else shoppingListForm();
        }
        function shoppingListFabLabel() {
            return selectedShoppingListId ? 'Add item' : 'Add list';
        }
        function toggleShoppingItem(listId, itemId) {
            const item = D.shoppingLists.find(list => list.id === listId)?.items.find(entry => entry.id === itemId);
            if (!item) return;
            item.checked = !item.checked;
            save();
            render();
        }
        const deleteShoppingItem = (listId, itemId) => ask('Remove this item from the shopping list?', () => {
            const list = D.shoppingLists.find(item => item.id === listId);
            if (list) list.items = list.items.filter(item => item.id !== itemId)
        });
        const deleteShoppingList = id => ask('Delete this shopping list and all its items?', () => {
            D.shoppingLists = D.shoppingLists.filter(list => list.id !== id);
            if (selectedShoppingListId === id) selectedShoppingListId = ''
        });
        const REPORT_COLORS = ['#16a34a', '#ea580c', '#2563eb'],
            REPORT_RANGES = [['weekly', 'Weekly'], ['monthly', 'Monthly'], ['yearly', 'Yearly'], ['custom', 'Custom']];
        const reportDate = value => {
            const [year, month, day] = value.split('-').map(Number);
            return new Date(year, month - 1, day)
        };
        const reportDayLabel = value => new Intl.DateTimeFormat('en-PH', {
            month: 'short',
            day: 'numeric'
        }).format(reportDate(value));
        const reportTick = value => peso(Math.round(value));
        function reportPeriod() {
            const now = new Date(),
                endToday = today();
            let start, end = endToday;
            if (U.reportRange === 'weekly') {
                const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
                start = iso(weekStart)
            } else if (U.reportRange === 'yearly') {
                start = iso(new Date(now.getFullYear(), 0, 1))
            } else if (U.reportRange === 'custom') {
                start = U.reportFrom || iso(new Date(now.getFullYear(), now.getMonth(), 1));
                end = U.reportTo || endToday
            } else {
                start = iso(new Date(now.getFullYear(), now.getMonth(), 1))
            }
            const valid = /^\d{4}-\d\d-\d\d$/.test(start) && /^\d{4}-\d\d-\d\d$/.test(end) && start <= end;
            if (!valid) return { start, end, valid: false, buckets: [] };
            const days = Math.round((reportDate(end) - reportDate(start)) / 86400000) + 1,
                bucketMode = U.reportRange === 'yearly' || (U.reportRange === 'custom' && days > 180) ?
                    'month' : U.reportRange === 'custom' && days > 35 ? 'week' : 'day',
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
            ov(`<div class="report-filter-sheet">
<div class="report-filter-sheet-header"><div><h3>Report filters</h3><small>Choose what to include in your reports.</small></div><button type="button" class="chip" onclick="cl()">Close</button></div>
<div class="report-filter-sheet-fields">
<label><span>Date range</span><select name="reportRange" aria-label="Report date range">${rangeOptions}</select></label>
<label><span>Account</span><select name="reportAccount" aria-label="Filter reports by account">${accountOptions}</select></label>
<label class="report-filter-sheet-category"><span>Category</span><select name="reportCategory" aria-label="Filter reports by category">${categoryOptions}</select></label>
<div class="report-filter-custom-range"${U.reportRange === 'custom' ? '' : ' hidden'}><label><span>From</span><input name="reportFrom" type="date" value="${esc(startValue)}"></label><label><span>To</span><input name="reportTo" type="date" value="${esc(endValue)}"></label></div>
</div>
<small id="report-filter-error" class="report-filter-error" hidden></small>
<div class="row end report-filter-sheet-actions"><button type="button" class="b2" onclick="cl()">Cancel</button><button type="button" class="b1" onclick="applyReportFilters()">Apply filters</button></div>
</div>`);
            $('#ov').classList.add('report-filter-open');
            wireRenderedSelects($('#ovc'));
            $('#ovc [name="reportRange"]').addEventListener('change', event => {
                $('#ovc .report-filter-custom-range').hidden = event.target.value !== 'custom';
            })
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
            return `tabindex="0" role="button" onclick="openReportTransactions(${args})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openReportTransactions(${args})}"`;
        }
        function clearReportDoughnutSelection(wrap) {
            if (!wrap) return;
            wrap.dataset.selectedCategory = '';
            wrap.classList.remove('has-selection');
            wrap.querySelectorAll('.report-category').forEach(element => {
                element.classList.remove('is-selected', 'is-dimmed')
            });
            const canvas = wrap.querySelector('.report-donut-canvas'),
                chart = canvas && Chart.getChart(canvas);
            if (!chart) return;
            chart.data.datasets[0].selectedIndex = -1;
            chart.data.datasets[0].backgroundColor = [...chart.data.datasets[0].originalColors];
            chart.update()
        }
        function applyReportDoughnutSelection(wrap, categoryId) {
            if (!wrap) return;
            wrap.dataset.selectedCategory = categoryId;
            wrap.classList.add('has-selection');
            wrap.querySelectorAll('.report-category').forEach(element => {
                const selected = element.dataset.categoryId === categoryId;
                element.classList.toggle('is-selected', selected);
                element.classList.toggle('is-dimmed', !selected)
            });
            const canvas = wrap.querySelector('.report-donut-canvas'),
                chart = canvas && Chart.getChart(canvas);
            if (!chart) return;
            const selectedIndex = chart.data.datasets[0].categoryIds.indexOf(categoryId);
            if (selectedIndex < 0) return;
            chart.data.datasets[0].selectedIndex = selectedIndex;
            chart.data.datasets[0].backgroundColor = chart.data.datasets[0].originalColors.map((color, index) =>
                index === selectedIndex ? color : colorWithOpacity(color, .28)
            );
            chart.update()
        }
        function selectReportDoughnut(element, categoryId, start, end) {
            const wrap = element.closest('.report-donut-wrap');
            if (!wrap) return;
            if (wrap.dataset.selectedCategory === categoryId) {
                openReportTransactions(start, end, 'expense', categoryId, U.ra || '');
                return
            }
            applyReportDoughnutSelection(wrap, categoryId)
        }
        function deselectReportDoughnutOutside(event, wrap) {
            if (event.target.closest('.report-donut-canvas, .report-category')) return;
            clearReportDoughnutSelection(wrap)
        }
        document.addEventListener('click', event => {
            if (event.target.closest('.report-donut-wrap')) return;
            document.querySelectorAll('.report-donut-wrap.has-selection').forEach(clearReportDoughnutSelection)
        });
        function reportEmpty(message = 'No transactions in this period.') {
            return `<div class="empty report-empty">${message}</div>`
        }
        function reportLegend(series) {
            return `<div class="report-legend">${series.map(item => `<span><i style="--report-color:${item.color}"></i>${esc(item.name)}</span>`).join('')}</div>`
        }
        let reportChartInstances = [];
        const chartConfigAttribute = config => `data-chart-config="${esc(JSON.stringify(config))}"`;
        function reportLineChart(buckets, series, emptyMessage, area = false) {
            if (!buckets.length || !series.some(item => item.values.some(value => value !== 0))) return reportEmpty(emptyMessage);
            const config = { kind: 'line', buckets, series, area };
            return `<div class="report-line-chart"><canvas class="report-line-canvas" role="img" aria-label="Line chart" ${chartConfigAttribute(config)}>Line chart</canvas></div>${reportLegend(series)}`
        }
        function reportBarChart(buckets, series, emptyMessage) {
            if (!buckets.length || !series.some(item => item.values.some(value => value !== 0))) return reportEmpty(emptyMessage);
            const width = 640, height = 270, left = 64, right = 16, top = 18, bottom = 40,
                values = series.flatMap(item => item.values),
                high = Math.max(1, ...values), low = Math.min(0, ...values),
                y = value => top + (high - value) / (high - low || 1) * (height - top - bottom),
                baseline = y(0), groupWidth = (width - left - right) / buckets.length,
                barWidth = Math.max(2, groupWidth * .66 / series.length),
                tickIndexes = new Set([0, ...Array.from({ length: 4 }, (_, index) =>
                    Math.round((buckets.length - 1) * (index + 1) / 5)), buckets.length - 1]);
            let svg = `<svg viewBox="0 0 ${width} ${height}" class="ch report-chart" role="img" aria-label="Bar chart">`;
            for (let index = 0; index <= 4; index++) {
                const value = low + (high - low) * (4 - index) / 4, yy = y(value);
                svg += `<line x1="${left}" x2="${width-right}" y1="${yy}" y2="${yy}" class="report-gridline"/><text x="${left-8}" y="${yy+4}" text-anchor="end">${reportTick(value)}</text>`
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
            return svg + '</svg>' + reportLegend(series)
        }
        function reportDonutChart(entries, period, emptyMessage) {
            const total = entries.reduce((sum, entry) => sum + entry.value, 0);
            if (!entries.length || total <= 0) return reportEmpty(emptyMessage);
            const legend = entries.map(entry => {
                const percent = Math.round(entry.value / total * 100),
                    onclick = `selectReportDoughnut(this,'${esc(entry.id)}','${esc(period.start)}','${esc(period.end)}')`;
                return `<button type="button" class="report-category" data-category-id="${esc(entry.id)}" style="--report-color:${entry.color}" onclick="${onclick}"><span><i style="--report-color:${entry.color}"></i><span class="report-category-name">${esc(entry.name)}</span></span><b>${peso(entry.value)} <small>${percent}%</small></b></button>`
            }).join('');
            const config = { kind: 'doughnut', entries, total, period };
            return `<div class="report-donut-wrap" onclick="deselectReportDoughnutOutside(event,this)"><div class="report-donut-stage"><canvas class="report-donut-canvas" role="img" aria-label="Donut chart showing expenses by category" ${chartConfigAttribute(config)}>Donut chart showing expenses by category</canvas></div><div class="report-category-list">${legend}</div></div>`
        }
        const chartCssColor = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        function colorWithOpacity(color, opacity) {
            const match = /^#([\da-f]{6})$/i.exec(color);
            if (!match) return color;
            const value = match[1];
            return `rgba(${parseInt(value.slice(0, 2), 16)},${parseInt(value.slice(2, 4), 16)},${parseInt(value.slice(4, 6), 16)},${opacity})`
        }
        function createReportChart(canvas) {
            const config = JSON.parse(canvas.dataset.chartConfig),
                textColor = chartCssColor('--tx'),
                mutedColor = chartCssColor('--mu'),
                gridColor = colorWithOpacity(chartCssColor('--bd'), .6);
            const chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 180 },
                plugins: { legend: { display: false } },
                onClick(event, elements) {
                    if (config.kind === 'doughnut') {
                        const wrap = canvas.closest('.report-donut-wrap');
                        if (!elements.length) {
                            clearReportDoughnutSelection(wrap);
                            return
                        }
                        const category = config.entries[elements[0].index];
                        if (wrap.dataset.selectedCategory === category.id) {
                            openReportTransactions(config.period.start, config.period.end, 'expense', category.id, U.ra || '');
                        } else {
                            applyReportDoughnutSelection(wrap, category.id)
                        }
                        return
                    }
                    if (!elements.length) return;
                    const element = elements[0],
                        bucket = config.buckets[element.index],
                        series = config.series[element.datasetIndex];
                    if (bucket && series) {
                        openReportTransactions(bucket.start, bucket.end, series.type || '', series.category || U.rc || '', U.ra || '')
                    }
                }
            };
            let chartConfig;
            if (config.kind === 'doughnut') {
                const background = chartCssColor('--cd'),
                    colors = config.entries.map(entry => entry.color),
                    centerText = {
                        id: 'reportDoughnutCenter',
                        afterDraw(chart) {
                            const arc = chart.getDatasetMeta(0).data[0];
                            if (!arc) return;
                            const context = chart.ctx;
                            context.save();
                            context.textAlign = 'center';
                            context.textBaseline = 'middle';
                            context.fillStyle = textColor;
                            context.font = '700 16px system-ui, sans-serif';
                            context.fillText(peso(config.total), arc.x, arc.y - 5);
                            context.fillStyle = mutedColor;
                            context.font = '12px system-ui, sans-serif';
                            context.fillText('Total expenses', arc.x, arc.y + 13);
                            const index = chart.data.datasets[0].selectedIndex;
                            if (index >= 0) {
                                const selectedArc = chart.getDatasetMeta(0).data[index],
                                    entry = config.entries[index];
                                if (selectedArc && entry) {
                                    const angle = (selectedArc.startAngle + selectedArc.endAngle) / 2,
                                        fromX = selectedArc.x + Math.cos(angle) * selectedArc.outerRadius,
                                        fromY = selectedArc.y + Math.sin(angle) * selectedArc.outerRadius,
                                        toX = selectedArc.x + Math.cos(angle) * (selectedArc.outerRadius + 16),
                                        toY = selectedArc.y + Math.sin(angle) * (selectedArc.outerRadius + 16),
                                        rightSide = Math.cos(angle) >= 0,
                                        labelX = toX + (rightSide ? 4 : -4);
                                    context.strokeStyle = textColor;
                                    context.lineWidth = 1;
                                    context.beginPath();
                                    context.moveTo(fromX, fromY);
                                    context.lineTo(toX, toY);
                                    context.stroke();
                                    context.fillStyle = textColor;
                                    context.textAlign = rightSide ? 'left' : 'right';
                                    context.font = '600 11px system-ui, sans-serif';
                                    context.fillText(entry.name, labelX, toY - 5);
                                    context.font = '12px system-ui, sans-serif';
                                    context.fillText(peso(entry.value), labelX, toY + 10)
                                }
                            }
                            context.restore()
                        }
                    };
                chartConfig = {
                    type: 'doughnut',
                    data: {
                        labels: config.entries.map(entry => entry.name),
                        datasets: [{
                            data: config.entries.map(entry => entry.value),
                            categoryIds: config.entries.map(entry => entry.id),
                            originalColors: colors,
                            backgroundColor: colors,
                            borderColor: background,
                            borderWidth: 3,
                            hoverOffset: 6,
                            selectedIndex: -1,
                            offset: context => context.dataIndex === context.dataset.selectedIndex ? 8 : 0
                        }]
                    },
                    options: {
                        ...chartOptions,
                        cutout: '62%',
                        layout: { padding: 28 },
                        plugins: {
                            ...chartOptions.plugins,
                            tooltip: {
                                callbacks: {
                                    label(context) {
                                        const entry = config.entries[context.dataIndex],
                                            percent = Math.round(entry.value / config.total * 100);
                                        return `${entry.name}: ${peso(entry.value)} (${percent}%)`
                                    }
                                }
                            }
                        }
                    },
                    plugins: [centerText]
                }
            } else {
                chartConfig = {
                    type: 'line',
                    data: {
                        labels: config.buckets.map(bucket => bucket.label),
                        datasets: config.series.map(item => ({
                            label: item.name,
                            data: item.values,
                            borderColor: item.color,
                            backgroundColor: colorWithOpacity(item.color, .14),
                            fill: config.area,
                            tension: .35,
                            borderWidth: 2.5,
                            pointRadius: 2,
                            pointHoverRadius: 5
                        }))
                    },
                    options: {
                        ...chartOptions,
                        scales: {
                            x: {
                                grid: { display: false },
                                ticks: { color: mutedColor, maxTicksLimit: 7, maxRotation: 0 }
                            },
                            y: {
                                beginAtZero: true,
                                grid: { color: gridColor },
                                ticks: { color: mutedColor, callback: reportTick }
                            }
                        },
                        plugins: {
                            ...chartOptions.plugins,
                            tooltip: {
                                callbacks: {
                                    title(items) {
                                        const bucket = config.buckets[items[0]?.dataIndex];
                                        return bucket ? `${fd(bucket.start)}${bucket.start !== bucket.end ? ` – ${fd(bucket.end)}` : ''}` : ''
                                    },
                                    label(context) {
                                        return `${config.series[context.datasetIndex].name}: ${peso(context.parsed.y)}`
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return new Chart(canvas, chartConfig)
        }
        function destroyReportCharts() {
            reportChartInstances.forEach(chart => chart.destroy());
            reportChartInstances = []
        }
        function renderReportCharts(root) {
            if (typeof Chart !== 'function') throw new Error('Chart.js did not load. Check vendor/chartjs/chart.umd.min.js.');
            reportChartInstances = Array.from(root.querySelectorAll('canvas[data-chart-config]'))
                .map(createReportChart)
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
            const monthlyAmount = D.budgets[categoryId] || 0;
            let total = 0, cursor = new Date(reportDate(start).getFullYear(), reportDate(start).getMonth(), 1);
            while (iso(cursor) <= end) {
                const monthStart = iso(cursor),
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
            txPageLimit = TRANSACTION_PAGE_SIZE;
            go('tx')
        }

        function catForm(id) {
            const c = id ? C(id) : null;
            openForm(c ? 'Edit category' : 'New category', () => [{
                k: 'name',
                l: 'Name',
                req: 1
            }, !c && {
                k: 'g',
                l: 'Type',
                t: 'sel',
                o: [
                    ['Daily', 'Daily expense'],
                    ['Financial', 'Financial'],
                    ['Income', 'Income']
                ]
            }, {
                k: 'color',
                l: 'Color',
                t: 'color'
            }, {
                k: 'icon',
                l: 'Icon',
                t: 'icons'
            }], c || {
                color: '#6366f1',
                icon: 'tag',
                g: 'Daily'
            }, v => {
                if (D.cats.some(x => x.id !== id && x.name.toLowerCase() === v.name.toLowerCase()))
                return 'A category with this name already exists';
                c ? Object.assign(c, {
                    name: v.name,
                    color: v.color,
                    icon: v.icon
                }) : D.cats.push({
                    id: 'c_' + uid(),
                    ...v
                })
            })
        }
        const delCat = id => D.tx.some(t => t.cat === id) || D.budgets[id] || (D.cashbacks.length && C(id)?.name.toLowerCase() === 'cashback') ? info(
            'This category is in use by transactions or a budget.') : ask('Delete this category?', () => {
            D.cats = D.cats.filter(c => c.id !== id)
        });

        function csv() {
            const q = s => '"' + String(s ?? '').replace(/"/g, '""') + '"';
            return ['Date,Time,Title,Type,Category,Account,To,Amount,Notes', ...sorted().map(t => [fd(t.date), t.time, t
                .title, t.type, C(t.cat)?.name, A(t.acc)?.name, A(t.to)?.name, t.amount, t.note
            ].map(q).join(','))].join('\n')
        }

        function repCsv() {
            const y = new Date().getFullYear();
            return 'Month,Income,Expenses,Savings\n' + MO.map((m, i) => {
                const T = D.tx.filter(t => +t.date.slice(0, 4) === y && +t.date.slice(5, 7) === i + 1),
                    a = sum(T, 'income'),
                    b = sum(T, 'expense');
                return [m + ' ' + y, a, b, a - b].join(',')
            }).join('\n')
        }

        function exportAllData() {
            dl(`pocket-backup-${today()}.json`, JSON.stringify(D, null, 2), 'application/json');
            info('Your full Pocket backup has been downloaded as a JSON file.')
        }

        function clearTransactionHistory() {
            if (!D.tx.length) return info('There are no transactions to clear.');
            ask('Clear all transaction history and cashback claims? Current account balances will be preserved as new opening balances. Recurring schedules will remain active.', () => {
                D.acc.forEach(account => { account.initial = bal(account) });
                D.tx = [];
                D.cashbacks = []
            }, 'Clear history')
        }

        function showText(title, txt, restore) {
            ov(`<h3>${title}</h3><small>${restore?'Paste a backup below, then restore.':'Select all and copy this text.'}</small>${restore?'<input type="file" accept=".json,application/json" onchange="rf(this)" style="margin-top:8px">':''}<textarea id="ta" rows="10" style="margin-top:8px"${restore?'':' readonly'}>${esc(txt)}</textarea><p class="er" id="er"></p><div class="row end"><button class="b2" onclick="cl()">Close</button>${restore?'':`<button class="b2" onclick="dl('${title==='Backup'?'pocket-backup-'+today()+'.json':'pocket-'+today()+'.csv'}',$('#ta').value,'${title==='Backup'?'application/json':'text/csv'}')">Download</button>`}<button class="b1" onclick="${restore?'doRestore()':'cp()'}">${restore?'Restore':'Copy'}</button></div>`)
        }

        function dl(n, t, m) {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([t], {
                type: m
            }));
            a.download = n;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                URL.revokeObjectURL(a.href);
                a.remove()
            }, 1000)
        }
        const rf = i => {
            const f = i.files[0];
            if (f) f.text().then(t => {
                $('#ta').value = t
            })
        };

        function cp() {
            const t = $('#ta');
            t.select();
            try {
                navigator.clipboard.writeText(t.value)
            } catch (e) {}
            $('#er').style.color = 'var(--in)';
            $('#er').textContent = 'Copied'
        }

        function doRestore() {
            let d;
            try {
                d = clean(JSON.parse($('#ta').value))
            } catch (e) {}
            if (!d) return $('#er').textContent = 'That doesn’t look like a valid Pocket backup.';
            ask('Replace all your current data with this backup?', () => {
                D = d;
                processRecurring();
                if (onboardingActive && onboardingState && !demoMode) {
                    onboardingActive = false;
                    onboardingState.completed = true;
                    onboardingState.checklistDismissed = false;
                    onboardingState.step = 'complete';
                    onboardingState.draft = null;
                    U.v = 'dash';
                    persistOnboardingState()
                }
            }, 'Restore')
        }
        function showSetupInstructions() {
            ov(`<h3>Getting started</h3><p class="settings-note">Start with your accounts, then record income or expenses. Budgets and savings goals are optional and can be changed any time.</p><div class="settings-actions"><button type="button" class="b2" onclick="cl();go('acc');accForm()">${ic('wallet')} Add an account</button><button type="button" class="b2" onclick="cl();go('tx');quickAdd('expense')">${ic('file-text')} Record a transaction</button><button type="button" class="b2" onclick="cl();go('bud');budForm()">${ic('gauge')} Set a budget</button><button type="button" class="b2" onclick="cl();go('goal');goalForm()">${ic('target')} Create a savings goal</button><button type="button" class="b2" onclick="cl();go('cat')">${ic('tag')} Customize categories</button></div><div class="row end" style="margin-top:12px"><button type="button" class="b1" onclick="cl()">Done</button></div>`)
        }
        async function uploadProfilePhoto(input) {
            const file = input.files?.[0];
            input.value = '';
            if (!file) return;
            if (file.type && !file.type.startsWith('image/')) return info('Choose an image file for your profile photo.');
            if (file.size > 10 * 1024 * 1024) return info('Choose a photo smaller than 10 MB.');
            let objectUrl = '';
            try {
                objectUrl = URL.createObjectURL(file);
                const image = new Image(),
                    loaded = new Promise((resolve, reject) => {
                        image.onload = resolve;
                        image.onerror = () => reject(new Error('This file could not be opened as an image.'));
                    });
                image.src = objectUrl;
                await loaded;
                if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth > 12000 || image.naturalHeight > 12000) {
                    throw new Error('Choose an image with valid dimensions up to 12,000 pixels.');
                }
                const scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight)),
                    canvas = document.createElement('canvas');
                canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
                canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
                const context = canvas.getContext('2d');
                if (!context) throw new Error('This browser could not process the selected photo.');
                context.fillStyle = '#fff';
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                let photo = '';
                for (const quality of [.82, .72, .62, .52, .42]) {
                    photo = canvas.toDataURL('image/jpeg', quality);
                    if (photo.length <= MAX_PROFILE_PHOTO_DATA_URL_LENGTH) break;
                }
                if (photo.length > MAX_PROFILE_PHOTO_DATA_URL_LENGTH) {
                    throw new Error('This photo could not be compressed enough. Choose a simpler image.');
                }
                D.profilePhoto = photo;
                save();
                render();
            } catch (error) {
                console.warn('Unable to process profile photo', error);
                info(error instanceof Error ? error.message : 'Could not process this photo. Try a different image.');
            } finally {
                if (objectUrl) URL.revokeObjectURL(objectUrl);
            }
        }
        function removeProfilePhoto() {
            if (!D.profilePhoto) return;
            D.profilePhoto = '';
            save();
            render();
        }
        const NAV = ['dash', 'tx', 'acc', 'rep', 'set'];
        const TITLE_MENU_GROUPS = [
            ['pages', '', [
                ['dash', 'Overview', 'home'],
                ['tx', 'Transactions', 'arrow-down-up'],
                ['acc', 'Accounts', 'wallet'],
                ['rep', 'Reports', 'bar-chart-3']
            ]],
            ['manage', 'Manage', [
                ['bud', 'Budgets'],
                ['goal', 'Savings goals'],
                ['rec', 'Recurring transactions'],
                ['shop', 'Shopping lists'],
                ['cat', 'Categories'],
                ['cash', 'Cashback']
            ]],
            ['account-preferences', 'Account & Preferences', [
                ['prof', 'Profile'],
                ['set', 'Settings']
            ]]
        ];
        let titleMenu, titleMenuBackdrop, titleMenuTrigger, pageTransition, titleMenuCloseTimer, titleMenuOpenTimer;

        function bindPageMenuToggle(toggle) {
            if (!toggle) return;
            toggle.addEventListener('click', event => {
                event.stopPropagation();
                if (!titleMenu.hidden && titleMenuTrigger === toggle) closeTitleMenu();
                else openTitleMenu(toggle);
            });
            toggle.addEventListener('keydown', event => {
                if (event.key !== 'ArrowDown') return;
                event.preventDefault();
                openTitleMenu(toggle);
                titleMenu.querySelector('button[data-page]')?.focus();
            });
        }

        function closeTitleMenu() {
            if (!titleMenu || titleMenu.hidden || titleMenu.classList.contains('is-closing')) return;
            window.clearTimeout(titleMenuOpenTimer);
            titleMenu.classList.remove('is-opening', 'is-open');
            titleMenu.classList.add('is-closing');
            titleMenu.setAttribute('aria-hidden', 'true');
            titleMenu.inert = true;
            titleMenuBackdrop.classList.remove('is-opening', 'is-open');
            titleMenuBackdrop.classList.add('is-closing');
            titleMenuBackdrop.setAttribute('aria-hidden', 'true');
            titleMenuBackdrop.inert = true;
            titleMenuTrigger?.setAttribute('aria-expanded', 'false');
            if (titleMenuTrigger?.classList.contains('page-menu-toggle')) {
                titleMenuTrigger.setAttribute('aria-label', 'Open pages menu');
                titleMenuTrigger.title = 'Open pages menu';
            }
            titleMenuTrigger = null;
            window.clearTimeout(titleMenuCloseTimer);
            titleMenuCloseTimer = window.setTimeout(() => {
                titleMenu.hidden = true;
                titleMenuBackdrop.hidden = true;
                titleMenu.classList.remove('is-closing', 'is-opening', 'is-open');
                titleMenuBackdrop.classList.remove('is-closing', 'is-opening', 'is-open');
                document.body.classList.remove('page-menu-open');
                titleMenuCloseTimer = 0
            }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 240)
        }

        function openTitleMenu(trigger) {
            closeTitleMenu();
            window.clearTimeout(titleMenuCloseTimer);
            window.clearTimeout(titleMenuOpenTimer);
            titleMenu.classList.remove('is-closing', 'is-opening', 'is-open');
            titleMenuBackdrop.classList.remove('is-closing', 'is-opening', 'is-open');
            titleMenuBackdrop.hidden = false;
            titleMenuBackdrop.inert = false;
            titleMenuBackdrop.setAttribute('aria-hidden', 'false');
            titleMenu.hidden = false;
            titleMenu.inert = false;
            titleMenu.setAttribute('aria-hidden', 'false');
            document.body.classList.add('page-menu-open');
            titleMenuTrigger = trigger;
            trigger.setAttribute('aria-expanded', 'true');
            trigger.setAttribute('aria-label', 'Close pages menu');
            trigger.title = 'Close pages menu';
            void titleMenu.offsetWidth;
            titleMenuBackdrop.classList.add('is-opening');
            titleMenu.classList.add('is-opening');
            titleMenu.querySelector('button[data-page]')?.focus();
            titleMenuOpenTimer = window.setTimeout(() => {
                titleMenu.classList.remove('is-opening');
                titleMenu.classList.add('is-open');
                titleMenuBackdrop.classList.remove('is-opening');
                titleMenuBackdrop.classList.add('is-open');
                titleMenuOpenTimer = 0
            }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 240)
        }

        function setupTitleMenu() {
            if (!titleMenuBackdrop) {
                titleMenuBackdrop = document.createElement('div');
                titleMenuBackdrop.className = 'page-title-menu-backdrop';
                titleMenuBackdrop.setAttribute('aria-hidden', 'true');
                titleMenuBackdrop.hidden = true;
                titleMenuBackdrop.inert = true;
                document.body.append(titleMenuBackdrop);
                titleMenuBackdrop.addEventListener('click', () => {
                    const trigger = titleMenuTrigger;
                    closeTitleMenu();
                    trigger?.focus();
                });
            }
            if (!titleMenu) {
                titleMenu = document.createElement('div');
                titleMenu.className = 'page-title-menu';
                titleMenu.id = 'page-title-menu';
                titleMenu.setAttribute('role', 'dialog');
                titleMenu.setAttribute('aria-modal', 'true');
                titleMenu.setAttribute('aria-labelledby', 'page-title-menu-heading');
                titleMenu.setAttribute('aria-hidden', 'true');
                titleMenu.hidden = true;
                titleMenu.inert = true;
                document.body.append(titleMenu);
                titleMenu.addEventListener('click', event => {
                    if (event.target.closest('.page-title-menu-close')) {
                        const trigger = titleMenuTrigger;
                        closeTitleMenu();
                        trigger?.focus();
                        return;
                    }
                    const shoppingListAction = event.target.closest('button[data-shopping-list-action]');
                    if (shoppingListAction && selectedShoppingListId) {
                        const action = shoppingListAction.dataset.shoppingListAction;
                        closeTitleMenu();
                        if (action === 'rename') shoppingListForm(selectedShoppingListId);
                        else if (action === 'delete') deleteShoppingList(selectedShoppingListId);
                        return;
                    }
                    const item = event.target.closest('button[data-page]');
                    if (item) go(item.dataset.page)
                });
                document.addEventListener('keydown', event => {
                    if (event.key === 'Escape' && !titleMenu.hidden) {
                        const trigger = titleMenuTrigger;
                        closeTitleMenu();
                        trigger?.focus();
                        return;
                    }
                    if (event.key === 'Tab' && !titleMenu.hidden) {
                        const focusable = Array.from(titleMenu.querySelectorAll('button:not(:disabled)')),
                            first = focusable[0],
                            last = focusable[focusable.length - 1];
                        if (!first || !last) return;
                        if (event.shiftKey && (document.activeElement === first || !titleMenu.contains(document.activeElement))) {
                            event.preventDefault();
                            last.focus();
                        } else if (!event.shiftKey && (document.activeElement === last || !titleMenu.contains(document.activeElement))) {
                            event.preventDefault();
                            first.focus();
                        }
                    }
                });
                window.addEventListener('resize', closeTitleMenu);
            }
            const isShoppingListDetail = U.v === 'shop' && D.shoppingLists.some(list => list.id === selectedShoppingListId);
            document.body.classList.toggle('pocket-shopping-list-detail-active', isShoppingListDetail);
            const shoppingListActions = isShoppingListDetail
                ? `<div class="page-title-menu-group page-title-menu-group-manage"><div class="page-title-menu-label">Current list</div><div class="page-title-menu-items"><button type="button" data-shopping-list-action="rename"><span class="page-title-menu-item-icon">${ic('pencil')}</span><span>Rename list</span></button><button type="button" data-shopping-list-action="delete"><span class="page-title-menu-item-icon">${ic('trash-2')}</span><span>Delete list</span></button></div></div>`
                : '';
            titleMenu.innerHTML = `<div class="page-title-menu-header"><strong id="page-title-menu-heading">Pocket</strong></div>${TITLE_MENU_GROUPS.map(([group, label, items]) =>
                `<div class="page-title-menu-group page-title-menu-group-${group}">${label?`<div class="page-title-menu-label">${label}</div>`:''}<div class="page-title-menu-items">${items.map(([id, itemLabel, icon]) =>
                    `<button type="button" data-page="${id}"${U.v===id?' aria-current="page"':''}>${icon?`<span class="page-title-menu-item-icon">${ic(icon)}</span>`:''}<span>${itemLabel}</span></button>`
                ).join('')}</div></div>`
            ).join('')}${shoppingListActions}`;
            const heading = $('#m').querySelector('h2');
            if (!heading) return;
            heading.classList.add('page-menu-title');
            const header = heading.closest('.pocket-unified-page-header, .row, .cashback-header');
            if (!header) return;
            if (isShoppingListDetail) {
                header.querySelector(':scope > .page-menu-toggle')?.remove();
                return;
            }
            let toggle = header.querySelector(':scope > .page-menu-toggle');
            if (!toggle) {
                toggle = document.createElement('button');
                toggle.type = 'button';
                toggle.className = 'page-menu-toggle';
                toggle.setAttribute('aria-label', 'Open pages menu');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-haspopup', 'dialog');
                toggle.setAttribute('aria-controls', 'page-title-menu');
                toggle.addEventListener('click', event => {
                    event.stopPropagation();
                    if (!titleMenu.hidden && titleMenuTrigger === toggle) closeTitleMenu();
                    else openTitleMenu(toggle);
                });
                toggle.addEventListener('keydown', event => {
                    if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        openTitleMenu(toggle);
                        titleMenu.querySelector('button[data-page]')?.focus();
                    }
                });
            }
            toggle.innerHTML = dashboardIcon('more');
            if (toggle.parentElement !== header || toggle !== header.lastElementChild) header.append(toggle);
        }

        function updateViewHistory(view, replace = false) {
            const currentState = history.state,
                state = currentState && typeof currentState === 'object' && !Array.isArray(currentState)
                    ? { ...currentState, pocketView: view }
                    : { pocketView: view };
            if (replace) history.replaceState(state, '', location.href);
            else history.pushState(state, '', location.href);
        }

        function restoreViewFromHistory(event) {
            const view = event.state?.pocketView;
            if (!view || !Object.prototype.hasOwnProperty.call(V, view) || view === U.v) return;
            const previousView = U.v;
            if (view === 'shop') selectedShoppingListId = '';
            if (view === 'tx' && previousView !== 'tx') txPageLimit = TRANSACTION_PAGE_SIZE;
            U.v = view;
            render();
            window.scrollTo(0, 0)
        }

        function go(v) {
            const previousView = U.v;
            closeTitleMenu();
            if (v === 'shop') selectedShoppingListId = '';
            if (v === 'tx' && previousView !== 'tx') txPageLimit = TRANSACTION_PAGE_SIZE;
            if (v !== previousView) updateViewHistory(v);
            U.v = v;
            render();
            if (v === 'prof') window.scrollTo(0, 0);
            const from = NAV.indexOf(previousView),
                to = NAV.indexOf(v);
            if (previousView !== v) window.PocketFeatures?.[v]?.onEnter?.();
            if (from >= 0 && to >= 0 && from !== to) {
                const main = $('#m');
                if (typeof main.animate === 'function') {
                    pageTransition?.cancel();
                    pageTransition = main.animate([
                        { transform: `translateX(${to > from ? 100 : -100}%)` },
                        { transform: 'translateX(0)' }
                    ], { duration: 280, easing: 'cubic-bezier(.22, .68, 0, 1)' });
                }
            }
            scrollTo(0, 0)
        }

        function syncNavbar() {
            const frame = $('#pocket-navbar-frame');
            frame?.contentWindow?.postMessage({
                type: 'pocket-navbar-state',
                view: U.v,
                theme: D.theme
            }, '*');
        }
        window.addEventListener('message', event => {
            const frame = $('#pocket-navbar-frame');
            if (event.source !== frame?.contentWindow || !event.data || typeof event.data !== 'object') return;
            if (event.data.type === 'pocket-navbar-ready') syncNavbar();
            if (event.data.type === 'pocket-navbar-navigate' && NAV.includes(event.data.view)) go(event.data.view);
        });
        $('#pocket-navbar-frame')?.addEventListener('load', syncNavbar);

        function restoreCurrentView() {
            try {
                const view = localStorage.getItem(VIEW_KEY);
                if (view && Object.prototype.hasOwnProperty.call(V, view)) U.v = view
            } catch (error) {
                console.warn('Unable to restore the previous page', error)
            }
        }

        function persistCurrentView() {
            try {
                localStorage.setItem(VIEW_KEY, U.v)
            } catch (error) {
                console.warn('Unable to save the current page', error)
            }
        }

        function renderDemoModeBanner() {
            return demoMode ?
                `<div class="demo-mode-banner" role="status"><span>${ic('eye')} Demo mode · sample data only. Your actual data is safe and unchanged.</span><button type="button" class="b2" onclick="exitDemoMode()">Exit demo</button></div>` :
                ''
        }

        function renderFeatureTemplate(featureId, content) {
            const markup = window.PocketFeatureTemplates?.[featureId];
            if (typeof markup !== 'string') throw new Error(`Missing HTML template for feature "${featureId}".`);
            const template = document.createElement('template');
            template.innerHTML = markup;
            const root = template.content.querySelector('.pocket-feature');
            const mount = root?.querySelector('[data-feature-content]');
            if (root?.dataset.feature !== featureId || !mount) {
                throw new Error(`Invalid HTML template for feature "${featureId}".`);
            }
            mount.innerHTML = content;
            return template.innerHTML;
        }

        function render() {
            closeTitleMenu();
            if (onboardingActive) {
                if (typeof window.PocketFeatures?.onboarding !== 'function') return;
                document.body.classList.add('pocket-onboarding-active');
                document.documentElement.dataset.theme = onboardingDraft()?.theme || D.theme;
                document.documentElement.dataset.view = 'onboarding';
                window.dispatchEvent(new CustomEvent('pocket:viewchange', { detail: { view: 'onboarding' } }));
                document.querySelector('meta[name=theme-color]').content =
                    (onboardingDraft()?.theme || D.theme) === 'dark' ? '#000000' : '#f5f5f4';
                destroyReportCharts();
                $('#m').dataset.view = 'onboarding';
                $('#m').innerHTML = renderFeatureTemplate('onboarding', window.PocketFeatures.onboarding());
                wireRenderedSelects($('#m'));
                return
            }
            if (typeof V[U.v] !== 'function') return;
            document.body.classList.remove('pocket-onboarding-active');
            persistCurrentView();
            document.documentElement.dataset.theme = D.theme;
            document.documentElement.dataset.view = U.v;
            window.dispatchEvent(new CustomEvent('pocket:viewchange', { detail: { view: U.v } }));
            document.querySelector('meta[name=theme-color]').content = (U.v === 'dash' || U.v === 'tx' || U.v === 'acc') && D.theme === 'dark'
                ? '#0b100e'
                : D.theme === 'dark' ? '#000000' : '#f5f5f4';
            syncNavbar();
            $('#m').dataset.view = U.v;
            destroyReportCharts();
            $('#m').innerHTML = renderFeatureTemplate(U.v, renderDemoModeBanner() + V[U.v]());
            if (U.v === 'rep') {
                const reportRoot = $('#m');
                renderReportCharts(reportRoot);
                const charts = reportChartInstances.slice();
                requestAnimationFrame(() => charts.forEach(chart => {
                    if (chart.canvas?.isConnected) chart.resize()
                }));
            }
            wireRenderedSelects($('#m'));
            setupTitleMenu();
            if (U.v === 'acc') wireAccountStack();
            lu()
        }
        window.render = render;
        const okId = s => typeof s === 'string' && /^[\w-]{1,40}$/.test(s),
            okCol = s => /^#[0-9a-fA-F]{6}$/.test(s),
            okD = s => /^\d{4}-\d\d-\d\d$/.test(s),
            nm = x => isFinite(+x) ? +x : 0,
            sx = (s, n = 200) => String(s ?? '').slice(0, n),
            ic2 = i => typeof IP[i] === 'string' ? i : 'tag';

        function clean(d) {
            if (!d || !Array.isArray(d.acc) || !Array.isArray(d.tx) || !Array.isArray(d.cats)) return null;
            const dashboardWidgets = d.dashboardWidgets && typeof d.dashboardWidgets === 'object' ? d.dashboardWidgets : {};
            const expenseIds = new Set(d.tx.filter(t =>
                t && okId(t.id) && okD(t.date) && t.type === 'expense'
            ).map(t => t.id));
            return {
                name: sx(d.name, 32).trim(),
                profileAccent: PROFILE_COLORS.some(([, color]) => color === d.profileAccent) ? d.profileAccent : PROFILE_COLORS[0][1],
                profilePhoto: typeof d.profilePhoto === 'string' &&
                    d.profilePhoto.length <= MAX_PROFILE_PHOTO_DATA_URL_LENGTH &&
                    /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(d.profilePhoto) ? d.profilePhoto : '',
                theme: d.theme === 'light' ? 'light' : 'dark',
                dateFormat: DATE_FORMATS.includes(d.dateFormat) ? d.dateFormat : DATE_FORMATS[0],
                financialPeriod: ['weekly', 'monthly', 'yearly'].includes(d.financialPeriod) ? d.financialPeriod : 'yearly',
                dashboardWidgets: Object.fromEntries(DASHBOARD_WIDGETS.map(([id, , enabled]) => [
                    id,
                    typeof dashboardWidgets[id] === 'boolean' ? dashboardWidgets[id] : enabled
                ])),
                v2: 1,
                v3: 1,
                acc: d.acc.filter(a => a && okId(a.id)).map(a => ({
                    id: a.id,
                    name: sx(a.name),
                    type: TYPES.some(t => t[0] === a.type) ? a.type : 'Other',
                    color: okCol(a.color) ? a.color : '#2563eb',
                    icon: ic2(a.icon),
                    initial: nm(a.initial),
                    created: okD(a.created) ? a.created : today(),
                    od: a.od === 'yes' ? 'yes' : 'no'
                })),
                cats: d.cats.filter(c => c && okId(c.id)).map(c => ({
                    id: c.id,
                    name: sx(c.name),
                    icon: ic2(c.icon),
                    color: okCol(c.color) ? c.color : '#6366f1',
                    g: ['Daily', 'Financial', 'Income'].includes(c.g) ? c.g : 'Daily'
                })),
                tx: d.tx.filter(t => t && okId(t.id) && okD(t.date) && ['income', 'expense', 'transfer'].includes(t
                    .type)).map(t => ({
                    id: t.id,
                    type: t.type,
                    title: sx(t.title),
                    amount: nm(t.amount),
                    cat: sx(t.cat),
                    acc: sx(t.acc),
                    to: t.to ? sx(t.to) : null,
                    date: t.date,
                    time: /^\d\d:\d\d$/.test(t.time) ? t.time : '',
                    note: sx(t.note, 500),
                    ...(okId(t.recurringId) && okD(t.recurringDate) ? {
                        recurringId: t.recurringId,
                        recurringDate: t.recurringDate
                        } : {}),
                        ...(okId(t.cashbackId) ? { cashbackId: t.cashbackId } : {})
                })),
                recurring: (Array.isArray(d.recurring) ? d.recurring : []).filter(rule =>
                    rule && okId(rule.id) && ['income', 'expense', 'transfer'].includes(rule.type) &&
                    ['daily', 'weekly', 'monthly'].includes(rule.frequency) && okD(rule.start) && okD(rule.next) &&
                    okId(rule.acc) && (rule.type === 'transfer' ? okId(rule.to) : okId(rule.cat))
                ).map(rule => ({
                    id: rule.id,
                    type: rule.type,
                    title: sx(rule.title),
                    amount: Math.max(0, nm(rule.amount)),
                    cat: sx(rule.cat),
                    acc: rule.acc,
                    to: okId(rule.to) ? rule.to : '',
                    frequency: rule.frequency,
                    start: rule.start,
                    day: Math.min(31, Math.max(1, Number(rule.day) || dayNumber(rule.start))),
                    next: rule.next,
                    time: /^\d\d:\d\d$/.test(rule.time) ? rule.time : '',
                    note: sx(rule.note, 500),
                    active: rule.active !== false
                })),
                cashbacks: (Array.isArray(d.cashbacks) ? d.cashbacks : []).filter(claim =>
                    claim && okId(claim.id) && okId(claim.expenseId) && okD(claim.created) &&
                    ['pending', 'received'].includes(claim.status) && nm(claim.amount) > 0 && okId(claim.account)
                ).map(claim => ({
                    id: claim.id,
                    expenseId: claim.expenseId,
                    expenseTitle: sx(claim.expenseTitle),
                    expenseDate: okD(claim.expenseDate) ? claim.expenseDate : '',
                    amount: nm(claim.amount),
                    account: claim.account,
                    created: claim.created,
                    status: claim.status,
                    receivedDate: okD(claim.receivedDate) ? claim.receivedDate : '',
                    incomeId: okId(claim.incomeId) ? claim.incomeId : ''
                })),
                budgets: Object.fromEntries(Object.entries(d.budgets && typeof d.budgets === 'object' ? d.budgets : {})
                    .filter(([k, v]) => okId(k) && nm(v) > 0).map(([k, v]) => [k, nm(v)])),
                goals: (Array.isArray(d.goals) ? d.goals : []).filter(g => g && okId(g.id)).map(g => ({
                    id: g.id,
                    name: sx(g.name),
                    target: nm(g.target) || 1,
                    current: nm(g.current),
                    date: okD(g.date) ? g.date : today(),
                    acc: okId(g.acc) ? g.acc : ''
                })),
                shoppingLists: (Array.isArray(d.shoppingLists) ? d.shoppingLists : [])
                    .filter(list => list && okId(list.id) && typeof list.name === 'string')
                    .map(list => ({
                        id: list.id,
                        name: sx(list.name, 100),
                        created: okD(list.created) ? list.created : today(),
                        ...(expenseIds.has(list.expenseTransactionId) ? {
                            expenseTransactionId: list.expenseTransactionId
                        } : {}),
                        items: (Array.isArray(list.items) ? list.items : [])
                            .filter(item => item && okId(item.id) && typeof item.name === 'string')
                            .map(item => ({
                                id: item.id,
                                name: sx(item.name, 100),
                                estimatedAmount: Math.max(0, nm(item.estimatedAmount)),
                                checked: item.checked === true
                            }))
                    }))
            }
        }
        window.pocketApp = {
            getData: () => demoMode ? demoReturnData : D,
            normalizeData: clean,
            uploadProfilePhoto,
            removeProfilePhoto,
            replaceFromCloud: data => {
                if (demoMode) {
                    demoReturnData = data;
                    if (demoReturnOnboarding && onboardingState && !onboardingState.completed) {
                        demoReturnOnboarding = false;
                        onboardingState.completed = true;
                        onboardingState.checklistDismissed = true;
                        onboardingState.step = 'complete';
                        onboardingState.draft = null;
                        persistOnboardingState()
                    }
                    save();
                    return
                }
                D = data;
                if (onboardingActive && onboardingState && !onboardingState.completed) {
                    onboardingActive = false;
                    onboardingState.completed = true;
                    onboardingState.checklistDismissed = true;
                    onboardingState.step = 'complete';
                    onboardingState.draft = null;
                    persistOnboardingState()
                }
                save();
                render()
            }
        };
        let hasValidSavedData = false;
        try {
            const storedData = localStorage.getItem(K);
            D = storedData ? clean(JSON.parse(storedData)) : null;
            hasValidSavedData = !!D
        } catch (e) {
            D = null
        }
        if (!D) {
            try {
                const raw = localStorage.getItem(K);
                if (raw) localStorage.setItem(K + '.old', raw)
            } catch (e) {}
            D = seed();
            zero(D);
            D.acc = [];
            D.budgets = {};
            D.goals = [];
            D.theme = 'dark';
            D.financialPeriod = 'monthly';
            D.v2 = 1
        }
        const restoredOnboarding = restoreOnboardingState();
        onboardingState = restoredOnboarding || (hasValidSavedData ? {
            version: 1,
            completed: true,
            checklistDismissed: true,
            step: 'complete',
            draft: null
        } : createOnboardingState());
        onboardingActive = !onboardingState.completed;
        if (!restoredOnboarding) persistOnboardingState();
        U.reportRange = D.financialPeriod || 'yearly';
        if (!D.cats.some(category => category.g === 'Income' && category.name.toLowerCase() === 'cashback')) {
            D.cats.push({ id: 'c_cashback', name: 'Cashback', icon: 'coins', color: '#0891b2', g: 'Income' });
        }
        processRecurring();
        save();
        try {
            navigator.storage && navigator.storage.persist && navigator.storage.persist()
        } catch (e) {}
        $('#ov').onclick = e => {
            if (e.target.id === 'ov') cl()
        };
        restoreCurrentView();
        updateViewHistory(U.v, true);
        window.addEventListener('popstate', restoreViewFromHistory);
        render();
        const runDueRecurring = () => {
            if (processRecurring()) {
                save();
                render()
            }
        };
        window.setInterval(runDueRecurring, 60000);
        window.addEventListener('focus', runDueRecurring);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) runDueRecurring()
        });
        if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register(
            'sw.js').catch(() => {})
