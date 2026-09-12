import { tabFromEvent } from './dom.js';
import type { KTabsState } from './models.js';

export function selectTab(
  state: KTabsState,
  index: number,
  { focus = false } = {},
): void {
  const next = state.tabs[index];
  if (!next) {
    return;
  }

  for (const [i, tab] of state.tabs.entries()) {
    const on = i === index;
    tab.setAttribute('aria-selected', String(on));
    tab.tabIndex = on ? 0 : -1;
    const panel = state.panels[i];
    if (panel) {
      panel.hidden = !on;
    }
  }

  if (focus) {
    next.focus();
  }
}

export function bindEvents(state: KTabsState, signal: AbortSignal): void {
  state.root.addEventListener(
    'click',
    (event) => {
      const tab = tabFromEvent(state.root, event);
      if (!tab) {
        return;
      }
      const index = state.tabs.indexOf(tab);
      if (index >= 0) {
        selectTab(state, index, { focus: true });
      }
    },
    { signal },
  );
}
