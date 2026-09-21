import { describe, expect, it } from 'vitest';
import { buildDropdown, setLabel, setOpen } from './dom.js';

const items = [{ label: 'Name' }, { label: 'Date' }];

function built(id?: string) {
  const root = document.createElement('div');
  if (id) {
    root.id = id;
  }
  document.body.append(root);
  return { root, parts: buildDropdown(root, { items, trigger: 'Sort' }) };
}

describe('buildDropdown', () => {
  it('throws when items is empty', () => {
    const root = document.createElement('div');
    expect(() => buildDropdown(root, { items: [], trigger: 'Sort' })).toThrow(
      'KDropdown: at least one item is required',
    );
  });

  it('builds the trigger, menu, and items from the host id', () => {
    const { root, parts } = built('sort');
    expect(parts.trigger.className).toContain('k-dropdown__trigger');
    expect(parts.trigger.querySelector('.k-dropdown__label')?.textContent).toBe(
      'Sort',
    );
    expect(parts.trigger.querySelector('.k-icon--chevron-down')).not.toBeNull();
    expect(parts.trigger.textContent).toBe('Sort');
    expect(parts.trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(parts.trigger.getAttribute('aria-controls')).toBe('sort-menu');
    expect(parts.menu.id).toBe('sort-menu');
    expect(parts.menu.getAttribute('role')).toBe('menu');
    expect(parts.trigger.style.getPropertyValue('anchor-name')).toBe('--sort');
    expect(parts.menu.style.getPropertyValue('position-anchor')).toBe('--sort');
    expect(parts.items).toHaveLength(2);
    expect(parts.items[0]?.textContent).toBe('Name');
    expect(parts.items[0]?.getAttribute('role')).toBe('menuitem');
    root.remove();
  });

  it('falls back to k-dropdown when the host has no id', () => {
    const { root, parts } = built();
    expect(parts.menu.id).toBe('k-dropdown-menu');
    expect(parts.trigger.getAttribute('aria-controls')).toBe('k-dropdown-menu');
    root.remove();
  });

  it('renders a link when an item has href', () => {
    const root = document.createElement('div');
    root.id = 'nav';
    const parts = buildDropdown(root, {
      trigger: 'More',
      items: [{ label: 'Docs', href: '/docs' }],
    });
    expect(parts.items[0]?.tagName).toBe('A');
    expect(parts.items[0]?.getAttribute('href')).toBe('/docs');
  });
});

describe('setLabel', () => {
  it('relabels the trigger without dropping the chevron', () => {
    const { root, parts } = built('sort');
    const state = { ...parts, open: false, select: false };
    setLabel(state, 'Order');
    expect(parts.trigger.querySelector('.k-dropdown__label')?.textContent).toBe(
      'Order',
    );
    expect(parts.trigger.querySelector('.k-icon--chevron-down')).not.toBeNull();
    root.remove();
  });
});

describe('setOpen', () => {
  it('toggles hidden and aria-expanded', () => {
    const { root, parts } = built('sort');
    const state = { ...parts, open: false, select: false };
    setOpen(state, true);
    expect(state.open).toBe(true);
    expect(state.menu.hidden).toBe(false);
    expect(state.trigger.getAttribute('aria-expanded')).toBe('true');
    setOpen(state, false);
    expect(state.open).toBe(false);
    expect(state.menu.hidden).toBe(true);
    expect(state.trigger.getAttribute('aria-expanded')).toBe('false');
    root.remove();
  });
});
