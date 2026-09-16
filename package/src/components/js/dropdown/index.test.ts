import { describe, expect, it, vi } from 'vitest';
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

  it('relabels the trigger without rebuilding the menu', () => {
    const dropdown = host();
    dropdown.options = options;
    document.body.append(dropdown);
    const trigger = dropdown.querySelector('.k-dropdown__trigger');
    const menu = dropdown.querySelector('.k-dropdown__menu');

    dropdown.setAttribute('label', 'Order');

    expect(dropdown.querySelector('.k-dropdown__trigger')).toBe(trigger);
    expect(dropdown.querySelector('.k-dropdown__menu')).toBe(menu);
    expect(trigger?.querySelector('.k-dropdown__label')?.textContent).toBe(
      'Order',
    );
    expect(trigger?.querySelector('.k-icon--chevron-down')).not.toBeNull();
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

  it('fires k-change when an item is clicked', () => {
    const dropdown = host();
    dropdown.options = options;
    document.body.append(dropdown);
    const onChange = vi.fn();
    dropdown.addEventListener('k-change', onChange);

    dropdown.openMenu();
    dropdown.getItem(1)?.click();

    expect(onChange).toHaveBeenCalledTimes(1);
    const event = onChange.mock.calls[0]?.[0] as CustomEvent<{
      index: number;
      label: string;
    }>;
    expect(event.detail.index).toBe(1);
    expect(event.detail.label).toBe('Date');
    dropdown.remove();
  });
});

describe('k-dropdown api', () => {
  function mounted(): KDropdown {
    const dropdown = host();
    dropdown.options = options;
    document.body.append(dropdown);
    return dropdown;
  }

  it('reports count and labels with or without a connection', () => {
    const dropdown = host();
    dropdown.options = options;
    expect(dropdown.count).toBe(2);
    expect(dropdown.labels).toEqual(['Name', 'Date']);
    document.body.append(dropdown);
    expect(dropdown.count).toBe(2);
    expect(dropdown.labels).toEqual(['Name', 'Date']);
    dropdown.remove();
  });

  it('openMenu and closeMenu drive the menu', () => {
    const dropdown = mounted();
    dropdown.openMenu();
    expect(dropdown.open).toBe(true);
    expect(dropdown.menu?.hidden).toBe(false);
    dropdown.closeMenu();
    expect(dropdown.open).toBe(false);
    expect(dropdown.menu?.hidden).toBe(true);
    dropdown.remove();
  });

  it('exposes the trigger, menu, and item nodes', () => {
    const dropdown = mounted();
    expect(dropdown.trigger).toBe(
      dropdown.querySelector('.k-dropdown__trigger'),
    );
    expect(dropdown.menu).toBe(dropdown.querySelector('.k-dropdown__menu'));
    expect(dropdown.getItems()).toHaveLength(2);
    expect(dropdown.getItem(0)?.textContent).toBe('Name');
    expect(dropdown.getItem(9)).toBeNull();
    dropdown.remove();
  });

  it('focusItem opens the menu and moves focus', () => {
    const dropdown = mounted();
    expect(dropdown.focusItem(1)).toBe(true);
    expect(dropdown.open).toBe(true);
    expect(document.activeElement).toBe(dropdown.getItem(1));
    expect(dropdown.focusItem(9)).toBe(false);
    dropdown.remove();
  });

  it('select picks an item and fires k-change', () => {
    const dropdown = mounted();
    const onChange = vi.fn();
    dropdown.addEventListener('k-change', onChange);
    dropdown.openMenu();
    dropdown.select(0);
    expect(dropdown.open).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(1);
    dropdown.remove();
  });

  it('selectByLabel picks a match and reports a miss', () => {
    const dropdown = mounted();
    const onChange = vi.fn();
    dropdown.addEventListener('k-change', onChange);
    expect(dropdown.selectByLabel('Date')).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(dropdown.selectByLabel('Nope')).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(1);
    dropdown.remove();
  });

  it('addOption appends or inserts, and renders it', () => {
    const dropdown = mounted();
    dropdown.addOption({ label: 'Size' });
    expect(dropdown.labels).toEqual(['Name', 'Date', 'Size']);
    dropdown.addOption({ label: 'Kind' }, 0);
    expect(dropdown.labels).toEqual(['Kind', 'Name', 'Date', 'Size']);
    expect(dropdown.querySelectorAll('.k-dropdown__item')).toHaveLength(4);
    dropdown.remove();
  });

  it('removeOption drops an item', () => {
    const dropdown = mounted();
    dropdown.removeOption(0);
    expect(dropdown.labels).toEqual(['Date']);
    expect(dropdown.querySelectorAll('.k-dropdown__item')).toHaveLength(1);
    dropdown.remove();
  });

  it('updateOption patches one option', () => {
    const dropdown = mounted();
    dropdown.updateOption(1, { href: '/date' });
    expect(dropdown.options[1]).toEqual({ label: 'Date', href: '/date' });
    expect(dropdown.getItem(1)).toBeInstanceOf(HTMLAnchorElement);
    dropdown.remove();
  });

  it('refresh rebuilds the trigger and menu', () => {
    const dropdown = mounted();
    const menu = dropdown.menu;
    dropdown.refresh();
    expect(dropdown.menu).not.toBe(menu);
    expect(dropdown.querySelectorAll('.k-dropdown__menu')).toHaveLength(1);
    dropdown.remove();
  });

  it('api calls are inert while disconnected', () => {
    const dropdown = host();
    dropdown.options = options;
    expect(() => {
      dropdown.openMenu();
      dropdown.closeMenu();
      dropdown.toggle();
      dropdown.select(0);
      dropdown.refresh();
    }).not.toThrow();
    expect(dropdown.open).toBe(false);
    expect(dropdown.trigger).toBeNull();
    expect(dropdown.menu).toBeNull();
    expect(dropdown.getItems()).toEqual([]);
    expect(dropdown.focusItem(0)).toBe(false);
    expect(dropdown.selectByLabel('Name')).toBe(false);
  });
});
