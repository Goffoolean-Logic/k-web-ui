import { describe, expect, it } from 'vitest';
import { queryParts, setOpen } from './dom.js';

function markup(withClass = true): HTMLElement {
  const root = document.createElement('div');
  root.innerHTML = `
    <button type="button"${withClass ? ' class="k-dropdown__trigger"' : ''}>Sort</button>
    <div class="k-dropdown__menu" hidden>
      <button type="button" class="k-dropdown__item">Name</button>
      <button type="button" class="k-dropdown__item">Date</button>
    </div>
  `;
  return root;
}

describe('queryParts', () => {
  it('finds the trigger, menu, and items', () => {
    const root = markup();
    const parts = queryParts(root);
    expect(parts.trigger.textContent).toBe('Sort');
    expect(parts.menu.classList.contains('k-dropdown__menu')).toBe(true);
    expect(parts.items).toHaveLength(2);
  });

  it('falls back to the first button when the trigger class is missing', () => {
    const root = markup(false);
    expect(queryParts(root).trigger.tagName).toBe('BUTTON');
  });

  it('throws when the trigger or menu is missing', () => {
    const noMenu = document.createElement('div');
    noMenu.innerHTML = `<button type="button" class="k-dropdown__trigger">Sort</button>`;
    expect(() => queryParts(noMenu)).toThrow(
      'KDropdown: expected a .k-dropdown__trigger and .k-dropdown__menu',
    );

    const noTrigger = document.createElement('div');
    noTrigger.innerHTML = `<div class="k-dropdown__menu"></div>`;
    expect(() => queryParts(noTrigger)).toThrow(
      'KDropdown: expected a .k-dropdown__trigger and .k-dropdown__menu',
    );
  });
});

describe('setOpen', () => {
  it('toggles hidden and aria-expanded', () => {
    const root = markup();
    const state = { ...queryParts(root), open: false };
    setOpen(state, true);
    expect(state.open).toBe(true);
    expect(state.menu.hidden).toBe(false);
    expect(state.trigger.getAttribute('aria-expanded')).toBe('true');
    setOpen(state, false);
    expect(state.open).toBe(false);
    expect(state.menu.hidden).toBe(true);
    expect(state.trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
