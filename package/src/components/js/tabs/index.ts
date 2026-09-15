import { defineElement } from '../root.js';
import { buildTabs } from './dom/dom.js';
import { bindEvents, selectTab } from './events/events.js';
import { bindKeybinds } from './keybinds/keybinds.js';
import type { KTabItem, KTabsState } from './models/models.js';

export type { KTabItem, KTabsOptions } from './models/models.js';

/**
 * Tabs. The host is `<k-tabs class="k-tabs">`. Set `items` and the element
 * builds the tablist, tabs, panels, and ARIA. `label`, `selected`, and
 * `keyboard` are attributes.
 *
 *   <k-tabs id="sections" class="k-tabs" label="Sections"></k-tabs>
 *   document.getElementById('sections').items = [
 *     { label: 'Overview', icon: 'info', content: '…' },
 *   ];
 */
export class KTabs extends HTMLElement {
  #state: KTabsState | null = null;
  #abort = new AbortController();
  #items: KTabItem[] = [];

  static get observedAttributes(): string[] {
    return ['label', 'selected', 'keyboard'];
  }

  connectedCallback(): void {
    this.classList.add('k-tabs');
    this.#connect();
  }

  disconnectedCallback(): void {
    this.disconnect();
    this.#abort = new AbortController();
    this.#state = null;
  }

  attributeChangedCallback(): void {
    if (this.isConnected) {
      this.#connect();
    }
  }

  disconnect(): void {
    this.#abort.abort();
  }

  get items(): KTabItem[] {
    return this.#items;
  }

  set items(value: KTabItem[]) {
    this.#items = value;
    if (this.isConnected) {
      this.#connect();
    }
  }

  get tabs(): HTMLElement[] {
    return this.#state ? [...this.#state.tabs] : [];
  }

  get selectedIndex(): number {
    if (!this.#state) {
      return -1;
    }
    return this.#state.tabs.findIndex(
      (tab) => tab.getAttribute('aria-selected') === 'true',
    );
  }

  select(index: number, { focus = false } = {}): void {
    if (!this.#state) {
      return;
    }
    selectTab(this.#state, index, { focus });
  }

  #connect(): void {
    if (this.#items.length === 0) {
      return;
    }

    this.#abort.abort();
    this.#abort = new AbortController();
    this.#state = {
      root: this,
      tabs: [],
      panels: [],
      keyboard: this.getAttribute('keyboard') !== 'false',
    };

    const selected = Number(this.getAttribute('selected') ?? 0);
    buildTabs(this.#state, {
      items: this.#items,
      label: this.getAttribute('label') ?? undefined,
      keyboard: this.#state.keyboard,
    });
    bindEvents(this.#state, this.#abort.signal);
    bindKeybinds(this.#state, this.#abort.signal);
    selectTab(this.#state, Number.isFinite(selected) ? selected : 0, {
      emit: false,
    });
  }
}

defineElement('k-tabs', KTabs);

declare global {
  interface HTMLElementTagNameMap {
    'k-tabs': KTabs;
  }
}
