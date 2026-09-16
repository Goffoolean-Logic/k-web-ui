import { defineElement } from '../root.js';
import {
  applyAttribute,
  focusItem,
  getItem,
  indexOfLabel,
  init,
  insertAt,
  parseOptions,
  patchAt,
  pickItem,
  removeAt,
  setOpen,
} from './controller/controller.js';
import type { KDropdownItem, KDropdownState } from './models/models.js';

export type { KDropdownItem, KDropdownOptions } from './models/models.js';

/**
 * Dropdown. The host is `<k-dropdown class="k-dropdown">`. `label`, `align`,
 * and `options` are attributes. The element builds the trigger, menu, and
 * ARIA, and fires `k-change` when an item is picked.
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
    this.#init();
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
    if (this.#state && applyAttribute(this.#state, name)) {
      return;
    }
    this.#init();
  }

  #init(): void {
    const options = this.options;
    if (options.length === 0) {
      return;
    }
    this.#abort.abort();
    this.#abort = new AbortController();
    this.#state = init(this, options, this.#abort.signal);
  }

  /** Number of options, readable before the element is connected. */
  get count(): number {
    return this.options.length;
  }

  get options(): KDropdownItem[] {
    return parseOptions(this.getAttribute('options'));
  }

  set options(value: KDropdownItem[]) {
    this.setAttribute('options', JSON.stringify(value));
  }

  get labels(): string[] {
    return this.options.map((option) => option.label);
  }

  get open(): boolean {
    return this.#state?.open ?? false;
  }

  get trigger(): HTMLElement | null {
    return this.#state?.trigger ?? null;
  }

  get menu(): HTMLElement | null {
    return this.#state?.menu ?? null;
  }

  getItems(): HTMLElement[] {
    return this.#state ? [...this.#state.items] : [];
  }

  getItem(index: number): HTMLElement | null {
    return this.#state ? getItem(this.#state, index) : null;
  }

  toggle(open = !this.open): void {
    if (this.#state) {
      setOpen(this.#state, open);
    }
  }

  openMenu(): void {
    this.toggle(true);
  }

  closeMenu(): void {
    this.toggle(false);
  }

  /** Opens the menu if needed and moves focus to an item. */
  focusItem(index: number): boolean {
    return this.#state ? focusItem(this.#state, index) : false;
  }

  /** Picks an item as a click would: closes the menu and fires `k-change`. */
  select(index: number): void {
    if (this.#state) {
      pickItem(this.#state, index);
    }
  }

  /** Picks the first option whose label matches. Returns false on a miss. */
  selectByLabel(label: string): boolean {
    if (!this.#state) {
      return false;
    }
    const index = indexOfLabel(this.#state, label);
    if (index < 0) {
      return false;
    }
    pickItem(this.#state, index);
    return true;
  }

  addOption(option: KDropdownItem, at?: number): void {
    this.options = insertAt(this.options, option, at);
  }

  removeOption(index: number): void {
    this.options = removeAt(this.options, index);
  }

  updateOption(index: number, patch: Partial<KDropdownItem>): void {
    this.options = patchAt(this.options, index, patch);
  }

  /** Rebuilds the trigger and menu from the current options. */
  refresh(): void {
    if (this.isConnected) {
      this.#init();
    }
  }

  disconnect(): void {
    this.#abort.abort();
  }
}

defineElement('k-dropdown', KDropdown);

declare global {
  interface HTMLElementTagNameMap {
    'k-dropdown': KDropdown;
  }
}
