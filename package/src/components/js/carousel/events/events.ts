import { emitKChange } from '../../root.js';
import { paint } from '../dom/dom.js';
import type { KCarouselState } from '../models/models.js';

export const AUTOSCROLL_MS = 5000;

function prefersReducedMotion(): boolean {
  return (
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function clearAutoscroll(state: KCarouselState): void {
  if (state.autoscrollTimer !== undefined) {
    clearTimeout(state.autoscrollTimer);
    state.autoscrollTimer = undefined;
  }
}

function armAutoscroll(state: KCarouselState): void {
  clearAutoscroll(state);
  if (!state.autoscroll || state.autoscrollPaused) {
    return;
  }
  if (prefersReducedMotion()) {
    return;
  }
  if (state.slides.length < 2) {
    return;
  }
  if (!state.loop && state.index >= state.slides.length - 1) {
    return;
  }

  state.autoscrollTimer = setTimeout(() => {
    goTo(state, state.index + 1);
  }, AUTOSCROLL_MS);
}

export function goTo(
  state: KCarouselState,
  index: number,
  { emit = true } = {},
): void {
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
  armAutoscroll(state);
  if (emit) {
    emitKChange(state.root, { index: state.index });
  }
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

  const pause = (): void => {
    state.autoscrollPaused = true;
    clearAutoscroll(state);
  };
  const resume = (): void => {
    state.autoscrollPaused = false;
    armAutoscroll(state);
  };

  state.root.addEventListener('pointerenter', pause, { signal });
  state.root.addEventListener('pointerleave', resume, { signal });
  state.root.addEventListener('focusin', pause, { signal });
  state.root.addEventListener(
    'focusout',
    (event) => {
      const next = event.relatedTarget;
      if (next instanceof Node && state.root.contains(next)) {
        return;
      }
      resume();
    },
    { signal },
  );
  signal.addEventListener('abort', () => clearAutoscroll(state), {
    once: true,
  });
}
