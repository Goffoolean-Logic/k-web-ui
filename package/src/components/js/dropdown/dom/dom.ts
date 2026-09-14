import type { KDropdownState } from '../models/models.js';

export function queryParts(root: HTMLElement): Omit<KDropdownState, 'open'> {
  const trigger =
    root.querySelector<HTMLElement>('.k-dropdown__trigger') ??
    root.querySelector<HTMLElement>('button');
  const menu = root.querySelector<HTMLElement>('.k-dropdown__menu');
  if (!trigger || !menu) {
    throw new Error(
      'KDropdown: expected a .k-dropdown__trigger and .k-dropdown__menu',
    );
  }

  const items = [...menu.querySelectorAll<HTMLElement>('.k-dropdown__item')];
  return { root, trigger, menu, items };
}

export function setOpen(state: KDropdownState, open: boolean): void {
  state.open = open;
  state.menu.hidden = !open;
  state.trigger.setAttribute('aria-expanded', String(open));
}
