import { bindTrack, buildControls, paint } from '../dom/dom.js';
import { bindEvents, goTo, setAutoscroll } from '../events/events.js';
import { bindKeybinds } from '../keybinds/keybinds.js';
import type { KCarouselState } from '../models/models.js';

export { goTo, setAutoscroll } from '../events/events.js';

export function getSlide(
  state: KCarouselState,
  index: number,
): HTMLElement | null {
  return state.slides[index] ?? null;
}

export function getCurrentSlide(state: KCarouselState): HTMLElement | null {
  return getSlide(state, state.index);
}

export function isPlaying(state: KCarouselState): boolean {
  return state.autoscroll && !state.autoscrollPaused;
}

export function init(
  root: HTMLElement,
  slides: HTMLElement[],
  signal: AbortSignal,
): KCarouselState {
  const track = bindTrack(slides);
  const controls = buildControls(root, slides.length);
  const state: KCarouselState = {
    root,
    track,
    slides,
    ...controls,
    index: 0,
    loop: true,
    keyboard: !root.classList.contains('k-carousel--no-keyboard'),
    autoscroll: root.classList.contains('k-carousel--autoscroll'),
  };

  root.setAttribute('aria-roledescription', 'carousel');
  root.tabIndex = 0;
  bindEvents(state, signal);
  bindKeybinds(state, signal);
  goTo(state, 0, { emit: false });
  return state;
}

export function applyHostClass(state: KCarouselState): void {
  state.keyboard = !state.root.classList.contains('k-carousel--no-keyboard');
  setAutoscroll(state, state.root.classList.contains('k-carousel--autoscroll'));
}
