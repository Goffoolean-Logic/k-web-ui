import { describe, expect, it } from 'vitest';
import { buildTabs } from '../dom/dom.js';
import { selectTab } from '../events/events.js';
import type { KTabsState } from '../models/models.js';
import { bindKeybinds } from './keybinds.js';

function mounted(keyboard = true): {
  state: KTabsState;
  abort: AbortController;
} {
  const root = document.createElement('div');
  root.id = 'sections';
  document.body.append(root);
  const state: KTabsState = { root, tabs: [], panels: [], keyboard };
  buildTabs(state, {
    items: [
      { label: 'A', content: '1' },
      { label: 'B', content: '2' },
      { label: 'C', content: '3' },
    ],
  });
  selectTab(state, 0, { emit: false });
  return { state, abort: new AbortController() };
}

function press(tab: HTMLElement | undefined, key: string): KeyboardEvent {
  if (!tab) {
    throw new Error('missing tab');
  }
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });
  tab.dispatchEvent(event);
  return event;
}

function selected(state: KTabsState): number {
  return state.tabs.findIndex(
    (tab) => tab.getAttribute('aria-selected') === 'true',
  );
}

describe('bindKeybinds', () => {
  it('does nothing when keyboard is off', () => {
    const { state, abort } = mounted(false);
    bindKeybinds(state, abort.signal);
    press(state.tabs[0], 'ArrowRight');
    expect(selected(state)).toBe(0);
    abort.abort();
    state.root.remove();
  });

  it('moves right and left, wrapping at the ends', () => {
    const { state, abort } = mounted();
    bindKeybinds(state, abort.signal);
    press(state.tabs[0], 'ArrowRight');
    expect(selected(state)).toBe(1);
    press(state.tabs[1], 'ArrowDown');
    expect(selected(state)).toBe(2);
    press(state.tabs[2], 'ArrowRight');
    expect(selected(state)).toBe(0);
    press(state.tabs[0], 'ArrowLeft');
    expect(selected(state)).toBe(2);
    press(state.tabs[2], 'ArrowUp');
    expect(selected(state)).toBe(1);
    abort.abort();
    state.root.remove();
  });

  it('jumps to the first and last tab', () => {
    const { state, abort } = mounted();
    bindKeybinds(state, abort.signal);
    press(state.tabs[0], 'End');
    expect(selected(state)).toBe(2);
    press(state.tabs[2], 'Home');
    expect(selected(state)).toBe(0);
    abort.abort();
    state.root.remove();
  });

  it('ignores other keys and non-tab targets', () => {
    const { state, abort } = mounted();
    bindKeybinds(state, abort.signal);
    const event = press(state.tabs[0], 'Enter');
    expect(event.defaultPrevented).toBe(false);
    expect(selected(state)).toBe(0);
    press(state.panels[0], 'ArrowRight');
    expect(selected(state)).toBe(0);
    abort.abort();
    state.root.remove();
  });
});
