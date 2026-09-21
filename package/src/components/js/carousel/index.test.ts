import { describe, expect, it, vi } from 'vitest';
import type { KCarousel } from './index.js';
import './index.js';

function mount(id = 'deals'): {
  carousel: KCarousel;
  slides: HTMLElement[];
  trackParent: HTMLElement;
} {
  const trackParent = document.createElement('div');
  const slides = [0, 1, 2].map((i) => {
    const el = document.createElement('div');
    el.id = `${id}-${i}`;
    el.textContent = `Slide ${i}`;
    return el;
  });
  trackParent.append(...slides);
  const carousel = document.createElement('k-carousel') as KCarousel;
  carousel.id = id;
  document.body.append(trackParent, carousel);
  return { carousel, slides, trackParent };
}

describe('k-carousel', () => {
  it('uses an external track and builds controls', () => {
    const { carousel, trackParent, slides } = mount();
    expect(trackParent.classList.contains('k-carousel__track')).toBe(true);
    expect(trackParent.querySelectorAll('.k-carousel__slide')).toHaveLength(3);
    expect(carousel.querySelectorAll('.k-carousel__dot')).toHaveLength(3);
    expect(slides[0]?.getAttribute('aria-hidden')).toBe('false');
    carousel.remove();
    trackParent.remove();
  });

  it('throws when the track parent has extra children', () => {
    const extra = document.createElement('p');
    extra.textContent = 'nope';
    const a = document.createElement('div');
    a.id = 'bad-0';
    const wrap = document.createElement('div');
    wrap.append(a, extra);
    const carousel = document.createElement('k-carousel') as KCarousel;
    carousel.id = 'bad';
    expect(() => document.body.append(wrap, carousel)).toThrow(
      'KCarousel: slides must sit alone in their track parent',
    );
    wrap.remove();
    carousel.remove();
  });

  it('goTo updates the current dot and emits index', () => {
    const { carousel, trackParent } = mount();
    const onChange = vi.fn();
    carousel.addEventListener('k-change', onChange);
    carousel.select(2);
    expect(carousel.index).toBe(2);
    expect(
      carousel
        .querySelectorAll('.k-carousel__dot')[2]
        ?.getAttribute('aria-current'),
    ).toBe('true');
    expect(onChange.mock.calls[0]?.[0].detail).toEqual({ index: 2 });
    carousel.remove();
    trackParent.remove();
  });
});
