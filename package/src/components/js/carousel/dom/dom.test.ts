import { describe, expect, it } from 'vitest';
import type { KCarouselState } from '../models/models.js';
import { buildCarousel, paint } from './dom.js';

const items = [{ content: 'One' }, { content: 'Two' }, { content: 'Three' }];

function built(root = document.createElement('div')) {
  document.body.append(root);
  return { root, parts: buildCarousel(root, { items }) };
}

describe('buildCarousel', () => {
  it('throws when items is empty', () => {
    const root = document.createElement('div');
    expect(() => buildCarousel(root, { items: [] })).toThrow(
      'KCarousel: at least one item is required',
    );
  });

  it('builds the track, slides, arrows, and dots', () => {
    const { root, parts } = built();
    expect(parts.slides).toHaveLength(3);
    expect(parts.dots).toHaveLength(3);
    expect(parts.track.className).toBe('k-carousel__track');
    expect(parts.slides[1]?.getAttribute('aria-label')).toBe('2 of 3');
    expect(parts.slides[0]?.textContent).toBe('One');
    expect(parts.prev.getAttribute('aria-label')).toBe('Previous slide');
    expect(parts.next.getAttribute('aria-label')).toBe('Next slide');
    expect(parts.dots[0]?.getAttribute('aria-label')).toBe('Go to slide 1');
    root.remove();
  });

  it('accepts a Node as slide content', () => {
    const root = document.createElement('div');
    const child = document.createElement('img');
    buildCarousel(root, { items: [{ content: child }] });
    expect(root.querySelector('.k-carousel__slide')?.firstElementChild).toBe(
      child,
    );
  });
});

describe('paint', () => {
  it('shifts the track and marks the current dot', () => {
    const { root, parts } = built();
    const state: KCarouselState = {
      ...parts,
      index: 1,
      loop: true,
      keyboard: true,
    };
    paint(state);
    expect(state.track.style.transform).toBe('translateX(-100%)');
    expect(state.dots[1]?.getAttribute('aria-current')).toBe('true');
    expect(state.dots[0]?.hasAttribute('aria-current')).toBe(false);
    expect(state.prev.disabled).toBe(false);
    expect(state.next.disabled).toBe(false);
    root.remove();
  });

  it('disables end arrows when loop is off', () => {
    const { root, parts } = built();
    const state: KCarouselState = {
      ...parts,
      index: 0,
      loop: false,
      keyboard: true,
    };
    paint(state);
    expect(state.prev.disabled).toBe(true);
    expect(state.next.disabled).toBe(false);
    state.index = 2;
    paint(state);
    expect(state.prev.disabled).toBe(false);
    expect(state.next.disabled).toBe(true);
    root.remove();
  });
});
