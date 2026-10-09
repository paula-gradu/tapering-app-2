import { test, eq, near } from './harness.js';
import { gains, maxDailyStep, nextDose } from '../js/model.js';

// The worked example from the spec: 18–22 a day satisfy, 8/10 with none.
const setup = { without: 8, nLow: 18, nHigh: 22, ceiling: 20 };
const dose = (o) => nextDose(Object.assign({ setup }, o));

test('gains bracket 1/g as Theorem 5.1 requires', () => {
  const k = gains(setup);
  near(k.kPlus, 2.25, 1e-9, 'K+');
  near(k.kMinus, 2.75, 1e-9, 'K−');
});

test('daily step is a fifth of the ceiling, rounded down, at least 1', () => {
  eq(maxDailyStep(20), 4);
  eq(maxDailyStep(22), 4);
  eq(maxDailyStep(18), 3);
  eq(maxDailyStep(3), 1);
});

test('an ordinary day under the floor steps down by Eq. 5.1', () => {
  const r = dose({ taken: 20, prescribed: 20, craving: 3, floor: 4 });
  eq([r.raw, r.next, r.capped], [18, 18, false]);
});

test('right at the floor, tomorrow stays where it is', () => {
  eq(dose({ taken: 12, prescribed: 12, craving: 4, floor: 4 }).next, 12);
});

test('dad\'s case: 4 confirmed on a 20 day no longer drops to 4', () => {
  const r = dose({ taken: 4, prescribed: 20, craving: 4, floor: 4 });
  eq([r.raw, r.next, r.capped], [4, 16, true]);
});

test('a very low craving cannot take more than the step off', () => {
  const r = dose({ taken: 20, prescribed: 20, craving: 0, floor: 4 });
  eq([r.raw, r.next], [11, 16]);
});

test('a hard day goes up, by at most the step', () => {
  const r = dose({ taken: 8, prescribed: 8, craving: 9, floor: 4 });
  eq([r.err, r.raw, r.next], [-5, 20, 12]);
});

test('the ceiling holds however hard the day', () => {
  eq(dose({ taken: 19, prescribed: 19, craving: 10, floor: 4 }).next, 20);
});

test('it can reach zero, and never goes below', () => {
  eq(dose({ taken: 2, prescribed: 2, craving: 2, floor: 4 }).next, 0);
});

test('steps from what was taken, not what was prescribed (Eq. 3.1)', () => {
  // smoked 14 against a 16: the controller starts from 14
  eq(dose({ taken: 14, prescribed: 16, craving: 3, floor: 4 }).raw, 12);
});
