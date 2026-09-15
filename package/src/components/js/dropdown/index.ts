import { defineElement } from '../root.js';
import { queryParts, setOpen } from './dom/dom.js';
import { bindEvents } from './events/events.js';
import { bindKeybinds } from './keybinds/keybinds.js';
import type { KDropdownState } from './models/models.js';

/**
 * Dropdown. Markup is the host, a trigger, and a hidden menu. Importing the
 * JS registers `<k-dropdown>` and wires toggle, outside click, and keyboard.
 *
 *   <k-dropdown class="k-dropdown">
 *     <button type="button" class="k-dropdown__trigger">Sort</button>
 *     <div id="sort-menu" class="k-dropdown__menu" hidden>…</div>
 *   </k-dropdown>
 */
export class KDropdown extends HTMLElement {
  #state: KDropdownState | null = null;
  #abort = new AbortController();

  connectedCallback(): void {
    this.classList.add('k-dropdown');
    const start = (): void => {
      if (!this.isConnected) {
        return;
      }
      this.#bind();
    };
    if (this.querySelector('.k-dropdown__menu')) {
      start();
      return;
    }
    queueMicrotask(start);
  }

  disconnectedCallback(): void {
    this.disconnect();
    this.#abort = new AbortController();
    this.#state = null;
  }

  disconnect(): void {
    this.#abort.abort();
  }

  get open(): boolean {
    return this.#state?.open ?? false;
  }

  toggle(open = !this.open): void {
    if (!this.#state) {
      return;
    }
    setOpen(this.#state, open);
  }

  #bind(): void {
    this.#abort.abort();
    this.#abort = new AbortController();
    const parts = queryParts(this);
    this.#state = { ...parts, open: false };
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
}

defineElement('k-dropdown', KDropdown);

declare global {
  interface HTMLElementTagNameMap {
    'k-dropdown': KDropdown;
  }
}
