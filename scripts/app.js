const K = 'pera.v1',
            VIEW_KEY = 'pera.view.v1',
            $ = s => document.querySelector(s),
            uid = () => Math.random().toString(36).slice(2, 9),
            pad = n => String(n).padStart(2, '0');
        const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()),
            today = () => iso(new Date()),
            fd = s => {
                if (!s) return '';
                const [year, month, day] = s.split('-');
                return `${day}/${month}/${year}`;
            };
        const peso = (n, f) => (n < 0 ? '−' : '') + '₱' + Math.abs(n).toLocaleString('en-PH', {
            minimumFractionDigits: f ? 2 : Number.isInteger(Math.abs(n)) ? 0 : 2,
            maximumFractionDigits: 2
        });
        const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;'
        } [c]));
        const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const ICONS = ['wallet', 'banknote', 'landmark', 'smartphone', 'piggy-bank', 'credit-card', 'coins', 'tag',
            'bus', 'utensils', 'shopping-cart', 'cookie', 'heart', 'shopping-bag', 'home', 'zap', 'repeat', 'film',
            'activity', 'shield', 'trending-up', 'briefcase', 'laptop', 'gift', 'calendar', 'rotate-ccw',
            'arrow-left-right', 'car', 'book', 'plane', 'target'
        ].map(x => [x, x]);
        const TYPES = ['Cash', 'E-Wallet', 'Digital Bank', 'Traditional Bank', 'Savings', 'Credit Card', 'Other'].map(
            x => [x, x]);
        const DASHBOARD_WIDGETS = [
            ['summary', 'Balance summary', true],
            ['alerts', 'Budget alerts', true],
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
        const defaultDashboardWidgets = () => Object.fromEntries(DASHBOARD_WIDGETS.map(([id, , enabled]) => [id, enabled]));
        let D, accountStackOrder = [], accountStackSignature = '', accountStackExpanded = false, U = {
            v: 'dash',
            ry: new Date().getFullYear(),
            ra: '',
            rc: '',
            q: '',
            c: '',
            a: '',
            ty: '',
            tf: '',
            tt: ''
        };

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
                theme: matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light',
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

        function ov(h) {
            $('#ovc').innerHTML = h;
            document.body.classList.add('pocket-modal-open');
            $('#ov').style.display = 'flex';
            lu()
        }
        const cl = () => {
            $('#ov').style.display = 'none';
            $('#ov').classList.remove('form-open');
            document.body.classList.remove('pocket-modal-open')
        };

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

        function openForm(title, fn, vals, submit, rr) {
            const f = fn(vals).filter(Boolean);
            const fld = x => {
                const v = vals[x.k] ?? '';
                const i = x.t === 'icons' ?
                    `<input type="hidden" name="${x.k}" value="${esc(v)}"><button type="button" class="b2 it" onclick="tg(this)"><span>${ic(v||'tag')}</span> Change icon</button><div class="ip" hidden>${ICONS.map(o=>`<button type="button" class="ib${o[0]==v?' sel':''}" onclick="pick(this,'${o[0]}')">${ic(o[0])}</button>`).join('')}</div>` :
                    x.t === 'sel' ?
                    `<select name="${x.k}">${x.o.map(o=>`<option value="${o[0]}"${o[0]==v?' selected':''}>${esc(o[1])}</option>`).join('')}</select>` :
                    x.t === 'area' ? `<textarea name="${x.k}" rows="2">${esc(v)}</textarea>` :
                    `<input name="${x.k}" type="${x.t||'text'}" value="${esc(v)}" ${x.t==='number'?'step="0.01"':''}>`;
                return `<label>${x.l}${x.req?' *':''}${i}</label>`
            };
            ov(
            `<div id="f"><h3>${title}</h3><div class="form-fields">${f.map(fld).join('')}</div><p class="er" id="er"></p><div class="row end"><button type="button" class="b2" onclick="cl()">Cancel</button><button type="button" class="b1" id="sv">Save</button></div></div>`);
            $('#ov').classList.add('form-open');
            const F = $('#f'),
                el = k => F.querySelector('[name="' + k + '"]'),
                get = () => {
                    const o = {};
                    f.forEach(x => o[x.k] = el(x.k).value.trim());
                    return o
                },
                er = m => {
                    $('#er').textContent = m
                };
            if (rr) el(rr).onchange = () => openForm(title, fn, {
                ...vals,
                ...get()
            }, submit, rr);
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
                }
                const m = submit(v);
                if (m) return er(m);
                cl();
                save();
                render()
            };
            $('#sv').onclick = go2;
            F.onkeydown = e => {
                if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    go2()
                }
            }
        }

        function txForm(id) {
            window._dup = '';
            const t = id ? D.tx.find(x => x.id === id) : null;
            openForm(t ? 'Edit transaction' : 'Add transaction', v => {
                    const tr = v.type === 'transfer',
                        ac = D.acc.map(a => [a.id, a.name]);
                    return [{
                            k: 'type',
                            l: 'Type',
                            t: 'sel',
                            o: [
                                ['expense', 'Expense'],
                                ['income', 'Income'],
                                ['transfer', 'Transfer']
                            ]
                        }, {
                            k: 'title',
                            l: 'Title',
                            req: !tr
                        }, {
                            k: 'amount',
                            l: 'Amount (₱)',
                            t: 'number',
                            req: 1,
                            pos: 1
                        }, ...(!t && v.type === 'expense' ? [{
                            k: 'cashbackAmount',
                            l: 'Cashback',
                            t: 'number',
                            pos: 1
                        }] : []),
                        tr ? {
                            k: 'acc',
                            l: 'From',
                            t: 'sel',
                            o: ac
                        } : {
                            k: 'cat',
                            l: 'Choose category',
                            t: 'sel',
                            o: D.cats.filter(c => v.type === 'income' ? c.g === 'Income' : c.g !== 'Income')
                                .map(c => [c.id, c.name])
                        },
                        tr ? {
                            k: 'to',
                            l: 'To',
                            t: 'sel',
                            o: ac
                        } : {
                            k: 'acc',
                            l: 'Choose account',
                            t: 'sel',
                            o: ac
                        }, {
                            k: 'date',
                            l: 'Date',
                            t: 'date',
                            req: 1
                        }, {
                            k: 'note',
                            l: 'Notes (optional)',
                            t: 'area'
                        }
                    ]
                },
                t || {
                    type: 'expense',
                    date: today(),
                    acc: 'cash',
                    to: 'gcash'
                }, v => {
                    const amt = +v.amount,
                        tr = v.type === 'transfer',
                        title = v.title || 'Transfer';
                    const linkedCashback = t && D.cashbacks.find(claim => claim.expenseId === t.id);
                    const cashbackAmount = +v.cashbackAmount || 0;
                    if (cashbackAmount > 0 && v.type !== 'expense') return 'Cashback can only be added to an expense.';
                    if (cashbackAmount > amt) return 'Cashback can’t exceed the expense amount.';
                    if (cashbackAmount > 0 && !A(v.acc)) return 'Choose an expense account for the cashback deposit.';
                    if (linkedCashback && (tr || v.type !== 'expense')) return 'Remove the linked cashback claim before changing this expense type.';
                    if (linkedCashback && amt < linkedCashback.amount) return 'This expense amount is below its cashback claim. Update the claim first.';
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
                        time: t?.time || '',
                        note: v.note,
                        ...(t?.cashbackId ? { cashbackId: t.cashbackId } : {})
                    };
                    if (linkedCashback) {
                        linkedCashback.expenseTitle = title;
                        linkedCashback.expenseDate = v.date;
                        linkedCashback.account = v.acc
                    }
                    t ? Object.assign(t, o) : D.tx.push(o);
                    if (!t && v.type === 'expense' && cashbackAmount > 0) {
                        D.cashbacks.push({
                            id: uid(),
                            expenseId: o.id,
                            expenseTitle: title,
                            expenseDate: v.date,
                            amount: cashbackAmount,
                            account: v.acc,
                            created: today(),
                            status: 'pending',
                            receivedDate: '',
                            incomeId: ''
                        })
                    }
                }, 'type')
        }

        function quickAdd(type) {
            txForm();
            const t = document.querySelector('#f [name="type"]');
            if (t) {
                t.value = type;
                t.onchange && t.onchange();
            }
        }

        function primaryAdd() {
            if (U.v === 'acc') accForm();
            else txForm()
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

        function cashbackForm(expenseId) {
            const expense = D.tx.find(item => item.id === expenseId && item.type === 'expense');
            if (!expense) return info('The linked expense could not be found.');
            if (D.cashbacks.some(claim => claim.expenseId === expenseId)) {
                go('cash');
                return info('This expense already has a cashback claim. You can manage it on the Cashback page.');
            }
            const cashbackCategory = D.cats.find(category => category.g === 'Income' && category.name.toLowerCase() === 'cashback');
            if (!cashbackCategory) return info('Cashback category is unavailable. Reload Pocket to update categories.');
            openForm('Track cashback', () => [{
                k: 'amount', l: 'Expected cashback (₱)', t: 'number', req: 1, pos: 1
            }, {
                k: 'account', l: 'Deposit account', t: 'sel', o: D.acc.map(account => [account.id, account.name])
            }], { amount: '', account: expense.acc }, value => {
                const amount = +value.amount;
                if (amount > expense.amount) return 'Cashback can’t exceed the linked expense amount.';
                D.cashbacks.push({
                    id: uid(),
                    expenseId,
                    expenseTitle: expense.title,
                    expenseDate: expense.date,
                    amount,
                    account: value.account,
                    created: today(),
                    status: 'pending',
                    receivedDate: '',
                    incomeId: ''
                });
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

        const deleteCashback = id => ask('Delete this cashback claim? If received, its linked income transaction will also be deleted.', () => {
            const claim = D.cashbacks.find(item => item.id === id);
            if (claim?.incomeId) D.tx = D.tx.filter(item => item.id !== claim.incomeId);
            D.cashbacks = D.cashbacks.filter(item => item.id !== id)
        });

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
                    k: 'type', l: 'Type', t: 'sel', o: [
                        ['expense', 'Expense'], ['income', 'Income'], ['transfer', 'Transfer']
                    ]
                }, {
                    k: 'title', l: 'Title', req: !transfer
                }, {
                    k: 'amount', l: 'Amount (₱)', t: 'number', req: 1, pos: 1
                }, transfer ? {
                    k: 'acc', l: 'From account', t: 'sel', o: accounts
                } : {
                    k: 'cat', l: 'Category', t: 'sel',
                    o: D.cats.filter(category => v.type === 'income' ? category.g === 'Income' : category.g !== 'Income')
                        .map(category => [category.id, category.name])
                }, transfer ? {
                    k: 'to', l: 'To account', t: 'sel', o: accounts
                } : {
                    k: 'acc', l: 'Account', t: 'sel', o: accounts
                }, {
                    k: 'frequency', l: 'Repeat', t: 'sel', o: RECURRENCES
                }, {
                    k: 'start', l: 'First transaction date', t: 'date', req: 1
                }, {
                    k: 'note', l: 'Notes (optional)', t: 'area'
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
            });

        function openRecentTransaction(id) {
            const transaction = D.tx.find(item => item.id === id);
            if (!transaction) return;
            U.v = 'tx';
            U.q = '';
            U.c = U.a = U.ty = U.tf = U.tt = '';
            render();
            scrollTo(0, 0)
        }

        function row(t, act, recentLink = false) {
            const c = C(t.cat),
                tr = t.type === 'transfer',
                col = tr ? 'var(--tx)' : t.type === 'income' ? 'var(--in)' : 'var(--ex)',
                details = tr ? `${esc(A(t.acc)?.name)} → ${esc(A(t.to)?.name)}` : `${esc(c ? c.name : 'Uncategorized')} · ${esc(A(t.acc)?.name)}`,
                date = `${fd(t.date)}${t.time ? ' ' + t.time : ''}`,
                amount = `${t.type === 'expense' ? '−' : t.type === 'income' ? '+' : ''}${peso(t.amount)}`;
            const cashback = t.type === 'expense' ? D.cashbacks.find(claim => claim.expenseId === t.id) : null;
            const actions = act ? `<div class="tx-actions">${t.type === 'expense' ? `<button class="ib" onclick="${cashback ? "go('cash')" : `cashbackForm('${t.id}')`}" aria-label="${cashback ? 'Manage cashback' : 'Track cashback'}" title="${cashback ? 'Manage cashback' : 'Track cashback'}">${ic('coins')}</button>` : ''}<button class="ib" onclick="editTx('${t.id}')" aria-label="Edit">${ic('pencil')}</button><button class="ib" onclick="delTx('${t.id}')" aria-label="Delete">${ic('trash-2')}</button></div>` : '';
            return `<div class="tx tx-list-row${recentLink ? ' recent-link' : ''}"${recentLink ? ` role="link" tabindex="0" aria-label="Open ${esc(t.title)} in Transactions" onclick="openRecentTransaction('${t.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openRecentTransaction('${t.id}')}"` : ''}><span class="dot" style="background:var(--sq);color:var(--tx)">${ic(tr ? 'arrow-left-right' : c ? c.icon : 'tag')}</span><div class="gr tx-copy"><b>${esc(t.title)}</b><small class="tx-meta"><span>${details}</span><span>${date}</span></small></div><div class="tx-end"><b class="tx-amount" style="color:${col}">${amount}</b>${actions}</div></div>`
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

        function spent(id, key) {
            return D.tx.filter(t => t.type === 'expense' && t.cat === id && ym(t.date) === key).reduce((s, t) => s + t
                .amount, 0)
        }

        function bstat() {
            const k = ym(today());
            return Object.entries(D.budgets).map(([id, b]) => {
                const s = spent(id, k),
                    p = s / b * 100;
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
        const alerts = () => bstat().filter(x => x.msg).map(x =>
            `<div class="warn">${ic('alert-triangle')} ${esc(C(x.id)?.name)} ${x.msg} (${Math.round(x.p)}% of ${peso(x.b)})</div>`
            ).join('');
        const V = {};
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
        function renderAccountStackLayout(restoreFocus) {
            const stack = $('#m .account-stack');
            const previousPositions = new Map(stack ? Array.from(stack.querySelectorAll('.account-stack-card'))
                .map(card => [card.dataset.accountId, card.getBoundingClientRect()]) : []);
            render();
            const nextStack = $('#m .account-stack');
            if (restoreFocus && nextStack) nextStack.focus();
            if (!nextStack || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            nextStack.querySelectorAll('.account-stack-card').forEach(card => {
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
        function sendAccountCardToBack(restoreFocus) {
            if (accountStackOrder.length < 2 || !$('#m .account-stack')) return;
            accountStackOrder.unshift(accountStackOrder.pop());
            renderAccountStackLayout(restoreFocus)
        }
        function setAccountStackExpanded(expanded, restoreFocus) {
            if (accountStackExpanded === expanded) return;
            accountStackExpanded = expanded;
            renderAccountStackLayout(restoreFocus)
        }
        function toggleAccountStackExpanded() {
            setAccountStackExpanded(!accountStackExpanded)
        }
        function wireAccountStack() {
            const stack = $('#m .account-stack');
            if (!stack || stack.dataset.swipeReady) return;
            stack.dataset.swipeReady = '1';
            let pointerStart = null, touchStart = null;
            stack.addEventListener('pointerdown', event => {
                if (event.button !== 0 || event.target.closest('button,a,input,select,textarea')) return;
                pointerStart = { x: event.clientX, y: event.clientY };
                stack.setPointerCapture(event.pointerId);
            });
            stack.addEventListener('pointerup', event => {
                if (!pointerStart) return;
                const dx = event.clientX - pointerStart.x,
                    dy = event.clientY - pointerStart.y;
                pointerStart = null;
                if (Math.abs(dx) >= 48 && Math.abs(dx) >= Math.abs(dy) * 1.25) {
                    sendAccountCardToBack();
                    return
                }
                if (Math.abs(dy) >= 48 && Math.abs(dy) >= Math.abs(dx) * 1.25) {
                    setAccountStackExpanded(dy > 0)
                }
            });
            stack.addEventListener('pointercancel', () => { pointerStart = null });
            stack.addEventListener('touchstart', event => {
                if (event.touches.length !== 1) {
                    touchStart = null;
                    return
                }
                const touch = event.touches[0];
                touchStart = { x: touch.clientX, y: touch.clientY }
            }, { passive: true });
            stack.addEventListener('touchend', event => {
                if (!touchStart) return;
                const touch = event.changedTouches[0],
                    dx = touch.clientX - touchStart.x,
                    dy = touch.clientY - touchStart.y;
                touchStart = null;
                if (Math.abs(dy) >= 48 && Math.abs(dy) >= Math.abs(dx) * 1.25) {
                    setAccountStackExpanded(dy > 0)
                }
            }, { passive: true });
            stack.addEventListener('touchcancel', () => { touchStart = null }, { passive: true });
            stack.addEventListener('keydown', event => {
                if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                    event.preventDefault();
                    sendAccountCardToBack(true)
                } else if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    setAccountStackExpanded(true, true)
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    setAccountStackExpanded(false, true)
                }
            })
        }
        V.dash = () => {
            const [a, b] = rng(), T = D.tx.filter(t => t.date >= a && t.date <= b), inc = sum(T, 'income'), exp =
                sum(T, 'expense'), tot = D.acc.filter(x => !isSav(x)).reduce((s, x) => s + bal(x), 0), cr = D.acc.filter(x => x.type === 'Credit Card')
                .reduce((s, x) => s + bal(x), 0), av = tot - cr, n = new Date(), ks = [], L = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(n.getFullYear(), n.getMonth() - i, 1);
                ks.push(ym(iso(d)));
                L.push(MO[d.getMonth()])
            }
            const reportYear = new Date().getFullYear(),
                reportTransactions = D.tx.filter(t => +t.date.slice(0, 4) === reportYear),
                reportMonthly = i => reportTransactions.filter(t => +t.date.slice(5, 7) === i + 1),
                reportIncome = MO.map((_, i) => sum(reportMonthly(i), 'income')),
                reportExpenses = MO.map((_, i) => sum(reportMonthly(i), 'expense')),
                reportBalanceHistory = MO.map((_, i) => D.acc.reduce((total, account) =>
                    total + bal(account, iso(new Date(reportYear, i + 1, 0))), 0));
            const card = (l, v, c, s = '') =>
                `<div class="card"><small>${l}</small><div class="big" style="color:${c||'inherit'}">${peso(v)}</div><small>${s}</small></div>`;
            const accountPages = [];
            for (let i = 0; i < D.acc.length; i += 4) accountPages.push(D.acc.slice(i, i + 4));
            const accountCard = x =>
                `<div class="ac" onclick="go('acc')"><div class="row" style="flex-wrap:nowrap;gap:8px"><span style="display:inline-flex">${ic(x.icon||'wallet')}</span><b>${esc(x.name)}</b></div><div class="av" style="color:${bal(x)<0?'var(--ex)':'inherit'}">${peso(bal(x))}</div></div>`;
            const widgets = D.dashboardWidgets;
            const summaryWidget = widgets.summary ?
                `<div class="hero"><small>Total Balance</small><div class="hb">${peso(tot,1)}</div><div class="two"><div><small>Income</small><div class="hn" style="color:var(--in)">${peso(inc)}</div></div><div><small>Expenses</small><div class="hn" style="color:var(--ex)">${peso(exp)}</div></div></div><small class="pocket-summary-amounts">Available ${peso(av)}${cr<0?' · Card owed '+peso(-cr):''}</small></div>` :
                '';
            const shortcutsWidget = widgets.shortcuts ?
                `<section class="mo dashboard-shortcuts" aria-labelledby="dashboard-shortcuts-title"><h3 class="sec" id="dashboard-shortcuts-title">Quick Actions</h3><div class="quick-actions-grid"><button class="quick-action" onclick="go('bud')"><span class="quick-action-icon quick-action-budget" aria-hidden="true">${ic('gauge')}</span><span>Budgets</span></button><button class="quick-action" onclick="go('cash')"><span class="quick-action-icon quick-action-cashback" aria-hidden="true">${ic('coins')}</span><span>Cashback</span></button><button class="quick-action" onclick="go('rec')"><span class="quick-action-icon quick-action-recurring" aria-hidden="true">${ic('repeat')}</span><span>Recurring</span></button><button class="quick-action" onclick="go('goal')"><span class="quick-action-icon quick-action-savings" aria-hidden="true">${ic('target')}</span><span>Savings goals</span></button></div></section>` :
                '';
            const actionsWidget = widgets.actions ?
                `<div class="row end" style="margin-top:18px"><button class="b2" onclick="quickAdd('expense')">${ic('plus')} Expense</button><button class="b2" onclick="quickAdd('income')">${ic('plus')} Income</button><button class="b2" onclick="quickAdd('transfer')">${ic('arrow-left-right')} Transfer</button></div>` :
                '';
            const accountsWidget = widgets.accounts ?
                `<div class="row sp" style="margin-top:22px"><h3 class="sec" style="margin:0">My Accounts</h3>${accountPages.length>1?`<small id="account-page-indicator" class="mu" aria-live="polite">Swipe · 1/${accountPages.length}</small>`:''}</div>${accountPages.length?`<div class="account-carousel" role="region" aria-label="My Accounts; swipe horizontally for more" onscroll="accountPageChanged(this)"><div class="account-carousel-track">${accountPages.map(page=>`<div class="ag account-page">${page.map(accountCard).join('')}</div>`).join('')}</div></div>`:'<div class="empty">No accounts yet.</div>'}` :
                '';
            const transactionsWidget = widgets.transactions ?
                `<div class="row sp" style="margin-top:22px"><h3 class="sec" style="margin:0">Recent Transactions</h3><button class="chip" onclick="go('tx')">View all</button></div><div style="margin-top:6px">${D.tx.length?sorted().slice(0,3).map(t=>row(t,false,true)).join(''):'<div class="empty">No transactions yet.</div>'}</div>` :
                '';
            const reportCards = [];
            if (widgets.incomeExpenses) {
                reportCards.push(`<div class="card"><h3>Income vs. expenses</h3>${bars([ks.map(k=>sum(D.tx.filter(t=>ym(t.date)===k),'income')),ks.map(k=>sum(D.tx.filter(t=>ym(t.date)===k),'expense'))],L,['#16a34a','#ea580c'])}</div>`);
            }
            if (widgets.expensesByCategory) reportCards.push(`<div class="card"><h3>Expenses by category</h3>${catBars(T)}</div>`);
            if (widgets.spendingTrend) reportCards.push(`<div class="card"><h3>Spending trend (${reportYear})</h3>${line(reportExpenses,MO,'#ea580c')}</div>`);
            if (widgets.accountBalanceHistory) reportCards.push(`<div class="card"><h3>Account balance history (${reportYear})</h3>${line(reportBalanceHistory,MO,'#2563eb')}</div>`);
            if (widgets.monthlySavings) reportCards.push(`<div class="card"><h3>Monthly savings (${reportYear})</h3>${bars([reportIncome.map((income,i)=>income-reportExpenses[i])],MO,['#16a34a'])}</div>`);
            const reportsWidget = reportCards.length ? `<div class="g g2">${reportCards.join('')}</div>` : '';
            const emptyDashboard = DASHBOARD_WIDGETS.some(([id]) => widgets[id]) ? '' :
                '<div class="empty card">No dashboard sections are visible. Go to Settings and select Customize Dashboard to add sections.</div>';
            const dashboardTitle = D.name ? `Hi, ${esc(D.name)}` : 'My Finance';
            return `<div class="row sp pocket-privacy-header"><h2 style="font-size:26px">${dashboardTitle}</h2></div>${widgets.alerts?alerts():''}
${summaryWidget}${shortcutsWidget}${actionsWidget}${accountsWidget}${transactionsWidget}${reportsWidget}${emptyDashboard}`
        };

        function txList() {

            const q = U.q.toLowerCase(),
                L = sorted().filter(t => (!q || t.title.toLowerCase().includes(q)) && (!U.c || t.cat === U.c) && (!U
                        .a || t.acc === U.a || t.to === U.a) && (!U.ty || t.type === U.ty) && (!U.tf || t.date >= U
                    .tf) && (!U.tt || t.date <= U.tt));
            return L.length ? L.map(t => row(t, 1)).join('') :
                '<div class="empty">No transactions match. Try clearing a filter or add one.</div>'
        }

        function fl() {
            $('#tl').innerHTML = txList();
            lu()
        }
        const cashbackSection = () => {
            const pending = D.cashbacks.filter(claim => claim.status === 'pending');
            const received = D.cashbacks.filter(claim => claim.status === 'received');
            const claimCard = claim => {
                const expense = D.tx.find(item => item.id === claim.expenseId);
                const timingLabel = claim.status === 'received' ? 'Received' : 'Added';
                const timingDate = claim.status === 'received' ? claim.receivedDate : claim.created;
                const deleteButton = `<button class="ib" onclick="deleteCashback('${claim.id}')" aria-label="Delete cashback claim">${ic('trash-2')}</button>`;
                const actions = claim.status === 'pending'
                    ? `<div class="cashback-card-actions"><button class="chip" onclick="markCashbackReceived('${claim.id}')">Mark received</button>${deleteButton}</div>`
                    : '';
                return `<article class="card cashback-card"><div class="cashback-card-heading"><span class="dot" style="background:#0891b222;color:#0891b2">${ic('coins')}</span><div class="cashback-card-title"><b>${esc(claim.expenseTitle || expense?.title || 'Linked expense')}</b><small>Expense · ${fd(claim.expenseDate || expense?.date || claim.created)}</small></div><b class="cashback-amount">${peso(claim.amount)}</b></div><div class="cashback-card-meta"><span><small>Deposit account</small><b>${esc(A(claim.account)?.name || 'Unknown account')}</b></span><span><small>${timingLabel}</small><b>${fd(timingDate)}</b></span>${claim.status === 'received' ? deleteButton : ''}</div>${actions}</article>`
            };
            const receivedTotal = received.reduce((total, claim) => total + claim.amount, 0);
            return `<div class="cashback-header"><div><h2>Cashback</h2><small>Track pending and received cashback.</small></div></div><h3 class="sec cashback-subtitle"><span>Pending</span><span class="cashback-count">${pending.length}</span></h3><div class="g g2 cashback-list">${pending.length ? pending.map(claimCard).join('') : '<div class="empty card cashback-empty">No pending cashback. Add a claim from an expense in Transactions.</div>'}</div><div class="cashback-section-heading"><h3 class="sec cashback-subtitle"><span>Received</span><span class="cashback-count">${received.length}</span></h3><div class="cashback-total"><small>Total received</small><b>${peso(receivedTotal)}</b></div></div><div class="g g2 cashback-list">${received.length ? received.map(claimCard).join('') : '<div class="empty card cashback-empty">Cashback marked received will appear here as income.</div>'}</div>`
        };
        V.tx = () => {
            const o = (L, all) => `<option value="">${all}</option>` + L.map(x =>
                `<option value="${x.id}">${esc(x.name)}</option>`).join('');
            return `<div class="row sp pocket-privacy-header"><h2>Transactions</h2></div>
<div class="f"><input placeholder="Search by name" value="${esc(U.q)}" oninput="U.q=this.value;fl()"><select onchange="U.c=this.value;fl()">${o(D.cats,'All categories').replace(`value="${U.c}"`,`value="${U.c}" selected`)}</select><select onchange="U.a=this.value;fl()">${o(D.acc,'All accounts').replace(`value="${U.a}"`,`value="${U.a}" selected`)}</select>
<select onchange="U.ty=this.value;fl()">${[['','All types'],['income','Income'],['expense','Expense'],['transfer','Transfer']].map(x=>`<option value="${x[0]}"${U.ty===x[0]?' selected':''}>${x[1]}</option>`).join('')}</select><input type="date" value="${U.tf}" onchange="U.tf=this.value;fl()"><input type="date" value="${U.tt}" onchange="U.tt=this.value;fl()"></div><div class="card" id="tl">${txList()}</div>`
        };
        V.cash = () => cashbackSection();
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
            L.querySelector('.it span').innerHTML = ic(n);
            L.querySelectorAll('.ip .ib').forEach(x => x.classList.remove('sel'));
            b.classList.add('sel');
            L.querySelector('.ip').hidden = true
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
                req: 1
            }, {
                k: 'type',
                l: 'Type',
                t: 'sel',
                o: TYPES
            }, {
                k: 'initial',
                l: a ? 'Current balance (₱, negative if you owe)' :
                    'Initial balance (₱, negative if you owe)',
                t: 'number',
                neg: 1,
                req: 1
            }, {
                k: 'color',
                l: 'Color',
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
        V.acc = () => {
            const accounts = accountStackAccounts();
            const collapsedHeight = accounts.length ? Math.min(206 + (accounts.length - 1) * 28, 430) : 0,
                stackGap = accounts.length > 1 ? accountStackExpanded ? 68 : (collapsedHeight - 206) / (accounts.length - 1) : 0,
                stackHeight = accounts.length ? 206 + (accounts.length - 1) * stackGap : 0,
                stackClass = accountStackExpanded ? 'account-stack is-expanded' : 'account-stack';
            const visibleAccounts = accounts;
            const cards = visibleAccounts.map((account, index) => {
                const balance = bal(account);
                const isFront = index === visibleAccounts.length - 1;
                const balanceNote = account.type === 'Credit Card' ? 'Liability · not counted in available balance' :
                    isSav(account) ? 'Savings · kept separate from total balance' : `Initial ${peso(account.initial)}`;
                const actions = isFront ?
                    `<div class="account-stack-actions"><button class="ib" onclick="accForm('${account.id}')" aria-label="Edit ${esc(account.name)}">${ic('pencil')}</button><button class="ib" onclick="delAcc('${account.id}')" aria-label="Delete ${esc(account.name)}">${ic('trash-2')}</button></div>` :
                    '';
                return `<article class="account-stack-card${isFront ? ' is-front' : ''}" data-account-id="${esc(account.id)}" aria-hidden="${!isFront && !accountStackExpanded}" style="--account-accent:${esc(account.color)};--stack-offset:${index * stackGap}px;z-index:${index}"><div class="account-stack-card-heading"><div class="account-stack-name"><span class="account-stack-icon">${ic(account.icon || 'wallet')}</span><span class="account-stack-name-copy"><b>${esc(account.name)}</b><small>${esc(account.type)} · since ${fd(account.created)}</small></span></div><b class="account-stack-balance" style="color:${balance < 0 ? 'var(--ex)' : 'var(--tx)'}">${peso(balance)}</b></div><div class="account-stack-card-footer"><small>${balanceNote}</small>${actions}</div></article>`
            }).join('');
            return `<div class="row sp account-stack-summary"><div><h2>Accounts</h2><small>Total Balance ${peso(D.acc.filter(account => !isSav(account)).reduce((total, account) => total + bal(account), 0))} · Savings ${peso(D.acc.filter(isSav).reduce((total, account) => total + bal(account), 0))}</small></div><small>${accounts.length} accounts</small></div>${accounts.length ? `<div class="account-stack-wrap"><small class="account-stack-hint">${accountStackExpanded ? 'Swipe up to return to the card stack.' : 'Swipe down to see each account name and balance.'}</small><div class="${stackClass}" role="region" aria-expanded="${accountStackExpanded}" aria-label="Account cards. Swipe down to show all account names and balances, or swipe up to collapse." tabindex="0" style="height:${stackHeight}px">${cards}</div><div class="account-stack-footer"><small>${accountStackExpanded ? 'Swipe up to collapse the cards.' : 'Swipe down for all balances or left and right to cycle cards.'}</small><button type="button" class="chip" aria-label="Show next account" ${accounts.length < 2 ? 'disabled' : ''} onclick="sendAccountCardToBack()">Next card</button><button type="button" class="chip" aria-label="${accountStackExpanded ? 'Collapse account cards' : 'Show all account balances'}" aria-expanded="${accountStackExpanded}" ${accounts.length < 2 ? 'disabled' : ''} onclick="toggleAccountStackExpanded()">${accountStackExpanded ? 'Collapse cards' : 'Show balances'}</button></div></div>` : '<div class="empty">No accounts yet.</div>'}`
        };

        function budForm(id) {
            openForm(id ? 'Edit budget' : 'Set budget', () => [{
                k: 'cat',
                l: 'Category',
                t: 'sel',
                o: D.cats.filter(c => c.g !== 'Income').map(c => [c.id, c.name])
            }, {
                k: 'amt',
                l: 'Monthly budget (₱)',
                t: 'number',
                req: 1,
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
        V.bud = () => {
            const L = bstat();
            return `<div class="row sp"><div><h2>Budgets</h2><small>As of ${MO[new Date().getMonth()]} ${new Date().getFullYear()}</small></div></div>${alerts()}<div class="g g2">${L.length ? L.map(x => {
                const c = C(x.id) || { name: 'Unknown category', color: '#999' };
                const col = x.p >= 100 ? 'var(--ex)' : x.p >= 75 ? '#eab308' : 'var(--in)';
                const percent = Math.round(x.p);
                return `<div class="card"><div class="row"><span style="color:${c.color};display:inline-flex">${ic(c.icon || 'tag')}</span><b class="gr">${esc(c.name)}</b><button class="ib" onclick="budForm('${x.id}')" aria-label="Edit budget">${ic('pencil')}</button><button class="ib" onclick="delBudget('${x.id}')" aria-label="Remove budget">${ic('trash-2')}</button></div><div class="bar"><i style="width:${Math.min(100, Math.max(0, x.p))}%;background:${col}"></i></div><div class="row sp"><small>Spent ${peso(x.s)} of ${peso(x.b)}</small><b style="color:${col}">${percent}%</b></div><small>${x.b >= x.s ? `${peso(x.b - x.s)} remaining` : `${peso(x.s - x.b)} over budget`}</small></div>`
            }).join('') : '<div class="empty card">No budgets yet. Set one for a category to track your spending.</div>'}</div>`
        };

        function goalForm(id) {
            const g = id ? D.goals.find(x => x.id === id) : null;
            openForm(g ? 'Edit goal' : 'New savings goal', () => [{
                k: 'name',
                l: 'Goal name',
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
                current: '0',
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
            })
        }
        const fund = id => openForm('Add money to goal', () => [{
            k: 'amt',
            l: 'Amount (₱)',
            t: 'number',
            req: 1,
            pos: 1
        }], {}, v => {
            D.goals.find(x => x.id === id).current += +v.amt
        });
        V.goal = () =>
            `<div class="row sp"><div><h2>Savings goals</h2><small>Track progress separately from your account balances.</small></div></div><div class="g g2">${D.goals.length?D.goals.map(g=>{const p=Math.min(100,g.current/g.target*100),mo=Math.max(1,Math.ceil((new Date(g.date)-new Date())/2629e6));return`<div class="card goal-card"><div class="row goal-heading"><span style="color:var(--in);display:inline-flex">${ic('target')}</span><b class="gr">${esc(g.name)}</b><button class="ib" onclick="goalForm('${g.id}')">${ic('pencil')}</button><button class="ib" onclick="ask('Delete this goal?',()=>D.goals=D.goals.filter(x=>x.id!=='${g.id}'))">${ic('trash-2')}</button></div><div class="big goal-amount">${peso(g.current)} <small>of ${peso(g.target)}</small></div><div class="bar"><i style="width:${p}%;background:var(--in)"></i></div><div class="goal-details-row"><small>${Math.round(p)}% · by ${fd(g.date)}${A(g.acc)?' · '+esc(A(g.acc).name):''}</small><button class="chip" onclick="fund('${g.id}')">+ Add money</button></div><small class="goal-estimate">${p<100?`≈ ${peso((g.target-g.current)/mo)} per month to stay on track`:'Goal reached 🎉'}</small></div>`}).join(''):'<div class="empty card">No goals yet. Create one to start saving toward it.</div>'}</div>`;
        V.rec = () => {
            const frequencyName = frequency => RECURRENCES.find(item => item[0] === frequency)?.[1] || 'Recurring';
            const details = rule => rule.type === 'transfer'
                ? `${esc(A(rule.acc)?.name || 'Unknown account')} → ${esc(A(rule.to)?.name || 'Unknown account')}`
                : `${esc(C(rule.cat)?.name || 'Uncategorized')} · ${esc(A(rule.acc)?.name || 'Unknown account')}`;
            const waitingForFunds = rule => rule.active && rule.type === 'transfer' && rule.next <= today() &&
                A(rule.acc) && !od(A(rule.acc)) && bal(A(rule.acc)) < rule.amount;
            return `<div class="row"><div class="gr"><h2>Recurring transactions</h2><small>Due items are added while Pocket is open; missed items catch up next time.</small></div></div><div class="g g2">${D.recurring.length ? D.recurring.map(rule => `<div class="card"><div class="row"><span class="dot" style="background:var(--sq);color:${rule.type==='income'?'var(--in)':rule.type==='expense'?'var(--ex)':'var(--tr)'}">${ic(rule.type==='transfer'?'arrow-left-right':rule.type==='income'?'wallet':'zap')}</span><div class="gr"><b>${esc(rule.title || 'Transfer')}</b><br><small>${frequencyName(rule.frequency)} · ${details(rule)}</small></div><button class="ib" onclick="recurringForm('${rule.id}')" aria-label="Edit schedule">${ic('pencil')}</button><button class="ib" onclick="deleteRecurring('${rule.id}')" aria-label="Delete schedule">${ic('trash-2')}</button></div><div class="row sp" style="margin-top:10px"><b style="color:${rule.type==='income'?'var(--in)':rule.type==='expense'?'var(--ex)':'var(--tr)'}">${rule.type==='expense'?'−':rule.type==='income'?'+':''}${peso(rule.amount)}</b><small>${rule.active ? waitingForFunds(rule) ? 'Waiting for sufficient funds' : `Next: ${fd(rule.next)}` : 'Paused'}</small></div><div class="row sp" style="margin-top:10px"><small>${rule.next < today() && !rule.active ? `Paused · next due ${fd(rule.next)}` : `Starts ${fd(rule.start)}`}</small><button class="chip" onclick="toggleRecurring('${rule.id}')">${rule.active?'Pause':'Resume'}</button></div></div>`).join('') : '<div class="empty card">No recurring schedules yet. Add one for a regular bill, subscription, salary, or transfer.</div>'}</div>`
        };
        V.rep = () => {
            const y = +U.ry,
                yrs = [...new Set([new Date().getFullYear(), ...D.tx.map(t => +t.date.slice(0, 4))])].sort(),
                T = D.tx.filter(t => +t.date.slice(0, 4) === y && (!U.ra || t.acc === U.ra) && (!U.rc || t.cat === U
                    .rc)),
                m = i => T.filter(t => +t.date.slice(5, 7) === i + 1),
                inc = MO.map((_, i) => sum(m(i), 'income')),
                exp = MO.map((_, i) => sum(m(i), 'expense')),
                ids = U.ra ? [A(U.ra)] : D.acc,
                hist = MO.map((_, i) => ids.reduce((s, a) => s + bal(a, iso(new Date(y, i + 1, 0))), 0)),
                o = (L, v) => L.map(x => `<option value="${x[0]}"${x[0]==v?' selected':''}>${esc(x[1])}</option>`)
                .join('');
            return `<div class="row sp"><h2>Reports</h2></div><div class="f"><select onchange="U.ry=this.value;render()">${o(yrs.map(x=>[x,x]),y)}</select><select onchange="U.ra=this.value;render()">${o([['','All accounts'],...D.acc.map(a=>[a.id,a.name])],U.ra)}</select><select onchange="U.rc=this.value;render()">${o([['','All categories'],...D.cats.map(c=>[c.id,c.name])],U.rc)}</select></div>
<div class="g g2"><div class="card"><h3>Income vs. expenses (monthly)</h3>${bars([inc,exp],MO,['#16a34a','#ea580c'])}</div><div class="card"><h3>Spending trend</h3>${line(exp,MO,'#ea580c')}</div><div class="card"><h3>Expenses by category</h3>${catBars(T)}</div><div class="card"><h3>Account balance history</h3>${line(hist,MO,'#2563eb')}</div><div class="card"><h3>Monthly savings (income − expenses)</h3>${bars([inc.map((v,i)=>v-exp[i])],MO,['#16a34a'])}</div></div>`
        };

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
        V.cat = () =>
            `<div class="row sp"><h2>Categories</h2></div>${[['Daily','Daily expenses'],['Financial','Financial transactions'],['Income','Income']].map(([g,l])=>`<div class="card" style="margin-top:14px"><h3>${l}</h3>${D.cats.filter(c=>c.g===g).sort((a,b)=>a.name.localeCompare(b.name,undefined,{sensitivity:'base'})||a.id.localeCompare(b.id)).map(c=>`<div class="tx"><span class="dot" style="background:${c.color}22;color:${c.color}">${ic(c.icon)}</span><b class="gr">${esc(c.name)}</b><button class="ib" onclick="catForm('${c.id}')">${ic('pencil')}</button><button class="ib" onclick="delCat('${c.id}')">${ic('trash-2')}</button></div>`).join('')}</div>`).join('')}`;

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
                processRecurring()
            }, 'Restore')
        }
        function profileSettingsCard() {
            const initial = D.name.trim().charAt(0).toUpperCase() || 'P';
            const colors = PROFILE_COLORS.map(([name, color]) =>
                `<button type="button" class="profile-color-swatch" style="--profile-swatch:${color}" aria-label="${name} profile color" aria-pressed="${D.profileAccent===color}" onclick="D.profileAccent='${color}';save();render()"></button>`
            ).join('');
            return `<div class="card profile-card" style="--profile-accent:${D.profileAccent}"><h3>Profile</h3><div class="profile-summary"><div class="profile-avatar" id="profile-avatar" aria-hidden="true"><span>${esc(initial)}</span></div><div class="profile-identity"><strong id="profile-name-preview">${esc(D.name||'Your profile')}</strong><small>Personalize your Pocket profile</small></div></div><label class="profile-name-field">Display name<input id="profile-name" type="text" maxlength="32" autocomplete="name" aria-label="Profile display name" placeholder="Your name" value="${esc(D.name)}" onchange="D.name=this.value.trim().slice(0,32);save();render()"></label><div class="profile-email-row"><span>Account email</span><strong id="profile-email">Sign in to see your account email.</strong></div><div class="profile-color-setting"><span>Profile color</span><div class="profile-color-options" role="group" aria-label="Profile color">${colors}</div></div><small class="settings-note">Your display name and profile color sync to your signed-in devices.</small></div>`;
        }
        V.set = () =>
            `<h2>Settings</h2><div class="g g2">
<div class="card cloud-sync-card" id="cloud-sync-card">
  <div class="cloud-sync-intro"><h3>Cloud sync</h3><p class="settings-note">Sync your data across devices.</p></div>
  <p id="cloud-sync-status" class="cloud-sync-status" role="status">Connecting to Firebase…</p>
  <p class="cloud-sync-error" id="cloud-sync-error" role="alert" hidden></p>
  <div id="cloud-login-options"><button class="b2 cloud-google-button" type="button" data-cloud-action="google-sign-in">Continue with Google</button><details class="cloud-email-options"><summary>Use email instead</summary><form id="cloud-auth-form"><label>Email<input id="cloud-email" type="email" autocomplete="email" required></label><label>Password<input id="cloud-password" type="password" autocomplete="current-password" minlength="6" required></label><div class="settings-actions"><button class="b1" type="submit" data-cloud-action="sign-in">Sign in</button><button class="b2" type="button" data-cloud-action="signup">Create account</button><button class="b2" type="button" data-cloud-action="password-reset">Forgot password?</button></div></form></details></div>
  <div id="cloud-user-controls" hidden><div class="cloud-account-row"><div class="cloud-account-copy"><small>Signed in as</small><strong id="cloud-sync-email"></strong></div><button class="b2" type="button" data-cloud-action="sign-out">Sign out</button></div></div>
  <div id="cloud-conflict" class="cloud-conflict" hidden><p>Cloud data changed while this device also has local changes. Choose which copy to keep.</p><div class="settings-actions"><button class="b1" type="button" data-cloud-action="use-cloud">Use cloud copy</button><button class="b2" type="button" data-cloud-action="keep-local">Keep this device</button></div></div>
</div>
${profileSettingsCard()}
<div class="card settings-preferences"><h3>Preferences</h3><div class="settings-preference-list"><div class="settings-preference-row"><span>Currency</span><b>Philippine Peso (₱)</b></div><div class="settings-preference-row"><span>Date format</span><b>DD/MM/YYYY</b></div><div class="settings-preference-row"><span>Theme</span><button class="b2" onclick="D.theme=D.theme==='dark'?'light':'dark';save();render()">${ic(D.theme==='dark'?'sun':'moon')} ${D.theme==='dark'?'Light':'Dark'} mode</button></div></div><div class="settings-preference-dashboard"><small>Dashboard</small><button class="b2 dashboard-layout-setting" onclick="dashboardSettingsForm()">${ic('bar-chart-3')} Customize Dashboard</button></div></div>
<div class="card"><h3>Manage</h3><div class="settings-actions"><button class="b2" onclick="go('acc')">${ic('wallet')} Accounts</button><button class="b2" onclick="go('cat')">${ic('tag')} Categories</button><button class="b2" onclick="go('bud')">${ic('gauge')} Budgets</button><button class="b2" onclick="go('goal')">${ic('target')} Savings goals</button><button class="b2" onclick="go('rec')">${ic('repeat')} Recurring transactions</button><button class="b2" onclick="go('cash')">${ic('coins')} Cashback</button></div></div>
<div class="card"><h3>Export</h3><div class="settings-actions"><button class="b2" onclick="showText('Transactions (CSV)',csv())">${ic('file-text')} Transactions CSV</button><button class="b2" onclick="showText('Monthly report (CSV)',repCsv())">${ic('bar-chart-3')} Report CSV</button><button class="b2" onclick="exportAllData()">${ic('download')} Export all data (JSON)</button></div></div>
<div class="card"><h3>Back up &amp; restore</h3><div class="settings-actions"><button class="b2" onclick="showText('Backup',JSON.stringify(D))">${ic('save')} View / copy backup</button><button class="b2" onclick="showText('Restore backup','',1)">${ic('upload')} Restore backup</button></div><small class="settings-note">Data is saved in this browser. Backups are files you download and store yourself; Pocket does not upload them to the cloud.</small></div>
<div class="card"><h3>Data management</h3><small class="settings-note">These actions can clear or replace local data. You’ll be asked to confirm before they run.</small><div class="settings-actions" style="margin-top:10px"><button class="b2" style="color:var(--ex)" onclick="clearTransactionHistory()">${ic('trash-2')} Clear transaction history</button><button class="b2" onclick="ask('Reset all amounts to ₱0? This clears every transaction, sets all account balances to ₱0 and empties savings goals.',()=>zero(D),'Reset')">${ic('rotate-ccw')} Reset all amounts</button><button class="b2" onclick="ask('Load the sample data? Your changes will be lost.',()=>{D=seed();D.v2=D.v3=1},'Load')">${ic('rotate-ccw')} Load sample data</button></div></div></div>`;
        const ico = p =>
            `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`,
            NI = {
                dash: ico(
                    '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>'
                    ),
                tx: ico('<path d="M7 20V4M7 4 3.5 7.5M7 4l3.5 3.5M17 4v16M17 20l-3.5-3.5M17 20l3.5-3.5"/>'),
                cash: ico('<circle cx="9" cy="9" r="6"/><circle cx="16" cy="16" r="5"/>'),
                rec: ico('<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9a7 7 0 0 1 11.8-2L20 12M4 12l2.7 5a7 7 0 0 0 11.8-2"/>'),
                acc: ico('<rect x="3" y="6" width="18" height="14" rx="4"/><path d="M3 11h18M16.5 15.5h1"/>'),
                rep: ico('<circle cx="12" cy="12" r="9"/><path d="M12 3v9h9"/>'),
                set: ico(
                    '<path d="M4 7h9M19 7h1M4 17h1M11 17h9"/><circle cx="16" cy="7" r="2.5"/><circle cx="8" cy="17" r="2.5"/>'
                    )
            };
        const NAV = [
            ['dash', 'Dashboard', 'layout-grid', 1],
            ['tx', 'Transactions', 'receipt', 1],
            ['acc', 'Accounts', 'wallet', 1],
            ['rep', 'Reports', 'pie-chart', 1],
            ['set', 'Settings', 'settings', 1]
        ];
        const TITLE_MENU_GROUPS = [
            ['Pages', [
                ['dash', 'Dashboard'],
                ['tx', 'Transactions'],
                ['acc', 'Accounts'],
                ['rep', 'Reports']
            ]],
            ['Manage', [
                ['bud', 'Budgets'],
                ['goal', 'Savings goals'],
                ['rec', 'Recurring transactions'],
                ['cat', 'Categories'],
                ['cash', 'Cashback']
            ]],
            ['Preferences', [
                ['set', 'Settings']
            ]]
        ];
        let titleMenu, titleMenuTrigger, pageTransition;

        function closeTitleMenu() {
            if (!titleMenu) return;
            titleMenu.hidden = true;
            titleMenuTrigger?.setAttribute('aria-expanded', 'false');
            titleMenuTrigger = null
        }

        function openTitleMenu(trigger) {
            closeTitleMenu();
            titleMenu.hidden = false;
            titleMenuTrigger = trigger;
            trigger.setAttribute('aria-expanded', 'true');
            const rect = trigger.getBoundingClientRect(),
                menu = titleMenu.getBoundingClientRect(),
                left = Math.max(8, Math.min(rect.left, innerWidth - menu.width - 8)),
                below = rect.bottom + 6,
                top = below + menu.height <= innerHeight - 8 ? below : Math.max(8, rect.top - menu.height - 6);
            titleMenu.style.left = `${left}px`;
            titleMenu.style.top = `${top}px`
        }

        function setupTitleMenu() {
            if (!titleMenu) {
                titleMenu = document.createElement('div');
                titleMenu.className = 'page-title-menu';
                titleMenu.setAttribute('role', 'menu');
                titleMenu.hidden = true;
                document.body.append(titleMenu);
                titleMenu.addEventListener('click', event => {
                    const item = event.target.closest('button[data-page]');
                    if (item) go(item.dataset.page)
                });
                document.addEventListener('click', event => {
                    if (!titleMenu.hidden && !titleMenu.contains(event.target) &&
                        !event.target.closest('.page-menu-title')) closeTitleMenu()
                });
                document.addEventListener('keydown', event => {
                    if (event.key === 'Escape' && !titleMenu.hidden) {
                        const trigger = titleMenuTrigger;
                        closeTitleMenu();
                        trigger?.focus()
                    }
                });
                window.addEventListener('resize', closeTitleMenu);
                window.addEventListener('scroll', closeTitleMenu, true)
            }
            titleMenu.innerHTML = TITLE_MENU_GROUPS.map(([group, items]) =>
                `<div class="page-title-menu-group"><div class="page-title-menu-label">${group}</div>${items.map(([id, label]) =>
                    `<button type="button" role="menuitem" data-page="${id}"${U.v===id?' aria-current="page"':''}>${label}</button>`
                ).join('')}</div>`
            ).join('');
            const heading = $('#m').querySelector('h2');
            if (!heading) return;
            heading.classList.add('page-menu-title');
            heading.tabIndex = 0;
            heading.setAttribute('aria-haspopup', 'menu');
            heading.setAttribute('aria-expanded', 'false');
            heading.onclick = () => {
                if (!titleMenu.hidden && titleMenuTrigger === heading) closeTitleMenu();
                else openTitleMenu(heading)
            };
            heading.onkeydown = event => {
                if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
                    event.preventDefault();
                    openTitleMenu(heading);
                    titleMenu.querySelector('button')?.focus()
                }
            }
        }

        function go(v) {
            const previousView = U.v;
            closeTitleMenu();
            U.v = v;
            render();
            const from = NAV.findIndex(([id]) => id === previousView),
                to = NAV.findIndex(([id]) => id === v);
            if (from >= 0 && to >= 0 && from !== to &&
                !matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

        function updateNavigationIndicator() {
            const nav = $('#nv'),
                indicator = nav.querySelector('.nav-indicator'),
                activeButton = [...nav.querySelectorAll('button')].find(button => button.dataset.view === U.v);
            if (!indicator || !activeButton) return;
            indicator.style.width = `${activeButton.offsetWidth}px`;
            indicator.style.height = `${activeButton.offsetHeight}px`;
            indicator.style.transform = `translate(${activeButton.offsetLeft}px, ${activeButton.offsetTop}px)`;
        }

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

        function render() {
            persistCurrentView();
            closeTitleMenu();
            document.documentElement.dataset.theme = D.theme;
            document.querySelector('meta[name=theme-color]').content = D.theme === 'dark' ? '#000000' : '#f5f5f4';
            const nav = $('#nv');
            if (!nav.querySelector('button')) {
                nav.innerHTML = NAV.map(n =>
                    `<button data-view="${n[0]}" class="${n[3]?'':'dm'}" aria-label="${n[1]}" onclick="go('${n[0]}')">${NI[n[0]]||''}<span>${n[1]}</span></button>`
                ).join('');
            }
            let indicator = nav.querySelector('.nav-indicator');
            const isFirstIndicator = !indicator;
            if (isFirstIndicator) {
                indicator = document.createElement('div');
                indicator.className = 'nav-indicator';
                indicator.setAttribute('aria-hidden', 'true');
                nav.prepend(indicator);
            }
            nav.querySelectorAll('button').forEach(button =>
                button.classList.toggle('on', button.dataset.view === U.v)
            );
            updateNavigationIndicator();
            if (isFirstIndicator) requestAnimationFrame(() => indicator.classList.add('ready'));
            $('#m').dataset.view = U.v;
            $('#m').innerHTML = V[U.v]();
            setupTitleMenu();
            if (U.v === 'acc') wireAccountStack();
            lu()
        }
        window.addEventListener('resize', updateNavigationIndicator);
        const okId = s => typeof s === 'string' && /^[\w-]{1,40}$/.test(s),
            okCol = s => /^#[0-9a-fA-F]{6}$/.test(s),
            okD = s => /^\d{4}-\d\d-\d\d$/.test(s),
            nm = x => isFinite(+x) ? +x : 0,
            sx = (s, n = 200) => String(s ?? '').slice(0, n),
            ic2 = i => typeof IP[i] === 'string' ? i : 'tag';

        function clean(d) {
            if (!d || !Array.isArray(d.acc) || !Array.isArray(d.tx) || !Array.isArray(d.cats)) return null;
            const dashboardWidgets = d.dashboardWidgets && typeof d.dashboardWidgets === 'object' ? d.dashboardWidgets : {};
            return {
                name: sx(d.name, 32).trim(),
                profileAccent: PROFILE_COLORS.some(([, color]) => color === d.profileAccent) ? d.profileAccent : PROFILE_COLORS[0][1],
                theme: d.theme === 'light' ? 'light' : 'dark',
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
                }))
            }
        }
        window.pocketApp = {
            getData: () => D,
            normalizeData: clean,
            replaceFromCloud: data => {
                D = data;
                save();
                render()
            }
        };
        try {
            D = clean(JSON.parse(localStorage.getItem(K)))
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
            D.theme = 'dark';
            D.v2 = 1
        }
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
