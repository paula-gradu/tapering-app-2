// The Progress tab: two stats, the dose and craving charts, and a day list.

import { html } from '../dom.js';

// Charts are drawn in a 300×96 box; values map onto y = 88 (zero) … 10 (max).
const W = 300;
const y = (v, max) => Math.round((88 - (v / max) * 78) * 10) / 10;

// A step line: flat across each day's slot.
function stepPath(values, max, slot) {
  return values.map((v, i) => {
    const yy = y(v, max);
    return (i === 0 ? 'M0 ' + yy : 'L' + Math.round(i * slot) + ' ' + yy) + ' L' + Math.round((i + 1) * slot) + ' ' + yy;
  }).join(' ');
}

export function progress(v) {
  const { str, T, ctx, data, answered } = v;
  const slot = W / data.days.length;
  const floorOf = d => d.floor === null ? data.tolerable : d.floor;

  const dosePath = stepPath(data.days.map(d => d.dose), data.ceiling, slot);
  // the floor is time-varying, so it is drawn as a step line too
  const floorPath = stepPath(answered.map(floorOf), 10, slot);
  const dots = answered.map((d, i) => ({ x: Math.round((i + 0.5) * slot), y: y(d.craving, 10), raised: d.raised }));
  const cravingPath = dots.map((p, i) => (i ? 'L' : 'M') + p.x + ' ' + p.y).join(' ');

  return html`
    <div class="stack g18">
      <div class="stack g3">
        <span class="screen-title">${str.progress}</span>
        <span class="sub">${T('trendSub', ctx)}</span>
      </div>

      <div class="stats">
        <div class="stat stat--clay">
          <span class="stat__value">${v.avoided}</span>
          <span class="stat__label">${str.notSmoked}</span>
        </div>
        <div class="stat stat--sage">
          <span class="stat__value">${answered.length}</span>
          <span class="stat__label">${str.eveningsAnswered}</span>
        </div>
      </div>

      <div class="card card--charts g18">
        <div class="stack g8">
          <span class="kicker c-clay">${str.chartDose}</span>
          <svg class="chart" viewBox="0 0 300 96" preserveAspectRatio="none">
            <path d="${dosePath} L300 88 L0 88 Z" class="chart__area"></path>
            <path d="${dosePath}" class="chart__line chart__line--dose"></path>
          </svg>
          <div class="row-between axis"><span>${T('dayOneAxis', ctx)}</span><span>${T('todayAxis', ctx)}</span></div>
        </div>
        <div class="rule"></div>
        <div class="stack g8">
          <div class="row-between baseline">
            <span class="kicker c-sage">${str.chartCraving}</span>
            <span class="axis">${T('tolerableAxis', ctx)}</span>
          </div>
          <svg class="chart" viewBox="0 0 300 96" preserveAspectRatio="none">
            <path d="${floorPath}" class="chart__floor"></path>
            <path d="${cravingPath}" class="chart__line chart__line--craving"></path>
            ${dots.map(p => html`<circle cx="${p.x}" cy="${p.y}" r="3.5" class="chart__dot ${p.raised && 'is-raised'}"></circle>`)}
          </svg>
          <span class="small">${str.chartNote}</span>
        </div>
      </div>

      <div class="stack g10">
        <span class="kicker c-muted">${str.dayByDay}</span>
        ${data.days.slice().reverse().slice(0, 8).map(d => dayRow(d, v, floorOf))}
      </div>
    </div>`;
}

function dayRow(d, v, floorOf) {
  const { str, T } = v;
  const pending = d.craving === null;
  const over = !pending && d.craving > floorOf(d);
  const note = pending ? T('rowToday', { smoked: d.smoked || 0 })
    : d.raised ? T('rowRaised', { craving: d.craving, floor: d.floor })
    : over ? T('rowOver', { craving: d.craving })
    : T('rowUnder', { craving: d.craving, room: floorOf(d) - d.craving });
  const chip = pending ? str.chipNow : d.raised ? str.chipHard : over ? str.chipUp : str.chipDown;
  const tone = pending ? 'now' : (d.raised || over) ? 'up' : 'down';
  return html`
    <div class="day-row">
      <span class="day-row__label">${str.dayWord} ${d.n}</span>
      <span class="day-row__dose">${d.dose}</span>
      <span class="day-row__note">${note}</span>
      <span class="chip chip--${tone}">${chip}</span>
    </div>`;
}
