import { defineElement, parseJsonList } from '../root.js';
import { buildCarousel } from './dom/dom.js';
import { bindEvents, goTo, setAutoscroll, setLoop } from './events/events.js';
import { bindKeybinds } from './keybinds/keybinds.js';
import type { KCarouselSlide, KCarouselState } from './models/models.js';

export type { KCarouselOptions, KCarouselSlide } from './models/models.js';

function isNode(value: unknown): value is Node {
  return value instanceof Node;
}

function toIndex(raw: string | null): number {
  const value = Number(raw ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function parseSlides(raw: string | null): KCarouselSlide[] {
  const list = parseJsonList(raw, 'KCarousel');
  const slides: KCarouselSlide[] = [];
  for (const entry of list) {
    if (!entry || typeof entry !== 'object') {
      throw new Error('KCarousel: each slide is an object');
    }
    const rec = entry as { src?: unknown; alt?: unknown; content?: unknown };
    const slide: KCarouselSlide = {};
    if (typeof rec.src === 'string') {
      slide.src = rec.src;
    }
    if (typeof rec.alt === 'string') {
      slide.alt = rec.alt;
    }
    if (typeof rec.content === 'string') {
      slide.content = rec.content;
    }
    slides.push(slide);
  }
  return slides;
}

function serializeSlides(slides: KCarouselSlide[]): string | null {
  const json: Array<Record<string, string>> = [];
  for (const slide of slides) {
    if (isNode(slide.content)) {
      return null;
    }
    const entry: Record<string, string> = {};
    if (slide.src) {
      entry.src = slide.src;
    }
    if (slide.alt) {
      entry.alt = slide.alt;
    }
    if (typeof slide.content === 'string') {
      entry.content = slide.content;
    }
    json.push(entry);
  }
  return JSON.stringify(json);
}

function resolveSlide(slide: KCarouselSlide): string | Node {
  if (slide.src) {
    const img = document.createElement('img');
    img.src = slide.src;
    img.alt = slide.alt ?? '';
    return img;
  }
  return slide.content ?? '';
}

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
    this.#connect();
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
      this.#connect();
      return;
    }

    const state = this.#state;
    if (!state) {
      return;
    }
    switch (name) {
      case 'index':
        goTo(state, toIndex(this.getAttribute('index')), { emit: false });
        break;
      case 'loop':
        setLoop(state, this.getAttribute('loop') !== 'false');
        break;
      case 'autoscroll':
        setAutoscroll(state, this.getAttribute('autoscroll') !== 'false');
        break;
      case 'keyboard':
        state.keyboard = this.getAttribute('keyboard') !== 'false';
        break;
    }
  }

  disconnect(): void {
    this.#abort.abort();
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
    const slides = this.slides;
    if (slides.length === 0) {
      return;
    }

    this.#abort.abort();
    this.#abort = new AbortController();
    const parts = buildCarousel(this, {
      items: slides.map((slide) => ({ content: resolveSlide(slide) })),
    });
    this.#state = {
      ...parts,
      index: toIndex(this.getAttribute('index')),
      loop: this.getAttribute('loop') !== 'false',
      keyboard: this.getAttribute('keyboard') !== 'false',
      autoscroll: this.getAttribute('autoscroll') !== 'false',
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
