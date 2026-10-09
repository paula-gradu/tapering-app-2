// The Settings tab, in the order the author chose: what's tolerable, the
// setup answers, the record, the disclaimer, start over.

import { html } from '../dom.js';
import { slider } from './parts.js';

export function settings(v, sync) {
  const { str, T, ctx, data, ui } = v;
  return html`
    <div class="stack g16">
      <div class="row-between center-y">
        <span class="screen-title">${str.settings}</span>
        <button type="button" class="lang-chip" data-action="cycleLang" title="${str.language}">${data.lang.toUpperCase()}</button>
      </div>

      <div class="card g16">
        <div class="stack g5">
          <span class="card-title">${str.tolerableTitle}</span>
          <span class="body-sm c-muted">${str.tolerableBody}</span>
        </div>
        <div class="readout">
          <span class="readout__value readout__value--md">${data.tolerable}</span>
          <span class="readout__unit">${str.outOfTen}</span>
        </div>
        ${slider({ name: 'tolerable', value: data.tolerable, min: 1, tone: 'sage', size: 'tall' })}
        <span class="small">${T('tolerableSetting', data.tolerable)}</span>
      </div>

      <div class="card g14">
        <div class="stack g5">
          <span class="card-title">${str.setupTitle}</span>
          <span class="body-sm c-muted">${str.setupBody}</span>
        </div>
        ${[
          [str.setupRow1, data.start],
          [str.setupRow2, data.nLow + '–' + data.nHigh],
          [str.setupRow3, data.without + ' / 10']
        ].map(([k, val]) => html`
          <div class="answer-row"><span>${k}</span><span class="answer-row__value">${val}</span></div>`)}
        <div class="rule"></div>
        <div class="row-between baseline">
          <button type="button" class="link link--muted" data-action="togglePreview">${T('previewToggle', { open: ui.previewOpen })}</button>
          <button type="button" class="link link--clay nowrap" data-action="startOnboarding">${str.redoSetup}</button>
        </div>
        ${ui.previewOpen && preview(v, '')}
      </div>

      <div class="card g14">
        <div class="stack g5">
          <span class="card-title">${str.dataTitle}</span>
          <span class="body-sm c-muted">${str.dataBody}</span>
        </div>
        <div class="sync">
          <div class="sync__dot sync__dot--${sync.tone}"></div>
          <span class="sync__text">${sync.text}</span>
          ${sync.canRetry && html`<button type="button" class="btn btn--outline btn--xs" data-action="retrySync">${str.retry}</button>`}
        </div>
        <span class="small c-muted">${T('dataStatus', ctx)}</span>
        <button type="button" class="btn btn--primary btn--sm" data-action="exportCsv">${str.exportCsv}</button>
        <button type="button" class="btn btn--soft btn--sm" data-action="sendCsv">${str.sendCsv}</button>
      </div>

      <div class="card card--muted card--flat card--snug g10">
        <span class="card-title card-title--xs">${str.legalTitle}</span>
        <span class="fine">${str.paperNote}</span>
        <div class="rule"></div>
        <span class="fine">${str.legalBody}</span>
      </div>

      <div class="card card--danger card--flat card--snug g11">
        <span class="card-title card-title--sm c-deep">${str.resetTitle}</span>
        <span class="small c-clay-deep">${str.resetBody}</span>
        <button type="button" class="btn btn--sm ${ui.resetArmed ? 'btn--armed' : 'btn--outline-clay'}" data-action="hardReset">
          ${ui.resetArmed ? str.resetConfirm : str.resetButton}
        </button>
      </div>
    </div>`;
}

// "What does that mean?": what one cigarette is worth, and the two limits.
export function preview(v, tone) {
  const { T, previewCtx } = v;
  return html`
    <div class="stack g10 rise-in preview ${tone}" data-key="preview">
      <span>${T('livePreview', previewCtx)}</span>
      <span>${T('ceilingNote', previewCtx)}</span>
      <span>${T('stepNote', previewCtx)}</span>
    </div>`;
}
