import { describe, expect, it, vi } from 'vitest';
import type { KScrollbar } from './index.js';
import './index.js';

function host(): KScrollbar {
  const el = document.createElement('k-scrollbar');
  el.id = 'pane';
  const para = document.createElement('p');
  para.textContent = 'Long copy.';
  el.append(para);
  return el;
}

function mockOverflow(
  el: HTMLElement,
  scrollHeight = 400,
  clientHeight = 100,
): void {
  let scrollTop = 0;
  Object.defineProperty(el, 'clientHeight', {
    configurable: true,
    get: () => clientHeight,
  });
  Object.defineProperty(el, 'clientWidth', {
    configurable: true,
    get: () => 200,
  });
  Object.defineProperty(el, 'scrollHeight', {
    configurable: true,
    get: () => scrollHeight,
  });
  Object.defineProperty(el, 'scrollWidth', {
    configurable: true,
    get: () => 200,
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
    get: () => 0,
    set: () => undefined,
  });
}

describe('k-scrollbar', () => {
  it('does not boot a page overlay in tests', () => {
    expect(
      document.querySelector('k-scrollbar[data-k-target="viewport"]'),
    ).toBeNull();
  });

  it('wraps children and writes tracks', () => {
    const bar = host();
    document.body.append(bar);
    expect(bar.querySelector('.k-scrollbar__viewport')).toBeTruthy();
    expect(bar.querySelector('.k-scrollbar__thumb--y')).toBeTruthy();
    bar.remove();
  });

  it('scrollTo fires k-change', () => {
    const bar = host();
    document.body.append(bar);
    const view = bar.getViewport();
    if (view) {
      mockOverflow(view);
    }
    const onChange = vi.fn();
    bar.addEventListener('k-change', onChange);
    bar.goTo(80);
    expect(bar.getScroll().scrollTop).toBe(80);
    expect(onChange).toHaveBeenCalledTimes(1);
    bar.remove();
  });

  it('axis patches without dropping the viewport', () => {
    const bar = host();
    document.body.append(bar);
    const viewport = bar.getViewport();
    bar.axis = 'y';
    expect(bar.axis).toBe('y');
    expect(bar.classList.contains('k-scrollbar--y')).toBe(true);
    expect(bar.getViewport()).toBe(viewport);
    bar.remove();
  });

  it('moves late children into the viewport', async () => {
    const bar = host();
    document.body.append(bar);
    const extra = document.createElement('span');
    extra.textContent = 'More';
    bar.append(extra);
    await Promise.resolve();
    expect(bar.getViewport()?.contains(extra)).toBe(true);
    bar.remove();
  });
});

describe('k-scrollbar api', () => {
  it('reads are empty while disconnected', () => {
    const bar = host();
    expect(bar.getViewport()).toBeNull();
    expect(() => {
      bar.goTo(10);
      bar.refresh();
    }).not.toThrow();
  });

  it('autohide and size use modifier classes', () => {
    const bar = host();
    document.body.append(bar);
    bar.autohide = false;
    bar.size = 'sm';
    expect(bar.classList.contains('k-scrollbar--no-autohide')).toBe(true);
    expect(bar.classList.contains('k-scrollbar--sm')).toBe(true);
    bar.autohide = true;
    bar.size = undefined;
    expect(bar.classList.contains('k-scrollbar--no-autohide')).toBe(false);
    expect(bar.classList.contains('k-scrollbar--sm')).toBe(false);
    bar.remove();
  });

  it('options.target paints over another scroller', () => {
    const pane = document.createElement('div');
    pane.id = 'scroll-target';
    document.body.append(pane);
    const bar = document.createElement('k-scrollbar') as KScrollbar;
    document.body.append(bar);
    bar.options = { target: '#scroll-target' };
    expect(bar.getViewport()).toBe(pane);
    bar.remove();
    pane.remove();
  });
});
