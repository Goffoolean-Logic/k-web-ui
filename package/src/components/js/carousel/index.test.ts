import { describe, expect, it } from 'vitest';
import { KCarousel } from './index.js';

function host(): HTMLElement {
  const el = document.createElement('div');
  el.id = 'shots';
  document.body.append(el);
  return el;
}

const items = [{ content: 'One' }, { content: 'Two' }, { content: 'Three' }];

describe('KCarousel.mount', () => {
  it('builds slides, arrows, and dots', () => {
    const root = host();
    const carousel = KCarousel.mount(root, { items });
    expect(root.querySelector('.k-carousel__track')).toBeTruthy();
    expect(root.querySelectorAll('.k-carousel__slide')).toHaveLength(3);
    expect(root.querySelectorAll('.k-carousel__dot')).toHaveLength(3);
    expect(root.querySelector('.k-carousel__prev')).toBeTruthy();
    expect(root.querySelector('.k-carousel__next')).toBeTruthy();
    expect(carousel.index).toBe(0);
    expect(
      root
        .querySelectorAll('.k-carousel__dot')[0]
        ?.getAttribute('aria-current'),
    ).toBe('true');
    root.remove();
  });

  it('goTo updates the current dot', () => {
    const root = host();
    const carousel = KCarousel.mount(root, { items });
    carousel.goTo(2);
    expect(carousel.index).toBe(2);
    const dots = root.querySelectorAll('.k-carousel__dot');
    expect(dots[2]?.getAttribute('aria-current')).toBe('true');
    expect(dots[0]?.hasAttribute('aria-current')).toBe(false);
    root.remove();
  });

  it('disables end arrows when loop is false', () => {
    const root = host();
    const carousel = KCarousel.mount(root, { items, loop: false });
    const prev = root.querySelector<HTMLButtonElement>('.k-carousel__prev');
    const next = root.querySelector<HTMLButtonElement>('.k-carousel__next');
    expect(prev?.disabled).toBe(true);
    expect(next?.disabled).toBe(false);
    carousel.goTo(2);
    expect(prev?.disabled).toBe(false);
    expect(next?.disabled).toBe(true);
    root.remove();
  });
});
