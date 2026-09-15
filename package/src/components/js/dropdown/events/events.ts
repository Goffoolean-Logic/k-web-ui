import { setOpen } from '../dom/dom.js';
import type { KDropdownState } from '../models/models.js';

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
        setOpen(state, false);
        state.trigger.focus();
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
