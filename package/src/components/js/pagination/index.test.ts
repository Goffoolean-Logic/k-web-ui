import { describe, expect, it, vi } from 'vitest';
import type { KPagination } from './index.js';
import './index.js';

function mount(
  id = 'story',
  count = 3,
): { pager: KPagination; pages: HTMLElement[] } {
  const pages = Array.from({ length: count }, (_, i) => {
    const el = document.createElement('div');
    el.id = `${id}-${i}`;
    el.textContent = `Page ${i}`;
    return el;
  });
  const pager = document.createElement('k-pagination') as KPagination;
  pager.id = id;
  document.body.append(...pages, pager);
  return { pager, pages };
}

describe('k-pagination', () => {
  it('infers count from content nodes and shows the first', () => {
    const { pager, pages } = mount();
    expect(pager.count).toBe(3);
    expect(pager.querySelector('[aria-current="page"]')?.textContent).toBe('1');
    expect(pages[0]?.hidden).toBe(false);
    expect(pages[1]?.hidden).toBe(true);
    pager.remove();
    for (const page of pages) {
      page.remove();
    }
  });

  it('selects by zero-based index and emits index', () => {
    const { pager, pages } = mount();
    const onChange = vi.fn();
    pager.addEventListener('k-change', onChange);
    pager.select(2);
    expect(pages[2]?.hidden).toBe(false);
    expect(pages[0]?.hidden).toBe(true);
    expect(onChange.mock.calls[0]?.[0].detail).toEqual({ index: 2 });
    pager.remove();
    for (const page of pages) {
      page.remove();
    }
  });

  it('does not leak across two pagers', () => {
    const a = mount('alpha', 2);
    const b = mount('beta', 2);
    a.pager.select(1);
    expect(a.pages[1]?.hidden).toBe(false);
    expect(b.pages[0]?.hidden).toBe(false);
    a.pager.remove();
    b.pager.remove();
    for (const page of [...a.pages, ...b.pages]) {
      page.remove();
    }
  });
});
