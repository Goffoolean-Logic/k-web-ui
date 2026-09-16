import { describe, expect, it } from 'vitest';
import type { KDropdownState } from '../models/models.js';
import {
  applyAttribute,
  focusItem,
  getItem,
  indexOfLabel,
  init,
  parseOptions,
} from './controller.js';

const options = [{ label: 'Name' }, { label: 'Date' }, { label: 'Size' }];

function mount(attrs: Record<string, string> = {}): {
  state: KDropdownState;
  abort: AbortController;
  root: HTMLElement;
} {
  const root = document.createElement('div');
  root.id = 'sort';
  for (const [name, value] of Object.entries(attrs)) {
    root.setAttribute(name, value);
  }
  document.body.append(root);
  const abort = new AbortController();
  const state = init(root, options, abort.signal);
  return { state, abort, root };
}

describe('parseOptions', () => {
  it('reads label and href', () => {
    expect(
      parseOptions(
        JSON.stringify([{ label: 'Docs', href: '/docs' }, { label: 'Name' }]),
      ),
    ).toEqual([{ label: 'Docs', href: '/docs' }, { label: 'Name' }]);
  });

  it('returns an empty list when the attribute is absent', () => {
    expect(parseOptions(null)).toEqual([]);
    expect(parseOptions('  ')).toEqual([]);
  });

  it('throws on invalid JSON, non-arrays, and missing labels', () => {
    expect(() => parseOptions('{oops')).toThrow('KDropdown: invalid JSON');
    expect(() => parseOptions('{"a":1}')).toThrow(
      'KDropdown: expected a JSON array',
    );
    expect(() => parseOptions('["nope"]')).toThrow(
      'KDropdown: each option needs a label',
    );
    expect(() => parseOptions(JSON.stringify([{ href: '/a' }]))).toThrow(
      'KDropdown: each option needs a label',
    );
  });
});

describe('getItem', () => {
  it('hands back the live node, null past the end', () => {
    const { state, abort, root } = mount();
    expect(getItem(state, 1)).toBe(state.items[1]);
    expect(getItem(state, 9)).toBeNull();
    abort.abort();
    root.remove();
  });
});

describe('focusItem', () => {
  it('opens the menu and focuses the item', () => {
    const { state, abort, root } = mount();
    expect(state.open).toBe(false);
    expect(focusItem(state, 1)).toBe(true);
    expect(state.open).toBe(true);
    expect(document.activeElement).toBe(state.items[1]);
    abort.abort();
    root.remove();
  });

  it('leaves an open menu open', () => {
    const { state, abort, root } = mount();
    focusItem(state, 0);
    expect(focusItem(state, 2)).toBe(true);
    expect(state.open).toBe(true);
    expect(document.activeElement).toBe(state.items[2]);
    abort.abort();
    root.remove();
  });

  it('reports false past the end and leaves the menu alone', () => {
    const { state, abort, root } = mount();
    expect(focusItem(state, 9)).toBe(false);
    expect(state.open).toBe(false);
    abort.abort();
    root.remove();
  });
});

describe('indexOfLabel', () => {
  it('finds a label and reports -1 for a miss', () => {
    const { state, abort, root } = mount();
    expect(indexOfLabel(state, 'Date')).toBe(1);
    expect(indexOfLabel(state, 'Nope')).toBe(-1);
    abort.abort();
    root.remove();
  });
});

describe('init', () => {
  it('builds the trigger and menu, closed, with ARIA wired up', () => {
    const { state, abort, root } = mount({ label: 'Sort' });
    expect(state.open).toBe(false);
    expect(state.items).toHaveLength(3);
    expect(state.trigger.textContent).toBe('Sort');
    expect(state.trigger.getAttribute('aria-expanded')).toBe('false');
    expect(state.trigger.getAttribute('aria-controls')).toBe('sort-menu');
    expect(state.menu.id).toBe('sort-menu');
    expect(state.menu.hidden).toBe(true);
    abort.abort();
    root.remove();
  });

  it('binds the trigger click', () => {
    const { state, abort, root } = mount();
    state.trigger.click();
    expect(state.open).toBe(true);
    expect(state.menu.hidden).toBe(false);
    abort.abort();
    root.remove();
  });

  it('binds keybinds', () => {
    const { state, abort, root } = mount();
    root.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(state.open).toBe(true);
    expect(document.activeElement).toBe(state.items[0]);
    abort.abort();
    root.remove();
  });
});

describe('applyAttribute', () => {
  it('relabels the trigger in place and claims the change', () => {
    const { state, abort, root } = mount({ label: 'Sort' });
    const trigger = state.trigger;
    root.setAttribute('label', 'Order by');
    expect(applyAttribute(state, 'label')).toBe(true);
    expect(state.trigger).toBe(trigger);
    expect(trigger.textContent).toBe('Order by');
    abort.abort();
    root.remove();
  });

  it('clears the label when the attribute goes away', () => {
    const { state, abort, root } = mount({ label: 'Sort' });
    root.removeAttribute('label');
    applyAttribute(state, 'label');
    expect(state.trigger.textContent).toBe('');
    abort.abort();
    root.remove();
  });

  it('declines anything else so the caller rebuilds', () => {
    const { state, abort, root } = mount();
    expect(applyAttribute(state, 'options')).toBe(false);
    expect(applyAttribute(state, 'nope')).toBe(false);
    abort.abort();
    root.remove();
  });
});
