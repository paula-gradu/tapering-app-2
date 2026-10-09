// State, actions and wiring. Views are pure functions of `derive(state)`;
// every change goes through `update`, which saves and re-renders.

import { morph } from './dom.js';
import { derive, OB_STEPS } from './derive.js';
import { load, save, erase, storageWorks, freshData, newDay } from './store.js';
import { view } from './views/index.js';
import { rangeMax } from './views/setup.js';

// Put the Google Apps Script web-app URL here to send each day to a Sheet.
// Until it is set, days are kept on the device and exported by hand.
const SYNC_URL = '';
const AUTHOR_EMAIL = 'pgradu@berkeley.edu';

const SETUP_FIELDS = ['name', 'start', 'nLow', 'nHigh', 'without', 'tolerable'];

const root = document.getElementById('app');
const saved = load();
const data = saved || freshData();

const state = {
  data,
  ui: {
    screen: 'today',
    storageOk: storageWorks(),
    // evening question
    checkIn: false,
    countDraft: null,
    countConfirmed: false,
    draft: data.tolerable,
    note: '',
    overDismissed: false,
    // a hard day's floor: null until he raises it, for today only
    raisedFloor: null,
    floorDraft: data.tolerable,
    sheet: null, // 'hardDay' | 'baseline' | 'result'
    fromOverCard: false, // hard-day sheet opened from the over-the-number card
    numbersOpen: false,
    previewOpen: false,
    resetArmed: false,
    syncState: 'idle',
    dragging: null,
    // setup runs until it is finished, even if the app is closed part-way
    onboarding: data.setupDone ? null : openSetup(data, 0, false)
  }
};

// Setup edits a copy of the answers; they apply only when it finishes, so
// backing out of "Redo setup" changes nothing.
function openSetup(source, step, relapse) {
  const draft = {};
  for (const k of SETUP_FIELDS) draft[k] = source[k];
  // he had stopped, so a restart's count opens low rather than at his old number
  if (relapse) draft.start = Math.min(draft.start, 2);
  return { step, relapse, draft };
}

// ── update loop ──────────────────────────────────────────────

let lastSaved = JSON.stringify(state.data);

function update(change) {
  change(state);
  const now = JSON.stringify(state.data);
  if (now !== lastSaved) {
    state.data.savedAt = save(state.data);
    lastSaved = JSON.stringify(state.data);
  }
  render();
}

function render() {
  document.documentElement.lang = state.data.lang;
  morph(root, view(derive(state), syncView()));
}

const today = s => s.data.days[s.data.days.length - 1];

function editToday(s, fields) {
  const days = s.data.days.slice();
  days[days.length - 1] = Object.assign({}, today(s), fields);
  s.data.days = days;
}

// After a sheet closes: on to tomorrow's number, unless the sheet was opened
// from the over-the-number card during the day.
function closeSheet(s) {
  s.ui.sheet = s.ui.fromOverCard ? null : 'result';
  s.ui.fromOverCard = false;
  s.ui.overDismissed = true;
}

// ── actions ──────────────────────────────────────────────────

