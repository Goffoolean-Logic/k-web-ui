import { describe, expect, it } from 'vitest';
import { buildTabs } from '../dom/dom.js';
import { selectTab } from '../events/events.js';
import type { KTabsState } from '../models/models.js';
import { bindKeybinds } from './keybinds.js';

function mounted(keyboard = true): {
  state: KTabsState;
  abort: AbortController;
  panels: HTMLElement[];
} {
  const root = document.createElement('div');
  root.id = 'sections';
  if (!keyboard) {
    root.classList.add('k-tabs--no-keyboard');
  }
  const panels = [0, 1, 2].map((i) => {
    const el = document.createElement('div');
    el.id = `sections-${i}`;
    document.body.append(el);
    return el;
  });
  document.body.append(root);
  const state: KTabsState = {
    root,
    tabs: [],
    panels: [],
    keyboard,
  };
  buildTabs(
    state,
    {
      items: [{ label: 'A' }, { label: 'B' }, { label: 'C' }],
    },
    panels,
  );
  selectTab(state, 0, { emit: false });
  return { state, abort: new AbortController(), panels };
}

function press(tab: HTMLElement | undefined, key: string): void {
  tab?.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
  );
}

describe('bindKeybinds', () => {
  it('does nothing when keyboard is off', () => {
    const { state, abort, panels } = mounted(false);
    bindKeybinds(state, abort.signal);
    press(state.tabs[0], 'ArrowRight');
    expect(state.tabs[0]?.getAttribute('aria-selected')).toBe('true');
    abort.abort();
    state.root.remove();
    for (const panel of panels) {
      panel.remove();
    }
  });

  it('moves right and left, wrapping at the ends', () => {
    const { state, abort, panels } = mounted();
    bindKeybinds(state, abort.signal);
    press(state.tabs[0], 'ArrowRight');
    expect(state.tabs[1]?.getAttribute('aria-selected')).toBe('true');
    press(state.tabs[1], 'ArrowLeft');
    expect(state.tabs[0]?.getAttribute('aria-selected')).toBe('true');
    abort.abort();
    state.root.remove();
    for (const panel of panels) {
      panel.remove();
    }
  });

  it('jumps to the first and last tab', () => {
    const { state, abort, panels } = mounted();
    bindKeybinds(state, abort.signal);
    press(state.tabs[0], 'End');
    expect(state.tabs[2]?.getAttribute('aria-selected')).toBe('true');
    press(state.tabs[2], 'Home');
    expect(state.tabs[0]?.getAttribute('aria-selected')).toBe('true');
    abort.abort();
    state.root.remove();
    for (const panel of panels) {
      panel.remove();
    }
  });

  it('ignores other keys and non-tab targets', () => {
    const { state, abort, panels } = mounted();
    bindKeybinds(state, abort.signal);
    press(state.tabs[0], 'Enter');
    expect(state.tabs[0]?.getAttribute('aria-selected')).toBe('true');
    state.root.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    expect(state.tabs[0]?.getAttribute('aria-selected')).toBe('true');
    abort.abort();
    state.root.remove();
    for (const panel of panels) {
      panel.remove();
    }
  });
});
