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
