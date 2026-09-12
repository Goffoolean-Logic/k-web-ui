import { paint } from './dom.js';
import type { KCarouselState } from './models.js';

export function goTo(state: KCarouselState, index: number): void {
  const last = state.slides.length - 1;
  let next = index;
  if (state.loop) {
    if (next < 0) {
      next = last;
    } else if (next > last) {
      next = 0;
    }
  } else {
    next = Math.min(last, Math.max(0, next));
  }
  state.index = next;
  paint(state);
}

export function bindEvents(state: KCarouselState, signal: AbortSignal): void {
  state.prev.addEventListener('click', () => goTo(state, state.index - 1), {
    signal,
  });
  state.next.addEventListener('click', () => goTo(state, state.index + 1), {
    signal,
  });
  for (const [i, dot] of state.dots.entries()) {
    dot.addEventListener('click', () => goTo(state, i), { signal });
  }
}
