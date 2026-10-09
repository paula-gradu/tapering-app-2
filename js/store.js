// Everything that survives a reload, kept in localStorage.
//
// The first build (paula-gradu.github.io/tapering-app/) shares this origin
// and saves under 'step.nicotine.v2'. This build uses its own key, so the two
// never read or change each other's data. If the shape here ever changes,
// bump the version in the key and add a step to `migrate` that reads the old one.

export const STORE_KEY = 'tapering-app-2.v1';

const PERSISTED = [
  'lang', 'start', 'ceiling', 'nLow', 'nHigh', 'without', 'tolerable', 'name',
  'agreed', 'setupDone', 'days', 'holdingDay', 'outbox', 'syncedCount', 'savedAt'
];

// A day record. craving === null marks the day in progress.
export function newDay(n, dose) {
  return { n, dose, craving: null, floor: null, raised: false, note: '', smoked: 0 };
}

// What a brand-new phone starts from. The numbers are only defaults for the
// setup questions; finishing setup replaces day one with the real count.
export function freshData() {
  return {
    lang: 'en',
    start: 20,
    // the hard cap, set once at first setup and never lowered by a restart
    ceiling: 20,
    nLow: 18,
    nHigh: 22,
    without: 8,
    tolerable: 4,
    name: '',
    agreed: false,
    setupDone: false,
    days: [newDay(1, 20)],
    holdingDay: 0,
    outbox: [],
    syncedCount: 0,
    savedAt: ''
  };
}

// Fill gaps from the defaults so a partial or older record still loads.
function migrate(saved) {
  const data = Object.assign(freshData(), pick(saved));
  if (!Array.isArray(data.days) || !data.days.length) data.days = freshData().days;
  data.days = data.days.map(d => Object.assign(newDay(d.n, d.dose), d));
  return data;
}

function pick(obj) {
  const out = {};
  for (const k of PERSISTED) if (obj && obj[k] !== undefined) out[k] = obj[k];
  return out;
}

// Reading window.localStorage can itself throw when storage is blocked, so it
// is only touched inside the try blocks below.
const local = storage => storage || window.localStorage;

export function load(storage) {
  try {
    const raw = local(storage).getItem(STORE_KEY);
    return raw ? migrate(JSON.parse(raw)) : null;
  } catch (e) {
    return null;
  }
}

// Returns the time it was saved, for the Settings status line.
export function save(data, storage) {
  const savedAt = new Date().toLocaleTimeString();
  try {
    local(storage).setItem(STORE_KEY, JSON.stringify(Object.assign(pick(data), { savedAt })));
  } catch (e) {}
  return savedAt;
}

export function erase(storage) {
  try { local(storage).removeItem(STORE_KEY); } catch (e) {}
}

// file:// on some Android builds refuses storage outright; better to say so
// than to lose his day silently.
export function storageWorks(storage) {
  try {
    const s = local(storage);
    const k = STORE_KEY + '.probe';
    s.setItem(k, '1');
    const ok = s.getItem(k) === '1';
    s.removeItem(k);
    return ok;
  } catch (e) {
    return false;
  }
}
