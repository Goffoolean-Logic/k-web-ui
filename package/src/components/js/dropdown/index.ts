import { defineElement, parseJsonList } from '../root.js';
import { buildDropdown, setLabel, setOpen } from './dom/dom.js';
import { bindEvents } from './events/events.js';
import { bindKeybinds } from './keybinds/keybinds.js';
import type { KDropdownItem, KDropdownState } from './models/models.js';

export type { KDropdownItem, KDropdownOptions } from './models/models.js';

function parseOptions(raw: string | null): KDropdownItem[] {
  const list = parseJsonList(raw, 'KDropdown');
  const options: KDropdownItem[] = [];
  for (const entry of list) {
    if (
      !entry ||
      typeof entry !== 'object' ||
      typeof (entry as { label?: unknown }).label !== 'string'
    ) {
      throw new Error('KDropdown: each option needs a label');
    }
    const item: KDropdownItem = { label: (entry as { label: string }).label };
    if (typeof (entry as { href?: unknown }).href === 'string') {
      item.href = (entry as { href: string }).href;
    }
    options.push(item);
  }
  return options;
}

/**
 * Dropdown. The host is `<k-dropdown class="k-dropdown">`. `label` and
 * `options` are attributes. The element builds the trigger, menu, and ARIA.
 *
 *   <k-dropdown class="k-dropdown" label="Sort" options='[{"label":"Name"}]'></k-dropdown>
 */
export class KDropdown extends HTMLElement {
  #state: KDropdownState | null = null;
  #abort = new AbortController();

  static get observedAttributes(): string[] {
    return ['label', 'options'];
  }

  connectedCallback(): void {
    this.classList.add('k-dropdown');
    this.#connect();
  }

  disconnectedCallback(): void {
    this.disconnect();
    this.#abort = new AbortController();
    this.#state = null;
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnected) {
      return;
    }
    if (name === 'label' && this.#state) {
      setLabel(this.#state, this.getAttribute('label'));
      return;
    }
    this.#connect();
  }

  disconnect(): void {
    this.#abort.abort();
  }

  get options(): KDropdownItem[] {
    return parseOptions(this.getAttribute('options'));
  }

  set options(value: KDropdownItem[]) {
    this.setAttribute('options', JSON.stringify(value));
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

  #connect(): void {
    const options = this.options;
    if (options.length === 0) {
      return;
    }

    this.#abort.abort();
    this.#abort = new AbortController();
    this.#state = {
      ...buildDropdown(this, {
        items: options,
        label: this.getAttribute('label') ?? undefined,
      }),
      open: false,
    };
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
