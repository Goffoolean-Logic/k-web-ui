import { createIcon } from '../../icon.js';
import { fill } from '../../root.js';
import type { KCarouselOptions, KCarouselState } from '../models/models.js';

export function buildCarousel(
  root: HTMLElement,
  options: KCarouselOptions,
): Omit<KCarouselState, 'index' | 'loop' | 'keyboard'> {
  if (options.items.length === 0) {
    throw new Error('KCarousel: at least one item is required');
  }

  const viewport = document.createElement('div');
  viewport.className = 'k-carousel__viewport';

  const track = document.createElement('div');
  track.className = 'k-carousel__track';

  const slides: HTMLElement[] = [];
  for (const [i, item] of options.items.entries()) {
    const slide = document.createElement('div');
    slide.className = 'k-carousel__slide';
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} of ${options.items.length}`);
    fill(slide, item.content);
    slides.push(slide);
    track.append(slide);
  }

  viewport.append(track);

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'k-carousel__prev';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.append(createIcon('chevron-left', 'sm'));

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'k-carousel__next';
  next.setAttribute('aria-label', 'Next slide');
  next.append(createIcon('chevron-right', 'sm'));

  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'k-carousel__dots';
  const dots: HTMLButtonElement[] = [];
  for (let i = 0; i < options.items.length; i += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'k-carousel__dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dots.push(dot);
    dotsWrap.append(dot);
  }

  root.replaceChildren(viewport, prev, next, dotsWrap);
  return { root, track, slides, dots, prev, next };
}

export function paint(state: KCarouselState): void {
  state.track.style.transform = `translateX(-${state.index * 100}%)`;
  const last = state.slides.length - 1;
  state.prev.disabled = !state.loop && state.index === 0;
  state.next.disabled = !state.loop && state.index === last;
  for (const [i, dot] of state.dots.entries()) {
    if (i === state.index) {
      dot.setAttribute('aria-current', 'true');
    } else {
      dot.removeAttribute('aria-current');
    }
  }
}
