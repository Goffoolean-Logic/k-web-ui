import { buildDropdown, setLabel, setOpen } from '../dom/dom.js';
import { bindEvents } from '../events/events.js';
import { bindKeybinds } from '../keybinds/keybinds.js';
import type { KDropdownItem, KDropdownState } from '../models/models.js';

export { insertAt, patchAt, removeAt } from '../../root.js';
export { setOpen } from '../dom/dom.js';
export { pickItem } from '../events/events.js';

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

export function init(
  root: HTMLElement,
  items: KDropdownItem[],
  trigger: string,
  signal: AbortSignal,
  select = false,
): KDropdownState {
  const state: KDropdownState = {
    ...buildDropdown(root, {
      items,
      trigger,
    }),
    open: false,
    select,
  };

  setOpen(state, false);
  bindEvents(state, signal);
  bindKeybinds(state, signal);
  return state;
}
