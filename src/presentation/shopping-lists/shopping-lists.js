(() => {
    window.PocketFeatures = window.PocketFeatures || {};
        V.shop = () => {
            const selectedList = D.shoppingLists.find(list => list.id === selectedShoppingListId);
            if (selectedShoppingListId && !selectedList) selectedShoppingListId = '';
            if (selectedList) {
                const items = selectedList.items.length ? selectedList.items.map(item =>
                    `<div class="shopping-list-item${item.checked ? ' is-checked' : ''}"><label><input type="checkbox"${item.checked ? ' checked' : ''} onchange="toggleShoppingItem('${selectedList.id}','${item.id}')"><span>${esc(item.name)}</span></label><b class="shopping-list-item-amount">${peso(item.estimatedAmount || 0)}</b><button type="button" class="ib" aria-label="Edit ${esc(item.name)}" onclick="shoppingItemForm('${selectedList.id}','${item.id}')">${ic('pencil')}</button><button type="button" class="ib" aria-label="Remove ${esc(item.name)}" onclick="deleteShoppingItem('${selectedList.id}','${item.id}')">${ic('trash-2')}</button></div>`
                ).join('') : '<div class="shopping-list-empty"><b>No items yet</b><small>Tap Add item to start your list.</small></div>';
                const linkedExpense = D.tx.find(transaction =>
                    transaction.id === selectedList.expenseTransactionId && transaction.type === 'expense'
                );
                const expenseAction = linkedExpense
                    ? `<div class="shopping-list-expense"><small>Expense recorded · ${peso(linkedExpense.amount)} · ${fd(linkedExpense.date)}</small><button type="button" class="chip" onclick="editTx('${linkedExpense.id}')">Edit</button></div>`
                    : `<div class="shopping-list-expense"><small>Expense not recorded yet</small><button type="button" class="b1" onclick="recordShoppingListExpense('${selectedList.id}')">Record expense</button></div>`;
                return `<div class="row sp"><div><h2>Shopping List</h2></div><button type="button" class="chip" onclick="closeShoppingList()">All lists</button></div><section class="card shopping-list-detail"><div class="shopping-list-heading"><div class="gr"><h3>${esc(selectedList.name)}</h3></div><button type="button" class="ib" aria-label="Rename ${esc(selectedList.name)}" onclick="shoppingListForm('${selectedList.id}')">${ic('pencil')}</button><button type="button" class="ib" aria-label="Delete ${esc(selectedList.name)}" onclick="deleteShoppingList('${selectedList.id}')">${ic('trash-2')}</button></div><div class="row sp shopping-list-total"><span>Estimated amount</span><b>${peso(shoppingListEstimate(selectedList))}</b></div>${expenseAction}<div class="shopping-list-items">${items}</div></section>`
            }
            const lists = D.shoppingLists.map(list => {
                const estimate = shoppingListEstimate(list),
                    remaining = list.items.filter(item => !item.checked).length;
                return `<button type="button" class="shopping-list-summary" aria-label="Open ${esc(list.name)}, ${remaining} item${remaining === 1 ? '' : 's'} remaining, estimated amount ${peso(estimate)}" onclick="openShoppingList('${list.id}')"><span class="shopping-list-summary-icon">${ic('shopping-bag')}</span><span class="shopping-list-summary-copy"><b>${esc(list.name)}</b><small>${remaining} item${remaining === 1 ? '' : 's'} remaining</small></span><b class="shopping-list-summary-amount">${peso(estimate)}</b>${ic('chevron-right')}</button>`
            }).join('');
            return `<div class="row sp"><div><h2>Shopping List</h2><small>Organize what you need to buy.</small></div></div><div class="g g2 shopping-lists">${lists || '<div class="empty card">No shopping lists yet. Tap “Add list” to create one.</div>'}</div>`
        };

    window.PocketFeatures['shop'] = V.shop;
})();
