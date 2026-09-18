import { describe, expect, it } from 'vitest';
import type { KScrollbarState } from '../models/models.js';
import {
  buildScrollbar,
  hasOverflowX,
  hasOverflowY,
  paint,
  readAxis,
} from './dom.js';

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
}

function stateOf(root: HTMLElement): KScrollbarState {
  return {
    root,
    viewport: root,
    vTrack: root,
    vThumb: root,
    hTrack: root,
    hThumb: root,
    axis: 'both',
    mode: 'wrap',
    autohide: false,
    dragging: false,
    dragAxis: null,
    dragPointer: null,
    dragStartPos: 0,
    dragStartScroll: 0,
    silent: false,
    signal: new AbortController().signal,
  };
}

describe('readAxis', () => {
  it('defaults to both and accepts x or y', () => {
    expect(readAxis(null)).toBe('both');
    expect(readAxis('y')).toBe('y');
    expect(readAxis('x')).toBe('x');
    expect(readAxis('both')).toBe('both');
    expect(readAxis('nope')).toBe('both');
  });
});

describe('buildScrollbar', () => {
  it('wraps host children in a viewport and paints tracks', () => {
    const root = document.createElement('div');
    const para = document.createElement('p');
    para.textContent = 'Long copy.';
    root.append(para);
    document.body.append(root);
    const state = stateOf(root);
    buildScrollbar(state);

    expect(state.viewport.className).toBe('k-scrollbar__viewport');
    expect(state.viewport.contains(para)).toBe(true);
    expect(state.vTrack.className).toContain('k-scrollbar__track--y');
    expect(state.hTrack.className).toContain('k-scrollbar__track--x');
    expect(state.vThumb.getAttribute('role')).toBe('scrollbar');
    expect(state.vThumb.getAttribute('aria-orientation')).toBe('vertical');
    expect(state.viewport.tabIndex).toBe(0);
    root.remove();
  });

  it('does not wrap twice', () => {
    const root = document.createElement('div');
    root.append(document.createElement('p'));
    document.body.append(root);
    const state = stateOf(root);
    buildScrollbar(state);
    const viewport = state.viewport;
    buildScrollbar(state);
    expect(state.viewport).toBe(viewport);
    expect(root.querySelectorAll('.k-scrollbar__viewport')).toHaveLength(1);
    root.remove();
  });
});

describe('paint', () => {
  it('hides thumbs when content fits', () => {
    const root = document.createElement('div');
    root.append(document.createElement('p'));
    document.body.append(root);
    const state = stateOf(root);
    buildScrollbar(state);
    mockScroller(state.viewport, {
      clientHeight: 200,
      clientWidth: 200,
      scrollHeight: 200,
      scrollWidth: 200,
    });
    mockTrack(state.vTrack, 200);
    mockTrack(state.hTrack, 200);
    paint(state);
    expect(state.vTrack.hidden).toBe(false);
    expect(state.vTrack.hasAttribute('data-idle')).toBe(true);
    expect(state.hTrack.hasAttribute('data-idle')).toBe(true);
    expect(hasOverflowY(state)).toBe(false);
    expect(hasOverflowX(state)).toBe(false);
    root.remove();
  });

  it('sizes the vertical thumb from overflow', () => {
    const root = document.createElement('div');
    root.append(document.createElement('p'));
    document.body.append(root);
    const state = stateOf(root);
    buildScrollbar(state);
    mockScroller(state.viewport, {
      clientHeight: 100,
      clientWidth: 200,
      scrollHeight: 400,
      scrollWidth: 200,
      scrollTop: 0,
    });
    mockTrack(state.vTrack, 100);
    mockTrack(state.hTrack, 200);
    paint(state);
    expect(state.vTrack.hidden).toBe(false);
    expect(state.vTrack.hasAttribute('data-idle')).toBe(false);
    expect(state.hTrack.hasAttribute('data-idle')).toBe(true);
    expect(state.vThumb.style.height).toBe('25px');
    expect(state.vThumb.style.transform).toBe('translateY(0px)');
    expect(state.vThumb.getAttribute('aria-valuenow')).toBe('0');
    expect(hasOverflowY(state)).toBe(true);
    root.remove();
  });

  it('sizes the horizontal thumb from overflow', () => {
    const root = document.createElement('div');
    root.append(document.createElement('p'));
    document.body.append(root);
    const state = stateOf(root);
    buildScrollbar(state);
    mockScroller(state.viewport, {
      clientHeight: 100,
      clientWidth: 200,
      scrollHeight: 100,
      scrollWidth: 800,
      scrollLeft: 0,
    });
    mockTrack(state.vTrack, 100);
    mockTrack(state.hTrack, 200);
    paint(state);
    expect(state.hTrack.hidden).toBe(false);
    expect(state.hTrack.hasAttribute('data-idle')).toBe(false);
    expect(state.vTrack.hasAttribute('data-idle')).toBe(true);
    expect(state.hThumb.style.width).toBe('50px');
    expect(state.hThumb.style.transform).toBe('translateX(0px)');
    expect(state.hThumb.getAttribute('aria-valuenow')).toBe('0');
    expect(hasOverflowX(state)).toBe(true);
    root.remove();
  });

  it('moves the horizontal thumb when scrolled', () => {
    const root = document.createElement('div');
    root.append(document.createElement('p'));
    document.body.append(root);
    const state = stateOf(root);
    buildScrollbar(state);
    mockScroller(state.viewport, {
      clientHeight: 100,
      clientWidth: 200,
      scrollHeight: 100,
      scrollWidth: 800,
      scrollLeft: 300,
    });
    mockTrack(state.vTrack, 100);
    mockTrack(state.hTrack, 200);
    paint(state);
    expect(state.hThumb.style.transform).toBe('translateX(75px)');
    expect(state.hThumb.getAttribute('aria-valuenow')).toBe('50');
    root.remove();
  });

  it('moves the thumb when scrolled', () => {
    const root = document.createElement('div');
    root.append(document.createElement('p'));
    document.body.append(root);
    const state = stateOf(root);
    buildScrollbar(state);
    mockScroller(state.viewport, {
      clientHeight: 100,
      clientWidth: 200,
      scrollHeight: 400,
      scrollWidth: 200,
      scrollTop: 150,
    });
    mockTrack(state.vTrack, 100);
    mockTrack(state.hTrack, 200);
    paint(state);
    expect(state.vThumb.style.transform).toBe('translateY(37.5px)');
    expect(state.vThumb.getAttribute('aria-valuenow')).toBe('50');
    root.remove();
  });
});
