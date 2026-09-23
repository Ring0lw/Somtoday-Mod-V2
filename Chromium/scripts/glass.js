// Optional, component-scoped glass styling. No Somtoday content is read or stored.
const SomtodayGlass = (() => {
    const groups = [
        { id: 'other', label: 'Overige panelen', scopes: ['sl-home', 'sl-plaatsingen', 'sl-registraties', 'sl-gepubliceerde-schoolinformatie'], surfaces: ['sl-plaatsingen', 'sl-registratie-overzicht', 'sl-gepubliceerde-schoolinformatie .content', 'hmy-geen-data'] },
        { id: 'roster', label: 'Rooster en lesblokken', scopes: ['sl-rooster', 'sl-rooster-item'], surfaces: ['sl-rooster-item', 'sl-rooster-huiswerk-stack .card'] },
        { id: 'study', label: 'Huiswerk en studiewijzers', scopes: ['sl-studiewijzer', 'sl-studiewijzer-item', 'sl-studiemateriaal'], surfaces: ['sl-studiewijzer-item', 'sl-studiewijzer-week', 'sl-studiemateriaal .card'] },
        { id: 'grades', label: 'Cijfers en vakgemiddelden', scopes: ['sl-cijfers'], surfaces: ['sl-laatste-resultaat-item', 'sl-vakresultaat-item', 'sl-vakgemiddelden .vakken', 'sl-cijfer-overzicht .vakken', 'sl-volgende-publicatiemoment'] },
        { id: 'messages', label: 'Berichten', scopes: ['sl-berichten', 'sl-bericht-detail', 'sl-bericht-nieuw'], surfaces: ['sl-bericht-samenvatting', 'sl-bericht-detail .header', '.nieuw-bericht-form'] },
        { id: 'navigation', label: 'Navigatie en menubalk', scopes: ['sl-header', 'sl-tab-bar', '#mod-top-menu'], surfaces: ['sl-header', 'sl-tab-bar', '#mod-top-menu'] },
        { id: 'headers', label: 'Roosterheaders, tijdbalk en tabs', scopes: ['.headers-container', 'sl-dagen-header', 'sl-rooster-tijden', 'sl-scrollable-title', 'sl-studiewijzer-weken-header', 'sl-home .tabs', 'hmy-switch-group'], surfaces: ['.headers-container', 'sl-dagen-header', 'sl-rooster-tijden', 'sl-scrollable-title', 'sl-studiewijzer-weken-header', 'sl-home .tabs', 'hmy-switch-group'] },
        { id: 'panels', label: 'Pop-ups, zijpanelen en Mod-menu', scopes: ['sl-sidebar > .content-container', 'sl-modal .content-container', 'sl-sidebar-page', 'hmy-popup', 'sl-popup', 'sl-leerling-menu-acties', '#mod-grade-dialog'], surfaces: ['sl-sidebar > .content-container', 'sl-modal .content-container', 'sl-sidebar-page', 'hmy-popup', 'sl-popup', '#mod-grade-dialog'] },
        { id: 'details', label: 'Detailvakken: tijd, locatie en omschrijving', scopes: ['sl-rooster-item-detail .tijd-locatie', 'sl-rooster-item-detail .inhoud', 'sl-rooster-item-detail .buttons'], surfaces: ['sl-rooster-item-detail .tijd-locatie .blok', 'sl-rooster-item-detail .inhoud', 'sl-rooster-item-detail .buttons'] },
        { id: 'badges', label: 'Labels, tijdsaanduidingen en icoonachtergronden', scopes: ['hmy-pill', 'hmy-tag', 'hmy-internal-tag', 'hmy-icon-plate'], surfaces: ['hmy-pill', 'hmy-internal-tag', 'hmy-icon-plate'] },
        { id: 'overlay', label: 'Donkere laag achter pop-ups', scopes: ['sl-modal > .background', 'sl-sidebar > .background'], surfaces: ['sl-modal > .background', 'sl-sidebar > .background'] },
        { id: 'controls', label: 'Knoppen, zoekvelden en keuzelijsten', scopes: ['sl-modal .sluiten-icon', 'hmy-button', 'sl-dropdown', 'hmy-dropdown', 'sl-studiewijzer-filter-button', 'sl-root input:not([type="checkbox"]):not([type="radio"])', 'sl-root textarea', 'sl-root select', 'sl-modal input:not([type="checkbox"]):not([type="radio"])', 'sl-modal textarea', 'sl-modal select'], surfaces: ['sl-modal .sluiten-icon', 'hmy-button button', 'sl-dropdown', 'hmy-dropdown', 'sl-studiewijzer-filter-button', 'sl-root input:not([type="checkbox"]):not([type="radio"])', 'sl-root textarea', 'sl-root select'] }
    ];
    const defaults = { glass_enabled: false, glass_transparency: 45, glass_blur: 12 };
    for (const group of groups) defaults[`glass_${group.id}`] = true;
    defaults.glass_overlay = false;
    const keys = Object.keys(defaults);
    const tokens = ['--bg-mask-normal'];
    for (const family of ['neutral', 'elevated', 'primary', 'accent', 'warning', 'negative', 'positive', 'alternative']) {
        for (const strength of ['none', 'weakest', 'weak', 'moderate', 'normal', 'strong', 'strongest', 'max']) {
            tokens.push(`--bg-${family}-${strength}`);
        }
    }
    const isBoolean = value => typeof value === 'boolean' || value === 'true' || value === 'false';
    function valid(key, value) {
        if (!keys.includes(key)) return false;
        if (typeof defaults[key] === 'boolean') return isBoolean(value);
        return (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) &&
            Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= (key === 'glass_blur' ? 40 : 100);
    }
    function read(get) {
        return Object.fromEntries(keys.map(key => {
            const value = get(key);
            return [key, valid(key, value) ? (typeof defaults[key] === 'boolean' ? value === true || value === 'true' : Number(value)) : defaults[key]];
        }));
    }
    const enabled = get => read(get).glass_enabled;
    const scoped = selectors => `:root.mod-glass-enabled :is(${selectors.join(',')}):not(#mod-setting-panel, #mod-setting-panel *, #somtoday-mod, #somtoday-mod *)`;
    function palette(solid) {
        return tokens.map(token => `${token}:color-mix(in srgb,var(--mod-glass-original${token}) ${solid}%,transparent);`).join('');
    }
    function buildCss(settings, primaryColor, layout) {
        if (!settings.glass_enabled) return '';
        const solid = 100 - settings.glass_transparency;
        const blur = settings.glass_blur > 0 && solid < 100 ? `${settings.glass_blur}px` : '0px';
        // Aliases resolve on :root before being inherited. Scoped overrides cannot
        // feed back into their originals, and theme changes need no DOM scanning.
        let css = `:root.mod-glass-enabled{${tokens.map(token => `--mod-glass-original${token}:var(${token},var(--bg-neutral-none));`).join('')}}`;
        for (const group of groups) {
            const active = settings[`glass_${group.id}`];
            css += `${scoped(group.scopes)}{${palette(active ? solid : 100)}}`;
            css += `${scoped(group.surfaces)}{-webkit-backdrop-filter:${active ? `blur(${blur})` : 'none'}!important;backdrop-filter:${active ? `blur(${blur})` : 'none'}!important;}`;
        }
        // A single blur layer per painted surface avoids repeatedly blurring
        // nested buttons, headers and cards (and keeps fixed popup positioning).
        const surfaces = groups.filter(group => settings[`glass_${group.id}`]).flatMap(group => group.surfaces).join(',');
        if (surfaces) css += `${scoped(groups.flatMap(group => group.surfaces))}:is(:is(${surfaces}) *){-webkit-backdrop-filter:none!important;backdrop-filter:none!important;}`;
        // Remove opaque nested chrome while retaining coloured indicators/cards.
        if (settings.glass_headers && solid < 100) {
            css += `${scoped(['sl-dagen-header sl-dag-header-tab', '.headers-container .week-nummer', '.headers-container sl-dagen-header', '.headers-container sl-scrollable-title', 'sl-home .tabs .filler'])}{background-color:transparent!important;}`;
        }
        if (settings.glass_roster && solid < 100) {
            css += `${scoped(['sl-rooster .stack'])}{background-color:transparent!important;}`;
        }
        if (settings.glass_panels && solid < 100) {
            css += `${scoped(['sl-sidebar > .content-container sl-sidebar-page', 'sl-sidebar sl-account-modal-header', 'sl-sidebar sl-account-modal-details', 'sl-modal .content-container > .swipe-container', 'sl-modal .content-container sl-account-modal-header', 'sl-modal .content-container sl-account-modal-details', 'sl-modal .content-container sl-rooster-item-detail > .header', 'sl-modal .content-container sl-rooster-item-detail .afspraak-header', 'sl-sidebar-page sl-rooster-item-detail > .header', 'sl-sidebar-page sl-rooster-item-detail .afspraak-header'])}{background-color:transparent!important;}`;
        }
        if (settings.glass_navigation && /^[#][0-9a-f]{6}$/i.test(primaryColor) && [2, 3, 5].includes(Number(layout))) {
            css += `@media(min-width:1280px){${scoped(['sl-header'])}{background-color:color-mix(in srgb,${primaryColor} ${solid}%,transparent)!important;}}`;
        }
        // The mod menu and its dialogs follow the panel setting. Inside an
        // already blurred panel, the menu shares that layer instead of stacking.
        const modPanels = ':is(#mod-setting-panel,#mod-message > center > div)';
        const panelGroup = groups.find(group => group.id === 'panels');
        css += `:root.mod-glass-enabled ${modPanels}{${palette(settings.glass_panels ? solid : 100)}background-color:var(--bg-elevated-none);-webkit-backdrop-filter:${settings.glass_panels ? `blur(${blur})` : 'none'}!important;backdrop-filter:${settings.glass_panels ? `blur(${blur})` : 'none'}!important;}`;
        if (settings.glass_panels && solid < 100) {
            css += `:root.mod-glass-enabled :is(${panelGroup.surfaces.join(',')}) #mod-setting-panel{background-color:transparent!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;}`;
        }
        css += `@supports not (backdrop-filter:blur(1px)){${scoped(groups.flatMap(group => group.scopes))}{${palette(100)}}}`;
        return css;
    }
    // Extend the existing UI sliders to floating panels as well. Their elevated
    // palette is separate from the neutral palette changed by the original mod.
    function buildLegacyPanelCss(get) {
        const transparency = Number(get('ui'));
        if (!Number.isFinite(transparency) || transparency <= 0 || transparency > 100) return '';
        const rawBlur = Number(get('uiblur'));
        const blur = Number.isFinite(rawBlur) ? Math.max(0, Math.min(100, rawBlur)) : 0;
        const solid = 100 - transparency;
        const root = ':root:not(.mod-glass-enabled)';
        const panel = groups.find(group => group.id === 'panels');
        const elevated = tokens.filter(token => token.startsWith('--bg-elevated-'));
        const select = selectors => `${root} :is(${selectors.join(',')}):not(#mod-setting-panel, #mod-setting-panel *, #somtoday-mod, #somtoday-mod *)`;
        let css = `${root}{${elevated.map(token => `--mod-glass-legacy${token}:var(${token},var(--bg-elevated-none));`).join('')}}`;
        css += `${select(panel.scopes)}{${elevated.map(token => `${token}:color-mix(in srgb,var(--mod-glass-legacy${token}) ${solid}%,transparent);`).join('')}}`;
        css += `${select(panel.surfaces)}{-webkit-backdrop-filter:blur(${blur}px)!important;backdrop-filter:blur(${blur}px)!important;}`;
        const inner = ['sl-sidebar > .content-container sl-sidebar-page', 'sl-sidebar sl-account-modal-header', 'sl-sidebar sl-account-modal-details', 'sl-modal .content-container > .swipe-container', 'sl-modal sl-account-modal-header', 'sl-modal sl-account-modal-details', 'sl-sidebar sl-rooster-item-detail > .header', 'sl-sidebar sl-rooster-item-detail .afspraak-header', 'sl-modal sl-rooster-item-detail > .header', 'sl-modal sl-rooster-item-detail .afspraak-header'];
        css += `${select(inner)}{background-color:transparent!important;}`;
        css += `${select(panel.surfaces)}:is(:is(${panel.surfaces.join(',')}) *){-webkit-backdrop-filter:none!important;backdrop-filter:none!important;}`;
        css += `${root} :is(#mod-setting-panel,#mod-message > center > div){${elevated.map(token => `${token}:color-mix(in srgb,var(--mod-glass-legacy${token}) ${solid}%,transparent);`).join('')}background-color:var(--bg-elevated-none);-webkit-backdrop-filter:blur(${blur}px)!important;backdrop-filter:blur(${blur}px)!important;}`;
        css += `${root} :is(${panel.surfaces.join(',')}) #mod-setting-panel{background-color:transparent!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;}`;
        return css;
    }
    let lastSignature = null;
    let lastHadCss = false;
    function update(get) {
        const settings = read(get);
        if (document.documentElement.classList.contains('mod-glass-enabled') !== settings.glass_enabled) {
            document.documentElement.classList.toggle('mod-glass-enabled', settings.glass_enabled);
        }
        const signature = JSON.stringify([settings, get('primarycolor'), get('layout'), get('ui'), get('uiblur')]);
        if (signature === lastSignature && (!lastHadCss || document.getElementById('mod-glass-style'))) return;
        lastSignature = signature;
        const css = settings.glass_enabled ? buildCss(settings, get('primarycolor'), get('layout')) : buildLegacyPanelCss(get);
        lastHadCss = !!css;
        let style = document.getElementById('mod-glass-style');
        if (!css) {
            style?.remove();
            return;
        }
        if (!style) {
            style = document.createElement('style');
            style.id = 'mod-glass-style';
            document.head.appendChild(style);
        }
        style.textContent = css;
    }
    function render(get) {
        const settings = read(get);
        const checkbox = (key, label) => `<label class="mod-glass-check"><input class="mod-custom-setting" id="${key}" type="checkbox" ${settings[key] ? 'checked' : ''}><span>${label}</span></label>`;
        return `<div id="mod-glass-settings">
            <p>Maak de achtergronden van Somtoday doorzichtig en vervaag wat erachter ligt. Tekst en iconen blijven scherp.</p>
            ${checkbox('glass_enabled', 'Glaseffect per onderdeel inschakelen')}
            <p class="mod-glass-hint">Uitgeschakeld gelden je bestaande UI-transparantie en UI-blur onder Achtergrond. Een achtergrondafbeelding maakt het effect beter zichtbaar.</p>
            <fieldset id="mod-glass-options" ${settings.glass_enabled ? '' : 'disabled'}>
                <legend>Glaseffect instellen</legend>
                <label class="mod-glass-range" for="glass_transparency"><span>Transparantie</span><input class="mod-custom-setting" id="glass_transparency" type="range" min="0" max="100" step="1" value="${settings.glass_transparency}"><output for="glass_transparency">${settings.glass_transparency}%</output></label>
                <label class="mod-glass-range" for="glass_blur"><span>Vervaging</span><input class="mod-custom-setting" id="glass_blur" type="range" min="0" max="40" step="1" value="${settings.glass_blur}"><output for="glass_blur">${settings.glass_blur} px</output></label>
                <p>0% transparantie is ondoorzichtig. 0 px vervaging geeft alleen transparantie.</p>
                <div class="mod-glass-groups">${groups.map(group => checkbox(`glass_${group.id}`, group.label)).join('')}</div>
                <p>De donkere laag achter pop-ups blijft standaard ongewijzigd. Schakel die optie in om ook deze laag transparanter en vervaagd te maken.</p>
                <p>Een uitgeschakeld onderdeel behoudt zijn normale achtergrond. Klik op Opslaan om je wijzigingen toe te passen.</p>
            </fieldset>
        </div>`;
    }
    function bind() {
        const panel = document.getElementById('mod-glass-settings');
        if (!panel) return;
        panel.addEventListener('input', event => {
            const input = event.target;
            input.classList.add('mod-modified');
            if (input.id === 'glass_enabled') document.getElementById('mod-glass-options').disabled = !input.checked;
            const output = panel.querySelector(`output[for="${input.id}"]`);
            if (output) output.textContent = `${input.value}${input.id === 'glass_blur' ? ' px' : '%'}`;
        });
    }
    return { keys, defaults, groups, valid, read, enabled, buildCss, buildLegacyPanelCss, update, render, bind };
})();
