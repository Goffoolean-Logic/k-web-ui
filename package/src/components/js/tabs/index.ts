import { defineElement, parseJsonList } from '../root.js';
import { buildTabs } from './dom/dom.js';
import { bindEvents, selectTab } from './events/events.js';
import { bindKeybinds } from './keybinds/keybinds.js';
import type { KTabItem, KTabsState } from './models/models.js';

export type { KTabItem, KTabsOptions } from './models/models.js';

function isNode(value: unknown): value is Node {
  return value instanceof Node;
}

function parsePanels(raw: string | null): KTabItem[] {
  const list = parseJsonList(raw, 'KTabs');
  const panels: KTabItem[] = [];
  for (const entry of list) {
    if (!entry || typeof entry !== 'object') {
      throw new Error('KTabs: each panel is an object');
    }
    const rec = entry as {
      label?: unknown;
      icon?: unknown;
      content?: unknown;
    };
    const panel: KTabItem = {
      content: typeof rec.content === 'string' ? rec.content : '',
    };
    if (typeof rec.label === 'string') {
      panel.label = rec.label;
    }
    if (typeof rec.icon === 'string') {
      panel.icon = rec.icon as KTabItem['icon'];
    }
    panels.push(panel);
  }
  return panels;
}

function serializePanels(panels: KTabItem[]): string | null {
  const json: Array<Record<string, string>> = [];
  for (const panel of panels) {
    if (isNode(panel.content) || isNode(panel.icon)) {
      return null;
    }
    const entry: Record<string, string> = {};
    if (panel.label !== undefined) {
      entry.label = panel.label;
    }
    if (typeof panel.icon === 'string') {
      entry.icon = panel.icon;
    }
    if (typeof panel.content === 'string') {
      entry.content = panel.content;
    }
    json.push(entry);
  }
  return JSON.stringify(json);
}

/**
 * Tabs. The host is `<k-tabs class="k-tabs">`. `label`, `selected`,
 * `keyboard`, and `panels` are attributes. The element builds the tablist,
 * tabs, panels, and ARIA.
 *
 *   <k-tabs class="k-tabs" label="Sections" panels='[{"label":"Overview","content":"…"}]'></k-tabs>
 */
export class KTabs extends HTMLElement {
  #state: KTabsState | null = null;
  #abort = new AbortController();
  #panels: KTabItem[] | null = null;
  #reflecting = false;

  static get observedAttributes(): string[] {
    return ['label', 'selected', 'keyboard', 'panels'];
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

  attributeChangedCallback(name: string): void {
    if (this.#reflecting) {
      return;
    }
    if (name === 'panels') {
      this.#panels = null;
    }
    if (this.isConnected) {
      this.#connect();
    }
  }

  disconnect(): void {
    this.#abort.abort();
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
    const panels = this.panels;
    if (panels.length === 0) {
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
      items: panels,
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
