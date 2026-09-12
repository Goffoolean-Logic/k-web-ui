import { resolveRoot } from '../root.js';
import { queryParts, setOpen } from './dom.js';
import { bindEvents } from './events.js';
import { bindKeybinds } from './keybinds.js';
import type { KDropdownState } from './models.js';

const instances = new WeakMap<HTMLElement, KDropdown>();

/**
 * Dropdown. Markup is a host, a trigger, and a hidden menu. This class
 * toggles open state, outside click, and keyboard movement.
 *
 *   <div id="sort" class="k-dropdown">…</div>
 *   KDropdown.mount('sort');
 */
export class KDropdown {
  readonly #state: KDropdownState;
  readonly #abort = new AbortController();

  static mount(target: string | HTMLElement): KDropdown {
    const root = resolveRoot(target, 'KDropdown');
    const existing = instances.get(root);
    if (existing && root.querySelector('.k-dropdown__menu')) {
      return existing;
    }
    existing?.disconnect();
    return new KDropdown(root);
  }

  constructor(target: string | HTMLElement) {
    const root = resolveRoot(target, 'KDropdown');
    const parts = queryParts(root);
    this.#state = { ...parts, open: false };
    instances.set(root, this);
    root.classList.add('k-dropdown');
    parts.trigger.classList.add('k-dropdown__trigger');
    parts.trigger.setAttribute('aria-haspopup', 'menu');
    parts.trigger.setAttribute('aria-expanded', 'false');
    if (parts.menu.id) {
      parts.trigger.setAttribute('aria-controls', parts.menu.id);
    }
    parts.menu.setAttribute('role', 'menu');
    for (const item of parts.items) {
      item.setAttribute('role', 'menuitem');
    }
    setOpen(this.#state, false);
    bindEvents(this.#state, this.#abort.signal);
    bindKeybinds(this.#state, this.#abort.signal);
  }

  disconnect(): void {
    this.#abort.abort();
  }

  get root(): HTMLElement {
    return this.#state.root;
  }

  get open(): boolean {
    return this.#state.open;
  }

  toggle(open = !this.#state.open): void {
    setOpen(this.#state, open);
  }
}
