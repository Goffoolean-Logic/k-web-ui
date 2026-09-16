import { defineElement } from '../root.js';
import {
  applyAttribute,
  getCurrentSlide,
  getSlide,
  goTo,
  init,
  insertAt,
  isPlaying,
  parseSlides,
  patchAt,
  removeAt,
  serializeSlides,
  setAutoscroll,
  toIndex,
} from './controller/controller.js';
import type { KCarouselSlide, KCarouselState } from './models/models.js';

export type { KCarouselOptions, KCarouselSlide } from './models/models.js';

/**
 * Carousel. The host is `<k-carousel class="k-carousel">`. `slides`, `loop`,
 * `autoscroll`, `index`, and `keyboard` are attributes. The element builds
 * the track, slides, and controls.
 *
 *   <k-carousel class="k-carousel" slides='[{"content":"One"}]'></k-carousel>
 */
export class KCarousel extends HTMLElement {
  #state: KCarouselState | null = null;
  #abort = new AbortController();
  #slides: KCarouselSlide[] | null = null;
  #reflecting = false;

  static get observedAttributes(): string[] {
    return ['index', 'loop', 'keyboard', 'autoscroll', 'slides'];
  }

  connectedCallback(): void {
    this.classList.add('k-carousel');
    this.#init();
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
    if (name === 'slides') {
      this.#slides = null;
    }
    if (!this.isConnected) {
      return;
    }
    if (name === 'slides') {
      this.#init();
      return;
    }
    if (this.#state) {
      applyAttribute(this.#state, name);
    }
  }

  #init(): void {
    const slides = this.slides;
    if (slides.length === 0) {
      return;
    }
    this.#abort.abort();
    this.#abort = new AbortController();
    this.#state = init(this, slides, this.#abort.signal);
  }

  /** Number of slides, readable before the element is connected. */
  get count(): number {
    return this.slides.length;
  }

  get slides(): KCarouselSlide[] {
    return this.#slides ?? parseSlides(this.getAttribute('slides'));
  }

  set slides(value: KCarouselSlide[]) {
    this.#slides = value;
    const json = serializeSlides(value);
    if (json !== null) {
      this.#reflecting = true;
      this.setAttribute('slides', json);
      this.#reflecting = false;
    }
    if (this.isConnected) {
      this.#init();
    }
  }

  get index(): number {
    return this.#state?.index ?? toIndex(this.getAttribute('index'));
  }

  /** True while autoscroll is on and nothing is hovering or focusing it. */
  get isPlaying(): boolean {
    return this.#state ? isPlaying(this.#state) : false;
  }

  getSlide(index: number): HTMLElement | null {
    return this.#state ? getSlide(this.#state, index) : null;
  }

  getCurrentSlide(): HTMLElement | null {
    return this.#state ? getCurrentSlide(this.#state) : null;
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

  first(): void {
    this.goTo(0);
  }

  last(): void {
    if (this.#state) {
      goTo(this.#state, this.#state.slides.length - 1);
    }
  }

  /** Starts autoscroll. Hovering or focusing still pauses it. */
  play(): void {
    if (this.#state) {
      setAutoscroll(this.#state, true);
    }
  }

  pause(): void {
    if (this.#state) {
      setAutoscroll(this.#state, false);
    }
  }

  addSlide(slide: KCarouselSlide, at?: number): void {
    this.slides = insertAt(this.slides, slide, at);
  }

  removeSlide(index: number): void {
    this.slides = removeAt(this.slides, index);
  }

  updateSlide(index: number, patch: Partial<KCarouselSlide>): void {
    this.slides = patchAt(this.slides, index, patch);
  }

  /** Rebuilds the subtree from the current slides. */
  refresh(): void {
    if (this.isConnected) {
      this.#init();
    }
  }

  disconnect(): void {
    this.#abort.abort();
  }
}

defineElement('k-carousel', KCarousel);

declare global {
  interface HTMLElementTagNameMap {
    'k-carousel': KCarousel;
  }
}
