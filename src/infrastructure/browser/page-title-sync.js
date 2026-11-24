(() => {
            const titles = {
                tx: 'Transactions',
                cash: 'Cashback',
                rec: 'Recurring',
                acc: 'Accounts',
                bud: 'Budgets',
                goal: 'Savings goals',
                shop: 'Shopping lists',
                rep: 'Reports',
                cat: 'Categories',
                prof: 'Your profile',
                set: 'Settings'
            };
            const main = document.querySelector('#m');
            const syncTitle = () => {
                if (document.body.classList.contains('pocket-onboarding-active')) return;
                const title = titles[U.v];
                const heading = main.querySelector('h2');
                const isShoppingListDetail = U.v === 'shop'
                    && heading?.closest('.pocket-unified-page-header')?.querySelector('.pocket-unified-page-eyebrow')?.textContent.trim() === 'SHOPPING LIST';
                if (isShoppingListDetail) return;
                if (title && heading && heading.textContent.trim() !== title) heading.textContent = title;
            };
            new MutationObserver(() => requestAnimationFrame(syncTitle))
                .observe(main, { childList: true, subtree: true });
            syncTitle();
        })();
