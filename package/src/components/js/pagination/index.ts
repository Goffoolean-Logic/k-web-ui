import { watchContent } from '../content.js';
import { defineElement } from '../root.js';
import {
  getVisiblePages,
  goTo,
  hasNext,
  hasPrevious,
  init,
} from './controller/controller.js';
import type { KPaginationState } from './models/models.js';

export type { KPaginationOptions } from './models/models.js';

export class KPagination extends HTMLElement {
  #state: KPaginationState | null = null;
  #abort = new AbortController();

  connectedCallback(): void {
    this.classList.add('k-pagination');
    this.#init();
  }

  disconnectedCallback(): void {
    this.disconnect();
    this.#abort = new AbortController();
    this.#state = null;
  }

  #init(): void {
    this.#abort.abort();
    this.#abort = new AbortController();
    watchContent(
      this,
      (panels) => {
        this.#abort.abort();
        this.#abort = new AbortController();
        this.#state = init(this, panels, this.#abort.signal);
      },
      this.#abort.signal,
    );
  }

  get count(): number {
    return this.#state?.count ?? 0;
  }

  get page(): number {
    return this.#state?.page ?? 1;
  }

  get hasPrevious(): boolean {
    return this.#state ? hasPrevious(this.#state) : false;
  }

  get hasNext(): boolean {
    return this.#state ? hasNext(this.#state) : false;
  }

  getVisiblePages(): number[] {
    return this.#state ? getVisiblePages(this.#state) : [];
  }

  getButtons(): HTMLButtonElement[] {
    return this.#state ? [...this.#state.buttons] : [];
  }

  select(index: number): void {
    if (this.#state) {
      goTo(this.#state, index + 1);
    }
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
