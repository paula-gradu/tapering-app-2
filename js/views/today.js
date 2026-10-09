// The Today tab: the day's number, the tally, and the evening question.

import { html } from '../dom.js';
import { slider, chevron } from './parts.js';

export function today(v) {
  const { str, T, ctx, ui, data } = v;
  return html`
    <div class="stack g16">
      <header class="today-head">
        <div class="stack g4 shrink">
          <span class="greeting">${T('greeting', ctx)}</span>
          <span class="sub">${T('dayLabel', ctx)}</span>
        </div>
        <span class="badge badge--sage">${T('saved', ctx)}</span>
      </header>

      ${!ui.storageOk && html`<div class="warn-band">${str.storageWarn}</div>`}

      ${v.holding ? holdingCard(v) : doseCard(v)}

      ${v.smoked > v.day.dose && !ui.overDismissed && !ui.checkIn && overCard(v)}
      ${ui.checkIn && !ui.countConfirmed && countCard(v)}
      ${ui.checkIn && ui.countConfirmed && cravingCard(v)}

      ${!ui.checkIn && !v.holding && html`
        <button type="button" class="evening-prompt" data-action="openCheckIn">
          <span class="stack g4">
            <span class="evening-prompt__title">${str.eveningTitle}</span>
            <span class="evening-prompt__sub">${str.eveningSub}</span>
          </span>
          ${chevron('evening-prompt__icon')}
        </button>`}

      <section class="stack g10 pad-x4">
        <div class="row-between baseline">
          <span class="kicker c-muted">${str.sinceDayOne}</span>
          <span class="pct-down">${T('pctDown', ctx)}</span>
        </div>
        <div class="progress"><div class="progress__fill" style="--pct: ${Math.max(0, v.pctDown)}%"></div></div>
        <span class="small c-muted">${T('encouragement', ctx)}</span>
      </section>

      <section class="stack g10 pad-x4">
        <span class="kicker c-muted">${str.lastWeek}</span>
        <div class="week">
          ${data.days.slice(-7).map(d => weekTile(d, data))}
        </div>
      </section>
    </div>`;
}

function weekTile(d, data) {
  const pending = d.craving === null;
  const over = !pending && (d.raised || d.craving > (d.floor === null ? data.tolerable : d.floor));
  const tone = pending ? 'pending' : over ? 'over' : 'under';
  return html`
    <div class="week__tile week__tile--${tone}">
      <span class="week__dose">${d.dose}</span>
      <span class="week__craving">${pending ? '·' : d.craving}</span>
    </div>`;
}

function doseCard(v) {
  const { str, T, ctx, day, smoked } = v;
  const marks = [];
  for (let i = 0; i < Math.max(smoked, day.dose); i++) {
    marks.push(i >= smoked ? 'open' : i >= day.dose ? 'beyond' : 'used');
  }
  return html`
    <div class="card card--clay card--wide g15">
      <div class="row-between">
        <span class="kicker c-clay">${str.todayKicker}</span>
        <span class="badge badge--clay">${T('vsStart', ctx)}</span>
      </div>
      <div class="dose">
        <span class="dose__number">${day.dose}</span>
        <span class="dose__unit">${T('unit', ctx)}</span>
      </div>
      <div class="tally">${marks.map(m => html`<div class="tally__mark tally__mark--${m}"></div>`)}</div>
      <span class="tally-text">${T('tally', ctx)}</span>
      <button type="button" class="btn btn--primary btn--md ${smoked > day.dose && 'btn--deep'}" data-action="addSmoke">${str.smokedOne}</button>
      ${smoked > 0 && html`<button type="button" class="link link--clay center" data-action="undoSmoke">${str.undoOne}</button>`}
    </div>`;
}

