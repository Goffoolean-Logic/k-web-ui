import { describe, expect, it, vi } from 'vitest';
import { renderPagination } from '../dom/dom.js';
import type { KPaginationState } from '../models/models.js';
import { bindEvents, goTo, syncPanels } from './events.js';

function mounted(page = 5, count = 12): KPaginationState {
  const abort = new AbortController();
  const root = document.createElement('div');
  document.body.append(root);
  const panels = Array.from({ length: count }, (_, i) => {
    const el = document.createElement('div');
    el.id = `story-${i}`;
    document.body.append(el);
    return el;
  });
  const state: KPaginationState = {
    root,
    count,
    page,
    buttons: [],
    signal: abort.signal,
    panels,
  };
  renderPagination(state);
  bindEvents(state);
  syncPanels(state);
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
    for (const panel of state.panels) {
      panel.remove();
    }
  });

  it('does nothing when the page is unchanged', () => {
    const state = mounted(5, 12);
    const onChange = vi.fn();
    state.root.addEventListener('k-change', onChange);
    goTo(state, 5);
    expect(onChange).not.toHaveBeenCalled();
    state.root.remove();
    for (const panel of state.panels) {
      panel.remove();
    }
  });

  it('re-renders, focuses the current page, and emits index', () => {
    const state = mounted(5, 12);
    const onChange = vi.fn();
    state.root.addEventListener('k-change', onChange);
    goTo(state, 6);
    expect(state.page).toBe(6);
    expect(onChange.mock.calls[0]?.[0].detail).toEqual({ index: 5 });
    const current = state.root.querySelector<HTMLElement>(
      '[aria-current="page"]',
    );
    expect(current?.textContent).toBe('6');
    expect(document.activeElement).toBe(current);
    state.root.remove();
    for (const panel of state.panels) {
      panel.remove();
    }
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
    for (const panel of state.panels) {
      panel.remove();
    }
  });
});
