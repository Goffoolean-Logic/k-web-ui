import { defineElement } from '../root.js';
import {
  applyAttribute,
  getLabels,
  getSelected,
  getSelectedIndex,
  indexOfLabel,
  init,
  insertAt,
  parsePanels,
  patchAt,
  removeAt,
  selectTab,
  serializePanels,
  step,
} from './controller/controller.js';
import type { KTabItem, KTabsSelection, KTabsState } from './models/models.js';

export type {
  KTabItem,
  KTabsOptions,
  KTabsSelection,
} from './models/models.js';

type StepOptions = { wrap?: boolean; focus?: boolean };

/**
 * Tabs. The host is `<k-tabs class="k-tabs">`. `label`, `selected`,
 * `keyboard`, `size`, and `panels` are attributes. The element builds the
 * tablist, tabs, panels, and ARIA.
 *
 *   <k-tabs class="k-tabs" label="Sections" panels='[{"label":"Overview","content":"…"}]'></k-tabs>
 */
export class KTabs extends HTMLElement {
  #state: KTabsState | null = null;
  #abort = new AbortController();
  #panels: KTabItem[] | null = null;
  #reflecting = false;

  static get observedAttributes(): string[] {
    return ['label', 'selected', 'keyboard', 'panels', 'size'];
  }

  connectedCallback(): void {
    this.classList.add('k-tabs');
    this.#init();
  }

  disconnectedCallback(): void {
    this.disconnect();
    this.#abort = new AbortController();
    this.#state = null;
  }

  attributeChangedCallback(name: string): void {
    if (this.#reflecting) {
      return;
    }
    if (name === 'panels') {
      this.#panels = null;
    }
    if (!this.isConnected) {
      return;
    }
    if (name === 'panels') {
      this.#init();
      return;
    }
    if (this.#state) {
      applyAttribute(this.#state, name);
    }
  }

  #init(): void {
    const panels = this.panels;
    if (panels.length === 0) {
      return;
    }
    this.#abort.abort();
    this.#abort = new AbortController();
    this.#state = init(this, panels, this.#abort.signal);
  }

  /** Number of panels, readable before the element is connected. */
  get count(): number {
    return this.panels.length;
  }

  get panels(): KTabItem[] {
    return this.#panels ?? parsePanels(this.getAttribute('panels'));
  }

  set panels(value: KTabItem[]) {
    this.#panels = value;
    const json = serializePanels(value);
    if (json !== null) {
      this.#reflecting = true;
      this.setAttribute('panels', json);
      this.#reflecting = false;
    }
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
    return this.panels.map((panel) => panel.label ?? '');
  }

  get selectedIndex(): number {
    return this.#state ? getSelectedIndex(this.#state) : -1;
  }

  /** The selected index with its live tab and panel nodes. */
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

  /** Selects the first panel whose label matches. Returns false on a miss. */
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

  addPanel(panel: KTabItem, at?: number): void {
    this.panels = insertAt(this.panels, panel, at);
  }

  removePanel(index: number): void {
    this.panels = removeAt(this.panels, index);
  }

  updatePanel(index: number, patch: Partial<KTabItem>): void {
    this.panels = patchAt(this.panels, index, patch);
  }

  /** Rebuilds the subtree from the current panels. */
  refresh(): void {
    if (this.isConnected) {
      this.#init();
    }
  }

  disconnect(): void {
    this.#abort.abort();
  }
}

defineElement('k-tabs', KTabs);

declare global {
  interface HTMLElementTagNameMap {
    'k-tabs': KTabs;
  }
}
