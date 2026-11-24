(() => {
    window.PocketFeatures = window.PocketFeatures || {};
        V.cat = () =>
            `<div class="row sp"><h2>Categories</h2></div>${[['Daily','Daily expenses'],['Financial','Financial transactions'],['Income','Income']].map(([g,l])=>`<div class="card" style="margin-top:14px"><h3>${l}</h3>${D.cats.filter(c=>c.g===g).sort((a,b)=>a.name.localeCompare(b.name,undefined,{sensitivity:'base'})||a.id.localeCompare(b.id)).map(c=>`<div class="tx"><span class="dot" style="background:${c.color}22;color:${c.color}">${ic(c.icon)}</span><b class="gr">${esc(c.name)}</b><button class="ib" onclick="catForm('${c.id}')">${ic('pencil')}</button><button class="ib" onclick="delCat('${c.id}')">${ic('trash-2')}</button></div>`).join('')}</div>`).join('')}`;

    window.PocketFeatures['cat'] = V.cat;
})();
