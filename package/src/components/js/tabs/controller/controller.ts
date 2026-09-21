import { setTabsLabel } from '../dom/dom.js';
import { buildTabs } from '../dom/dom.js';
import { bindEvents, paintInk, selectTab } from '../events/events.js';
import { bindKeybinds } from '../keybinds/keybinds.js';
import type { KTabItem, KTabsSelection, KTabsState } from '../models/models.js';

export { selectTab } from '../events/events.js';

export function getSelectedIndex(state: KTabsState): number {
  return state.tabs.findIndex(
    (tab) => tab.getAttribute('aria-selected') === 'true',
  );
}

export function getLabels(state: KTabsState): string[] {
  const items = state.items ?? [];
  return state.tabs.map((tab, i) => items[i]?.label ?? tab.textContent ?? '');
}

export function getSelected(state: KTabsState): KTabsSelection | null {
  const index = getSelectedIndex(state);
  const tab = state.tabs[index];
  const panel = state.panels[index];
  if (!tab || !panel) {
    return null;
  }
  return {
    index,
    tab,
    panel,
    label: state.items?.[index]?.label ?? tab.textContent ?? '',
  };
}

export function indexOfLabel(state: KTabsState, label: string): number {
  return getLabels(state).indexOf(label);
}

export function step(
  state: KTabsState,
  delta: number,
  { wrap = true, focus = false } = {},
): void {
  const index = getSelectedIndex(state);
  if (index < 0) {
    return;
  }
  const last = state.tabs.length - 1;
  let next = index + delta;
  if (next > last) {
    next = wrap ? 0 : last;
  }
  if (next < 0) {
    next = wrap ? last : 0;
  }
  selectTab(state, next, { focus });
}

export function init(
  root: HTMLElement,
  items: KTabItem[],
  panels: HTMLElement[],
  signal: AbortSignal,
): KTabsState {
  const state: KTabsState = {
    root,
    tabs: [],
    panels: [],
    keyboard: !root.classList.contains('k-tabs--no-keyboard'),
    items,
  };

  buildTabs(state, { items }, panels);
  bindEvents(state, signal);
  bindKeybinds(state, signal);
  selectTab(state, 0, { emit: false });
  return state;
}

export function applyHostClass(state: KTabsState): void {
  state.keyboard = !state.root.classList.contains('k-tabs--no-keyboard');
  const name = state.root.getAttribute('aria-label') || state.root.id;
  setTabsLabel(state, name);
  paintInk(state, { animate: false });
}
