import { describe, expect, it } from 'vitest';
import { renderPagination } from '../dom/dom.js';
import { bindEvents } from '../events/events.js';
import type { KPaginationState } from '../models/models.js';
import { bindKeybinds } from './keybinds.js';

function mounted(): KPaginationState {
  const abort = new AbortController();
  const root = document.createElement('div');
  document.body.append(root);
  const state: KPaginationState = {
    root,
    count: 12,
    page: 5,
    buttons: [],
    signal: abort.signal,
  };
  renderPagination(state);
  bindEvents(state);
  bindKeybinds(state);
  return state;
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
  it('moves with arrows, Home, and End', () => {
    const state = mounted();
    press(state.root, 'ArrowLeft');
    expect(state.page).toBe(4);
    press(state.root, 'ArrowRight');
    expect(state.page).toBe(5);
    press(state.root, 'Home');
    expect(state.page).toBe(1);
    press(state.root, 'End');
    expect(state.page).toBe(12);
    state.root.remove();
  });

  it('ignores other keys', () => {
    const state = mounted();
    const event = press(state.root, 'Enter');
    expect(event.defaultPrevented).toBe(false);
    expect(state.page).toBe(5);
    state.root.remove();
  });
});
