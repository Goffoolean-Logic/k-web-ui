import { goTo } from './events.js';
import type { KCarouselState } from './models.js';

export function bindKeybinds(state: KCarouselState, signal: AbortSignal): void {
  if (!state.keyboard) {
    return;
  }

  state.root.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(state, state.index - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(state, state.index + 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        goTo(state, 0);
      } else if (event.key === 'End') {
        event.preventDefault();
        goTo(state, state.slides.length - 1);
      }
    },
    { signal },
  );
}
