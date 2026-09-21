import { createIcon } from '../../icon.js';
import type { KCarouselState } from '../models/models.js';

/**
 * Slides stay where they are. Their parent becomes the track (flex + overflow).
 * Transform is applied via `--k-carousel-index` on each slide.
 */
export function bindTrack(slides: HTMLElement[]): HTMLElement {
  if (slides.length === 0) {
    throw new Error('KCarousel: at least one slide is required');
  }
  const parent = slides[0]?.parentElement;
  if (!parent) {
    throw new Error('KCarousel: slides need a parent');
  }
  const children = [...parent.children];
  if (
    children.length !== slides.length ||
    children.some((child, i) => child !== slides[i])
  ) {
    throw new Error('KCarousel: slides must sit alone in their track parent');
  }

  parent.classList.add('k-carousel__track');
  for (const [i, slide] of slides.entries()) {
    slide.classList.add('k-carousel__slide');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
  }
  return parent;
}

export function buildControls(
  root: HTMLElement,
  count: number,
): Pick<KCarouselState, 'prev' | 'next' | 'dots'> {
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
  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'k-carousel__dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dots.push(dot);
    dotsWrap.append(dot);
  }

  root.replaceChildren(prev, next, dotsWrap);
  return { prev, next, dots };
}

export function paint(state: KCarouselState): void {
  state.track.style.setProperty('--k-carousel-index', String(state.index));
  const last = state.slides.length - 1;
  state.prev.disabled = !state.loop && state.index === 0;
  state.next.disabled = !state.loop && state.index === last;
  for (const [i, slide] of state.slides.entries()) {
    const off = i !== state.index;
    slide.setAttribute('aria-hidden', String(off));
    if (off) {
      slide.setAttribute('inert', '');
    } else {
      slide.removeAttribute('inert');
    }
  }
  for (const [i, dot] of state.dots.entries()) {
    if (i === state.index) {
      dot.setAttribute('aria-current', 'true');
    } else {
      dot.removeAttribute('aria-current');
    }
  }
}
