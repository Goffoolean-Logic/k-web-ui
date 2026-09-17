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
    expect(document.querySelector('k-scrollbar[target="viewport"]')).toBeNull();
  });

  it('wraps children and writes tracks', () => {
    const bar = host();
    document.body.append(bar);
    expect(bar.querySelector('.k-scrollbar__viewport')).toBeTruthy();
    expect(bar.querySelector('.k-scrollbar__thumb--y')).toBeTruthy();
    expect(bar.getViewport()?.querySelector('p')?.textContent).toBe(
      'Long copy.',
    );
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
    expect(bar.getThumbY()).toBeNull();
    expect(bar.getThumbX()).toBeNull();
    expect(bar.hasOverflowY).toBe(false);
    expect(bar.hasOverflowX).toBe(false);
    expect(bar.getScroll()).toEqual({ scrollTop: 0, scrollLeft: 0 });
    expect(() => {
      bar.goTo(10);
      bar.refresh();
    }).not.toThrow();
  });

  it('disconnect aborts listeners', () => {
    const bar = host();
    document.body.append(bar);
    const view = bar.getViewport();
    if (view) {
      mockOverflow(view);
    }
    const onChange = vi.fn();
    bar.addEventListener('k-change', onChange);
    bar.disconnect();
    view?.dispatchEvent(new Event('scroll'));
    expect(onChange).not.toHaveBeenCalled();
    bar.remove();
  });

  it('autohide and size reflect to attributes', () => {
    const bar = host();
    document.body.append(bar);
    bar.autohide = true;
    bar.size = 'sm';
    expect(bar.hasAttribute('autohide')).toBe(true);
    expect(bar.getAttribute('size')).toBe('sm');
    bar.autohide = false;
    bar.size = undefined;
    expect(bar.hasAttribute('autohide')).toBe(false);
    expect(bar.hasAttribute('size')).toBe(false);
    bar.remove();
  });
});