const actions = {
  setScreen: (s, id) => { s.ui.screen = id; },

  addSmoke: s => {
    const smoked = (today(s).smoked || 0) + 1;
    editToday(s, { smoked });
    // every cigarette past the number asks again
    if (smoked > today(s).dose) s.ui.overDismissed = false;
  },
  undoSmoke: s => editToday(s, { smoked: Math.max(0, (today(s).smoked || 0) - 1) }),

  openFloorFromOver: s => {
    s.ui.sheet = 'hardDay';
    s.ui.fromOverCard = true;
    s.ui.floorDraft = Math.max(s.ui.raisedFloor || 0, s.data.tolerable);
  },
  dismissOver: s => { s.ui.overDismissed = true; },

  openCheckIn: s => {
    const day = today(s);
    const tally = day.smoked || 0;
    s.ui.checkIn = true;
    s.ui.overDismissed = true;
    s.ui.countDraft = tally;
    // an ordinary day skips straight to the one question
    s.ui.countConfirmed = tally === day.dose;
    s.ui.draft = s.data.tolerable;
  },
  countDown: s => { s.ui.countDraft = Math.max(0, s.ui.countDraft - 1); },
  countUp: s => { s.ui.countDraft += 1; },
  confirmCount: s => {
    editToday(s, { smoked: s.ui.countDraft });
    s.ui.countConfirmed = true;
  },
  // the forgot-to-tap case: he smoked exactly the day's number after all
  confirmPrescribed: s => {
    const dose = today(s).dose;
    editToday(s, { smoked: dose });
    s.ui.countDraft = dose;
    s.ui.countConfirmed = true;
  },

  submitCraving: s => {
    // during the holding fortnight there is nothing to set: record and move on
    if (s.data.holdingDay > 0) return commit(s);
    if (s.ui.draft > s.data.tolerable && s.ui.raisedFloor === null) {
      s.ui.sheet = 'hardDay';
      s.ui.fromOverCard = false;
      s.ui.floorDraft = Math.min(10, s.ui.draft);
    } else {
      s.ui.sheet = 'result';
    }
  },

  confirmTodayOnly: s => {
    if (s.ui.floorDraft > s.data.tolerable) {
      s.ui.raisedFloor = s.ui.floorDraft;
      s.ui.sheet = 'baseline';
    } else {
      s.ui.raisedFloor = null;
      closeSheet(s);
    }
  },
  skipTodayOnly: s => {
    s.ui.raisedFloor = null;
    closeSheet(s);
  },
  raiseBaseline: s => {
    s.data.tolerable = s.ui.raisedFloor;
    s.ui.raisedFloor = null;
    closeSheet(s);
  },
  keepBaseline: s => closeSheet(s),

  toggleNumbers: s => { s.ui.numbersOpen = !s.ui.numbersOpen; },
  commit: s => commit(s),

  startRelapse: s => {
    s.ui.checkIn = false;
    s.ui.onboarding = openSetup(s.data, OB_STEPS.indexOf('count'), true);
  },

  // ── setup ──
  startOnboarding: s => {
    s.ui.onboarding = openSetup(s.data, 0, false);
    s.ui.previewOpen = false;
  },
  pickLang: (s, code) => { s.data.lang = code; },
  toggleAgree: s => { s.data.agreed = !s.data.agreed; },
  startDown: s => { const a = s.ui.onboarding.draft; a.start = Math.max(1, a.start - 1); },
  startUp: s => { const a = s.ui.onboarding.draft; a.start = Math.min(60, a.start + 1); },
  dontKnowRange: s => {
    const a = s.ui.onboarding.draft;
    a.nLow = a.start;
    a.nHigh = Math.round(a.start * 1.2);
    s.ui.onboarding.step = OB_STEPS.indexOf('without');
  },
  dontKnowWithout: s => {
    s.ui.onboarding.draft.without = 10;
    s.ui.onboarding.step = OB_STEPS.indexOf('tolerable');
  },
  obNext: s => {
    const ob = s.ui.onboarding;
    const step = OB_STEPS[ob.step];
    if (step === 'legal' && !s.data.agreed) return;
    // a restart only needs the three numbers, then it begins again
    if (ob.relapse && step === 'tolerable') return finishRelapse(s);
    if (step === 'done') return finishSetup(s);
    // leaving the daily-count question: centre the range on that answer
    if (step === 'count') {
      ob.draft.nLow = Math.max(1, ob.draft.start - 2);
      ob.draft.nHigh = ob.draft.start + 2;
    }
    ob.step += 1;
    s.ui.previewOpen = false;
  },
  obBack: s => {
    const ob = s.ui.onboarding;
    if (ob.step === 0 || (ob.relapse && OB_STEPS[ob.step] === 'count')) s.ui.onboarding = null;
    else ob.step -= 1;
  },

  // ── settings ──
  togglePreview: s => { s.ui.previewOpen = !s.ui.previewOpen; },
  cycleLang: s => { s.data.lang = s.data.lang === 'en' ? 'ro' : 'en'; },
  retrySync: () => flush(),
  exportCsv: () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv()], { type: 'text/csv' }));
    a.download = 'step-nicotine.csv';
    a.click();
  },
  // No server, so this cannot post silently: hand the file to the OS share
  // sheet (Android/iOS give a mail app with the CSV attached), and fall back
  // to a prefilled message when sharing files is unavailable.
  sendCsv: s => {
    const text = csv();
    const subject = 'Step — taper log, day ' + today(s).n;
    const file = typeof File !== 'undefined' ? new File([text], 'step-nicotine.csv', { type: 'text/csv' }) : null;
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: subject, text: subject }).catch(() => {});
      return;
    }
    window.location.href = 'mailto:' + AUTHOR_EMAIL
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(text.slice(0, 1600));
  },
  // two taps: arm, then erase
  hardReset: s => {
    if (!s.ui.resetArmed) {
      s.ui.resetArmed = true;
      setTimeout(() => update(st => { st.ui.resetArmed = false; }), 4000);
      return;
    }
    erase();
    window.location.reload();
  }
};

