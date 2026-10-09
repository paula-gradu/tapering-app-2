// Values computed from state that both the views and the actions need.

import { STRINGS, t } from './strings.js';
import { gainRange, gains, maxDailyStep, nextDose } from './model.js';

export const OB_STEPS = ['intro', 'lang', 'name', 'count', 'range', 'without', 'tolerable', 'legal', 'done'];

export function derive(state) {
  const { data, ui } = state;
  const str = STRINGS[data.lang] || STRINGS.en;
  const T = (key, ctx) => t(data.lang, key, ctx);

  const day = data.days[data.days.length - 1];
  const smoked = day.smoked || 0;
  const answered = data.days.filter(d => d.craving !== null);
  const holding = data.holdingDay > 0;

  // y_min: the level he says he can live with
  const floor = data.tolerable;
  // Eq. 3.1: craving responds to the dose actually TAKEN, which is the tally
  // (he confirms it in the evening, and corrects it with the buttons above).
  const taken = smoked;
  // He confirmed a count other than the day's number, more or fewer: the
  // evening stays one slider, with no note and no hard-day questions.
  const offNumber = ui.countConfirmed && taken !== day.dose;
  const calc = nextDose({ taken, prescribed: day.dose, craving: ui.draft, floor, setup: data });

  // During setup the explanations preview the answers being given. On a first
  // setup those answers also set the ceiling; afterwards the ceiling is fixed.
  const ob = ui.onboarding;
  const answers = ob ? ob.draft : data;
  const ceilingShown = ob && !answered.length ? ob.draft.start : data.ceiling;
  const g = gainRange(answers);
  const k = gains(answers);

  const pctDown = Math.round((1 - day.dose / data.ceiling) * 100);
  const avoided = data.days.reduce((a, d) => a + Math.max(0, data.ceiling - d.dose), 0);

  const ctx = {
    day: day.n, dose: day.dose, start: data.ceiling, smoked, avoided, pctDown,
    tolerable: data.tolerable, holdingDay: data.holdingDay, name: data.name, agreed: data.agreed,
    craving: ui.draft, floor, over: ui.draft > floor,
    taken, err: calc.err, next: calc.next, raw: calc.raw, step: calc.step,
    atCeiling: calc.next >= data.ceiling,
    rows: data.days.length, savedAt: data.savedAt || '—'
  };
  const previewCtx = {
    start: ceilingShown,
    step: maxDailyStep(ceilingShown),
    perCig: Math.round(g.high * 100) / 100,
    perPoint: Math.round(k.kPlus * 10) / 10
  };

  return { data, ui, str, T, day, smoked, answered, holding, floor, taken, offNumber, calc, pctDown, avoided, ctx, previewCtx };
}
