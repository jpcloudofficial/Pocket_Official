(() => {
            const main = document.querySelector('#m');
            const maskAmounts = () => {
                const hidden = main.classList.contains('pocket-private');
                main.querySelectorAll('.hb, .hn, .av, .tx-amount').forEach(amount => {
                    if (hidden) {
                        if (!Object.prototype.hasOwnProperty.call(amount.dataset, 'pocketAmount')) {
                            amount.dataset.pocketAmount = amount.textContent;
                        }
                        if (amount.textContent !== '****') amount.textContent = '****';
                    } else if (Object.prototype.hasOwnProperty.call(amount.dataset, 'pocketAmount')) {
                        amount.textContent = amount.dataset.pocketAmount;
                        delete amount.dataset.pocketAmount;
                    }
                });
                main.querySelectorAll('.pocket-summary-amounts').forEach(summary => {
                    if (hidden) {
                        if (!Object.prototype.hasOwnProperty.call(summary.dataset, 'pocketAmount')) {
                            summary.dataset.pocketAmount = summary.textContent;
                        }
                        const masked = summary.dataset.pocketAmount.replace(/[−-]?₱[\d,.]+/g, '****');
                        if (summary.textContent !== masked) summary.textContent = masked;
                    } else if (Object.prototype.hasOwnProperty.call(summary.dataset, 'pocketAmount')) {
                        summary.textContent = summary.dataset.pocketAmount;
                        delete summary.dataset.pocketAmount;
                    }
                });
            };
            new MutationObserver(maskAmounts).observe(main, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
            maskAmounts();
        })();
