import { optionsEqual } from '../content.js';
import { defineElement } from '../root.js';
import {
  focusItem,
  getItem,
  indexOfLabel,
  init,
  insertAt,
  patchAt,
  pickItem,
  removeAt,
  setOpen,
} from './controller/controller.js';
import { setLabel } from './dom/dom.js';
import type {
  KDropdownItem,
  KDropdownOptions,
  KDropdownState,
} from './models/models.js';

export type { KDropdownItem, KDropdownOptions } from './models/models.js';

function normalize(value: KDropdownOptions): KDropdownOptions {
  const items = value.items.map((item) => {
    return item.href
      ? { label: item.label, href: item.href }
      : { label: item.label };
  });
  if (!value.trigger) {
    throw new Error('KDropdown: trigger is required');
  }
  return value.select
    ? { trigger: value.trigger, items, select: true }
    : { trigger: value.trigger, items };
}

export class KDropdown extends HTMLElement {
  #state: KDropdownState | null = null;
  #abort = new AbortController();
  #config: KDropdownOptions | null = null;

  connectedCallback(): void {
    this.classList.add('k-dropdown');
    this.#init();
  }

  disconnectedCallback(): void {
    this.disconnect();
    this.#abort = new AbortController();
    this.#state = null;
  }

  #init(): void {
    const config = this.#config;
    if (!this.isConnected || !config || config.items.length === 0) {
      return;
    }
    this.#abort.abort();
    this.#abort = new AbortController();
    this.#state = init(
      this,
      config.items,
      config.trigger,
      this.#abort.signal,
      Boolean(config.select),
    );
    if (config.select) {
      this.addEventListener('k-change', this.#syncTrigger, {
        signal: this.#abort.signal,
      });
    }
  }

  #syncTrigger = (event: Event): void => {
    if (!(event instanceof CustomEvent) || !this.#config?.select) {
      return;
    }
    const label = (event.detail as { label?: unknown } | undefined)?.label;
    if (typeof label === 'string') {
      this.#config = { ...this.#config, trigger: label };
    }
  };

  get count(): number {
    return this.#config?.items.length ?? 0;
  }

  get options(): KDropdownOptions | null {
    return this.#config;
  }

  set options(value: KDropdownOptions) {
    const next = normalize(value);
    if (optionsEqual(next, this.#config)) {
      return;
    }
    const prev = this.#config;
    this.#config = next;
    if (
      this.#state &&
      prev &&
      optionsEqual(next.items, prev.items) &&
      next.select === prev.select &&
      next.trigger !== prev.trigger
    ) {
      setLabel(this.#state, next.trigger);
      return;
    }
    this.#init();
  }

  get labels(): string[] {
    return this.#config?.items.map((item) => item.label) ?? [];
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

  focusItem(index: number): boolean {
    return this.#state ? focusItem(this.#state, index) : false;
  }

  select(index: number): void {
    if (this.#state) {
      pickItem(this.#state, index);
    }
  }

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
    if (!this.#config) {
      return;
    }
    this.options = {
      ...this.#config,
      items: insertAt(this.#config.items, option, at),
    };
  }

  removeOption(index: number): void {
    if (!this.#config) {
      return;
    }
    this.options = {
      ...this.#config,
      items: removeAt(this.#config.items, index),
    };
  }

  updateOption(index: number, patch: Partial<KDropdownItem>): void {
    if (!this.#config) {
      return;
    }
    this.options = {
      ...this.#config,
      items: patchAt(this.#config.items, index, patch),
    };
  }

  refresh(): void {
    this.#init();
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
