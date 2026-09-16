import { describe, expect, it, vi } from 'vitest';
import type { KPaginationState } from '../models/models.js';
import {
  applyAttribute,
  getVisiblePages,
  hasNext,
  hasPrevious,
  init,
  readCount,
  toPage,
} from './controller.js';

function mount(
  count: number,
  page?: number,
): { state: KPaginationState; abort: AbortController; root: HTMLElement } {
  const root = document.createElement('div');
  root.setAttribute('count', String(count));
  if (page !== undefined) {
    root.setAttribute('page', String(page));
  }
  document.body.append(root);
  const abort = new AbortController();
  const state = init(root, count, abort.signal);
  return { state, abort, root };
}

describe('toPage', () => {
  it('defaults to 1 and rejects junk or sub-1 values', () => {
    expect(toPage(null)).toBe(1);
    expect(toPage('5')).toBe(5);
    expect(toPage('nope')).toBe(1);
    expect(toPage('0')).toBe(1);
    expect(toPage('-3')).toBe(1);
  });
});

describe('readCount', () => {
  it('returns null when the attribute is absent', () => {
    const root = document.createElement('div');
    expect(readCount(root)).toBeNull();
  });

  it('reads a valid count', () => {
    const root = document.createElement('div');
    root.setAttribute('count', '12');
    expect(readCount(root)).toBe(12);
  });

  it('throws on a count below 1 or not a number', () => {
    const root = document.createElement('div');
    root.setAttribute('count', '0');
    expect(() => readCount(root)).toThrow(
      'KPagination: count must be at least 1',
    );
    root.setAttribute('count', 'nope');
    expect(() => readCount(root)).toThrow(
      'KPagination: count must be at least 1',
    );
  });
});

describe('hasPrevious and hasNext', () => {
  it('are false at the matching edge', () => {
    const { state, abort, root } = mount(3);
    expect(hasPrevious(state)).toBe(false);
    expect(hasNext(state)).toBe(true);
    state.page = 3;
    expect(hasPrevious(state)).toBe(true);
    expect(hasNext(state)).toBe(false);
    abort.abort();
    root.remove();
  });

  it('are both true in the middle', () => {
    const { state, abort, root } = mount(3, 2);
    expect(hasPrevious(state)).toBe(true);
    expect(hasNext(state)).toBe(true);
    abort.abort();
    root.remove();
  });
});

describe('getVisiblePages', () => {
  it('lists every page when there are few', () => {
    const { state, abort, root } = mount(4);
    expect(getVisiblePages(state)).toEqual([1, 2, 3, 4]);
    abort.abort();
    root.remove();
  });

  it('windows around the current page when there are many', () => {
    const { state, abort, root } = mount(12, 6);
    expect(getVisiblePages(state)).toEqual([5, 6, 7]);
    abort.abort();
    root.remove();
  });

  it('clamps the window at both ends', () => {
    const start = mount(12, 1);
    expect(getVisiblePages(start.state)).toEqual([1, 2, 3]);
    start.abort.abort();
    start.root.remove();

    const end = mount(12, 12);
    expect(getVisiblePages(end.state)).toEqual([10, 11, 12]);
    end.abort.abort();
    end.root.remove();
  });
});

describe('init', () => {
  it('renders the bar and marks the host as navigation', () => {
    const { state, abort, root } = mount(3);
    expect(root.getAttribute('role')).toBe('navigation');
    expect(root.getAttribute('aria-label')).toBe('Pagination');
    expect(state.page).toBe(1);
    expect(state.buttons.length).toBeGreaterThan(0);
    expect(root.querySelectorAll('[data-page]')).toHaveLength(3);
    abort.abort();
    root.remove();
  });

  it('starts on the page attribute', () => {
    const { state, abort, root } = mount(12, 6);
    expect(state.page).toBe(6);
    expect(root.querySelector('[aria-current="page"]')?.textContent).toBe('6');
    abort.abort();
    root.remove();
  });

  it('adds first and last controls only when there are many pages', () => {
    const few = mount(4);
    expect(few.root.querySelector('.k-pagination__first')).toBeNull();
    few.abort.abort();
    few.root.remove();

    const many = mount(12);
    expect(many.root.querySelector('.k-pagination__first')).toBeTruthy();
    expect(many.root.querySelector('.k-pagination__last')).toBeTruthy();
    many.abort.abort();
    many.root.remove();
  });

  it('binds the buttons and the keybinds', () => {
    const { state, abort, root } = mount(5);
    root.querySelector<HTMLButtonElement>('.k-pagination__next')?.click();
    expect(state.page).toBe(2);

    root.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(state.page).toBe(3);
    abort.abort();
    root.remove();
  });
});

describe('applyAttribute', () => {
  it('moves the page without focus or a k-change', () => {
    const { state, abort, root } = mount(12, 1);
    const onChange = vi.fn();
    root.addEventListener('k-change', onChange);
    const active = document.activeElement;

    root.setAttribute('page', '6');
    expect(applyAttribute(state, 'page')).toBe(true);
    expect(state.page).toBe(6);
    expect(onChange).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(active);
    abort.abort();
    root.remove();
  });

  it('declines count so the caller rebuilds', () => {
    const { state, abort, root } = mount(12);
    expect(applyAttribute(state, 'count')).toBe(false);
    expect(applyAttribute(state, 'nope')).toBe(false);
    abort.abort();
    root.remove();
  });
});
