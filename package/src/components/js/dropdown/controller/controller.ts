import { parseJsonList } from '../../root.js';
import { buildDropdown, setLabel, setOpen } from '../dom/dom.js';
import { bindEvents } from '../events/events.js';
import { bindKeybinds } from '../keybinds/keybinds.js';
import type { KDropdownItem, KDropdownState } from '../models/models.js';

/** Re-exported so `index.ts` only ever reaches for the controller. */
export { insertAt, patchAt, removeAt } from '../../root.js';
export { setOpen } from '../dom/dom.js';
export { pickItem } from '../events/events.js';

// --- attributes ---

export function parseOptions(raw: string | null): KDropdownItem[] {
  const list = parseJsonList(raw, 'KDropdown');
  const options: KDropdownItem[] = [];
  for (const entry of list) {
    if (
      !entry ||
      typeof entry !== 'object' ||
      typeof (entry as { label?: unknown }).label !== 'string'
    ) {
      throw new Error('KDropdown: each option needs a label');
    }
    const item: KDropdownItem = { label: (entry as { label: string }).label };
    if (typeof (entry as { href?: unknown }).href === 'string') {
      item.href = (entry as { href: string }).href;
    }
    options.push(item);
  }
  return options;
}

// --- reading the menu ---

export function getItem(
  state: KDropdownState,
  index: number,
): HTMLElement | null {
  return state.items[index] ?? null;
}

export function focusItem(state: KDropdownState, index: number): boolean {
  const item = state.items[index];
  if (!item) {
    return false;
  }
  if (!state.open) {
    setOpen(state, true);
  }
  item.focus();
  return true;
}

export function indexOfLabel(state: KDropdownState, label: string): number {
  return state.items.findIndex((item) => item.textContent === label);
}

// --- lifecycle ---

/** Builds the trigger and menu, then binds clicks and keys. */
export function init(
  root: HTMLElement,
  options: KDropdownItem[],
  signal: AbortSignal,
): KDropdownState {
  const state: KDropdownState = {
    ...buildDropdown(root, {
      items: options,
      label: root.getAttribute('label') ?? undefined,
    }),
    open: false,
  };

  setOpen(state, false);
  bindEvents(state, signal);
  bindKeybinds(state, signal);
  return state;
}

/** Only `label` can be patched in place; `options` rebuilds the menu. */
export function applyAttribute(state: KDropdownState, name: string): boolean {
  if (name === 'label') {
    setLabel(state, state.root.getAttribute('label'));
    return true;
  }
  return false;
}
