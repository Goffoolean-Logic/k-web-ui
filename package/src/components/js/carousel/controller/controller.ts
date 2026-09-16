import { parseJsonList } from '../../root.js';
import { buildCarousel } from '../dom/dom.js';
import { bindEvents, goTo, setAutoscroll, setLoop } from '../events/events.js';
import { bindKeybinds } from '../keybinds/keybinds.js';
import type { KCarouselSlide, KCarouselState } from '../models/models.js';

/** Re-exported so `index.ts` only ever reaches for the controller. */
export { insertAt, patchAt, removeAt } from '../../root.js';
export { goTo, setAutoscroll, setLoop } from '../events/events.js';

// --- attributes ---

export function toIndex(raw: string | null): number {
  const value = Number(raw ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function isNode(value: unknown): value is Node {
  return value instanceof Node;
}

export function parseSlides(raw: string | null): KCarouselSlide[] {
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

export function serializeSlides(slides: KCarouselSlide[]): string | null {
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

/** A slide entry becomes an `<img>` when it carries a src, else raw content. */
export function resolveSlide(slide: KCarouselSlide): string | Node {
  if (slide.src) {
    const img = document.createElement('img');
    img.src = slide.src;
    img.alt = slide.alt ?? '';
    return img;
  }
  return slide.content ?? '';
}

// --- reading the current slide ---

export function getSlide(
  state: KCarouselState,
  index: number,
): HTMLElement | null {
  return state.slides[index] ?? null;
}

export function getCurrentSlide(state: KCarouselState): HTMLElement | null {
  return getSlide(state, state.index);
}

/** True when autoscroll is on and nothing is hovering or focusing the host. */
export function isPlaying(state: KCarouselState): boolean {
  return state.autoscroll && !state.autoscrollPaused;
}

// --- lifecycle ---

/** Builds the subtree, binds listeners, and lands on the starting slide. */
export function init(
  root: HTMLElement,
  slides: KCarouselSlide[],
  signal: AbortSignal,
): KCarouselState {
  const parts = buildCarousel(root, {
    items: slides.map((slide) => ({ content: resolveSlide(slide) })),
  });
  const state: KCarouselState = {
    ...parts,
    index: toIndex(root.getAttribute('index')),
    loop: root.getAttribute('loop') !== 'false',
    keyboard: root.getAttribute('keyboard') !== 'false',
    autoscroll: root.getAttribute('autoscroll') !== 'false',
  };

  root.setAttribute('aria-roledescription', 'carousel');
  root.tabIndex = 0;
  bindEvents(state, signal);
  bindKeybinds(state, signal);
  goTo(state, state.index, { emit: false });
  return state;
}

/** Patches a live subtree in place so the track and timers survive. */
export function applyAttribute(state: KCarouselState, name: string): void {
  const root = state.root;
  switch (name) {
    case 'index':
      goTo(state, toIndex(root.getAttribute('index')), { emit: false });
      break;
    case 'loop':
      setLoop(state, root.getAttribute('loop') !== 'false');
      break;
    case 'autoscroll':
      setAutoscroll(state, root.getAttribute('autoscroll') !== 'false');
      break;
    case 'keyboard':
      state.keyboard = root.getAttribute('keyboard') !== 'false';
      break;
  }
}
