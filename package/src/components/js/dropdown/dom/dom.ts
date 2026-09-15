import type { KDropdownOptions, KDropdownState } from '../models/models.js';

export function buildDropdown(
  root: HTMLElement,
  options: KDropdownOptions,
): Omit<KDropdownState, 'open'> {
  if (options.items.length === 0) {
    throw new Error('KDropdown: at least one item is required');
  }

  const hostId = root.id || 'k-dropdown';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'k-btn k-btn--secondary k-dropdown__trigger';
  trigger.setAttribute('aria-haspopup', 'menu');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', `${hostId}-menu`);
  trigger.textContent = options.label ?? '';

  const menu = document.createElement('div');
  menu.className = 'k-dropdown__menu';
  menu.id = `${hostId}-menu`;
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

export function setOpen(state: KDropdownState, open: boolean): void {
  state.open = open;
  state.menu.hidden = !open;
  state.trigger.setAttribute('aria-expanded', String(open));
}
