import { describe, expect, it, vi } from 'vitest';
import { buildCarousel, paint } from '../dom/dom.js';
import type { KCarouselState } from '../models/models.js';
import { AUTOSCROLL_MS, bindEvents, goTo } from './events.js';

const items = [{ content: 'One' }, { content: 'Two' }, { content: 'Three' }];

function mounted(loop = true): {
  state: KCarouselState;
  abort: AbortController;
} {
  const root = document.createElement('div');
  document.body.append(root);
  const abort = new AbortController();
  const state: KCarouselState = {
    ...buildCarousel(root, { items }),
    index: 0,
    loop,
    keyboard: true,
    autoscroll: false,
  };
  paint(state);
  bindEvents(state, abort.signal);
  return { state, abort };
}

describe('goTo', () => {
  it('wraps when loop is on', () => {
    const { state, abort } = mounted(true);
    goTo(state, -1);
    expect(state.index).toBe(2);
    goTo(state, 3);
    expect(state.index).toBe(0);
    abort.abort();
    state.root.remove();
  });

  it('clamps when loop is off', () => {
    const { state, abort } = mounted(false);
    goTo(state, -1);
    expect(state.index).toBe(0);
    goTo(state, 9);
    expect(state.index).toBe(2);
    abort.abort();
    state.root.remove();
  });

  it('paints and emits k-change unless emit is false', () => {
    const { state, abort } = mounted();
    const onChange = vi.fn();
    state.root.addEventListener('k-change', onChange);
    goTo(state, 2);
    expect(state.track.style.transform).toBe('translateX(-200%)');
    expect(onChange).toHaveBeenCalledTimes(1);
    const event = onChange.mock.calls[0]?.[0] as CustomEvent<{
      index: number;
    }>;
    expect(event.detail).toEqual({ index: 2 });
    goTo(state, 1, { emit: false });
    expect(onChange).toHaveBeenCalledTimes(1);
    abort.abort();
    state.root.remove();
  });
});

describe('bindEvents', () => {
  it('moves from arrows and dots', () => {
    const { state, abort } = mounted();
    state.next.click();
    expect(state.index).toBe(1);
    state.prev.click();
    expect(state.index).toBe(0);
    state.dots[2]?.click();
    expect(state.index).toBe(2);
    abort.abort();
    state.root.remove();
  });
});

describe('autoscroll', () => {
  it('advances on the interval when autoscroll is on', () => {
    vi.useFakeTimers();
    const { state, abort } = mounted(true);
    state.autoscroll = true;
    goTo(state, 0, { emit: false });
    vi.advanceTimersByTime(AUTOSCROLL_MS);
    expect(state.index).toBe(1);
    vi.advanceTimersByTime(AUTOSCROLL_MS);
    expect(state.index).toBe(2);
    vi.advanceTimersByTime(AUTOSCROLL_MS);
    expect(state.index).toBe(0);
    abort.abort();
    state.root.remove();
    vi.useRealTimers();
  });

  it('does not advance after abort', () => {
    vi.useFakeTimers();
    const { state, abort } = mounted(true);
    state.autoscroll = true;
    goTo(state, 0, { emit: false });
    abort.abort();
    vi.advanceTimersByTime(AUTOSCROLL_MS * 2);
    expect(state.index).toBe(0);
    state.root.remove();
    vi.useRealTimers();
  });

  it('stops at the end when loop is off', () => {
    vi.useFakeTimers();
    const { state, abort } = mounted(false);
    state.autoscroll = true;
    goTo(state, 2, { emit: false });
    vi.advanceTimersByTime(AUTOSCROLL_MS * 2);
    expect(state.index).toBe(2);
    abort.abort();
    state.root.remove();
    vi.useRealTimers();
  });
});
