(() => {
            const titles = {
                tx: 'Transactions',
                cash: 'Cashback',
                rec: 'Recurring transactions',
                acc: 'Accounts',
                bud: 'Budgets',
                goal: 'Savings goals',
                rep: 'Reports',
                cat: 'Categories',
                set: 'Settings'
            };
            const main = document.querySelector('#m');
            const syncTitle = () => {
                const title = titles[U.v];
                const heading = main.querySelector('h2');
                if (title && heading && heading.textContent.trim() !== title) heading.textContent = title;
            };
            new MutationObserver(() => requestAnimationFrame(syncTitle))
                .observe(main, { childList: true, subtree: true });
            syncTitle();
        })();
