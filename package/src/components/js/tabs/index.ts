import { buildTabs, resolveRoot } from './dom.js';
import { bindEvents, selectTab } from './events.js';
import { bindKeybinds } from './keybinds.js';
import type { KTabsOptions, KTabsState } from './models.js';

export type { KTabItem, KTabsOptions } from './models.js';

const instances = new WeakMap<HTMLElement, KTabs>();

/**
 * Tabs. Markup is a host with an id and `.k-tabs`. This class builds the
 * tablist, tabs, panels, and ARIA from `items`.
 *
 *   <div id="sections" class="k-tabs"></div>
 *   KTabs.mount('sections', { items: [{ label: 'Overview', content: '…' }] });
 */
export class KTabs {
  readonly #state: KTabsState;
  readonly #abort = new AbortController();

  static mount(target: string | HTMLElement, options: KTabsOptions): KTabs {
    const root = resolveRoot(target);
    const existing = instances.get(root);
    if (existing && root.querySelector('[role="tablist"]')) {
      return existing;
    }
    existing?.disconnect();
    return new KTabs(root, options);
  }

  constructor(target: string | HTMLElement, options: KTabsOptions) {
    const root = resolveRoot(target);
    this.#state = {
      root,
      tabs: [],
      panels: [],
      keyboard: options.keyboard ?? true,
    };
    instances.set(root, this);
    root.classList.add('k-tabs');
    buildTabs(this.#state, options);
    bindEvents(this.#state, this.#abort.signal);
    bindKeybinds(this.#state, this.#abort.signal);
    this.select(options.selected ?? 0);
  }

  disconnect(): void {
    this.#abort.abort();
  }

  get root(): HTMLElement {
    return this.#state.root;
  }

  get tabs(): HTMLElement[] {
    return [...this.#state.tabs];
  }

  get selectedIndex(): number {
    return this.#state.tabs.findIndex(
      (tab) => tab.getAttribute('aria-selected') === 'true',
    );
  }

  select(index: number, { focus = false } = {}): void {
    selectTab(this.#state, index, { focus });
  }
}
