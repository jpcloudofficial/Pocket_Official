(() => {
    window.PocketFeatures = window.PocketFeatures || {};
    const groups = [
        ['Daily', 'Daily expenses'],
        ['Financial', 'Financial transactions'],
        ['Income', 'Income']
    ];

    V.cat = () => {
        const groupMarkup = groups.map(([group, title]) => {
            const categories = D.cats
                .filter(category => category.g === group)
                .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }) || a.id.localeCompare(b.id));
            const rows = categories.map(category => `
                <div class="category-row">
                    <span class="category-icon" style="background:${category.color}22;color:${category.color}">
                        ${ic(category.icon)}
                    </span>
                    <b class="category-name">${esc(category.name)}</b>
                    <span class="category-actions">
                        <button type="button" class="ib category-action" aria-label="Edit ${esc(category.name)}" onclick="catForm('${category.id}')">${ic('pencil')}</button>
                        <button type="button" class="ib category-action category-delete-action" aria-label="Delete ${esc(category.name)}" onclick="delCat('${category.id}')">${ic('trash-2')}</button>
                    </span>
                </div>`).join('');
            const groupId = `category-group-${group.toLowerCase()}`;

            return `
                <section class="card categories-group" aria-labelledby="${groupId}">
                    <header class="categories-group-heading">
                        <h3 id="${groupId}">${title}</h3>
                        <span class="categories-group-count">${categories.length} ${categories.length === 1 ? 'category' : 'categories'}</span>
                    </header>
                    <div class="categories-list">${rows || '<p class="categories-empty">No categories yet.</p>'}</div>
                </section>`;
        }).join('');

        return `${window.PocketPageHeader({ eyebrow: 'ORGANIZE YOUR MONEY', title: 'Categories' })}<div class="categories-groups">${groupMarkup}</div>`;
    };

    window.PocketFeatures['cat'] = V.cat;
})();
