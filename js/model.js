// The tapering model. Pure functions, no state; see tests/model.test.js.
//
// Integral controller from Gradu & Recht (2023), "Online Control for Adaptive
// Tapering of Medications", arXiv:2309.11629, Eq. 5.1:
//
//   u_t = max(0, u_{t-1} − K+ (y_t − y_min)+ − K− (y_t − y_min)−)
//
// Here the well-being signal is the evening craving on a 0–10 scale, where
// higher is worse, so y_t − y_min becomes (floor − craving): positive means
// room to step down. u_{t-1} is the dose actually TAKEN, not the dose
// prescribed (Eq. 3.1: well-being responds to what was taken).
//
// Two safeguards sit on top of Eq. 5.1:
//  - the ceiling: the daily count from first setup, never exceeded;
//  - the daily step: tomorrow's number is within a fifth of the ceiling of
//    today's number, in either direction.

export const DAILY_STEP_FRACTION = 0.2;

// g, points of craving per cigarette, elicited at setup rather than learned:
// `without` points of craving spread over nLow–nHigh cigarettes a day.
export function gainRange({ without, nLow, nHigh }) {
  const hi = Math.max(1, nHigh);
  const lo = Math.max(1, Math.min(nLow, hi));
  return { low: without / hi, high: without / lo };
}

// Theorem 5.1 needs K+ ≤ 1/g(0) ≤ K−: the cautious end steps down, the
// generous end steps back up.
export function gains(setup) {
  const g = gainRange(setup);
  return { kPlus: 1 / g.high, kMinus: 1 / g.low };
}

export function maxDailyStep(ceiling) {
  return Math.max(1, Math.floor(DAILY_STEP_FRACTION * ceiling));
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Tomorrow's number.
//   taken      cigarettes actually smoked today
//   prescribed today's number
//   craving    tonight's answer, 0–10
//   floor      y_min for today: the tolerable level, or a raised one
//   setup      { without, nLow, nHigh, ceiling }
// Returns err (room to spare, negative when over), the gain used, `raw` (Eq.
// 5.1 within the ceiling), `next` (raw after the daily step limit), and
// whether the step limit changed it.
export function nextDose({ taken, prescribed, craving, floor, setup }) {
  const k = gains(setup);
  const err = floor - craving;
  const K = err >= 0 ? k.kPlus : k.kMinus;
  const raw = clamp(Math.round(taken - K * err), 0, setup.ceiling);
  const step = maxDailyStep(setup.ceiling);
  const next = clamp(raw, Math.max(0, prescribed - step), Math.min(setup.ceiling, prescribed + step));
  return { err, K, raw, next, step, capped: next !== raw };
}
