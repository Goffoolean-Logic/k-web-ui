import { goTo } from '../events/events.js';
import type { KPaginationState } from '../models/models.js';

export function bindKeybinds(state: KPaginationState): void {
  state.root.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(state, state.page - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(state, state.page + 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        goTo(state, 1);
      } else if (event.key === 'End') {
        event.preventDefault();
        goTo(state, state.count);
      }
    },
    { signal: state.signal },
  );
}
