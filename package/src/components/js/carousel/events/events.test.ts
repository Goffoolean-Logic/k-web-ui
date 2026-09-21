import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { init } from '../controller/controller.js';
import { AUTOSCROLL_MS, bindEvents, goTo } from './events.js';

function mount(
  count = 3,
  className = '',
): {
  state: ReturnType<typeof init>;
  abort: AbortController;
  root: HTMLElement;
  track: HTMLElement;
} {
  const track = document.createElement('div');
  const slides = Array.from({ length: count }, (_, i) => {
    const el = document.createElement('div');
    el.id = `deals-${i}`;
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
  return { state, abort, root, track };
}

describe('goTo', () => {
  it('wraps when loop is on', () => {
    const { state, abort, root, track } = mount();
    goTo(state, -1);
    expect(state.index).toBe(2);
    goTo(state, 3);
    expect(state.index).toBe(0);
    abort.abort();
    root.remove();
    track.remove();
  });

  it('clamps when loop is off', () => {
    const { state, abort, root, track } = mount();
    state.loop = false;
    goTo(state, -1);
    expect(state.index).toBe(0);
    goTo(state, 9);
    expect(state.index).toBe(2);
    abort.abort();
    root.remove();
    track.remove();
  });

  it('paints and emits k-change unless emit is false', () => {
    const { state, abort, root, track } = mount();
    const onChange = vi.fn();
    root.addEventListener('k-change', onChange);
    goTo(state, 1);
    expect(onChange.mock.calls[0]?.[0].detail).toEqual({ index: 1 });
    goTo(state, 2, { emit: false });
    expect(onChange).toHaveBeenCalledTimes(1);
    abort.abort();
    root.remove();
    track.remove();
  });
});

describe('bindEvents', () => {
  it('moves from arrows and dots', () => {
    const { state, abort, root, track } = mount();
    state.prev.click();
    expect(state.index).toBe(2);
    state.next.click();
    expect(state.index).toBe(0);
    state.dots[1]?.click();
    expect(state.index).toBe(1);
    abort.abort();
    root.remove();
    track.remove();
  });
});

describe('autoscroll', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('advances on the interval when autoscroll is on', () => {
    const { state, abort, root, track } = mount(3, 'k-carousel--autoscroll');
    expect(state.index).toBe(0);
    vi.advanceTimersByTime(AUTOSCROLL_MS);
    expect(state.index).toBe(1);
    abort.abort();
    root.remove();
    track.remove();
  });

  it('does not advance after abort', () => {
    const { state, abort, root, track } = mount(3, 'k-carousel--autoscroll');
    abort.abort();
    vi.advanceTimersByTime(AUTOSCROLL_MS);
    expect(state.index).toBe(0);
    root.remove();
    track.remove();
  });

  it('stops at the end when loop is off', () => {
    const { state, abort, root, track } = mount(2, 'k-carousel--autoscroll');
    state.loop = false;
    goTo(state, 1, { emit: false });
    vi.advanceTimersByTime(AUTOSCROLL_MS);
    expect(state.index).toBe(1);
    abort.abort();
    root.remove();
    track.remove();
  });
});
