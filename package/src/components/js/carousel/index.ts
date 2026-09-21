import { watchContent } from '../content.js';
import { defineElement } from '../root.js';
import {
  applyHostClass,
  getCurrentSlide,
  getSlide,
  goTo,
  init,
  isPlaying,
} from './controller/controller.js';
import type { KCarouselState } from './models/models.js';

export type { KCarouselOptions, KCarouselSlide } from './models/models.js';

export class KCarousel extends HTMLElement {
  #state: KCarouselState | null = null;
  #abort = new AbortController();
  #classObserver: MutationObserver | null = null;

  connectedCallback(): void {
    this.classList.add('k-carousel');
    this.#classObserver = new MutationObserver(() => {
      if (this.#state) {
        applyHostClass(this.#state);
      }
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
    watchContent(
      this,
      (slides) => {
        this.#abort.abort();
        this.#abort = new AbortController();
        this.#state = init(this, slides, this.#abort.signal);
      },
      this.#abort.signal,
    );
  }

  get count(): number {
    return this.#state?.slides.length ?? 0;
  }

  get index(): number {
    return this.#state?.index ?? 0;
  }

  get isPlaying(): boolean {
    return this.#state ? isPlaying(this.#state) : false;
  }

  getSlide(index: number): HTMLElement | null {
    return this.#state ? getSlide(this.#state, index) : null;
  }

  getCurrentSlide(): HTMLElement | null {
    return this.#state ? getCurrentSlide(this.#state) : null;
  }

  select(index: number): void {
    this.goTo(index);
  }

  goTo(index: number): void {
    if (this.#state) {
      goTo(this.#state, index);
    }
  }

  next(): void {
    if (this.#state) {
      goTo(this.#state, this.#state.index + 1);
    }
  }

  previous(): void {
    if (this.#state) {
      goTo(this.#state, this.#state.index - 1);
    }
  }

  play(): void {
    this.classList.add('k-carousel--autoscroll');
  }

  pause(): void {
    this.classList.remove('k-carousel--autoscroll');
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

defineElement('k-carousel', KCarousel);

declare global {
  interface HTMLElementTagNameMap {
    'k-carousel': KCarousel;
  }
}