// Close the day: write the answer, queue it for sync, open tomorrow.
function commit(s) {
  const v = derive(s);
  const day = v.day;
  // a holding day stays at zero; only "I smoked today" restarts the taper
  const next = v.holding ? 0 : v.calc.next;
  const done = Object.assign({}, day, {
    craving: s.ui.draft,
    smoked: v.taken,
    floor: v.floorNow,
    raised: v.floorNow > s.data.tolerable,
    note: v.taken !== day.dose || s.ui.draft > v.floorNow ? s.ui.note : ''
  });
  s.data.days = s.data.days.slice(0, -1).concat([done, newDay(day.n + 1, next)]);
  s.data.outbox = s.data.outbox.concat([{
    day: done.n, allowance: done.dose, smoked: done.smoked,
    craving: done.craving, floor_used: done.floor, floor_raised: done.raised,
    baseline_tolerable: s.data.tolerable, note: done.note,
    recorded_at: new Date().toISOString()
  }]);
  s.data.holdingDay = next === 0 ? s.data.holdingDay + 1 : 0;
  resetEvening(s);
  setTimeout(flush);
}

function resetEvening(s) {
  Object.assign(s.ui, {
    checkIn: false, countDraft: null, countConfirmed: false, sheet: null, fromOverCard: false,
    numbersOpen: false, overDismissed: false, note: '',
    draft: s.data.tolerable, raisedFloor: null, floorDraft: s.data.tolerable
  });
}

function applyAnswers(s) {
  const a = s.ui.onboarding.draft;
  for (const k of SETUP_FIELDS) s.data[k] = a[k];
}

function finishSetup(s) {
  applyAnswers(s);
  // Until an evening has been answered this is still the first setup: the
  // count becomes the ceiling and today's number. After that the ceiling is
  // fixed for good and today's number is left alone.
  if (!s.data.days.some(d => d.craving !== null)) {
    s.data.ceiling = s.data.start;
    editToday(s, { dose: s.data.start });
  }
  s.data.setupDone = true;
  s.ui.onboarding = null;
  s.ui.screen = 'today';
  resetEvening(s);
}

// A relapse restarts today at the new count. History is kept, and the ceiling
// is not touched (nor exceeded).
function finishRelapse(s) {
  applyAnswers(s);
  editToday(s, { dose: Math.min(s.data.start, s.data.ceiling) });
  s.data.holdingDay = 0;
  s.ui.onboarding = null;
  s.ui.screen = 'today';
  resetEvening(s);
}

function csv() {
  const d = state.data;
  const head = 'day,allowance,smoked,craving,floor_used,floor_raised,baseline_tolerable,note';
  const rows = d.days.map(day => [
    day.n, day.dose, day.smoked || 0,
    day.craving === null ? '' : day.craving,
    day.floor === null ? '' : day.floor,
    day.raised ? 'yes' : 'no',
    d.tolerable,
    '"' + String(day.note || '').replace(/"/g, '""') + '"'
  ].join(','));
  return [head].concat(rows).join('\n');
}

// ── sync ─────────────────────────────────────────────────────

// POSTs as text/plain on purpose: it avoids a CORS preflight against Apps Script.
function flush() {
  if (!SYNC_URL || !state.data.outbox.length) return;
  const batch = state.data.outbox.slice();
  update(s => { s.ui.syncState = 'sending'; });
  fetch(SYNC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ rows: batch })
  }).then(res => {
    if (!res.ok) throw new Error(res.status);
    update(s => {
      s.data.outbox = s.data.outbox.slice(batch.length);
      s.data.syncedCount += batch.length;
      s.ui.syncState = 'ok';
    });
  }).catch(() => update(s => { s.ui.syncState = 'failed'; }));
}

