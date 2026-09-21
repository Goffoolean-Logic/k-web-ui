import { describe, expect, it } from 'vitest';
import { buildDropdown, setOpen } from '../dom/dom.js';
import type { KDropdownState } from '../models/models.js';
import { bindKeybinds } from './keybinds.js';

const items = [{ label: 'Name' }, { label: 'Date' }, { label: 'Size' }];

function mounted(): { state: KDropdownState; abort: AbortController } {
  const root = document.createElement('div');
  root.id = 'sort';
  document.body.append(root);
  const abort = new AbortController();
  const state: KDropdownState = {
    ...buildDropdown(root, { items, trigger: 'Sort' }),
    open: false,
    select: false,
  };
  setOpen(state, false);
  bindKeybinds(state, abort.signal);
  return { state, abort };
}

function press(root: HTMLElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });
  root.dispatchEvent(event);
  return event;
}

describe('bindKeybinds', () => {
  it('closes on Escape and returns focus to the trigger', () => {
    const { state, abort } = mounted();
    setOpen(state, true);
    state.items[0]?.focus();
    press(state.root, 'Escape');
    expect(state.open).toBe(false);
    expect(document.activeElement).toBe(state.trigger);
    abort.abort();
    state.root.remove();
  });

  it('opens from ArrowDown and ArrowUp when closed', () => {
    const { state, abort } = mounted();
    press(state.root, 'ArrowDown');
    expect(state.open).toBe(true);
    expect(document.activeElement).toBe(state.items[0]);
    setOpen(state, false);
    press(state.root, 'ArrowUp');
    expect(state.open).toBe(true);
    expect(document.activeElement).toBe(state.items.at(-1));
    abort.abort();
    state.root.remove();
  });

  it('moves and wraps among items while open', () => {
    const { state, abort } = mounted();
    setOpen(state, true);
    state.items[0]?.focus();
    press(state.root, 'ArrowDown');
    expect(document.activeElement).toBe(state.items[1]);
    press(state.root, 'End');
    expect(document.activeElement).toBe(state.items[2]);
    press(state.root, 'ArrowDown');
    expect(document.activeElement).toBe(state.items[0]);
    press(state.root, 'ArrowUp');
    expect(document.activeElement).toBe(state.items[2]);
    press(state.root, 'Home');
    expect(document.activeElement).toBe(state.items[0]);
    abort.abort();
    state.root.remove();
  });

  it('ignores other keys', () => {
    const { state, abort } = mounted();
    setOpen(state, true);
    const event = press(state.root, 'Enter');
    expect(event.defaultPrevented).toBe(false);
    expect(state.open).toBe(true);
    abort.abort();
    state.root.remove();
  });
});
