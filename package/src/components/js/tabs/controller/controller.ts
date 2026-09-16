import { parseJsonList } from '../../root.js';
import { buildTabs, setTabsLabel } from '../dom/dom.js';
import { bindEvents, paintInk, selectTab } from '../events/events.js';
import { bindKeybinds } from '../keybinds/keybinds.js';
import type { KTabItem, KTabsSelection, KTabsState } from '../models/models.js';

/** Re-exported so `index.ts` only ever reaches for the controller. */
export { insertAt, patchAt, removeAt } from '../../root.js';
export { selectTab } from '../events/events.js';

// --- attributes ---

export function toIndex(raw: string | null): number {
  const value = Number(raw ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function isNode(value: unknown): value is Node {
  return value instanceof Node;
}

export function parsePanels(raw: string | null): KTabItem[] {
  const list = parseJsonList(raw, 'KTabs');
  const panels: KTabItem[] = [];
  for (const entry of list) {
    if (!entry || typeof entry !== 'object') {
      throw new Error('KTabs: each panel is an object');
    }
    const rec = entry as {
      label?: unknown;
      icon?: unknown;
      content?: unknown;
    };
    const panel: KTabItem = {
      content: typeof rec.content === 'string' ? rec.content : '',
    };
    if (typeof rec.label === 'string') {
      panel.label = rec.label;
    }
    if (typeof rec.icon === 'string') {
      panel.icon = rec.icon as KTabItem['icon'];
    }
    panels.push(panel);
  }
  return panels;
}

export function serializePanels(panels: KTabItem[]): string | null {
  const json: Array<Record<string, string>> = [];
  for (const panel of panels) {
    if (isNode(panel.content) || isNode(panel.icon)) {
      return null;
    }
    const entry: Record<string, string> = {};
    if (panel.label !== undefined) {
      entry.label = panel.label;
    }
    if (typeof panel.icon === 'string') {
      entry.icon = panel.icon;
    }
    if (typeof panel.content === 'string') {
      entry.content = panel.content;
    }
    json.push(entry);
  }
  return JSON.stringify(json);
}

// --- reading the current selection ---

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

/** Moves selection by `delta`, wrapping past either end unless told not to. */
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

// --- lifecycle ---

/** Builds the subtree, binds listeners, and applies the starting selection. */
export function init(
  root: HTMLElement,
  panels: KTabItem[],
  signal: AbortSignal,
): KTabsState {
  const state: KTabsState = {
    root,
    tabs: [],
    panels: [],
    keyboard: root.getAttribute('keyboard') !== 'false',
    items: panels,
  };

  buildTabs(state, {
    items: panels,
    label: root.getAttribute('label') ?? undefined,
    keyboard: state.keyboard,
  });
  bindEvents(state, signal);
  bindKeybinds(state, signal);
  selectTab(state, toIndex(root.getAttribute('selected')), { emit: false });
  return state;
}

/** Patches a live subtree in place so focus and animations survive. */
export function applyAttribute(state: KTabsState, name: string): void {
  const root = state.root;
  switch (name) {
    case 'selected':
      selectTab(state, toIndex(root.getAttribute('selected')), {
        emit: false,
      });
      break;
    case 'keyboard':
      state.keyboard = root.getAttribute('keyboard') !== 'false';
      break;
    case 'label':
      setTabsLabel(state, root.getAttribute('label'));
      break;
    case 'size':
      // Tab widths change, so the ink has to move with them.
      paintInk(state, { animate: false });
      break;
  }
}
