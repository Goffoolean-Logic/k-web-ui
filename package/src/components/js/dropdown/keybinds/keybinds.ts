import { setOpen } from '../dom/dom.js';
import type { KDropdownState } from '../models/models.js';

export function bindKeybinds(state: KDropdownState, signal: AbortSignal): void {
  state.root.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && state.open) {
        event.preventDefault();
        setOpen(state, false);
        state.trigger.focus();
        return;
      }

      if (!state.open || state.items.length === 0) {
        if (
          (event.key === 'ArrowDown' || event.key === 'ArrowUp') &&
          !state.open
        ) {
          event.preventDefault();
          setOpen(state, true);
          const next =
            event.key === 'ArrowUp' ? state.items.at(-1) : state.items[0];
          next?.focus();
        }
        return;
      }

      const index = state.items.indexOf(document.activeElement as HTMLElement);
      const last = state.items.length - 1;
      let next: number | undefined;

      switch (event.key) {
        case 'ArrowDown':
          next = index < 0 || index === last ? 0 : index + 1;
          break;
        case 'ArrowUp':
          next = index <= 0 ? last : index - 1;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = last;
          break;
        default:
          return;
      }

      event.preventDefault();
      state.items[next]?.focus();
    },
    { signal },
  );
}
