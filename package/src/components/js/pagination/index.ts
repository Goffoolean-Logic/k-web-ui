import { defineElement } from '../root.js';
import { renderPagination } from './dom/dom.js';
import { bindEvents, goTo } from './events/events.js';
import { bindKeybinds } from './keybinds/keybinds.js';
import type { KPaginationState } from './models/models.js';

export type { KPaginationOptions } from './models/models.js';

/**
 * Pagination. The host is `<k-pagination class="k-pagination">`. `count` and
 * `page` are attributes. Page changes dispatch `k-change` with `{ page }`.
 *
 *   <k-pagination id="pages" class="k-pagination" count="12" page="5"></k-pagination>
 */
export class KPagination extends HTMLElement {
  #state: KPaginationState | null = null;
  #abort = new AbortController();

  static get observedAttributes(): string[] {
    return ['count', 'page'];
  }

  connectedCallback(): void {
    this.classList.add('k-pagination');
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

  get count(): number {
    return this.#state?.count ?? Number(this.getAttribute('count'));
  }

  set count(value: number) {
    this.setAttribute('count', String(value));
  }

  get page(): number {
    return this.#state?.page ?? Number(this.getAttribute('page') ?? 1);
  }

  set page(value: number) {
    if (this.#state) {
      goTo(this.#state, value);
      return;
    }
    this.setAttribute('page', String(value));
  }

  goTo(page: number): void {
    if (!this.#state) {
      return;
    }
    goTo(this.#state, page);
  }

  #connect(): void {
    const raw = this.getAttribute('count');
    if (raw === null) {
      return;
    }

    const count = Number(raw);
    if (!Number.isFinite(count) || count < 1) {
      throw new Error('KPagination: count must be at least 1');
    }

    this.#abort.abort();
    this.#abort = new AbortController();

    const page = Number(this.getAttribute('page') ?? 1);
    this.#state = {
      root: this,
      count,
      page: Number.isFinite(page) && page >= 1 ? page : 1,
      buttons: [],
      signal: this.#abort.signal,
    };
    this.setAttribute('role', 'navigation');
    this.setAttribute('aria-label', 'Pagination');
    renderPagination(this.#state);
    bindEvents(this.#state);
    bindKeybinds(this.#state);
  }
}

defineElement('k-pagination', KPagination);

declare global {
  interface HTMLElementTagNameMap {
    'k-pagination': KPagination;
  }
}
