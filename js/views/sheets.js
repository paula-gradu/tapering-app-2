// The sheet that slides up at the end of the evening: tomorrow's number.

import { html } from '../dom.js';
import { sheet, chevron } from './parts.js';

export function resultSheet(v) {
  const { str, T, ctx, ui, calc, taken, floor, holding } = v;
  // Going up is only the protocol's doing when the craving was over the floor;
  // a rise that comes from the daily step limit is explained by capBody.
  const isUp = calc.next > taken && calc.err < 0;
  const working = [
    [str.mathCraving, ui.draft, calc.err < 0 ? 'c-clay' : 'c-sage'],
    [str.mathTolerable, floor],
    [calc.err >= 0 ? str.mathRoom : str.mathOver, Math.abs(calc.err)],
    [str.mathPerPoint, Math.round(calc.K * 100) / 100],
    [str.mathTaken, taken],
    [str.mathStep, '± ' + calc.step],
    [T('mathTomorrow', ctx), calc.next, 'c-deep']
  ];
  return sheet('result', html`
    <div class="stack g8">
      <span class="kicker c-clay">${str.tomorrow}</span>
      <span class="sheet-title sheet-title--result">${T('resultHeadline', ctx)}</span>
      <span class="body">${calc.capped ? T('capBody', ctx) : T('resultBody', ctx)}</span>
    </div>
    <div class="card card--clay card--flat card--compare">
      <div class="stack g3">
        <span class="compare__label">${str.today}</span>
        <span class="compare__value">${taken}</span>
      </div>
      ${chevron('compare__arrow')}
      <div class="stack g3 right">
        <span class="compare__label">${str.tomorrow}</span>
        <span class="compare__value compare__value--next">${calc.next}</span>
      </div>
    </div>
    ${isUp && html`
      <div class="card card--sage card--flat card--tight g10">
        <span class="card-title card-title--xs c-sage-deep">${T('upTitle', ctx)}</span>
        <span class="body-sm c-sage-dark">${T('upBody', ctx)}</span>
      </div>`}
    <button type="button" class="link link--clay start" data-action="toggleNumbers">${T('numbersToggle', { open: ui.numbersOpen })}</button>
    ${ui.numbersOpen && html`
      <div class="card card--flat working rise-in" data-key="working">
        ${working.map(([k, val, tone]) => html`
          <div class="working__row"><span>${k}</span><span class="working__value ${tone || ''}">${val}</span></div>`)}
      </div>`}
    <button type="button" class="btn btn--primary btn--lg" data-action="commit">
      ${calc.next === 0 && holding ? str.acceptHolding : T('accept', ctx)}
    </button>`);
}
