import { test, eq } from './harness.js';
import { load, save, freshData, STORE_KEY } from '../js/store.js';

function memory(initial) {
  const m = new Map(Object.entries(initial || {}));
  return { getItem: k => m.has(k) ? m.get(k) : null, setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k), m };
}

test('a saved record loads unchanged', () => {
  const old = {
    lang: 'ro', start: 20, ceiling: 20, nLow: 18, nHigh: 22, without: 8, tolerable: 4, name: 'Tata',
    agreed: true, setupDone: true, holdingDay: 0, outbox: [], syncedCount: 0, savedAt: '20:00',
    days: [{ n: 1, dose: 20, craving: 4, floor: 4, raised: false, note: '', smoked: 4 },
           { n: 2, dose: 4, craving: null, floor: null, raised: false, note: '', smoked: 0 }]
  };
  const data = load(memory({ [STORE_KEY]: JSON.stringify(old) }));
  eq(data, old);
});

test('missing fields are filled from defaults', () => {
  const data = load(memory({ [STORE_KEY]: JSON.stringify({ lang: 'ro', days: [{ n: 1, dose: 12 }] }) }));
  eq(data.lang, 'ro');
  eq(data.tolerable, 4);
  eq(data.days[0], { n: 1, dose: 12, craving: null, floor: null, raised: false, note: '', smoked: 0 });
});

test('nothing saved means a fresh start', () => {
  eq(load(memory()), null);
});

test('only persisted fields are written', () => {
  const s = memory();
  save(Object.assign(freshData(), { screen: 'today', draft: 7 }), s);
  const saved = JSON.parse(s.getItem(STORE_KEY));
  eq('screen' in saved || 'draft' in saved, false);
});

test('unreadable storage loads as nothing rather than throwing', () => {
  eq(load({ getItem: () => { throw new Error('blocked'); } }), null);
});
