import { test, eq } from './harness.js';
import { STRINGS, LANGS } from '../js/strings.js';

const ctx = {
  name: 'Tata', day: 3, avoided: 5, dose: 16, start: 20, pctDown: 20, smoked: 2, holdingDay: 2,
  tolerable: 4, craving: 3, err: 1, next: 14, taken: 16, floor: 4, raw: 12, step: 4, dayFloor: 6,
  atCeiling: false, over: false, open: false, agreed: false, rows: 3, savedAt: '9:00',
  n: 2, perCig: 0.44, perPoint: 2.3, room: 1
};

test('English and Romanian have exactly the same keys', () => {
  const [en, ro] = LANGS.map(l => Object.keys(STRINGS[l]).sort());
  eq(en.filter(k => !ro.includes(k)), [], 'missing in ro');
  eq(ro.filter(k => !en.includes(k)), [], 'missing in en');
});

test('each key is the same kind in both languages', () => {
  for (const k of Object.keys(STRINGS.en)) {
    eq(typeof STRINGS.ro[k], typeof STRINGS.en[k], k);
  }
  eq(STRINGS.ro.ob.length, STRINGS.en.ob.length, 'setup steps');
});

test('every string renders without undefined or NaN', () => {
  for (const lang of LANGS) {
    for (const [k, v] of Object.entries(STRINGS[lang])) {
      if (k === 'ob') continue;
      // two strings take a 0–10 value rather than a context
      const arg = k === 'cravingWord' || k === 'tolerableSetting' ? 3 : ctx;
      const out = typeof v === 'function' ? v(arg) : v;
      if (/undefined|NaN/.test(String(out))) throw new Error(lang + '.' + k + ' → ' + out);
    }
  }
});
