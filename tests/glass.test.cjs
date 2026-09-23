const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({});
vm.runInContext(readFileSync('Chromium/scripts/glass.js', 'utf8') + '\nglobalThis.glass = SomtodayGlass;', context);
const glass = context.glass;

test('existing installations remain opted out, without needing a migration', () => {
    for (const missing of ['', null, undefined]) {
        assert.equal(glass.read(() => missing).glass_enabled, false);
        assert.equal(glass.read(() => missing).glass_blur, 12);
        assert.equal(glass.read(() => missing).glass_overlay, false);
    }
    assert.equal(glass.read(() => 'false').glass_enabled, false);
    assert.equal(glass.read(() => 'true').glass_enabled, true);
});

test('import validation rejects malformed CSS, booleans and out-of-range values', () => {
    for (const value of ['12px', '1; color:red', Infinity, NaN, -1, 101, {}, [], true, null, '']) {
        assert.equal(glass.valid('glass_transparency', value), false, String(value));
    }
    for (const value of [0, 100, '45.5']) assert.equal(glass.valid('glass_transparency', value), true);
    assert.equal(glass.valid('glass_blur', 41), false);
    assert.equal(glass.valid('glass_roster', 'on'), false);
    assert.equal(glass.valid('glass_unknown', true), false);
});

test('exported and imported settings preserve unchecked groups', () => {
    const settings = { ...glass.defaults, glass_enabled: true, glass_roster: false, glass_badges: false, glass_overlay: true, glass_transparency: 70, glass_blur: 0 };
    const imported = JSON.parse(JSON.stringify(settings));
    assert.deepEqual(JSON.parse(JSON.stringify(glass.read(key => imported[key]))), settings);
});

test('off produces no styling; zero blur and opaque surfaces do not blur', () => {
    assert.equal(glass.buildCss(glass.defaults, '#0067c2', 1), '');
    for (const overrides of [{ glass_blur: 0 }, { glass_transparency: 0 }]) {
        const css = glass.buildCss({ ...glass.defaults, glass_enabled: true, ...overrides }, '#0067c2', 1);
        assert.ok(css.includes('backdrop-filter:blur(0px)'));
        assert.ok(!css.includes('backdrop-filter:blur(12px)'));
        assert.ok(!css.includes('opacity:'));
    }
});

test('new assets are loaded before the main script and packaged files exist', () => {
    const manifest = JSON.parse(readFileSync('Chromium/manifest.json', 'utf8'));
    const content = manifest.content_scripts[0];
    assert.ok(content.js.indexOf('scripts/glass.js') < content.js.indexOf('scripts/main_functions.js'));
    for (const path of [...content.js, ...content.css]) assert.ok(readFileSync('Chromium/' + path).length);
});

test('existing UI sliders opt floating panels into glass without advanced settings', () => {
    for (const ui of [undefined, '', 0, -1, 101, '50; color:red']) {
        assert.equal(glass.buildLegacyPanelCss(key => key === 'ui' ? ui : 12), '');
    }
    const css = glass.buildLegacyPanelCss(key => ({ui:60,uiblur:8})[key]);
    assert.ok(css.includes('sl-sidebar > .content-container'));
    assert.ok(css.includes(' 40%,transparent)'));
    assert.ok(css.includes('backdrop-filter:blur(8px)'));
    assert.ok(!css.includes('opacity:'));
});
