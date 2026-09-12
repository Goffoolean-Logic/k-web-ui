import { tabFromEvent } from './dom.js';
import { selectTab } from './events.js';
import type { KTabsState } from './models.js';

export function bindKeybinds(state: KTabsState, signal: AbortSignal): void {
  if (!state.keyboard) {
    return;
  }

  state.root.addEventListener(
    'keydown',
    (event) => {
      const tab = tabFromEvent(state.root, event);
      if (!tab) {
        return;
      }

      const index = state.tabs.indexOf(tab);
      if (index < 0) {
        return;
      }

      const last = state.tabs.length - 1;
      let next: number | undefined;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          next = index === last ? 0 : index + 1;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          next = index === 0 ? last : index - 1;
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
      selectTab(state, next, { focus: true });
    },
    { signal },
  );
}