function holdingCard(v) {
  const { str, T, ctx, data } = v;
  const celebrating = data.holdingDay >= 14;
  const pips = Array.from({ length: 14 }, (_, i) => i < data.holdingDay);
  return html`
    <div class="card card--sage card--wide g14">
      ${celebrating ? html`
        <svg width="88" height="34" viewBox="0 0 88 34" fill="none" stroke="var(--color-accent-2-700)" stroke-width="2.75" stroke-linecap="round">
          <path d="M14 4v9M9.5 8.5h9M44 2v7M40.5 5.5h7M74 6v8M70 10h8M26 24v6M23 27h6M60 22v7M57 25.5h6"></path>
        </svg>
        <span class="holding-title holding-title--big">${str.celebrateTitle}</span>
        <span class="holding-body">${str.celebrateBody}</span>
      ` : html`
        <span class="kicker c-sage">${str.holdingKicker}</span>
        <span class="holding-title">${T('holdingDayOf', ctx)}</span>
        <div class="pips">${pips.map(on => html`<div class="pips__pip ${on && 'is-on'}"></div>`)}</div>
        <span class="holding-body">${str.holdingBody}</span>
      `}
      <button type="button" class="btn btn--sage" data-action="openCheckIn">${str.notSmokedToday}</button>
      <button type="button" class="btn btn--outline-clay" data-action="startRelapse">${str.smokedToday}</button>
    </div>`;
}

function overCard(v) {
  const { str, T, ctx } = v;
  return html`
    <div class="card card--alert card--flat card--snug g12 rise-in" data-key="over">
      <span class="card-title card-title--sm">${str.overTitle}</span>
      <span class="body-sm">${T('overBody', ctx)}</span>
      <div class="stack g9">
        <button type="button" class="btn btn--primary" data-action="openFloorFromOver">${str.overYes}</button>
        <button type="button" class="btn btn--outline" data-action="dismissOver">${T('overNo', ctx)}</button>
      </div>
    </div>`;
}

// Only shown when the tally differs from the day's number, in either direction.
function countCard(v) {
  const { str, T, day, taken, smoked } = v;
  return html`
    <div class="card card--alert g16" data-key="count">
      <div class="stack g5">
        <span class="card-title">${str.countTitle}</span>
        <span class="body-sm c-muted">${T('countBody', { n: taken, dose: day.dose })}</span>
      </div>
      <div class="count">
        <button type="button" class="stepper" data-action="countDown" aria-label="−1">−</button>
        <span class="count__value">${taken}</span>
        <button type="button" class="stepper" data-action="countUp" aria-label="+1">+</button>
        <span class="count__hint">${T('countHint', { n: smoked })}</span>
      </div>
      <button type="button" class="btn btn--primary btn--md" data-action="confirmCount">${T('countConfirm', { n: taken })}</button>
      ${taken !== day.dose && html`
        <button type="button" class="btn btn--outline" data-action="confirmPrescribed">${T('countConfirmAlt', { dose: day.dose })}</button>`}
    </div>`;
}

function cravingCard(v) {
  const { str, T, ctx, ui, holding, day, taken, floorNow } = v;
  const over = ui.draft > floorNow;
  // an unusual day: the confirmed count differed, or the craving came in over
  // the level he can live with. Saying "no, I smoked the number" is ordinary.
  const unusual = taken !== day.dose || over;
  return html`
    <div class="card g18" data-key="craving">
      <div class="stack g5">
        <span class="card-title card-title--md">${str.ciTitle}</span>
        <span class="body-sm c-muted">${str.ciSub}</span>
      </div>
      <div class="craving-readout ${over ? 'is-over' : ''}">
        <span class="craving-readout__value">${ui.draft}</span>
        <span class="craving-readout__word">${T('cravingWord', ui.draft)}</span>
      </div>
      <div class="stack g10">
        ${slider({ name: 'craving', value: ui.draft, mark: floorNow, tone: over ? 'craving-over' : 'craving', size: 'tall' })}
        <div class="row-between scale"><span>${str.scale0}</span><span>${str.scale10}</span></div>
        <span class="tolerable-note ${over ? 'is-over' : ''}">${T('tolerableNote', ctx)}</span>
      </div>
      ${unusual && html`
        <div class="stack g8">
          <span class="note-label">${str.noteLabel}</span>
          <span class="small c-muted">${str.noteWhy}</span>
          <textarea class="textarea" rows="3" data-input="note" placeholder="${str.notePlaceholder}">${ui.note}</textarea>
        </div>`}
      <button type="button" class="btn btn--lg ${holding ? 'btn--sage' : 'btn--primary'}" data-action="submitCraving">
        ${holding ? str.ciSubmitHolding : str.ciSubmit}
      </button>
    </div>`;
}
