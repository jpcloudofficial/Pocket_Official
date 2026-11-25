(() => {
    window.PocketFeatures = window.PocketFeatures || {};

        function openShoppingForm({ formClass, eyebrow, title, content, submitLabel, onSubmit }) {
            ov(
                `<div id="f" class="pocket-shopping-form ${formClass}">${window.PocketFormScreenHeader({ close: 'dashboard' })}<div class="form-screen-intro"><small class="form-eyebrow">${esc(eyebrow)}</small><h3>${esc(title)}</h3></div><div class="form-fields">${content}</div><p class="er shopping-form-error" id="er" role="alert" hidden></p><div class="row end shopping-form-actions"><button type="button" class="b1" id="shopping-form-submit">${esc(submitLabel)}</button><button type="button" class="b2" onclick="cl()">Cancel</button></div></div>`
            );
            $('#ov').classList.add('form-open');

            const form = $('#f'),
                error = form.querySelector('#er'),
                fields = Array.from(form.querySelectorAll('input')),
                submit = () => {
                    error.hidden = true;
                    fields.forEach(field => field.removeAttribute('aria-invalid'));
                    const message = onSubmit(form);
                    if (message) {
                        error.textContent = message;
                        error.hidden = false;
                        const invalidField = fields.find(field => field.value.trim() === '');
                        if (invalidField) {
                            invalidField.setAttribute('aria-invalid', 'true');
                            invalidField.focus();
                        }
                        return;
                    }
                    cl();
                    save();
                    render();
                };

            form.querySelector('#shopping-form-submit').addEventListener('click', submit);
            fields.forEach(field => field.addEventListener('input', () => {
                field.removeAttribute('aria-invalid');
                error.hidden = true;
            }));
            form.addEventListener('keydown', event => {
                if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
                    event.preventDefault();
                    submit();
                }
            });
        }

        function openShoppingListForm(id) {
            const list = id ? D.shoppingLists.find(item => item.id === id) : null,
                editing = Boolean(list),
                name = list?.name || '';

            openShoppingForm({
                formClass: 'pocket-shopping-list-form',
                eyebrow: 'START WITH WHAT YOU NEED',
                title: editing ? 'Edit shopping list' : 'New shopping list',
                submitLabel: editing ? 'Save list' : 'Create list',
                content: `<section class="shopping-list-form-card"><span class="shopping-list-form-icon" aria-hidden="true">${ic('shopping-cart')}</span><h4>A list for every little thing.</h4><p>Keep your next shop organized in one place.</p><label for="shopping-list-name">List name *<input id="shopping-list-name" name="name" type="text" value="${esc(name)}" placeholder="Name your list" autocomplete="off"></label></section>`,
                onSubmit: form => {
                    const value = form.querySelector('[name="name"]').value.trim();
                    if (!value) return 'List name is required.';
                    if (D.shoppingLists.some(item => item.id !== id && item.name.toLowerCase() === value.toLowerCase())) {
                        return 'A shopping list with this name already exists.';
                    }
                    if (list) list.name = value;
                    else D.shoppingLists.push({ id: uid(), name: value, created: today(), items: [] });
                    return '';
                }
            });
        }

        function openShoppingItemForm(listId, itemId) {
            const list = D.shoppingLists.find(item => item.id === listId);
            if (!list) return info('This shopping list could not be found.');

            const existingItem = itemId ? list.items.find(item => item.id === itemId) : null;
            if (itemId && !existingItem) return info('This shopping list item could not be found.');

            const name = existingItem?.name || '',
                amount = existingItem && Number.isFinite(Number(existingItem.estimatedAmount))
                    ? Number(existingItem.estimatedAmount).toFixed(2)
                    : '';

            openShoppingForm({
                formClass: 'pocket-shopping-item-form',
                eyebrow: 'GROCERY · SHOPPING LIST',
                title: existingItem ? 'Edit item' : 'Add an item',
                submitLabel: 'Save item',
                content: `<label class="shopping-item-name-field" for="shopping-item-name">Item name *<input id="shopping-item-name" name="name" type="text" value="${esc(name)}" placeholder="What do you need?" autocomplete="off"></label><section class="shopping-item-amount-card"><label for="shopping-item-amount">Estimated amount * (₱)</label>${window.PocketAmountInput.render({ id: 'shopping-item-amount', name: 'estimatedAmount', type: 'number', inputMode: 'decimal', min: '0', step: '0.01', value: amount, placeholder: '0.00', ariaDescribedBy: 'shopping-item-amount-help', className: 'shopping-item-amount-input' })}<small id="shopping-item-amount-help">Use an estimate now. Record the actual expense when you’re ready.</small></section>`,
                onSubmit: form => {
                    const itemName = form.querySelector('[name="name"]').value.trim(),
                        amountValue = form.querySelector('[name="estimatedAmount"]').value.trim(),
                        estimatedAmount = Number(amountValue);
                    if (!itemName) return 'Item name is required.';
                    if (!amountValue) return 'Estimated amount is required.';
                    if (!Number.isFinite(estimatedAmount)) return 'Estimated amount must be a number.';
                    if (estimatedAmount < 0) return 'Estimated amount can’t be negative.';
                    const itemData = { name: itemName, estimatedAmount };
                    if (existingItem) Object.assign(existingItem, itemData);
                    else list.items.push({ id: uid(), ...itemData, checked: false });
                    return '';
                }
            });
        }

        V.shop = () => {
            const selectedList = D.shoppingLists.find(list => list.id === selectedShoppingListId);
            if (selectedShoppingListId && !selectedList) selectedShoppingListId = '';
            if (selectedList) {
                const items = selectedList.items.length ? selectedList.items.map(item => {
                    const itemMenu = window.PocketActionMenu.render({
                        owner: 'shopping-list-item',
                        entityId: item.id,
                        label: `Options for ${item.name}`,
                        className: 'shopping-list-item-menu',
                        triggerIcon: ic('more-horizontal'),
                        actions: [
                            { action: 'edit', label: 'Edit item', icon: ic('pencil') },
                            { action: 'delete', label: 'Remove item', icon: ic('trash-2'), destructive: true }
                        ]
                    });
                    return `<div class="shopping-list-item${item.checked ? ' is-checked' : ''}"><label><input type="checkbox"${item.checked ? ' checked' : ''} onchange="toggleShoppingItem('${selectedList.id}','${item.id}')"><span>${esc(item.name)}</span></label><b class="shopping-list-item-amount">${peso(item.estimatedAmount || 0)}</b>${itemMenu}</div>`;
                }).join('') : '<div class="shopping-list-empty"><b>No items yet</b><small>Tap Add item to start your list.</small></div>';
                const linkedExpense = D.tx.find(transaction =>
                    transaction.id === selectedList.expenseTransactionId && transaction.type === 'expense'
                );
                const expenseAction = linkedExpense
                    ? `<div class="shopping-list-expense"><small>Expense recorded · ${peso(linkedExpense.amount)} · ${fd(linkedExpense.date)}</small><button type="button" class="chip" onclick="editTx('${linkedExpense.id}')">Edit expense</button></div>`
                    : `<small class="shopping-list-expense-status">Expense not recorded yet</small><button type="button" class="b1 shopping-list-action shopping-list-record-expense" onclick="recordShoppingListExpense('${selectedList.id}')">Record expense</button>`;
                const listMenu = window.PocketActionMenu.render({
                    owner: 'shopping-list',
                    entityId: selectedList.id,
                    label: `Shopping list options for ${selectedList.name}`,
                    className: 'shopping-list-total-menu',
                    triggerIcon: ic('more-horizontal'),
                    actions: [
                        { action: 'edit', label: 'Edit list', icon: ic('pencil') },
                        { action: 'delete', label: 'Delete list', icon: ic('trash-2'), destructive: true }
                    ]
                });
                return `${window.PocketFormScreenHeader({ back: 'shoppingLists', close: 'shoppingDashboard', shoppingList: true })}${window.PocketPageHeader({ eyebrow: 'SHOPPING LIST', title: selectedList.name })}<section class="card shopping-list-total-card"><div class="shopping-list-total-heading"><div class="shopping-list-total-copy"><small>Estimated total</small><strong class="shopping-list-total-amount">${peso(shoppingListEstimate(selectedList))}</strong></div>${listMenu}</div>${expenseAction}</section><section class="shopping-list-items-section"><div class="shopping-list-items-heading"><h3>Items</h3><small>${selectedList.items.length} item${selectedList.items.length === 1 ? '' : 's'}</small></div><div class="card shopping-list-items">${items}</div></section><div class="shopping-list-bottom-actions"><button type="button" class="b1 shopping-list-action" onclick="shoppingItemForm('${selectedList.id}')"><span>Add item</span></button><button type="button" class="b2 shopping-list-action shopping-list-back" onclick="closeShoppingList()"><span>Cancel</span></button></div>`
            }
            const lists = D.shoppingLists.map(list => {
                const estimate = shoppingListEstimate(list),
                    itemCount = list.items.length;
                return `<button type="button" class="shopping-list-summary" aria-label="Open ${esc(list.name)}, ${itemCount} item${itemCount === 1 ? '' : 's'}, estimated total ${peso(estimate)}" onclick="openShoppingList('${list.id}')"><span class="shopping-list-summary-topline"><span class="shopping-list-summary-icon">${ic('shopping-cart')}</span><span class="shopping-list-summary-copy"><b>${esc(list.name)}</b><small>${itemCount ? `${itemCount} item${itemCount === 1 ? '' : 's'}` : 'No items yet'}</small></span><span class="shopping-list-summary-arrow">${ic('arrow-right')}</span></span><span class="shopping-list-summary-total"><span>Estimated total</span><b>${peso(estimate)}</b></span></button>`
            }).join('');
            return `${window.PocketPageHeader({ eyebrow: 'BUY WITH A PLAN', title: 'Shopping lists', description: 'Organize what you need before you spend.' })}<div class="g g2 shopping-lists">${lists || '<div class="empty card">No shopping lists yet.</div>'}</div>`
        };

        document.addEventListener('pocket:action-menu', event => {
            const { owner, action, entityId } = event.detail || {};
            if (owner === 'shopping-list') {
                if (action === 'edit') shoppingListForm(entityId);
                else if (action === 'delete') deleteShoppingList(entityId);
            } else if (owner === 'shopping-list-item') {
                if (action === 'edit') shoppingItemForm(selectedShoppingListId, entityId);
                else if (action === 'delete') deleteShoppingItem(selectedShoppingListId, entityId);
            }
        });

    V.shop.openListForm = openShoppingListForm;
    V.shop.openItemForm = openShoppingItemForm;
    window.PocketFeatures['shop'] = V.shop;
})();
