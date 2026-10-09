// The whole app: the current tab, the tab bar, and whatever is open on top.

import { html } from '../dom.js';
import { today } from './today.js';
import { progress } from './progress.js';
import { settings } from './settings.js';
import { resultSheet } from './sheets.js';
import { setup } from './setup.js';

const TABS = [
  { id: 'today', label: 'tabToday', icon: 'M12 3a4 4 0 0 0-4 4c0 3-2 4-2 7a6 6 0 0 0 12 0c0-3-2-4-2-7a4 4 0 0 0-4-4z' },
  { id: 'trend', label: 'tabProgress', icon: 'M3 3v18h18M7 15l4-5 3 3 5-7' },
  { id: 'plan', label: 'tabSettings', icon: 'M4 6h16M4 12h16M4 18h16' }
];

export function view(v, sync) {
  const { str, ui } = v;
  const screen = ui.screen === 'trend' ? progress(v) : ui.screen === 'plan' ? settings(v, sync) : today(v);
  return html`
    <main class="screen" data-key="screen-${ui.screen}">${screen}</main>
    <nav class="tabs">
      ${TABS.map(tab => html`
        <button type="button" class="tabs__tab ${ui.screen === tab.id && 'is-on'}" data-action="setScreen" data-arg="${tab.id}">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75"
               stroke-linecap="round" stroke-linejoin="round"><path d="${tab.icon}"></path></svg>
          <span>${str[tab.label]}</span>
        </button>`)}
    </nav>
    ${ui.sheet === 'result' && resultSheet(v)}
    ${ui.onboarding && setup(v)}`;
}
