import { defineElement } from '../root.js';
import { buildCarousel } from './dom/dom.js';
import { bindEvents, goTo } from './events/events.js';
import { bindKeybinds } from './keybinds/keybinds.js';
import type { KCarouselItem, KCarouselState } from './models/models.js';

export type { KCarouselItem, KCarouselOptions } from './models/models.js';

/**
 * Carousel. The host is `<k-carousel class="k-carousel">`. Set `items` and
 * the element builds the track, slides, and controls. `loop`, `index`, and
 * `keyboard` are attributes.
 *
 *   <k-carousel id="shots" class="k-carousel"></k-carousel>
 *   document.getElementById('shots').items = [{ content: 'One' }];
 */
export class KCarousel extends HTMLElement {
  #state: KCarouselState | null = null;
  #abort = new AbortController();
  #items: KCarouselItem[] = [];

  static get observedAttributes(): string[] {
    return ['index', 'loop', 'keyboard'];
  }

  connectedCallback(): void {
    this.classList.add('k-carousel');
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

  get items(): KCarouselItem[] {
    return this.#items;
  }

  set items(value: KCarouselItem[]) {
    this.#items = value;
    if (this.isConnected) {
      this.#connect();
    }
  }

  get index(): number {
    return this.#state?.index ?? Number(this.getAttribute('index') ?? 0);
  }

  goTo(index: number): void {
    if (!this.#state) {
      return;
    }
    goTo(this.#state, index);
  }

  #connect(): void {
    if (this.#items.length === 0) {
      return;
    }

    this.#abort.abort();
    this.#abort = new AbortController();
    const index = Number(this.getAttribute('index') ?? 0);
    const parts = buildCarousel(this, { items: this.#items });
    this.#state = {
      ...parts,
      index: Number.isFinite(index) ? index : 0,
      loop: this.getAttribute('loop') !== 'false',
      keyboard: this.getAttribute('keyboard') !== 'false',
    };
    this.setAttribute('aria-roledescription', 'carousel');
    this.tabIndex = 0;
    bindEvents(this.#state, this.#abort.signal);
    bindKeybinds(this.#state, this.#abort.signal);
    goTo(this.#state, this.#state.index, { emit: false });
  }
}

defineElement('k-carousel', KCarousel);

declare global {
  interface HTMLElementTagNameMap {
    'k-carousel': KCarousel;
  }
}
