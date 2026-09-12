import { resolveRoot } from '../root.js';
import { renderPagination } from './dom.js';
import { bindEvents, goTo } from './events.js';
import { bindKeybinds } from './keybinds.js';
import type { KPaginationOptions, KPaginationState } from './models.js';

export type { KPaginationOptions } from './models.js';

const instances = new WeakMap<HTMLElement, KPagination>();

/**
 * Pagination. Markup is a host with an id and `.k-pagination`. This class
 * builds the controls from `count`: all page numbers when there are few,
 * otherwise first / prev / a three-page window / next / last.
 *
 *   <div id="pages" class="k-pagination"></div>
 *   KPagination.mount('pages', { count: 12 });
 */
export class KPagination {
  readonly #state: KPaginationState;
  readonly #abort = new AbortController();

  static mount(
    target: string | HTMLElement,
    options: KPaginationOptions,
  ): KPagination {
    const root = resolveRoot(target, 'KPagination');
    const existing = instances.get(root);
    if (existing && root.querySelector('.k-pagination__btn')) {
      return existing;
    }
    existing?.disconnect();
    return new KPagination(root, options);
  }

  constructor(target: string | HTMLElement, options: KPaginationOptions) {
    if (options.count < 1) {
      throw new Error('KPagination: count must be at least 1');
    }
    const root = resolveRoot(target, 'KPagination');
    this.#state = {
      root,
      count: options.count,
      page: options.page ?? 1,
      onChange: options.onChange,
      buttons: [],
      signal: this.#abort.signal,
    };
    instances.set(root, this);
    root.classList.add('k-pagination');
    root.setAttribute('role', 'navigation');
    root.setAttribute('aria-label', 'Pagination');
    renderPagination(this.#state);
    bindEvents(this.#state);
    bindKeybinds(this.#state);
  }

  disconnect(): void {
    this.#abort.abort();
  }

  get root(): HTMLElement {
    return this.#state.root;
  }

  get page(): number {
    return this.#state.page;
  }

  goTo(page: number): void {
    goTo(this.#state, page);
  }
}
