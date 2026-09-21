import { emitKChange } from '../../root.js';
import { setLabel, setOpen } from '../dom/dom.js';
import type { KDropdownState } from '../models/models.js';

/**
 * Closes the menu, hands focus back to the trigger, and announces the pick.
 * Both a click and a keyboard activation land here.
 */
export function pickItem(state: KDropdownState, index: number): void {
  const item = state.items[index];
  if (!item) {
    return;
  }
  const label = item.textContent ?? '';
  if (state.select) {
    setLabel(state, label);
  }
  setOpen(state, false);
  state.trigger.focus();
  emitKChange(state.root, {
    index,
    label,
    href: item instanceof HTMLAnchorElement ? item.getAttribute('href') : null,
  });
}

export function bindEvents(state: KDropdownState, signal: AbortSignal): void {
  state.trigger.addEventListener(
    'click',
    (event) => {
      event.stopPropagation();
      setOpen(state, !state.open);
      if (state.open) {
        state.items[0]?.focus();
      }
    },
    { signal },
  );

  state.menu.addEventListener(
    'click',
    (event) => {
      const item = (event.target as Element | null)?.closest?.(
        '.k-dropdown__item',
      );
      if (item instanceof HTMLElement && state.root.contains(item)) {
        pickItem(state, state.items.indexOf(item));
      }
    },
    { signal },
  );

  document.addEventListener(
    'click',
    (event) => {
      if (!state.open || !state.root.isConnected) {
        return;
      }
      const target = event.target as Node | null;
      if (target && !state.root.contains(target)) {
        setOpen(state, false);
      }
    },
    { signal },
  );
}
