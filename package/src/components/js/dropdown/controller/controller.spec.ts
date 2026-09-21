import { describe, expect, it } from 'vitest';
import { focusItem, getItem, indexOfLabel, init } from './controller.js';

const items = [{ label: 'Name' }, { label: 'Date', href: '/date' }];

function mount(): {
  state: ReturnType<typeof init>;
  abort: AbortController;
  root: HTMLElement;
} {
  const root = document.createElement('div');
  root.id = 'sort';
  document.body.append(root);
  const abort = new AbortController();
  const state = init(root, items, 'Sort', abort.signal);
  return { state, abort, root };
}

describe('init', () => {
  it('builds trigger, menu, and href anchors', () => {
    const { state, abort, root } = mount();
    expect(state.trigger.textContent).toContain('Sort');
    expect(getItem(state, 1)).toBeInstanceOf(HTMLAnchorElement);
    expect(indexOfLabel(state, 'Date')).toBe(1);
    abort.abort();
    root.remove();
  });

  it('focusItem opens the menu', () => {
    const { state, abort, root } = mount();
    expect(focusItem(state, 1)).toBe(true);
    expect(state.open).toBe(true);
    expect(document.activeElement).toBe(state.items[1]);
    abort.abort();
    root.remove();
  });
});
