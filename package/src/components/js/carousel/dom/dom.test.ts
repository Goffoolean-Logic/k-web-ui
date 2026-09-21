import { describe, expect, it } from 'vitest';
import { bindTrack, buildControls, paint } from './dom.js';
import type { KCarouselState } from '../models/models.js';

describe('bindTrack', () => {
  it('throws when items is empty', () => {
    expect(() => bindTrack([])).toThrow(
      'KCarousel: at least one slide is required',
    );
  });

  it('marks the parent as the track without moving slides', () => {
    const parent = document.createElement('div');
    const a = document.createElement('div');
    a.id = 'deals-0';
    const b = document.createElement('div');
    b.id = 'deals-1';
    parent.append(a, b);
    document.body.append(parent);
    const track = bindTrack([a, b]);
    expect(track).toBe(parent);
    expect(parent.classList.contains('k-carousel__track')).toBe(true);
    expect(a.parentElement).toBe(parent);
    expect(a.classList.contains('k-carousel__slide')).toBe(true);
    parent.remove();
  });
});

describe('paint', () => {
  it('shifts via css variable and marks the current dot', () => {
    const parent = document.createElement('div');
    const slides = [0, 1].map((i) => {
      const el = document.createElement('div');
      el.id = `deals-${i}`;
      return el;
    });
    parent.append(...slides);
    const root = document.createElement('div');
    document.body.append(parent, root);
    const track = bindTrack(slides);
    const controls = buildControls(root, 2);
    const state: KCarouselState = {
      root,
      track,
      slides,
      ...controls,
      index: 1,
      loop: true,
      keyboard: true,
      autoscroll: false,
    };
    paint(state);
    expect(track.style.getPropertyValue('--k-carousel-index')).toBe('1');
    expect(slides[1]?.getAttribute('aria-hidden')).toBe('false');
    expect(controls.dots[1]?.getAttribute('aria-current')).toBe('true');
    root.remove();
    parent.remove();
  });

  it('disables end arrows when loop is off', () => {
    const parent = document.createElement('div');
    const slides = [0, 1].map((i) => {
      const el = document.createElement('div');
      el.id = `deals-${i}`;
      return el;
    });
    parent.append(...slides);
    const root = document.createElement('div');
    document.body.append(parent, root);
    const track = bindTrack(slides);
    const controls = buildControls(root, 2);
    const state: KCarouselState = {
      root,
      track,
      slides,
      ...controls,
      index: 0,
      loop: false,
      keyboard: true,
      autoscroll: false,
    };
    paint(state);
    expect(controls.prev.disabled).toBe(true);
    expect(controls.next.disabled).toBe(false);
    root.remove();
    parent.remove();
  });
});
