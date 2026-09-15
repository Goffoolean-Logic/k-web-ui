import { describe, expect, it, vi } from 'vitest';
import { renderPagination } from '../dom/dom.js';
import type { KPaginationState } from '../models/models.js';
import { bindEvents, goTo } from './events.js';

function mounted(page = 5, count = 12): KPaginationState {
  const abort = new AbortController();
  const root = document.createElement('div');
  document.body.append(root);
  const state: KPaginationState = {
    root,
    count,
    page,
    buttons: [],
    signal: abort.signal,
  };
  renderPagination(state);
  bindEvents(state);
  return state;
}

describe('goTo', () => {
  it('clamps to the first and last page', () => {
    const state = mounted(5, 12);
    goTo(state, 0);
    expect(state.page).toBe(1);
    goTo(state, 99);
    expect(state.page).toBe(12);
    state.root.remove();
  });

  it('does nothing when the page is unchanged', () => {
    const state = mounted(5, 12);
    const onChange = vi.fn();
    state.root.addEventListener('k-change', onChange);
    goTo(state, 5);
    expect(onChange).not.toHaveBeenCalled();
    state.root.remove();
  });

  it('re-renders, focuses the current page, and emits k-change', () => {
    const state = mounted(5, 12);
    const onChange = vi.fn();
    state.root.addEventListener('k-change', onChange);
    goTo(state, 6);
    expect(state.page).toBe(6);
    expect(onChange).toHaveBeenCalledTimes(1);
    const event = onChange.mock.calls[0]?.[0] as CustomEvent<{ page: number }>;
    expect(event.detail).toEqual({ page: 6 });
    const current = state.root.querySelector<HTMLElement>(
      '[aria-current="page"]',
    );
    expect(current?.textContent).toBe('6');
    expect(document.activeElement).toBe(current);
    state.root.remove();
  });
});

describe('bindEvents', () => {
  it('goes to first, prev, next, last, and a numbered page', () => {
    const state = mounted(5, 12);
    state.root
      .querySelector<HTMLButtonElement>('.k-pagination__first')
      ?.click();
    expect(state.page).toBe(1);
    state.root.querySelector<HTMLButtonElement>('.k-pagination__next')?.click();
    expect(state.page).toBe(2);
    state.root.querySelector<HTMLButtonElement>('.k-pagination__prev')?.click();
    expect(state.page).toBe(1);
    state.root.querySelector<HTMLButtonElement>('.k-pagination__last')?.click();
    expect(state.page).toBe(12);
    state.root.querySelector<HTMLButtonElement>('[data-page="11"]')?.click();
    expect(state.page).toBe(11);
    state.root.remove();
  });
});
