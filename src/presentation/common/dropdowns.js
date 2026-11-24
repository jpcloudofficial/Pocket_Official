(() => {
    const iconMarkup = name => {
        if (typeof window.ic === 'function') return window.ic(name);
        const paths = {
            x: '<path d="M18 6 6 18M6 6l12 12"></path>',
            search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>'
        };
        return paths[name]
            ? `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`
            : '';
    };

    function wireSelectPicker(select, trigger, label, options = {}) {
        const searchable = options.mode === 'search',
            updateTrigger = () => {
                const text = select.options[select.selectedIndex]?.textContent || '';
                trigger.textContent = text;
                trigger.setAttribute('aria-label', `${label}: ${text}`)
            };
        select.addEventListener('change', updateTrigger);
        trigger.addEventListener('click', () => {
            const overlay = document.createElement('div'),
                menu = document.createElement('div'),
                isTransactionFilter = Boolean(trigger.closest('.transaction-filters'));
            overlay.className = 'pocket-select-overlay';
            menu.className = 'pocket-select-menu';
            if (isTransactionFilter) menu.classList.add('transaction-filter-menu');
            if (searchable) {
                overlay.classList.add('pocket-select-search-overlay');
                menu.classList.add('pocket-select-search-menu');
                menu.setAttribute('role', 'dialog');
                menu.setAttribute('aria-modal', 'true');
                menu.setAttribute('aria-labelledby', 'pocket-select-search-title');
            } else {
                menu.setAttribute('role', 'listbox');
                menu.setAttribute('aria-label', label);
            }
            let closing = false;
            const closePicker = (restoreFocus = true) => {
                window.removeEventListener('scroll', closeOnScroll, true);
                window.removeEventListener('resize', closeOnResize);
                if (!overlay.isConnected || closing) return;
                closing = true;
                menu.classList.add('is-closing');
                trigger.setAttribute('aria-expanded', 'false');
                window.setTimeout(() => overlay.remove(),
                    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 140);
                if (restoreFocus && trigger.isConnected) trigger.focus({ preventScroll: true })
            };
            const closeOnScroll = event => {
                if (!menu.contains(event.target)) closePicker(false)
            };
            const closeOnResize = () => {
                if (searchable) {
                    menu.style.maxHeight = `${Math.min(window.innerHeight * .76, 640)}px`;
                    return;
                }
                closePicker(false)
            };
            overlay.closePicker = closePicker;
            overlay.addEventListener('click', event => {
                if (event.target === overlay) closePicker()
            });
            let optionsList = menu,
                searchInput,
                noResults;
            if (searchable) {
                const header = document.createElement('div'),
                    heading = document.createElement('div'),
                    eyebrow = document.createElement('small'),
                    title = document.createElement('h2'),
                    closeButton = document.createElement('button'),
                    search = document.createElement('label'),
                    searchIcon = document.createElement('span');
                header.className = 'pocket-select-search-header';
                heading.className = 'pocket-select-search-heading';
                eyebrow.textContent = options.eyebrow || '';
                title.id = 'pocket-select-search-title';
                title.textContent = options.title || label;
                closeButton.type = 'button';
                closeButton.className = 'pocket-select-search-close';
                closeButton.setAttribute('aria-label', options.closeLabel || 'Close picker');
                closeButton.innerHTML = iconMarkup('x');
                search.className = 'pocket-select-search-field';
                searchIcon.setAttribute('aria-hidden', 'true');
                searchIcon.innerHTML = iconMarkup('search');
                searchInput = document.createElement('input');
                searchInput.type = 'search';
                searchInput.placeholder = options.searchPlaceholder || `Search ${label.toLowerCase()}`;
                searchInput.setAttribute('aria-label', searchInput.placeholder);
                searchInput.autocomplete = 'off';
                optionsList = document.createElement('div');
                optionsList.className = 'pocket-select-search-options';
                optionsList.setAttribute('role', 'listbox');
                optionsList.setAttribute('aria-label', label);
                noResults = document.createElement('p');
                noResults.className = 'pocket-select-search-empty';
                noResults.setAttribute('role', 'status');
                noResults.textContent = options.noResults || 'No matching options.';
                noResults.hidden = true;
                heading.append(eyebrow, title);
                header.append(heading, closeButton);
                search.append(searchIcon, searchInput);
                menu.append(header, search, optionsList, noResults);
                closeButton.addEventListener('click', () => closePicker());
            }
            const availableOptions = Array.from(select.options).filter(option => !option.disabled),
                optionButtons = [];
            availableOptions.forEach(option => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'pocket-select-option';
                item.setAttribute('role', 'option');
                item.setAttribute('aria-selected', String(option.value === select.value));
                item.textContent = option.textContent;
                item.addEventListener('click', () => {
                    select.value = option.value;
                    closePicker();
                    select.dispatchEvent(new Event('change', { bubbles: true }))
                });
                optionButtons.push({ value: option.value, button: item });
                optionsList.append(item)
            });
            if (searchable) {
                searchInput.addEventListener('input', () => {
                    const query = searchInput.value.trim().toLocaleLowerCase();
                    let matchCount = 0;
                    optionsList.querySelectorAll('.pocket-select-option').forEach(item => {
                        item.hidden = !item.textContent.toLocaleLowerCase().includes(query);
                        if (!item.hidden) matchCount += 1
                    });
                    noResults.hidden = matchCount > 0
                })
            }
            menu.addEventListener('keydown', event => {
                if (event.key === 'Escape') {
                    event.preventDefault();
                    closePicker()
                } else if (searchable && event.target === searchInput) {
                    if (event.key === 'ArrowDown') {
                        const firstOption = optionsList.querySelector('.pocket-select-option:not([hidden])');
                        if (firstOption) {
                            event.preventDefault();
                            firstOption.focus()
                        }
                    }
                } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
                    const items = Array.from(optionsList.querySelectorAll('.pocket-select-option:not([hidden])')),
                        index = items.indexOf(document.activeElement),
                        next = event.key === 'Home' ? 0 :
                            event.key === 'End' ? items.length - 1 :
                                (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
                    if (items.length) {
                        event.preventDefault();
                        items[next].focus()
                    }
                }
            });
            const bounds = trigger.getBoundingClientRect(),
                visualViewport = window.visualViewport,
                viewportTop = visualViewport?.offsetTop || 0,
                viewportLeft = visualViewport?.offsetLeft || 0,
                viewportWidth = visualViewport?.width || document.documentElement.clientWidth || window.innerWidth,
                viewportHeight = visualViewport?.height || window.innerHeight,
                viewportRight = viewportLeft + viewportWidth,
                viewportBottom = viewportTop + viewportHeight,
                minWidth = isTransactionFilter ? Math.min(220, viewportWidth - 16) : bounds.width,
                width = Math.min(Math.max(bounds.width, minWidth), viewportWidth - 16),
                left = Math.max(viewportLeft + 8, Math.min(bounds.left, viewportRight - width - 8)),
                spaceAbove = Math.max(0, bounds.top - viewportTop - 8),
                spaceBelow = Math.max(0, viewportBottom - bounds.bottom - 8),
                maxContentHeight = Math.min(
                    window.matchMedia('(max-width: 760px)').matches ? 320 : 220,
                    Math.max(48, availableOptions.length * 49 + 2)
                ),
                opensAbove = spaceBelow < maxContentHeight && spaceAbove > spaceBelow,
                maxHeight = Math.max(48, Math.min(maxContentHeight, opensAbove ? spaceAbove : spaceBelow));
            if (searchable) {
                menu.style.position = 'relative';
                menu.style.left = 'auto';
                menu.style.top = 'auto';
                menu.style.width = '100%';
                menu.style.maxHeight = `${Math.min(window.innerHeight * .76, 640)}px`
            } else {
                menu.classList.toggle('opens-up', opensAbove);
                menu.style.position = 'fixed';
                menu.style.left = `${left}px`;
                menu.style.top = `${opensAbove ? bounds.top - maxHeight - 4 : bounds.bottom + 4}px`;
                menu.style.width = `${width}px`;
                menu.style.maxHeight = `${maxHeight}px`
            }
            overlay.append(menu);
            document.body.append(overlay);
            window.addEventListener('scroll', closeOnScroll, true);
            window.addEventListener('resize', closeOnResize);
            trigger.setAttribute('aria-expanded', 'true');
            const initialOption = optionButtons.find(option => option.value === select.value)?.button ||
                (searchable ? optionsList.querySelector('.pocket-select-option') : menu.querySelector('button'));
            if (searchable) {
                if (window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0) {
                    menu.querySelector('.pocket-select-search-close').focus({ preventScroll: true })
                } else {
                    searchInput.focus({ preventScroll: true })
                }
                if (initialOption) optionsList.scrollTop = initialOption.offsetTop - optionsList.offsetTop
            } else {
                (initialOption || trigger).focus({ preventScroll: true });
                if (initialOption) menu.scrollTop = initialOption.offsetTop
            }
        })
    }

    function wireRenderedSelects(root) {
        root.querySelectorAll('select').forEach(select => {
            if (select.hidden) return;
            const selected = select.options[select.selectedIndex],
                label = select.getAttribute('aria-label') || 'Choose an option',
                trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.className = 'form-select-trigger';
            trigger.setAttribute('aria-haspopup', 'listbox');
            trigger.setAttribute('aria-expanded', 'false');
            trigger.textContent = selected?.textContent || '';
            trigger.setAttribute('aria-label', `${label}: ${trigger.textContent}`);
            select.hidden = true;
            select.setAttribute('aria-hidden', 'true');
            select.tabIndex = -1;
            select.insertAdjacentElement('afterend', trigger);
            wireSelectPicker(select, trigger, label)
        })
    }

    window.PocketDropdowns = { wireSelectPicker, wireRenderedSelects };
})();
