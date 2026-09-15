import { describe, expect, it } from 'vitest';
import type { KCarousel } from './index.js';
import './index.js';

function host(): KCarousel {
  const el = document.createElement('k-carousel');
  el.id = 'shots';
  return el;
}

const items = [{ content: 'One' }, { content: 'Two' }, { content: 'Three' }];

describe('k-carousel', () => {
  it('builds slides, arrows, and dots', () => {
    const carousel = host();
    carousel.items = items;
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

  it('goTo updates the current dot', () => {
    const carousel = host();
    carousel.items = items;
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
    carousel.items = items;
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
});
