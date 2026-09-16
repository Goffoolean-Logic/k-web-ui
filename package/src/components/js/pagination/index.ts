import { defineElement } from '../root.js';
import {
  applyAttribute,
  getVisiblePages,
  goTo,
  hasNext,
  hasPrevious,
  init,
  readCount,
  toPage,
} from './controller/controller.js';
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
    const count = readCount(this);
    if (count === null) {
      return;
    }
    this.#abort.abort();
    this.#abort = new AbortController();
    this.#state = init(this, count, this.#abort.signal);
  }

  get count(): number {
    return this.#state?.count ?? Number(this.getAttribute('count'));
  }

  set count(value: number) {
    this.setAttribute('count', String(value));
  }

  get page(): number {
    return this.#state?.page ?? toPage(this.getAttribute('page'));
  }

  set page(value: number) {
    if (this.#state) {
      goTo(this.#state, value);
      return;
    }
    this.setAttribute('page', String(value));
  }

  get hasPrevious(): boolean {
    return this.#state ? hasPrevious(this.#state) : false;
  }

  get hasNext(): boolean {
    return this.#state ? hasNext(this.#state) : false;
  }

  /** The page numbers currently rendered, ends included. */
  getVisiblePages(): number[] {
    return this.#state ? getVisiblePages(this.#state) : [];
  }

  /** Every rendered button, controls and page numbers alike. */
  getButtons(): HTMLButtonElement[] {
    return this.#state ? [...this.#state.buttons] : [];
  }

  goTo(page: number): void {
    if (this.#state) {
      goTo(this.#state, page);
    }
  }

  next(): void {
    if (this.#state) {
      goTo(this.#state, this.#state.page + 1);
    }
  }

  previous(): void {
    if (this.#state) {
      goTo(this.#state, this.#state.page - 1);
    }
  }

  first(): void {
    this.goTo(1);
  }

  last(): void {
    if (this.#state) {
      goTo(this.#state, this.#state.count);
    }
  }

  /** Re-renders the bar from the current count and page. */
  refresh(): void {
    if (this.isConnected) {
      this.#init();
    }
  }

  disconnect(): void {
    this.#abort.abort();
  }
}

defineElement('k-pagination', KPagination);

declare global {
  interface HTMLElementTagNameMap {
    'k-pagination': KPagination;
  }
}
