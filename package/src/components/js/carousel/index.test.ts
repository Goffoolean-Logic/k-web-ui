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

describe('k-carousel api', () => {
  function mounted(): KCarousel {
    const carousel = host();
    carousel.setAttribute('autoscroll', 'false');
    carousel.slides = slides;
    document.body.append(carousel);
    return carousel;
  }

  it('reports count with or without a connection', () => {
    const carousel = host();
    carousel.slides = slides;
    expect(carousel.count).toBe(3);
    document.body.append(carousel);
    expect(carousel.count).toBe(3);
    carousel.remove();
  });

  it('next and previous wrap when loop is on', () => {
    const carousel = mounted();
    carousel.next();
    expect(carousel.index).toBe(1);
    carousel.goTo(2);
    carousel.next();
    expect(carousel.index).toBe(0);
    carousel.previous();
    expect(carousel.index).toBe(2);
    carousel.remove();
  });

  it('next and previous clamp when loop is off', () => {
    const carousel = host();
    carousel.setAttribute('autoscroll', 'false');
    carousel.setAttribute('loop', 'false');
    carousel.slides = slides;
    document.body.append(carousel);

    carousel.previous();
    expect(carousel.index).toBe(0);
    carousel.goTo(2);
    carousel.next();
    expect(carousel.index).toBe(2);
    carousel.remove();
  });

  it('first and last jump to the ends', () => {
    const carousel = mounted();
    carousel.last();
    expect(carousel.index).toBe(2);
    carousel.first();
    expect(carousel.index).toBe(0);
    carousel.remove();
  });

  it('getSlide and getCurrentSlide hand back the live nodes', () => {
    const carousel = mounted();
    const rendered = carousel.querySelectorAll('.k-carousel__slide');
    expect(carousel.getSlide(1)).toBe(rendered[1]);
    expect(carousel.getCurrentSlide()).toBe(rendered[0]);
    carousel.goTo(2);
    expect(carousel.getCurrentSlide()).toBe(rendered[2]);
    expect(carousel.getSlide(9)).toBeNull();
    carousel.remove();
  });

  it('play and pause drive autoscroll', () => {
    vi.useFakeTimers();
    const carousel = mounted();
    expect(carousel.isPlaying).toBe(false);

    carousel.play();
    expect(carousel.isPlaying).toBe(true);
    vi.advanceTimersByTime(5000);
    expect(carousel.index).toBe(1);

    carousel.pause();
    expect(carousel.isPlaying).toBe(false);
    vi.advanceTimersByTime(20000);
    expect(carousel.index).toBe(1);

    carousel.remove();
    vi.useRealTimers();
  });

  it('addSlide appends or inserts, and renders it', () => {
    const carousel = mounted();
    carousel.addSlide({ content: 'Four' });
    expect(carousel.count).toBe(4);
    carousel.addSlide({ content: 'Zero' }, 0);
    expect(carousel.count).toBe(5);
    expect(carousel.querySelectorAll('.k-carousel__slide')).toHaveLength(5);
    expect(carousel.getSlide(0)?.textContent).toBe('Zero');
    carousel.remove();
  });

  it('removeSlide drops a slide and its dot', () => {
    const carousel = mounted();
    carousel.removeSlide(0);
    expect(carousel.count).toBe(2);
    expect(carousel.querySelectorAll('.k-carousel__dot')).toHaveLength(2);
    expect(carousel.getSlide(0)?.textContent).toBe('Two');
    carousel.remove();
  });

  it('updateSlide patches one slide', () => {
    const carousel = mounted();
    carousel.updateSlide(1, { content: 'Second' });
    expect(carousel.getSlide(1)?.textContent).toBe('Second');
    expect(carousel.getSlide(0)?.textContent).toBe('One');
    carousel.remove();
  });

  it('refresh rebuilds the subtree', () => {
    const carousel = mounted();
    const track = carousel.querySelector('.k-carousel__track');
    carousel.refresh();
    expect(carousel.querySelector('.k-carousel__track')).not.toBe(track);
    expect(carousel.querySelectorAll('.k-carousel__track')).toHaveLength(1);
    carousel.remove();
  });

  it('api calls are inert while disconnected', () => {
    const carousel = host();
    carousel.slides = slides;
    expect(() => {
      carousel.goTo(1);
      carousel.next();
      carousel.previous();
      carousel.first();
      carousel.last();
      carousel.play();
      carousel.pause();
      carousel.refresh();
    }).not.toThrow();
    expect(carousel.isPlaying).toBe(false);
    expect(carousel.getSlide(0)).toBeNull();
    expect(carousel.getCurrentSlide()).toBeNull();
  });
});
