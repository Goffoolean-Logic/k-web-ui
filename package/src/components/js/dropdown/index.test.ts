import { describe, expect, it } from 'vitest';
import { KDropdown } from './index.js';

function host(): HTMLElement {
  const el = document.createElement('div');
  el.id = 'sort';
  el.className = 'k-dropdown';
  el.innerHTML = `
    <button type="button" class="k-dropdown__trigger">Sort</button>
    <div id="sort-menu" class="k-dropdown__menu" hidden>
      <button type="button" class="k-dropdown__item">Name</button>
      <button type="button" class="k-dropdown__item">Date</button>
    </div>
  `;
  document.body.append(el);
  return el;
}

describe('KDropdown.mount', () => {
  it('sets menu ARIA on the trigger', () => {
    const root = host();
    const dropdown = KDropdown.mount(root);
    const trigger = root.querySelector('.k-dropdown__trigger');
    expect(trigger?.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger?.getAttribute('aria-controls')).toBe('sort-menu');
    expect(root.querySelector('.k-dropdown__menu')?.getAttribute('role')).toBe(
      'menu',
    );
    expect(dropdown.open).toBe(false);
    root.remove();
  });

  it('opens and closes from the trigger', () => {
    const root = host();
    const dropdown = KDropdown.mount(root);
    const trigger = root.querySelector<HTMLButtonElement>(
      '.k-dropdown__trigger',
    );
    trigger?.click();
    expect(dropdown.open).toBe(true);
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    trigger?.click();
    expect(dropdown.open).toBe(false);
    root.remove();
  });

  it('closes on outside click and Escape', () => {
    const root = host();
    const dropdown = KDropdown.mount(root);
    const trigger = root.querySelector<HTMLButtonElement>(
      '.k-dropdown__trigger',
    );
    trigger?.click();
    expect(dropdown.open).toBe(true);

    document.body.click();
    expect(dropdown.open).toBe(false);

    trigger?.click();
    root.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    expect(dropdown.open).toBe(false);
    root.remove();
  });
});
