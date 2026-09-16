import { createIcon } from '../../icon.js';
import type { KDropdownOptions, KDropdownState } from '../models/models.js';

export function buildDropdown(
  root: HTMLElement,
  options: KDropdownOptions,
): Omit<KDropdownState, 'open'> {
  if (options.items.length === 0) {
    throw new Error('KDropdown: at least one item is required');
  }

  const hostId = root.id || 'k-dropdown';
  const anchor = `--${hostId}`;

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'k-btn k-btn--secondary k-dropdown__trigger';
  trigger.style.setProperty('anchor-name', anchor);
  trigger.setAttribute('aria-haspopup', 'menu');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', `${hostId}-menu`);

  const label = document.createElement('span');
  label.className = 'k-dropdown__label';
  label.textContent = options.label ?? '';
  trigger.append(label, createIcon('chevron-down'));

  const menu = document.createElement('div');
  menu.className = 'k-dropdown__menu';
  menu.id = `${hostId}-menu`;
  menu.style.setProperty('position-anchor', anchor);
  menu.hidden = true;
  menu.setAttribute('role', 'menu');

  const items: HTMLElement[] = [];
  for (const item of options.items) {
    const node = item.href
      ? document.createElement('a')
      : document.createElement('button');
    if (node instanceof HTMLButtonElement) {
      node.type = 'button';
    }
    if (item.href && node instanceof HTMLAnchorElement) {
      node.href = item.href;
    }
    node.className = 'k-dropdown__item';
    node.setAttribute('role', 'menuitem');
    node.textContent = item.label;
    items.push(node);
    menu.append(node);
  }

  root.replaceChildren(trigger, menu);
  return { root, trigger, menu, items };
}

export function setLabel(state: KDropdownState, label: string | null): void {
  const text = state.trigger.querySelector('.k-dropdown__label');
  if (text) {
    text.textContent = label ?? '';
    return;
  }
  state.trigger.textContent = label ?? '';
}

export function setOpen(state: KDropdownState, open: boolean): void {
  state.open = open;
  state.menu.hidden = !open;
  state.trigger.setAttribute('aria-expanded', String(open));
}
