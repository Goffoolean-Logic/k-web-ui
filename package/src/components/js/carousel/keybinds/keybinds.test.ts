import { describe, expect, it } from 'vitest';
import { buildCarousel, paint } from '../dom/dom.js';
import { bindEvents } from '../events/events.js';
import type { KCarouselState } from '../models/models.js';
import { bindKeybinds } from './keybinds.js';

const items = [{ content: 'One' }, { content: 'Two' }, { content: 'Three' }];

function mounted(keyboard = true): {
  state: KCarouselState;
  abort: AbortController;
} {
  const root = document.createElement('div');
  document.body.append(root);
  const abort = new AbortController();
  const state: KCarouselState = {
    ...buildCarousel(root, { items }),
    index: 1,
    loop: true,
    keyboard,
  };
  paint(state);
  bindEvents(state, abort.signal);
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
  it('does nothing when keyboard is off', () => {
    const { state, abort } = mounted(false);
    press(state.root, 'ArrowRight');
    expect(state.index).toBe(1);
    abort.abort();
    state.root.remove();
  });

  it('moves with arrows, Home, and End', () => {
    const { state, abort } = mounted();
    press(state.root, 'ArrowLeft');
    expect(state.index).toBe(0);
    press(state.root, 'ArrowRight');
    expect(state.index).toBe(1);
    press(state.root, 'Home');
    expect(state.index).toBe(0);
    press(state.root, 'End');
    expect(state.index).toBe(2);
    abort.abort();
    state.root.remove();
  });

  it('ignores other keys', () => {
    const { state, abort } = mounted();
    const event = press(state.root, 'Enter');
    expect(event.defaultPrevented).toBe(false);
    expect(state.index).toBe(1);
    abort.abort();
    state.root.remove();
  });
});
