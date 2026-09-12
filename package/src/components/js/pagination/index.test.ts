import { describe, expect, it, vi } from 'vitest';
import { KPagination } from './index.js';

function host(): HTMLElement {
  const el = document.createElement('div');
  el.id = 'pages';
  document.body.append(el);
  return el;
}

describe('KPagination.mount', () => {
  it('throws when count is below 1', () => {
    const root = host();
    expect(() => KPagination.mount(root, { count: 0 })).toThrow(
      'KPagination: count must be at least 1',
    );
    root.remove();
  });

  it('marks the current page', () => {
    const root = host();
    const pager = KPagination.mount(root, { count: 12, page: 5 });
    const current = root.querySelector('[aria-current="page"]');
    expect(current?.textContent).toBe('5');
    expect(pager.page).toBe(5);
    root.remove();
  });

  it('omits first and last on a short list', () => {
    const root = host();
    KPagination.mount(root, { count: 4, page: 1 });
    expect(root.querySelector('.k-pagination__first')).toBeNull();
    expect(root.querySelector('.k-pagination__last')).toBeNull();
    expect(root.querySelectorAll('[data-page]')).toHaveLength(4);
    root.remove();
  });

  it('goTo fires onChange', () => {
    const root = host();
    const onChange = vi.fn();
    const pager = KPagination.mount(root, { count: 12, page: 5, onChange });
    pager.goTo(6);
    expect(pager.page).toBe(6);
    expect(onChange).toHaveBeenCalledWith(6);
    expect(root.querySelector('[aria-current="page"]')?.textContent).toBe('6');
    root.remove();
  });
});
