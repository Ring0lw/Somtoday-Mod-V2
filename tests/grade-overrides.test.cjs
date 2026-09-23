const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({});
vm.runInContext(readFileSync('Chromium/scripts/grade_overrides.js', 'utf8') + '\nglobalThis.grades = SomtodayGradeOverrides;', context);
const grades = context.grades;

test('validates numeric and letter grades, supports decimal commas and reset', () => {
    for (const [input, expected] of [['8.25', '8,25'], [' 10 ', '10'], ['1', '1'], ['v', 'V'], ['G+', 'G+'], ['', '']]) {
        assert.equal(grades.normalize(input), expected);
    }
    for (const input of ['0', '11', '10.01', '-1', '5.123', '1e1', '<b>9</b>', 'NaN!', null, {}, true]) {
        assert.equal(grades.normalize(input), null);
    }
});

test('persistent identity separates profiles, years, subjects, descriptions and grade types', () => {
    const base = ['student-a', 'recent', '2026/2027', 'Math', '23-09 • Algebra', '2x'];
    const key = grades.keyFor(...base);
    assert.equal(grades.keyFor(...JSON.parse(JSON.stringify(base))), key);
    for (let i = 0; i < base.length; i++) {
        const changed = [...base];
        changed[i] += '-other';
        assert.notEqual(grades.keyFor(...changed), key);
    }
    assert.notEqual(grades.keyFor('a', 'b|c'), grades.keyFor('a|b', 'c'));
});

test('extension bundles the module before main and includes its stylesheet', () => {
    const { js, css } = JSON.parse(readFileSync('Chromium/manifest.json', 'utf8')).content_scripts[0];
    assert.ok(js.indexOf('scripts/grade_overrides.js') >= 0);
    assert.ok(js.indexOf('scripts/grade_overrides.js') < js.indexOf('scripts/main_functions.js'));
    assert.ok(css.includes('css/grade-overrides.css'));
});
