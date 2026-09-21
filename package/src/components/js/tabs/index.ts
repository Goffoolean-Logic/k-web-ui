import { optionsEqual, watchContent } from '../content.js';
import { defineElement } from '../root.js';
import {
  applyHostClass,
  getLabels,
  getSelected,
  getSelectedIndex,
  indexOfLabel,
  init,
  selectTab,
  step,
} from './controller/controller.js';
import type { KTabItem, KTabsSelection, KTabsState } from './models/models.js';

export type {
  KTabItem,
  KTabsOptions,
  KTabsSelection,
} from './models/models.js';

type StepOptions = { wrap?: boolean; focus?: boolean };

function normalizeItems(value: KTabItem[]): KTabItem[] {
  return value.map((item) => {
    if (!item || typeof item.label !== 'string' || item.label.length === 0) {
      throw new Error('KTabs: each option needs a label');
    }
    return item.icon
      ? { label: item.label, icon: item.icon }
      : { label: item.label };
  });
}

export class KTabs extends HTMLElement {
  #state: KTabsState | null = null;
  #abort = new AbortController();
  #items: KTabItem[] = [];
  #classObserver: MutationObserver | null = null;

  static get observedAttributes(): string[] {
    return ['aria-label'];
  }

  connectedCallback(): void {
    this.classList.add('k-tabs');
    this.#bindClassObserver();
    this.#init();
  }

  attributeChangedCallback(): void {
    if (this.#state) {
      applyHostClass(this.#state);
    }
  }

  disconnectedCallback(): void {
    this.disconnect();
    this.#abort = new AbortController();
    this.#state = null;
  }

  #bindClassObserver(): void {
    this.#classObserver?.disconnect();
    this.#classObserver = new MutationObserver(() => {
      if (this.#state) {
        applyHostClass(this.#state);
      }
    });
    this.#classObserver.observe(this, {
      attributes: true,
      attributeFilter: ['class', 'aria-label'],
    });
  }

  #init(): void {
    if (!this.isConnected || this.#items.length === 0) {
      return;
    }
    this.#abort.abort();
    this.#abort = new AbortController();
    watchContent(
      this,
      (panels) => {
        this.#abort.abort();
        this.#abort = new AbortController();
        this.#state = init(this, this.#items, panels, this.#abort.signal);
      },
      this.#abort.signal,
    );
  }

  get count(): number {
    return this.#items.length;
  }

  get options(): KTabItem[] {
    return this.#items;
  }

  set options(value: KTabItem[]) {
    const items = normalizeItems(value);
    if (optionsEqual(items, this.#items)) {
      return;
    }
    this.#items = items;
    if (this.isConnected) {
      this.#init();
    }
  }

  get tabs(): HTMLElement[] {
    return this.#state ? [...this.#state.tabs] : [];
  }

  get labels(): string[] {
    if (this.#state) {
      return getLabels(this.#state);
    }
    return this.#items.map((item) => item.label);
  }

  get selectedIndex(): number {
    return this.#state ? getSelectedIndex(this.#state) : -1;
  }

  getSelected(): KTabsSelection | null {
    return this.#state ? getSelected(this.#state) : null;
  }

  getTab(index: number): HTMLElement | null {
    return this.#state?.tabs[index] ?? null;
  }

  getPanel(index: number): HTMLElement | null {
    return this.#state?.panels[index] ?? null;
  }

  select(index: number, { focus = false } = {}): void {
    if (this.#state) {
      selectTab(this.#state, index, { focus });
    }
  }

  selectByLabel(label: string, { focus = false } = {}): boolean {
    if (!this.#state) {
      return false;
    }
    const index = indexOfLabel(this.#state, label);
    if (index < 0) {
      return false;
    }
    selectTab(this.#state, index, { focus });
    return true;
  }

  next(options?: StepOptions): void {
    if (this.#state) {
      step(this.#state, 1, options);
    }
  }

  previous(options?: StepOptions): void {
    if (this.#state) {
      step(this.#state, -1, options);
    }
  }

  refresh(): void {
    if (this.isConnected) {
      this.#init();
    }
  }

  disconnect(): void {
    this.#abort.abort();
    this.#classObserver?.disconnect();
    this.#classObserver = null;
  }
}

defineElement('k-tabs', KTabs);

declare global {
  interface HTMLElementTagNameMap {
    'k-tabs': KTabs;
  }
}
