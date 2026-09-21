import { describe, expect, it, vi } from 'vitest';
import {
  getCurrentSlide,
  getSlide,
  init,
  isPlaying,
  setAutoscroll,
} from './controller.js';

function mount(
  count: number,
  className = '',
): {
  state: ReturnType<typeof init>;
  abort: AbortController;
  root: HTMLElement;
  track: HTMLElement;
  slides: HTMLElement[];
} {
  const track = document.createElement('div');
  const slides = Array.from({ length: count }, (_, i) => {
    const el = document.createElement('div');
    el.id = `deals-${i}`;
    el.textContent = `Slide ${i}`;
    return el;
  });
  track.append(...slides);
  const root = document.createElement('div');
  root.id = 'deals';
  if (className) {
    root.className = className;
  }
  document.body.append(track, root);
  const abort = new AbortController();
  const state = init(root, slides, abort.signal);
  return { state, abort, root, track, slides };
}

describe('init', () => {
  it('builds controls and marks the track', () => {
    const { state, abort, root, track, slides } = mount(3);
    expect(track.classList.contains('k-carousel__track')).toBe(true);
    expect(root.querySelectorAll('.k-carousel__dot')).toHaveLength(3);
    expect(getSlide(state, 0)).toBe(slides[0]);
    expect(getCurrentSlide(state)).toBe(slides[0]);
    expect(state.index).toBe(0);
    abort.abort();
    root.remove();
    track.remove();
  });

  it('reads keyboard and autoscroll from host classes', () => {
    const { state, abort, root, track } = mount(
      2,
      'k-carousel--autoscroll k-carousel--no-keyboard',
    );
    expect(state.autoscroll).toBe(true);
    expect(state.keyboard).toBe(false);
    abort.abort();
    root.remove();
    track.remove();
  });
});

describe('isPlaying', () => {
  it('follows autoscroll and pause', () => {
    const { state, abort, root, track } = mount(2, 'k-carousel--autoscroll');
    expect(isPlaying(state)).toBe(true);
    state.autoscrollPaused = true;
    expect(isPlaying(state)).toBe(false);
    setAutoscroll(state, false);
    expect(isPlaying(state)).toBe(false);
    abort.abort();
    root.remove();
    track.remove();
  });
});

describe('bindTrack errors', () => {
  it('throws when the track parent has extra children', () => {
    const track = document.createElement('div');
    const a = document.createElement('div');
    a.id = 'bad-0';
    track.append(a, document.createElement('p'));
    const root = document.createElement('div');
    root.id = 'bad';
    document.body.append(track, root);
    const abort = new AbortController();
    expect(() => init(root, [a], abort.signal)).toThrow(
      'KCarousel: slides must sit alone in their track parent',
    );
    abort.abort();
    root.remove();
    track.remove();
  });
});
