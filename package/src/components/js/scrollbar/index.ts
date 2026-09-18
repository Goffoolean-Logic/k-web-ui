import { defineElement } from '../root.js';
import {
  applyAttribute,
  attachScrollbar,
  disconnectState,
  hasOverflowX,
  hasOverflowY,
  init,
  isSize,
  readAxis,
  scrollTo,
  setBooleanAttribute,
  teardown,
} from './controller/controller.js';
import type {
  KScrollbarAxis,
  KScrollbarMetrics,
  KScrollbarSize,
  KScrollbarState,
} from './models/models.js';

export type {
  KScrollbarAxis,
  KScrollbarMetrics,
  KScrollbarOptions,
  KScrollbarSize,
} from './models/models.js';

/**
 * Overlay scrollbar. The host is `<k-scrollbar class="k-scrollbar">`.
 * Leave `target` off to wrap the host's children. Pass `target="viewport"`
 * to paint over the page, or a selector to paint over another scroller.
 *
 *   <k-scrollbar class="k-scrollbar" style="height: 12rem">…</k-scrollbar>
 */
export class KScrollbar extends HTMLElement {
  #state: KScrollbarState | null = null;
  #abort = new AbortController();

  static get observedAttributes(): string[] {
    return ['axis', 'target', 'autohide', 'size'];
  }

  connectedCallback(): void {
    this.classList.add('k-scrollbar');
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
    this.#abort.abort();
    this.#abort = new AbortController();
    if (this.#state) {
      teardown(this.#state);
    }
    this.#state = init(this, this.#abort.signal);
  }

  get axis(): KScrollbarAxis {
    return this.#state?.axis ?? readAxis(this.getAttribute('axis'));
  }

  set axis(next: KScrollbarAxis) {
    this.setAttribute('axis', next);
  }

  get target(): string {
    return this.getAttribute('target') ?? '';
  }

  set target(next: string) {
    if (next) {
      this.setAttribute('target', next);
      return;
    }
    this.removeAttribute('target');
  }

  get autohide(): boolean {
    return this.hasAttribute('autohide');
  }

  set autohide(next: boolean) {
    setBooleanAttribute(this, 'autohide', next);
  }

  get size(): KScrollbarSize | undefined {
    const raw = this.getAttribute('size');
    return isSize(raw) ? raw : undefined;
  }

  set size(next: KScrollbarSize | undefined) {
    if (next && isSize(next)) {
      this.setAttribute('size', next);
      return;
    }
    this.removeAttribute('size');
  }

  get hasOverflowY(): boolean {
    return this.#state ? hasOverflowY(this.#state) : false;
  }

  get hasOverflowX(): boolean {
    return this.#state ? hasOverflowX(this.#state) : false;
  }

  getViewport(): HTMLElement | null {
    return this.#state?.viewport ?? null;
  }

  getThumbY(): HTMLElement | null {
    return this.#state?.vThumb ?? null;
  }

  getThumbX(): HTMLElement | null {
    return this.#state?.hThumb ?? null;
  }

  getScroll(): KScrollbarMetrics {
    return {
      scrollTop: this.#state?.viewport.scrollTop ?? 0,
      scrollLeft: this.#state?.viewport.scrollLeft ?? 0,
    };
  }

  goTo(top?: number, left?: number): void {
    if (this.#state) {
      scrollTo(this.#state, top, left);
    }
  }

  /** Re-reads overflow and places the thumbs. */
  refresh(): void {
    if (this.isConnected) {
      this.#init();
    }
  }

  disconnect(): void {
    if (this.#state) {
      disconnectState(this.#state);
    }
    this.#abort.abort();
  }
}

defineElement('k-scrollbar', KScrollbar);

export { attachScrollbar };

function bootPageScrollbar(): void {
  if (!document.body) {
    document.addEventListener('DOMContentLoaded', bootPageScrollbar, {
      once: true,
    });
    return;
  }
  attachScrollbar('viewport');
}

function inBrowser(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  if ('happyDOM' in window) {
    return false;
  }
  return !/happy-dom|jsdom/i.test(navigator.userAgent);
}

if (inBrowser()) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootPageScrollbar, {
      once: true,
    });
  } else {
    bootPageScrollbar();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'k-scrollbar': KScrollbar;
  }
}
