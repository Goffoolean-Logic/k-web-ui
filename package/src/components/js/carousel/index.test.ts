import { describe, expect, it, vi } from 'vitest';
import type { KCarousel } from './index.js';
import './index.js';

function host(): KCarousel {
  const el = document.createElement('k-carousel');
  el.id = 'shots';
  return el;
}

const slides = [{ content: 'One' }, { content: 'Two' }, { content: 'Three' }];

describe('k-carousel', () => {
  it('builds slides, arrows, and dots from the slides attribute', () => {
    const carousel = host();
    carousel.setAttribute('slides', JSON.stringify(slides));
    document.body.append(carousel);
    expect(carousel.querySelector('.k-carousel__track')).toBeTruthy();
    expect(carousel.querySelectorAll('.k-carousel__slide')).toHaveLength(3);
    expect(carousel.querySelectorAll('.k-carousel__dot')).toHaveLength(3);
    expect(carousel.querySelector('.k-carousel__prev')).toBeTruthy();
    expect(carousel.querySelector('.k-carousel__next')).toBeTruthy();
    expect(carousel.index).toBe(0);
    expect(
      carousel
        .querySelectorAll('.k-carousel__dot')[0]
        ?.getAttribute('aria-current'),
    ).toBe('true');
    carousel.remove();
  });

  it('writes an image when a slide has src', () => {
    const carousel = host();
    carousel.slides = [{ src: '/scenery.jpg', alt: 'Scenery' }];
    document.body.append(carousel);
    const img = carousel.querySelector('.k-carousel__slide > img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('/scenery.jpg');
    expect(img?.getAttribute('alt')).toBe('Scenery');
    carousel.remove();
  });

  it('goTo updates the current dot', () => {
    const carousel = host();
    carousel.slides = slides;
    document.body.append(carousel);
    carousel.goTo(2);
    expect(carousel.index).toBe(2);
    const dots = carousel.querySelectorAll('.k-carousel__dot');
    expect(dots[2]?.getAttribute('aria-current')).toBe('true');
    expect(dots[0]?.hasAttribute('aria-current')).toBe(false);
    carousel.remove();
  });

  it('disables end arrows when loop is false', () => {
    const carousel = host();
    carousel.setAttribute('loop', 'false');
    carousel.slides = slides;
    document.body.append(carousel);
    const prev = carousel.querySelector<HTMLButtonElement>('.k-carousel__prev');
    const next = carousel.querySelector<HTMLButtonElement>('.k-carousel__next');
    expect(prev?.disabled).toBe(true);
    expect(next?.disabled).toBe(false);
    carousel.goTo(2);
    expect(prev?.disabled).toBe(false);
    expect(next?.disabled).toBe(true);
    carousel.remove();
  });

  it('keeps the track and slide nodes when index changes', () => {
    const carousel = host();
    carousel.slides = slides;
    document.body.append(carousel);
    const track = carousel.querySelector('.k-carousel__track');
    const first = carousel.querySelector('.k-carousel__slide');
    const onChange = vi.fn();
    carousel.addEventListener('k-change', onChange);

    carousel.setAttribute('index', '2');

    expect(carousel.querySelector('.k-carousel__track')).toBe(track);
    expect(carousel.querySelector('.k-carousel__slide')).toBe(first);
    expect(carousel.index).toBe(2);
    expect(onChange).not.toHaveBeenCalled();
    carousel.remove();
  });

  it('re-disables the arrows when loop changes', () => {
    const carousel = host();
    carousel.slides = slides;
    document.body.append(carousel);
    const prev = carousel.querySelector<HTMLButtonElement>('.k-carousel__prev');
    expect(prev?.disabled).toBe(false);

    carousel.setAttribute('loop', 'false');
    expect(carousel.querySelector('.k-carousel__prev')).toBe(prev);
    expect(prev?.disabled).toBe(true);
    carousel.remove();
  });

  it('advances on autoscroll unless it is off', () => {
    vi.useFakeTimers();
    const on = host();
    on.slides = slides;
    document.body.append(on);
    vi.advanceTimersByTime(5000);
    expect(on.index).toBe(1);
    on.remove();

    const off = host();
    off.setAttribute('autoscroll', 'false');
    off.slides = slides;
    document.body.append(off);
    vi.advanceTimersByTime(20000);
    expect(off.index).toBe(0);
    off.remove();
    vi.useRealTimers();
  });
});
