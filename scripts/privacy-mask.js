(() => {
            const main = document.querySelector('#m');
            const maskAmounts = () => {
                const hidden = main.classList.contains('pocket-private');
                if (!hidden) {
                    main.querySelectorAll('.pocket-private-amount').forEach(amount => {
                        amount.replaceWith(document.createTextNode(amount.dataset.pocketAmount));
                    });
                    return;
                }

                const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
                const textNodes = [];
                while (walker.nextNode()) {
                    const node = walker.currentNode;
                    if (!node.parentElement.closest('.pocket-private-amount, script, style') &&
                        /[+−-]?₱[\d,.]+/.test(node.nodeValue)) {
                        textNodes.push(node);
                    }
                }

                textNodes.forEach(node => {
                    const text = node.nodeValue;
                    const pattern = /[+−-]?₱[\d,.]+/g;
                    const fragment = document.createDocumentFragment();
                    let match, lastIndex = 0;
                    while ((match = pattern.exec(text)) !== null) {
                        fragment.append(document.createTextNode(text.slice(lastIndex, match.index)));
                        const amount = document.createElement('span');
                        amount.className = 'pocket-private-amount';
                        amount.dataset.pocketAmount = match[0];
                        amount.textContent = '****';
                        fragment.append(amount);
                        lastIndex = pattern.lastIndex;
                    }
                    fragment.append(document.createTextNode(text.slice(lastIndex)));
                    node.replaceWith(fragment);
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
