import { describe, expect, it, vi } from 'vitest';
import { buildDropdown, setOpen } from '../dom/dom.js';
import type { KDropdownState } from '../models/models.js';
import { bindEvents, pickItem } from './events.js';

const items = [{ label: 'Name' }, { label: 'Date' }];

function mounted(): { state: KDropdownState; abort: AbortController } {
  const root = document.createElement('div');
  root.id = 'sort';
  document.body.append(root);
  const abort = new AbortController();
  const state: KDropdownState = {
    ...buildDropdown(root, { items, label: 'Sort' }),
    open: false,
  };
  setOpen(state, false);
  bindEvents(state, abort.signal);
  return { state, abort };
}

describe('bindEvents', () => {
  it('toggles from the trigger and focuses the first item', () => {
    const { state, abort } = mounted();
    state.trigger.click();
    expect(state.open).toBe(true);
    expect(document.activeElement).toBe(state.items[0]);
    state.trigger.click();
    expect(state.open).toBe(false);
    abort.abort();
    state.root.remove();
  });

  it('closes when an item is chosen', () => {
    const { state, abort } = mounted();
    state.trigger.click();
    state.items[1]?.click();
    expect(state.open).toBe(false);
    expect(document.activeElement).toBe(state.trigger);
    abort.abort();
    state.root.remove();
  });

  it('closes on outside click and ignores clicks while closed', () => {
    const { state, abort } = mounted();
    document.body.click();
    expect(state.open).toBe(false);
    state.trigger.click();
    expect(state.open).toBe(true);
    document.body.click();
    expect(state.open).toBe(false);
    abort.abort();
    state.root.remove();
  });

  it('emits k-change with the index, label, and href of the pick', () => {
    const { state, abort } = mounted();
    const onChange = vi.fn();
    state.root.addEventListener('k-change', onChange);
    state.trigger.click();
    state.items[1]?.click();

    expect(onChange).toHaveBeenCalledTimes(1);
    const event = onChange.mock.calls[0]?.[0] as CustomEvent<{
      index: number;
      label: string;
      href: string | null;
    }>;
    expect(event.detail).toEqual({ index: 1, label: 'Date', href: null });
    abort.abort();
    state.root.remove();
  });

  it('reports the href when the item is a link', () => {
    const root = document.createElement('div');
    document.body.append(root);
    const abort = new AbortController();
    const state: KDropdownState = {
      ...buildDropdown(root, {
        items: [{ label: 'Docs', href: '/docs' }],
        label: 'Go',
      }),
      open: false,
    };
    setOpen(state, false);
    bindEvents(state, abort.signal);

    const onChange = vi.fn();
    root.addEventListener('k-change', onChange);
    state.items[0]?.click();
    const event = onChange.mock.calls[0]?.[0] as CustomEvent<{
      href: string | null;
    }>;
    expect(event.detail.href).toBe('/docs');
    abort.abort();
    root.remove();
  });
});

describe('pickItem', () => {
  it('closes, refocuses the trigger, and emits', () => {
    const { state, abort } = mounted();
    const onChange = vi.fn();
    state.root.addEventListener('k-change', onChange);
    setOpen(state, true);

    pickItem(state, 0);
    expect(state.open).toBe(false);
    expect(document.activeElement).toBe(state.trigger);
    expect(onChange).toHaveBeenCalledTimes(1);
    abort.abort();
    state.root.remove();
  });

  it('does nothing past the end', () => {
    const { state, abort } = mounted();
    const onChange = vi.fn();
    state.root.addEventListener('k-change', onChange);
    setOpen(state, true);

    pickItem(state, 9);
    expect(state.open).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
    abort.abort();
    state.root.remove();
  });
});
