// Small pieces shared by several screens.

import { html } from '../dom.js';

// A 0–max slider. Dragging and arrow keys are handled in app.js through
// data-slider; `mark` draws a tick (the floor) and `tone` picks the colours.
export function slider({ name, value, min = 0, max = 10, mark = null, tone, size = '' }) {
  const pct = v => (v / max * 100) + '%';
  return html`
    <div class="slider slider--${tone} ${size && 'slider--' + size}" data-slider="${name}"
         role="slider" tabindex="0" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${value}"
         style="--at: ${pct(value)}${mark !== null ? '; --mark: ' + pct(mark) : ''}">
      <div class="slider__track"></div>
      <div class="slider__fill"></div>
      ${mark !== null && html`<div class="slider__mark"></div>`}
      <div class="slider__thumb"></div>
    </div>`;
}

export function chevron(cls) {
  return html`<svg class="${cls}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>`;
}

// A bottom sheet over the app. The key makes each sheet a new element, so it
// slides up when it opens rather than when it re-renders.
export function sheet(key, body) {
  return html`
    <div class="sheet-backdrop" data-key="sheet-${key}">
      <div class="sheet">
        <div class="sheet__grip"></div>
        ${body}
      </div>
    </div>`;
}
