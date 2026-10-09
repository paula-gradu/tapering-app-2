// Setup: the first-run questions, also used for "Redo setup" and, from the
// count step on, for a restart after a relapse.

import { html } from '../dom.js';
import { STRINGS, LANGS } from '../strings.js';
import { OB_STEPS } from '../derive.js';
import { slider } from './parts.js';
import { preview } from './settings.js';

export const rangeMax = start => Math.max(10, start * 2);

export function setup(v) {
  const { str, T, ctx, data, ui, answered } = v;
  const ob = ui.onboarding;
  const a = ob.draft;
  const step = OB_STEPS[ob.step];
  const copy = ob.relapse && step === 'count'
    ? { title: str.relapseTitle, body: str.relapseBody }
    : str.ob[ob.step];
  const legalGate = step === 'legal' && !data.agreed;
  const closes = ob.step === 0 || (ob.relapse && step === 'count');

  return html`
    <div class="setup" data-key="setup">
      <div class="setup__pips">
        ${OB_STEPS.map((_, i) => html`<div class="setup__pip ${i <= ob.step && 'is-on'}"></div>`)}
      </div>

      <div class="setup__body">
        <div class="stack g10">
          <span class="setup__title">${copy.title}</span>
          <span class="setup__lead">${copy.body}</span>
        </div>
        ${stepBody(step, v, a)}
      </div>

      <div class="stack g10 setup__foot">
        <button type="button" class="btn btn--primary btn--lg ${legalGate && 'is-disabled'}" data-action="obNext" aria-disabled="${legalGate}">
          ${step === 'done' ? str.obBegin : step === 'intro' ? str.obStart : str.obNext}
        </button>
        ${(ob.step > 0 || answered.length > 0) && html`
          <button type="button" class="link-plain" data-action="obBack">${closes ? str.obClose : str.obBack}</button>`}
      </div>
    </div>`;
}

function stepBody(step, v, a) {
  const { str, T, data, ui } = v;
  switch (step) {
    case 'lang':
      return html`
        <div class="stack g10">
          ${LANGS.map(code => html`
            <button type="button" class="lang-option ${data.lang === code && 'is-on'}" data-action="pickLang" data-arg="${code}">
              ${STRINGS[code].name}
            </button>`)}
        </div>`;

    case 'name':
      return html`
        <div class="card card--flat g9">
          <label class="field-label" for="name">${str.nameLabel}</label>
          <input id="name" class="input" type="text" data-input="name" value="${a.name}" placeholder="${str.namePlaceholder}" autocomplete="off">
        </div>`;

    case 'count':
      return html`
        <div class="card card--flat g14">
          <div class="big-count">
            <button type="button" class="stepper stepper--big" data-action="startDown" aria-label="−1">−</button>
            <span class="big-count__value">${a.start}</span>
            <button type="button" class="stepper stepper--big" data-action="startUp" aria-label="+1">+</button>
          </div>
          <span class="center-text small c-muted">${str.aDay}</span>
        </div>`;

    case 'range': {
      const max = rangeMax(a.start);
      return html`
        <div class="card card--flat g16">
          <div class="range-readout">
            <span class="readout__value readout__value--sm">${a.nLow}</span>
            <span class="readout__unit">${str.to}</span>
            <span class="readout__value readout__value--sm">${a.nHigh}</span>
          </div>
          <div class="stack g6">
            <span class="field-label">${str.atFewest}</span>
            ${slider({ name: 'nLow', value: a.nLow, min: 1, max, tone: 'clay-light', size: 'small' })}
          </div>
          <div class="stack g6">
            <span class="field-label">${str.atMost}</span>
            ${slider({ name: 'nHigh', value: a.nHigh, min: 1, max, tone: 'clay-mid', size: 'small' })}
          </div>
          <button type="button" class="link link--clay center link--lg" data-action="dontKnowRange">${str.dontKnow}</button>
        </div>`;
    }

    case 'without':
      return html`
        <div class="card card--flat g14">
          <div class="readout">
            <span class="readout__value">${a.without}</span>
            <span class="readout__unit">${str.outOfTen}</span>
          </div>
          ${slider({ name: 'without', value: a.without, min: 1, tone: 'clay' })}
          <button type="button" class="link link--clay center link--lg" data-action="dontKnowWithout">${str.dontKnow}</button>
          <div class="rule"></div>
          <button type="button" class="link link--muted start" data-action="togglePreview">${T('previewToggle', { open: ui.previewOpen })}</button>
          ${ui.previewOpen && preview(v, 'preview--inset')}
        </div>`;

    case 'tolerable':
      return html`
        <div class="card card--flat g16">
          <div class="readout">
            <span class="readout__value">${a.tolerable}</span>
            <span class="readout__unit">${str.outOfTen}</span>
          </div>
          ${slider({ name: 'obTolerable', value: a.tolerable, min: 1, tone: 'sage' })}
          <span class="body-sm">${T('tolerableSetting', a.tolerable)}</span>
        </div>`;

    case 'legal':
      return html`
        <div class="card card--flat g12">
          <span class="legal-text">${str.paperNote}</span>
          <div class="rule"></div>
          <span class="legal-text">${str.legalBody}</span>
          <div class="rule"></div>
          <button type="button" class="agree ${data.agreed && 'is-on'}" data-action="toggleAgree">${T('agree', { agreed: data.agreed })}</button>
        </div>`;

    case 'done':
      return html`
        <div class="card card--clay card--flat g14">
          <div class="dose">
            <span class="dose__number dose__number--done">${a.start}</span>
            <span class="dose__unit">${str.today}</span>
          </div>
          <span class="tally-text">${str.doneBody}</span>
          <div class="rule rule--clay"></div>
          <button type="button" class="link link--clay-deep start" data-action="togglePreview">${T('previewToggle', { open: ui.previewOpen })}</button>
          ${ui.previewOpen && preview(v, 'preview--clay')}
        </div>`;

    default:
      return '';
  }
}
