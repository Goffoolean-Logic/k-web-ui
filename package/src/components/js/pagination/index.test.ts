import { describe, expect, it, vi } from 'vitest';
import type { KPagination } from './index.js';
import './index.js';

function host(): KPagination {
  const el = document.createElement('k-pagination');
  el.id = 'pages';
  return el;
}

describe('k-pagination', () => {
  it('throws when count is below 1', () => {
    const pager = host();
    pager.setAttribute('count', '0');
    expect(() => document.body.append(pager)).toThrow(
      'KPagination: count must be at least 1',
    );
    pager.remove();
  });

  it('marks the current page', () => {
    const pager = host();
    pager.setAttribute('count', '12');
    pager.setAttribute('page', '5');
    document.body.append(pager);
    const current = pager.querySelector('[aria-current="page"]');
    expect(current?.textContent).toBe('5');
    expect(pager.page).toBe(5);
    pager.remove();
  });

  it('omits first and last on a short list', () => {
    const pager = host();
    pager.setAttribute('count', '4');
    pager.setAttribute('page', '1');
    document.body.append(pager);
    expect(pager.querySelector('.k-pagination__first')).toBeNull();
    expect(pager.querySelector('.k-pagination__last')).toBeNull();
    expect(pager.querySelectorAll('[data-page]')).toHaveLength(4);
    pager.remove();
  });

  it('moves the current page from the attribute without focusing or emitting', () => {
    const pager = host();
    pager.setAttribute('count', '12');
    pager.setAttribute('page', '5');
    document.body.append(pager);
    const onChange = vi.fn();
    pager.addEventListener('k-change', onChange);

    pager.setAttribute('page', '6');

    expect(pager.page).toBe(6);
    expect(pager.querySelector('[aria-current="page"]')?.textContent).toBe('6');
    expect(onChange).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(document.body);
    pager.remove();
  });

  it('goTo fires k-change', () => {
    const pager = host();
    pager.setAttribute('count', '12');
    pager.setAttribute('page', '5');
    document.body.append(pager);
    const onChange = vi.fn();
    pager.addEventListener('k-change', onChange);
    pager.goTo(6);
    expect(pager.page).toBe(6);
    expect(onChange).toHaveBeenCalledTimes(1);
    const event = onChange.mock.calls[0]?.[0] as CustomEvent<{ page: number }>;
    expect(event.detail).toEqual({ page: 6 });
    expect(pager.querySelector('[aria-current="page"]')?.textContent).toBe('6');
    pager.remove();
  });
});

describe('k-pagination api', () => {
  function mounted(count = 12, page = 5): KPagination {
    const pager = host();
    pager.setAttribute('count', String(count));
    pager.setAttribute('page', String(page));
    document.body.append(pager);
    return pager;
  }

  it('next and previous step one page, clamping at the ends', () => {
    const pager = mounted(3, 1);
    pager.previous();
    expect(pager.page).toBe(1);
    pager.next();
    expect(pager.page).toBe(2);
    pager.next();
    expect(pager.page).toBe(3);
    pager.next();
    expect(pager.page).toBe(3);
    pager.remove();
  });

  it('first and last jump to the ends', () => {
    const pager = mounted();
    pager.last();
    expect(pager.page).toBe(12);
    pager.first();
    expect(pager.page).toBe(1);
    pager.remove();
  });

  it('hasPrevious and hasNext track the edges', () => {
    const pager = mounted(3, 1);
    expect(pager.hasPrevious).toBe(false);
    expect(pager.hasNext).toBe(true);
    pager.last();
    expect(pager.hasPrevious).toBe(true);
    expect(pager.hasNext).toBe(false);
    pager.remove();
  });

  it('getVisiblePages follows the current page', () => {
    const pager = mounted(12, 6);
    expect(pager.getVisiblePages()).toEqual([5, 6, 7]);
    pager.first();
    expect(pager.getVisiblePages()).toEqual([1, 2, 3]);
    pager.remove();
  });

  it('getButtons returns every rendered button', () => {
    const pager = mounted(12, 6);
    const buttons = pager.getButtons();
    expect(buttons).toHaveLength(
      pager.querySelectorAll('.k-pagination__btn').length,
    );
    expect(buttons[0]?.className).toContain('k-pagination__first');
    pager.remove();
  });

  it('refresh re-renders the bar', () => {
    const pager = mounted(12, 6);
    const first = pager.getButtons()[0];
    pager.refresh();
    expect(pager.getButtons()[0]).not.toBe(first);
    expect(pager.page).toBe(6);
    pager.remove();
  });

  it('api calls are inert while disconnected', () => {
    const pager = host();
    pager.setAttribute('count', '12');
    expect(() => {
      pager.goTo(3);
      pager.next();
      pager.previous();
      pager.first();
      pager.last();
      pager.refresh();
    }).not.toThrow();
    expect(pager.hasNext).toBe(false);
    expect(pager.hasPrevious).toBe(false);
    expect(pager.getVisiblePages()).toEqual([]);
    expect(pager.getButtons()).toEqual([]);
  });
});
