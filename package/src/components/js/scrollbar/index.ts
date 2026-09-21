import { defineElement } from '../root.js';
import {
  attachScrollbar,
  disconnectState,
  hasOverflowX,
  hasOverflowY,
  init,
  scrollTo,
  setAxis,
  teardown,
} from './controller/controller.js';
import type {
  KScrollbarAxis,
  KScrollbarMetrics,
  KScrollbarOptions,
  KScrollbarSize,
  KScrollbarState,
} from './models/models.js';

export type {
  KScrollbarAxis,
  KScrollbarMetrics,
  KScrollbarOptions,
  KScrollbarSize,
} from './models/models.js';

function readAxisFromClass(root: HTMLElement): KScrollbarAxis {
  if (root.classList.contains('k-scrollbar--x')) {
    return 'x';
  }
  if (root.classList.contains('k-scrollbar--y')) {
    return 'y';
  }
  return 'both';
}

export class KScrollbar extends HTMLElement {
  #state: KScrollbarState | null = null;
  #abort = new AbortController();
  #target: string | null = null;
  #classObserver: MutationObserver | null = null;

  connectedCallback(): void {
    this.classList.add('k-scrollbar');
    this.#classObserver = new MutationObserver(() => {
      if (!this.#state) {
        return;
      }
      setAxis(this.#state, readAxisFromClass(this));
      this.#state.autohide = !this.classList.contains(
        'k-scrollbar--no-autohide',
      );
    });
    this.#classObserver.observe(this, {
      attributes: true,
      attributeFilter: ['class'],
    });
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
    if (this.#state) {
      teardown(this.#state);
    }
    this.#state = init(this, this.#abort.signal, this.#target);
  }

  get options(): KScrollbarOptions {
    const options: KScrollbarOptions = {};
    if (this.#target) {
      options.target = this.#target;
    }
    return options;
  }

  set options(value: KScrollbarOptions) {
    const next = value.target ?? null;
    if (
      next === this.#target &&
      value.axis === undefined &&
      value.size === undefined &&
      value.autohide === undefined
    ) {
      return;
    }
    this.#target = next;
    if (next) {
      this.setAttribute('data-k-target', next);
    } else {
      this.removeAttribute('data-k-target');
    }
    if (value.axis) {
      this.axis = value.axis;
    }
    if (value.size === 'sm' || value.size === 'lg') {
      this.size = value.size;
    }
    if (value.autohide === false) {
      this.classList.add('k-scrollbar--no-autohide');
    } else if (value.autohide === true) {
      this.classList.remove('k-scrollbar--no-autohide');
    }
    if (this.isConnected) {
      this.#init();
    }
  }

  get axis(): KScrollbarAxis {
    return this.#state?.axis ?? readAxisFromClass(this);
  }

  set axis(next: KScrollbarAxis) {
    this.classList.remove(
      'k-scrollbar--x',
      'k-scrollbar--y',
      'k-scrollbar--both',
    );
    if (next === 'x' || next === 'y') {
      this.classList.add(`k-scrollbar--${next}`);
    }
    if (this.#state) {
      setAxis(this.#state, next);
    }
  }

  get target(): string {
    return this.#target ?? '';
  }

  set target(next: string) {
    this.options = { ...this.options, target: next || undefined };
  }

  get autohide(): boolean {
    return !this.classList.contains('k-scrollbar--no-autohide');
  }

  set autohide(next: boolean) {
    this.classList.toggle('k-scrollbar--no-autohide', !next);
    if (this.#state) {
      this.#state.autohide = next;
    }
  }

  get size(): KScrollbarSize | undefined {
    if (this.classList.contains('k-scrollbar--sm')) {
      return 'sm';
    }
    if (this.classList.contains('k-scrollbar--lg')) {
      return 'lg';
    }
    return undefined;
  }

  set size(next: KScrollbarSize | undefined) {
    this.classList.remove('k-scrollbar--sm', 'k-scrollbar--lg');
    if (next === 'sm' || next === 'lg') {
      this.classList.add(`k-scrollbar--${next}`);
    }
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
    this.#classObserver?.disconnect();
    this.#classObserver = null;
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
