import { describe, expect, it } from 'vitest';
import type { KDropdown } from './index.js';
import './index.js';

function host(): KDropdown {
  const el = document.createElement('k-dropdown');
  el.id = 'sort';
  el.setAttribute('label', 'Sort');
  return el;
}

const options = [{ label: 'Name' }, { label: 'Date' }];

describe('k-dropdown', () => {
  it('builds trigger, menu, items, and ARIA from the options attribute', () => {
    const dropdown = host();
    dropdown.setAttribute('options', JSON.stringify(options));
    document.body.append(dropdown);

    const trigger = dropdown.querySelector('.k-dropdown__trigger');
    expect(trigger?.textContent).toBe('Sort');
    expect(trigger?.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger?.getAttribute('aria-controls')).toBe('sort-menu');
    expect(
      dropdown.querySelector('.k-dropdown__menu')?.getAttribute('role'),
    ).toBe('menu');
    expect(dropdown.querySelectorAll('.k-dropdown__item')).toHaveLength(2);
    expect(dropdown.open).toBe(false);
    dropdown.remove();
  });

  it('opens and closes from the trigger', () => {
    const dropdown = host();
    dropdown.options = options;
    document.body.append(dropdown);
    const trigger = dropdown.querySelector<HTMLButtonElement>(
      '.k-dropdown__trigger',
    );
    trigger?.click();
    expect(dropdown.open).toBe(true);
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    trigger?.click();
    expect(dropdown.open).toBe(false);
    dropdown.remove();
  });

  it('closes on outside click and Escape', () => {
    const dropdown = host();
    dropdown.options = options;
    document.body.append(dropdown);
    const trigger = dropdown.querySelector<HTMLButtonElement>(
      '.k-dropdown__trigger',
    );
    trigger?.click();
    expect(dropdown.open).toBe(true);

    document.body.click();
    expect(dropdown.open).toBe(false);

    trigger?.click();
    dropdown.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    expect(dropdown.open).toBe(false);
    dropdown.remove();
  });

  it('setting options again does not double-bind', () => {
    const dropdown = host();
    dropdown.options = options;
    document.body.append(dropdown);
    dropdown.options = options;
    expect(dropdown.querySelectorAll('.k-dropdown__trigger')).toHaveLength(1);
    expect(dropdown.querySelectorAll('.k-dropdown__item')).toHaveLength(2);
    dropdown.remove();
  });
});
