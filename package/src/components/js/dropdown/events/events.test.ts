import { describe, expect, it } from 'vitest';
import { queryParts, setOpen } from '../dom/dom.js';
import type { KDropdownState } from '../models/models.js';
import { bindEvents } from './events.js';

function mounted(): { state: KDropdownState; abort: AbortController } {
  const root = document.createElement('div');
  root.innerHTML = `
    <button type="button" class="k-dropdown__trigger">Sort</button>
    <div class="k-dropdown__menu" hidden>
      <button type="button" class="k-dropdown__item">Name</button>
      <button type="button" class="k-dropdown__item">Date</button>
    </div>
  `;
  document.body.append(root);
  const abort = new AbortController();
  const state: KDropdownState = { ...queryParts(root), open: false };
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
});
