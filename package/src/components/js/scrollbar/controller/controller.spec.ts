import { describe, expect, it } from 'vitest';
import {
  applyAttribute,
  attachScrollbar,
  init,
  isSize,
  resolveViewport,
} from './controller.js';

function mockOverflow(el: HTMLElement): void {
  Object.defineProperty(el, 'clientHeight', {
    configurable: true,
    get: () => 100,
  });
  Object.defineProperty(el, 'clientWidth', {
    configurable: true,
    get: () => 200,
  });
  Object.defineProperty(el, 'scrollHeight', {
    configurable: true,
    get: () => 100,
  });
  Object.defineProperty(el, 'scrollWidth', {
    configurable: true,
    get: () => 200,
  });
}

describe('isSize', () => {
  it('accepts sm and lg only', () => {
    expect(isSize('sm')).toBe(true);
    expect(isSize('lg')).toBe(true);
    expect(isSize('md')).toBe(false);
    expect(isSize(null)).toBe(false);
  });
});

describe('resolveViewport', () => {
  it('wraps the host when target is omitted', () => {
    const root = document.createElement('div');
    expect(resolveViewport(root, null)).toEqual({
      viewport: root,
      mode: 'wrap',
    });
  });

  it('uses the document scroller for viewport', () => {
    const root = document.createElement('div');
    const resolved = resolveViewport(root, 'viewport');
    expect(resolved.mode).toBe('target');
    expect(resolved.viewport).toBe(
      document.scrollingElement ?? document.documentElement,
    );
  });

  it('finds a target by id', () => {
    const pane = document.createElement('div');
    pane.id = 'side';
    document.body.append(pane);
    const root = document.createElement('div');
    expect(resolveViewport(root, 'side').viewport).toBe(pane);
    pane.remove();
  });

  it('finds a target by selector', () => {
    const pane = document.createElement('div');
    pane.setAttribute('data-k-scrollbar-id', 'pane-1');
    document.body.append(pane);
    const root = document.createElement('div');
    expect(
      resolveViewport(root, '[data-k-scrollbar-id="pane-1"]').viewport,
    ).toBe(pane);
    pane.remove();
  });

  it('throws when nothing matches', () => {
    const root = document.createElement('div');
    expect(() => resolveViewport(root, '#missing')).toThrow(
      'KScrollbar: no element matching "#missing"',
    );
  });
});

describe('init', () => {
  it('wraps children and binds overflow chrome', () => {
    const root = document.createElement('div');
    const para = document.createElement('p');
    para.textContent = 'Copy.';
    root.append(para);
    document.body.append(root);
    const abort = new AbortController();
    const state = init(root, abort.signal);
    mockOverflow(state.viewport);
    expect(state.mode).toBe('wrap');
    expect(state.viewport.contains(para)).toBe(true);
    expect(root.querySelector('.k-scrollbar__thumb--y')).toBeTruthy();
    abort.abort();
    root.remove();
  });
});

describe('applyAttribute', () => {
  it('patches axis without rebuilding', () => {
    const root = document.createElement('div');
    root.append(document.createElement('p'));
    document.body.append(root);
    const abort = new AbortController();
    const state = init(root, abort.signal);
    root.setAttribute('axis', 'x');
    expect(applyAttribute(state, 'axis')).toBe(true);
    expect(state.axis).toBe('x');
    abort.abort();
    root.remove();
  });

  it('patches autohide', () => {
    const root = document.createElement('div');
    root.append(document.createElement('p'));
    document.body.append(root);
    const abort = new AbortController();
    const state = init(root, abort.signal);
    root.setAttribute('autohide', '');
    expect(applyAttribute(state, 'autohide')).toBe(true);
    expect(state.autohide).toBe(true);
    abort.abort();
    root.remove();
  });

  it('declines target so the caller rebuilds', () => {
    const root = document.createElement('div');
    root.append(document.createElement('p'));
    document.body.append(root);
    const abort = new AbortController();
    const state = init(root, abort.signal);
    expect(applyAttribute(state, 'target')).toBe(false);
    expect(applyAttribute(state, 'size')).toBe(true);
    abort.abort();
    root.remove();
  });
});

describe('attachScrollbar', () => {
  it('reuses a viewport instance', () => {
    const first = attachScrollbar('viewport');
    const second = attachScrollbar('viewport');
    expect(second).toBe(first);
    expect(first.getAttribute('target')).toBe('viewport');
    first.remove();
  });

  it('stamps a selector onto an element target', () => {
    const pane = document.createElement('div');
    document.body.append(pane);
    const first = attachScrollbar(pane);
    expect(pane.getAttribute('data-k-scrollbar-id')).toBeTruthy();
    const second = attachScrollbar(pane);
    expect(second).toBe(first);
    first.remove();
    pane.remove();
  });
});
