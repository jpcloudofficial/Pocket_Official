(() => {
    window.PocketFeatures = window.PocketFeatures || {};
        V.shop = () => {
            const selectedList = D.shoppingLists.find(list => list.id === selectedShoppingListId);
            if (selectedShoppingListId && !selectedList) selectedShoppingListId = '';
            if (selectedList) {
                const items = selectedList.items.length ? selectedList.items.map(item =>
                    `<div class="shopping-list-item${item.checked ? ' is-checked' : ''}"><label><input type="checkbox"${item.checked ? ' checked' : ''} onchange="toggleShoppingItem('${selectedList.id}','${item.id}')"><span>${esc(item.name)}</span></label><b class="shopping-list-item-amount">${peso(item.estimatedAmount || 0)}</b><details class="shopping-list-item-menu"><summary class="ib" aria-label="Options for ${esc(item.name)}">${ic('more-horizontal')}</summary><div class="shopping-list-item-menu-options"><button type="button" onclick="shoppingItemForm('${selectedList.id}','${item.id}')">Edit item</button><button type="button" onclick="deleteShoppingItem('${selectedList.id}','${item.id}')">Remove item</button></div></details></div>`
                ).join('') : '<div class="shopping-list-empty"><b>No items yet</b><small>Tap Add item to start your list.</small></div>';
                const linkedExpense = D.tx.find(transaction =>
                    transaction.id === selectedList.expenseTransactionId && transaction.type === 'expense'
                );
                const expenseAction = linkedExpense
                    ? `<div class="shopping-list-expense"><small>Expense recorded · ${peso(linkedExpense.amount)} · ${fd(linkedExpense.date)}</small><button type="button" class="chip" onclick="editTx('${linkedExpense.id}')">Edit expense</button></div>`
                    : `<small class="shopping-list-expense-status">Expense not recorded yet</small><button type="button" class="b1 shopping-list-action shopping-list-record-expense" onclick="recordShoppingListExpense('${selectedList.id}')">Record expense</button>`;
                return `${window.PocketFormScreenHeader({ back: 'shoppingLists', close: 'shoppingDashboard', shoppingList: true })}${window.PocketPageHeader({ eyebrow: 'SHOPPING LIST', title: selectedList.name })}<section class="card shopping-list-total-card"><small>Estimated total</small><strong class="shopping-list-total-amount">${peso(shoppingListEstimate(selectedList))}</strong>${expenseAction}</section><section class="shopping-list-items-section"><div class="shopping-list-items-heading"><h3>Items</h3><small>${selectedList.items.length} item${selectedList.items.length === 1 ? '' : 's'}</small></div><div class="card shopping-list-items">${items}</div></section><div class="shopping-list-bottom-actions"><button type="button" class="b1 shopping-list-action" onclick="shoppingItemForm('${selectedList.id}')">${ic('plus')}<span>Add item</span></button><button type="button" class="b2 shopping-list-action shopping-list-back" onclick="closeShoppingList()">${ic('arrow-left')}<span>All lists</span></button></div>`
            }
            const lists = D.shoppingLists.map(list => {
                const estimate = shoppingListEstimate(list),
                    itemCount = list.items.length;
                return `<button type="button" class="shopping-list-summary" aria-label="Open ${esc(list.name)}, ${itemCount} item${itemCount === 1 ? '' : 's'}, estimated total ${peso(estimate)}" onclick="openShoppingList('${list.id}')"><span class="shopping-list-summary-topline"><span class="shopping-list-summary-icon">${ic('shopping-cart')}</span><span class="shopping-list-summary-copy"><b>${esc(list.name)}</b><small>${itemCount ? `${itemCount} item${itemCount === 1 ? '' : 's'}` : 'No items yet'}</small></span><span class="shopping-list-summary-arrow">${ic('arrow-right')}</span></span><span class="shopping-list-summary-total"><span>Estimated total</span><b>${peso(estimate)}</b></span></button>`
            }).join('');
            return `${window.PocketPageHeader({ eyebrow: 'BUY WITH A PLAN', title: 'Shopping lists', description: 'Organize what you need before you spend.' })}<div class="g g2 shopping-lists">${lists || '<div class="empty card">No shopping lists yet.</div>'}</div><button type="button" class="b1 shopping-list-action" onclick="shoppingListForm()">${ic('plus')}<span>Add list</span></button>`
        };

    window.PocketFeatures['shop'] = V.shop;
})();
