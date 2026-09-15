import { describe, expect, it } from 'vitest';
import type { KPaginationState } from '../models/models.js';
import { renderPagination } from './dom.js';

function state(page: number, count: number): KPaginationState {
  const root = document.createElement('div');
  document.body.append(root);
  return {
    root,
    count,
    page,
    buttons: [],
    signal: new AbortController().signal,
  };
}

function pages(current: KPaginationState): string[] {
  return [...current.root.querySelectorAll('[data-page]')].map(
    (btn) => btn.textContent ?? '',
  );
}

describe('renderPagination', () => {
  it('lists every page and omits first/last when there are few pages', () => {
    const current = state(1, 4);
    renderPagination(current);
    expect(current.root.querySelector('.k-pagination__first')).toBeNull();
    expect(current.root.querySelector('.k-pagination__last')).toBeNull();
    expect(pages(current)).toEqual(['1', '2', '3', '4']);
    expect(current.buttons).toHaveLength(6);
    current.root.remove();
  });

  it('keeps first and last plus a three-page window on long lists', () => {
    const current = state(5, 12);
    renderPagination(current);
    expect(current.root.querySelector('.k-pagination__first')).toBeTruthy();
    expect(current.root.querySelector('.k-pagination__last')).toBeTruthy();
    expect(pages(current)).toEqual(['4', '5', '6']);
    expect(
      current.root.querySelector('[aria-current="page"]')?.textContent,
    ).toBe('5');
    current.root.remove();
  });

  it('clamps the window at the start and end', () => {
    const start = state(1, 12);
    renderPagination(start);
    expect(pages(start)).toEqual(['1', '2', '3']);
    start.root.remove();

    const end = state(12, 12);
    renderPagination(end);
    expect(pages(end)).toEqual(['10', '11', '12']);
    end.root.remove();
  });

  it('disables prev/first at the start and next/last at the end', () => {
    const start = state(1, 12);
    renderPagination(start);
    expect(
      start.root.querySelector<HTMLButtonElement>('.k-pagination__prev')
        ?.disabled,
    ).toBe(true);
    expect(
      start.root.querySelector<HTMLButtonElement>('.k-pagination__first')
        ?.disabled,
    ).toBe(true);
    expect(
      start.root.querySelector<HTMLButtonElement>('.k-pagination__next')
        ?.disabled,
    ).toBe(false);
    start.root.remove();

    const end = state(12, 12);
    renderPagination(end);
    expect(
      end.root.querySelector<HTMLButtonElement>('.k-pagination__next')
        ?.disabled,
    ).toBe(true);
    expect(
      end.root.querySelector<HTMLButtonElement>('.k-pagination__last')
        ?.disabled,
    ).toBe(true);
    end.root.remove();
  });
});
