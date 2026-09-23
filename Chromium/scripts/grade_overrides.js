// Local display overrides. Never writes to Somtoday or replaces its grade text.
const SomtodayGradeOverrides = (() => {
    const PREFIX = 'mod_grade_override_v1:';
    const ENABLED = 'mod_grade_overrides_enabled';
    const ROOTS = 'sl-laatsteresultaten, sl-vakgemiddelden';
    const ATTR = 'data-mod-grade-value';
    let started = false, enabled = false, ready = false, scheduled = false;
    let values = Object.create(null);
    const painted = new Map();
    const text = element => (element?.textContent || '').replace(/\s+/g, ' ').trim();

    function normalize(value) {
        if (typeof value !== 'string') return null;
        value = value.trim();
        if (!value) return '';
        if (/^\d{1,2}([.,]\d{1,2})?$/.test(value)) {
            const number = Number(value.replace(',', '.'));
            return number >= 1 && number <= 10 ? value.replace('.', ',') : null;
        }
        return /^[a-zA-Z+\-]{1,6}$/.test(value) ? value.toUpperCase() : null;
    }

    function keyFor(scope, kind, year, subject, detail, type) {
        return PREFIX + JSON.stringify([scope, kind, year, subject, detail, type]);
    }

    function scope() {
        const avatar = document.querySelector('hmy-avatar img[src*="/pasfoto/"]');
        const photoId = avatar?.getAttribute('src')?.match(/\/pasfoto\/([^?#]+)/)?.[1];
        // Do not guess an account from initials or a nickname shared by other students.
        return photoId ? location.origin + ':' + photoId : null;
    }

    function entries() {
        const account = scope();
        if (!account) return [];
        const results = [];
        for (const root of document.querySelectorAll(ROOTS)) {
            const average = root.matches('sl-vakgemiddelden');
            const now = new Date();
            const start = now.getFullYear() - (now.getMonth() < 7 ? 1 : 0);
            const year = text(root.querySelector('sl-dropdown')) || `${start}/${start + 1}`;
            const cards = root.querySelectorAll(average ? 'sl-vakgemiddelde-item' : 'sl-resultaat-item');
            for (const card of cards) {
                const subject = text(card.querySelector(average ? '.vak > span' : '.titel'));
                const detail = average ? '' : text(card.querySelector('.subtitel'));
                if (!subject || (!average && !detail)) continue;
                for (const grade of card.querySelectorAll('.cijfer')) {
                    // Use the innermost grade container, never a whole card.
                    if (grade.querySelector('.cijfer') || !text(grade)) continue;
                    const type = average ? grade.closest('sl-vakgemiddelde-item-cijfer')?.getAttribute('type') : text(card.querySelector('.weging'));
                    if (average && !type) continue;
                    const key = keyFor(account, average ? 'average' : 'recent', year, subject, detail, type || 'grade');
                    results.push({ key, grade, label: [subject, detail, type].filter(Boolean).join(' · '), original: text(grade) });
                }
            }
        }
        // Ambiguous cards must never inherit another card's saved override.
        const counts = new Map();
        for (const entry of results) counts.set(entry.key, (counts.get(entry.key) || 0) + 1);
        return results.filter(entry => counts.get(entry.key) === 1);
    }

    function restore(grade, old) {
        grade.removeAttribute(ATTR);
        if (grade.getAttribute('aria-label') === old.appliedLabel) {
            if (old.label === null) grade.removeAttribute('aria-label');
            else grade.setAttribute('aria-label', old.label);
        }
        if (grade.getAttribute('title') === old.appliedLabel) {
            if (old.title === null) grade.removeAttribute('title');
            else grade.setAttribute('title', old.title);
        }
        painted.delete(grade);
    }

    function refresh() {
        if (!ready) return;
        const current = entries();
        const active = new Set();
        for (const entry of current) {
            const value = enabled && values[entry.key];
            if (!value) continue;
            active.add(entry.grade);
            let old = painted.get(entry.grade);
            if (!old) {
                old = { label: entry.grade.getAttribute('aria-label'), title: entry.grade.getAttribute('title') };
                painted.set(entry.grade, old);
            }
            const label = `${value} (lokaal aangepast; origineel ${entry.original})`;
            if (entry.grade.getAttribute(ATTR) !== value) entry.grade.setAttribute(ATTR, value);
            if (entry.grade.getAttribute('aria-label') !== label) entry.grade.setAttribute('aria-label', label);
            if (entry.grade.getAttribute('title') !== label) entry.grade.setAttribute('title', label);
            old.appliedLabel = label;
        }
        for (const [grade, old] of painted) if (!active.has(grade)) restore(grade, old);
        for (const root of document.querySelectorAll(ROOTS)) {
            let toolbar = root.querySelector('.mod-grade-toolbar');
            if (!toolbar) {
                toolbar = document.createElement('div');
                toolbar.className = 'mod-grade-toolbar';
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'mod-button';
                button.textContent = 'Lokale cijfers aanpassen';
                button.addEventListener('click', open);
                toolbar.append(button);
                root.prepend(toolbar);
            }
        }
    }

    function schedule() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => { scheduled = false; refresh(); });
    }

    function element(tag, content, className) {
        const node = document.createElement(tag);
        if (content) node.textContent = content;
        if (className) node.className = className;
        return node;
    }

    function open() {
        if (document.getElementById('mod-grade-dialog')) return;
        const account = scope();
        const list = entries();
        const dialog = element('dialog', '', 'mod-grade-dialog');
        dialog.id = 'mod-grade-dialog';
        dialog.setAttribute('aria-labelledby', 'mod-grade-dialog-title');
        const title = element('h2', 'Lokale cijfers');
        title.id = 'mod-grade-dialog-title';
        dialog.append(title, element('p', 'Pas de weergave aan op deze browser. Opgeslagen wijzigingen blijven na vernieuwen staan. Officiële cijfers, berekeningen en exports blijven ongewijzigd. Vakgemiddelden stel je apart in.'));
        const status = element('p');
        status.setAttribute('role', 'status');
        const toggleLabel = element('label', '', 'mod-grade-toggle');
        const toggle = element('input');
        toggle.type = 'checkbox';
        toggle.checked = enabled;
        toggle.disabled = !ready;
        toggleLabel.append(toggle, document.createTextNode(' Lokale wijzigingen tonen'));
        toggle.addEventListener('change', async () => {
            toggle.disabled = true;
            try {
                await chrome.storage.local.set({ [ENABLED]: toggle.checked });
                enabled = toggle.checked;
                refresh();
                status.textContent = enabled ? 'Lokale wijzigingen ingeschakeld.' : 'Originele cijfers zichtbaar. Je wijzigingen blijven bewaard.';
            } catch { toggle.checked = enabled; status.textContent = 'Opslaan mislukt. Probeer opnieuw.'; }
            finally { toggle.disabled = false; }
        });
        dialog.append(toggleLabel);
        if (!account) dialog.append(element('p', 'Je profiel kon niet veilig worden herkend. Open deze pagina met een geladen Somtoday-profielfoto en probeer opnieuw.'));
        else if (!list.length) dialog.append(element('p', 'Geen bewerkbare cijfers op deze pagina. Open Laatste cijfers of Vakgemiddelden met beschikbare cijfers. Dubbele of onbekende cijferkaarten worden overgeslagen.'));
        const rows = element('div', '', 'mod-grade-rows');
        const inputs = [];
        for (const entry of list) {
            const row = element('form', '', 'mod-grade-row');
            const label = element('label', entry.label);
            const input = element('input');
            input.type = 'text';
            input.maxLength = 6;
            input.value = values[entry.key] || '';
            input.placeholder = entry.original;
            input.autocomplete = 'off';
            label.append(element('small', `Somtoday: ${entry.original}`), input);
            inputs.push(input);
            const save = element('button', 'Opslaan', 'mod-button');
            save.type = 'submit';
            const reset = element('button', 'Herstellen', 'mod-button');
            reset.type = 'button';
            async function persist(value) {
                save.disabled = reset.disabled = true;
                try {
                    if (scope() !== account) throw new Error('Profile changed');
                    if (value) {
                        await chrome.storage.local.set({ [entry.key]: value, [ENABLED]: true });
                        values[entry.key] = value;
                        enabled = toggle.checked = true;
                    } else {
                        await chrome.storage.local.remove(entry.key);
                        delete values[entry.key];
                    }
                    input.value = value;
                    refresh();
                    status.textContent = value ? 'Opgeslagen op deze browser. Blijft staan na vernieuwen.' : 'Origineel hersteld.';
                } catch { status.textContent = 'Opslaan mislukt of profiel gewijzigd. Sluit dit venster en probeer opnieuw.'; }
                finally { save.disabled = reset.disabled = false; }
            }
            row.addEventListener('submit', event => {
                event.preventDefault();
                const value = normalize(input.value);
                if (value === null) { status.textContent = 'Gebruik een cijfer van 1 t/m 10 (maximaal 2 decimalen) of een korte letterbeoordeling, zoals V. Leeg betekent herstellen.'; return; }
                void persist(value);
            });
            reset.addEventListener('click', () => void persist(''));
            row.append(label, save, reset);
            rows.append(row);
        }
        dialog.append(rows, status);
        const footer = element('div', '', 'mod-grade-footer');
        const clear = element('button', 'Alle lokale cijfers herstellen', 'mod-button');
        clear.type = 'button';
        clear.disabled = !account;
        clear.addEventListener('click', async () => {
            clear.disabled = true;
            try {
                if (scope() !== account) throw new Error('Profile changed');
                const keys = Object.keys(values).filter(key => {
                    try { return JSON.parse(key.slice(PREFIX.length))[0] === account; } catch { return false; }
                });
                await chrome.storage.local.remove(keys);
                for (const key of keys) delete values[key];
                for (const input of inputs) input.value = '';
                refresh();
                status.textContent = 'Alle lokale cijfers voor dit profiel zijn hersteld, inclusief andere schooljaren.';
            } catch { status.textContent = 'Herstellen mislukt. Probeer opnieuw.'; }
            finally { clear.disabled = !account; }
        });
        const close = element('button', 'Sluiten', 'mod-button');
        close.type = 'button';
        close.addEventListener('click', () => dialog.close());
        footer.append(clear, close);
        dialog.append(footer);
        dialog.addEventListener('close', () => dialog.remove());
        document.body.append(dialog);
        dialog.showModal();
    }

    async function start() {
        if (started) return;
        started = true;
        try {
            const stored = await chrome.storage.local.get(null);
            for (const [key, value] of Object.entries(stored)) {
                if (key.startsWith(PREFIX) && normalize(value)) values[key] = normalize(value);
            }
            enabled = stored[ENABLED] === true;
            ready = true;
            chrome.storage.onChanged.addListener((changes, area) => {
                if (area !== 'local') return;
                for (const [key, change] of Object.entries(changes)) {
                    if (key === ENABLED) enabled = change.newValue === true;
                    if (!key.startsWith(PREFIX)) continue;
                    const value = normalize(change.newValue);
                    if (value) values[key] = value;
                    else delete values[key];
                }
                schedule();
            });
            const observer = new MutationObserver(schedule);
            observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['src', 'type'] });
            refresh();
        } catch { started = false; console.warn('Somtoday Mod: lokale cijfers konden niet worden geladen.'); }
    }
    return { start, open, normalize, keyFor };
})();