function syncView() {
  const { str } = derive(state);
  const n = state.data.outbox.length;
  const t = (key, ctx) => str[key](ctx);
  if (!SYNC_URL) return { tone: 'off', text: str.syncNone, canRetry: false };
  const failed = state.ui.syncState === 'failed';
  return {
    tone: failed ? 'failed' : n ? 'waiting' : 'sent',
    text: state.ui.syncState === 'sending' ? str.syncSending
      : n ? t('syncWaiting', { n }) : t('syncSent', { n: state.data.syncedCount }),
    canRetry: n > 0 || failed
  };
}

// ── sliders ──────────────────────────────────────────────────

// Each slider's range and where its value lives.
const SLIDERS = {
  craving: { min: 0, max: () => 10, get: s => s.ui.draft, set: (s, v) => { s.ui.draft = v; } },
  tolerable: { min: 1, max: () => 10, get: s => s.data.tolerable, set: (s, v) => { s.data.tolerable = v; } },
  floorDraft: { min: 1, max: () => 10, get: s => s.ui.floorDraft, set: (s, v) => { s.ui.floorDraft = v; } },
  without: { min: 1, max: () => 10, get: s => s.ui.onboarding.draft.without, set: (s, v) => { s.ui.onboarding.draft.without = v; } },
  obTolerable: { min: 1, max: () => 10, get: s => s.ui.onboarding.draft.tolerable, set: (s, v) => { s.ui.onboarding.draft.tolerable = v; } },
  nLow: {
    min: 1, max: s => rangeMax(s.ui.onboarding.draft.start),
    get: s => s.ui.onboarding.draft.nLow,
    set: (s, v) => { const a = s.ui.onboarding.draft; a.nLow = Math.min(v, a.nHigh); }
  },
  nHigh: {
    min: 1, max: s => rangeMax(s.ui.onboarding.draft.start),
    get: s => s.ui.onboarding.draft.nHigh,
    set: (s, v) => { const a = s.ui.onboarding.draft; a.nHigh = Math.max(v, a.nLow); }
  }
};

function setSlider(name, value) {
  const def = SLIDERS[name];
  update(s => def.set(s, Math.max(def.min, Math.min(def.max(s), value))));
}

function sliderAt(el, name, clientX) {
  const r = el.getBoundingClientRect();
  const p = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
  setSlider(name, Math.round(p * SLIDERS[name].max(state)));
}

// ── events ───────────────────────────────────────────────────

root.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el || !actions[el.dataset.action]) return;
  update(s => actions[el.dataset.action](s, el.dataset.arg));
});

// Typing updates state without a re-render, so the field keeps its cursor.
root.addEventListener('input', e => {
  const field = e.target.dataset.input;
  if (field === 'note') state.ui.note = e.target.value;
  if (field === 'name') state.ui.onboarding.draft.name = e.target.value;
});

root.addEventListener('pointerdown', e => {
  const el = e.target.closest('[data-slider]');
  if (!el) return;
  state.ui.dragging = el.dataset.slider;
  sliderAt(el, el.dataset.slider, e.clientX);
});
window.addEventListener('pointermove', e => {
  const name = state.ui.dragging;
  const el = name && root.querySelector('[data-slider="' + name + '"]');
  if (el) sliderAt(el, name, e.clientX);
});
window.addEventListener('pointerup', () => { state.ui.dragging = null; });
window.addEventListener('pointercancel', () => { state.ui.dragging = null; });

root.addEventListener('keydown', e => {
  const el = e.target.closest('[data-slider]');
  const delta = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[e.key];
  if (!el || !delta) return;
  e.preventDefault();
  const name = el.dataset.slider;
  setSlider(name, SLIDERS[name].get(state) + delta);
});

render();
if (state.data.outbox.length) flush();
