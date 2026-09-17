import { describe, expect, it, vi } from 'vitest';
import { buildScrollbar } from '../dom/dom.js';
import type { KScrollbarState } from '../models/models.js';
import {
  beginDrag,
  bindEvents,
  endDrag,
  jumpTo,
  moveDrag,
  scrollTo,
} from './events.js';

function mockScroller(
  el: HTMLElement,
  box: {
    clientHeight: number;
    clientWidth: number;
    scrollHeight: number;
    scrollWidth: number;
    scrollTop?: number;
    scrollLeft?: number;
  },
): void {
  let scrollTop = box.scrollTop ?? 0;
  let scrollLeft = box.scrollLeft ?? 0;
  Object.defineProperty(el, 'clientHeight', {
    configurable: true,
    get: () => box.clientHeight,
  });
  Object.defineProperty(el, 'clientWidth', {
    configurable: true,
    get: () => box.clientWidth,
  });
  Object.defineProperty(el, 'scrollHeight', {
    configurable: true,
    get: () => box.scrollHeight,
  });
  Object.defineProperty(el, 'scrollWidth', {
    configurable: true,
    get: () => box.scrollWidth,
  });
  Object.defineProperty(el, 'scrollTop', {
    configurable: true,
    get: () => scrollTop,
    set: (value: number) => {
      scrollTop = value;
    },
  });
  Object.defineProperty(el, 'scrollLeft', {
    configurable: true,
    get: () => scrollLeft,
    set: (value: number) => {
      scrollLeft = value;
    },
  });
}

function mockTrack(el: HTMLElement, size: number): void {
  Object.defineProperty(el, 'clientHeight', {
    configurable: true,
    get: () => size,
  });
  Object.defineProperty(el, 'clientWidth', {
    configurable: true,
    get: () => size,
  });
  Object.defineProperty(el, 'offsetHeight', {
    configurable: true,
    get: () => size,
  });
  Object.defineProperty(el, 'offsetWidth', {
    configurable: true,
    get: () => size,
  });
  el.getBoundingClientRect = () =>
    ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: size,
      bottom: size,
      width: size,
      height: size,
      toJSON: () => ({}),
    }) as DOMRect;
}

function mounted(): {
  state: KScrollbarState;
  abort: AbortController;
  root: HTMLElement;
} {
  const root = document.createElement('div');
  root.append(document.createElement('p'));
  document.body.append(root);
  const abort = new AbortController();
  const state: KScrollbarState = {
    root,
    viewport: root,
    vTrack: root,
    vThumb: root,
    hTrack: root,
    hThumb: root,
    axis: 'y',
    mode: 'wrap',
    autohide: false,
    dragging: false,
    dragAxis: null,
    dragPointer: null,
    dragStartPos: 0,
    dragStartScroll: 0,
    silent: false,
    signal: abort.signal,
  };
  buildScrollbar(state);
  mockScroller(state.viewport, {
    clientHeight: 100,
    clientWidth: 200,
    scrollHeight: 400,
    scrollWidth: 200,
  });
  mockTrack(state.vTrack, 100);
  mockTrack(state.hTrack, 200);
  Object.defineProperty(state.vThumb, 'offsetHeight', {
    configurable: true,
    get: () => 25,
  });
  return { state, abort, root };
}

describe('scrollTo', () => {
  it('moves the viewport and emits k-change', () => {
    const { state, abort, root } = mounted();
    const onChange = vi.fn();
    root.addEventListener('k-change', onChange);
    scrollTo(state, 120);
    expect(state.viewport.scrollTop).toBe(120);
    expect(onChange).toHaveBeenCalledTimes(1);
    const event = onChange.mock.calls[0]?.[0] as CustomEvent<{
      scrollTop: number;
      scrollLeft: number;
    }>;
    expect(event.detail).toEqual({ scrollTop: 120, scrollLeft: 0 });
    abort.abort();
    root.remove();
  });

  it('stays quiet when emit is false', () => {
    const { state, abort, root } = mounted();
    const onChange = vi.fn();
    root.addEventListener('k-change', onChange);
    scrollTo(state, 40, undefined, { emit: false });
    expect(state.viewport.scrollTop).toBe(40);
    expect(onChange).not.toHaveBeenCalled();
    abort.abort();
    root.remove();
  });
});

describe('bindEvents', () => {
  it('paints and emits when the viewport scrolls', () => {
    const { state, abort, root } = mounted();
    bindEvents(state, abort.signal);
    const onChange = vi.fn();
    root.addEventListener('k-change', onChange);
    state.viewport.scrollTop = 90;
    state.viewport.dispatchEvent(new Event('scroll'));
    expect(onChange).toHaveBeenCalledTimes(1);
    abort.abort();
    root.remove();
  });
});

describe('drag', () => {
  it('maps thumb travel onto the viewport', () => {
    const { state, abort, root } = mounted();
    beginDrag(state, 'y', 1, 10, state.vThumb);
    moveDrag(state, 10 + 75);
    expect(state.viewport.scrollTop).toBe(300);
    endDrag(state);
    expect(state.dragging).toBe(false);
    abort.abort();
    root.remove();
  });

  it('maps horizontal thumb travel onto the viewport', () => {
    const { state, abort, root } = mounted();
    state.axis = 'both';
    mockScroller(state.viewport, {
      clientHeight: 100,
      clientWidth: 200,
      scrollHeight: 100,
      scrollWidth: 800,
    });
    mockTrack(state.hTrack, 200);
    Object.defineProperty(state.hThumb, 'offsetWidth', {
      configurable: true,
      get: () => 50,
    });
    beginDrag(state, 'x', 1, 10, state.hThumb);
    moveDrag(state, 10 + 75);
    expect(state.viewport.scrollLeft).toBe(300);
    endDrag(state);
    expect(state.dragging).toBe(false);
    abort.abort();
    root.remove();
  });
});

describe('jumpTo', () => {
  it('jumps so the thumb sits under the click', () => {
    const { state, abort, root } = mounted();
    jumpTo(state, 'y', 50);
    expect(state.viewport.scrollTop).toBe(150);
    abort.abort();
    root.remove();
  });

  it('jumps horizontally so the thumb sits under the click', () => {
    const { state, abort, root } = mounted();
    state.axis = 'both';
    mockScroller(state.viewport, {
      clientHeight: 100,
      clientWidth: 200,
      scrollHeight: 100,
      scrollWidth: 800,
    });
    mockTrack(state.hTrack, 200);
    Object.defineProperty(state.hThumb, 'offsetWidth', {
      configurable: true,
      get: () => 50,
    });
    jumpTo(state, 'x', 100);
    expect(state.viewport.scrollLeft).toBe(300);
    abort.abort();
    root.remove();
  });
});
