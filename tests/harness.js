// A tiny test harness: `test` registers, `run` executes and reports.
// Open tests/index.html in a browser to run everything.

const tests = [];

export function test(name, fn) { tests.push({ name, fn }); }

// Deep equality, ignoring the order of object keys.
const canon = v => JSON.stringify(v, (k, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.keys(x).sort().reduce((o, key) => (o[key] = x[key], o), {}) : x);

export function eq(actual, expected, label = '') {
  const a = canon(actual), e = canon(expected);
  if (a !== e) throw new Error((label ? label + ': ' : '') + 'expected ' + e + ', got ' + a);
}

export function near(actual, expected, tol, label = '') {
  if (Math.abs(actual - expected) > tol) throw new Error((label ? label + ': ' : '') + 'expected ≈' + expected + ', got ' + actual);
}

export function run() {
  return tests.map(({ name, fn }) => {
    try { fn(); return { name, ok: true }; }
    catch (e) { return { name, ok: false, error: e.message }; }
  });
}
