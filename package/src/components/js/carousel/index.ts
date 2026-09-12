import { buildCarousel } from './dom.js';
import { bindEvents, goTo } from './events.js';
import { bindKeybinds } from './keybinds.js';
import type { KCarouselOptions, KCarouselState } from './models.js';
import { resolveRoot } from '../root.js';

export type { KCarouselItem, KCarouselOptions } from './models.js';

const instances = new WeakMap<HTMLElement, KCarousel>();

/**
 * Carousel. Markup is a host with an id and `.k-carousel`. This class builds
 * the track, slides, and controls from `items`.
 *
 *   <div id="shots" class="k-carousel"></div>
 *   KCarousel.mount('shots', { items: [{ content: 'One' }] });
 */
export class KCarousel {
  readonly #state: KCarouselState;
  readonly #abort = new AbortController();

  static mount(target: string | HTMLElement, options: KCarouselOptions): KCarousel {
    const root = resolveRoot(target, 'KCarousel');
    const existing = instances.get(root);
    if (existing && root.querySelector('.k-carousel__track')) {
      return existing;
    }
    existing?.disconnect();
    return new KCarousel(root, options);
  }

  constructor(target: string | HTMLElement, options: KCarouselOptions) {
    const root = resolveRoot(target, 'KCarousel');
    const parts = buildCarousel(root, options);
    this.#state = {
      ...parts,
      index: options.index ?? 0,
      loop: options.loop ?? true,
      keyboard: options.keyboard ?? true,
    };
    instances.set(root, this);
    root.classList.add('k-carousel');
    root.setAttribute('aria-roledescription', 'carousel');
    root.tabIndex = 0;
    bindEvents(this.#state, this.#abort.signal);
    bindKeybinds(this.#state, this.#abort.signal);
    goTo(this.#state, this.#state.index);
  }

  disconnect(): void {
    this.#abort.abort();
  }

  get root(): HTMLElement {
    return this.#state.root;
  }

  get index(): number {
    return this.#state.index;
  }

  goTo(index: number): void {
    goTo(this.#state, index);
  }
}
