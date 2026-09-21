import { describe, expect, it } from 'vitest';
import { getVisiblePages, hasNext, hasPrevious, init } from './controller.js';

function mount(count: number): {
  root: HTMLElement;
  panels: HTMLElement[];
  abort: AbortController;
} {
  const root = document.createElement('div');
  root.id = 'story';
  const panels = Array.from({ length: count }, (_, i) => {
    const el = document.createElement('div');
    el.id = `story-${i}`;
    document.body.append(el);
    return el;
  });
  document.body.append(root);
  return { root, panels, abort: new AbortController() };
}

describe('init', () => {
  it('renders the bar from content nodes', () => {
    const { root, panels, abort } = mount(4);
    const state = init(root, panels, abort.signal);
    expect(state.count).toBe(4);
    expect(state.page).toBe(1);
    expect(root.getAttribute('role')).toBe('navigation');
    expect(root.querySelectorAll('.k-pagination__page')).toHaveLength(4);
    expect(hasPrevious(state)).toBe(false);
    expect(hasNext(state)).toBe(true);
    abort.abort();
    root.remove();
    for (const panel of panels) {
      panel.remove();
    }
  });

  it('adds first and last controls when there are many pages', () => {
    const { root, panels, abort } = mount(12);
    const state = init(root, panels, abort.signal);
    expect(root.querySelector('.k-pagination__first')).toBeTruthy();
    expect(root.querySelector('.k-pagination__last')).toBeTruthy();
    expect(getVisiblePages(state)).toEqual([1, 2, 3]);
    abort.abort();
    root.remove();
    for (const panel of panels) {
      panel.remove();
    }
  });
});

describe('window', () => {
  it('lists every page when there are few', () => {
    const { root, panels, abort } = mount(4);
    const state = init(root, panels, abort.signal);
    expect(getVisiblePages(state)).toEqual([1, 2, 3, 4]);
    abort.abort();
    root.remove();
    for (const panel of panels) {
      panel.remove();
    }
  });
});
