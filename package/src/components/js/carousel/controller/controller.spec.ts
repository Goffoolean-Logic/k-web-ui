import { describe, expect, it, vi } from 'vitest';
import type { KCarouselState } from '../models/models.js';
import {
  applyAttribute,
  getCurrentSlide,
  getSlide,
  init,
  isPlaying,
  parseSlides,
  resolveSlide,
  serializeSlides,
  toIndex,
} from './controller.js';

function mount(
  count: number,
  attrs: Record<string, string> = {},
): { state: KCarouselState; abort: AbortController; root: HTMLElement } {
  const root = document.createElement('div');
  for (const [name, value] of Object.entries(attrs)) {
    root.setAttribute(name, value);
  }
  document.body.append(root);
  const abort = new AbortController();
  const slides = Array.from({ length: count }, (_, i) => ({
    content: `Slide ${i}`,
  }));
  const state = init(root, slides, abort.signal);
  return { state, abort, root };
}

describe('toIndex', () => {
  it('defaults to 0 and rejects junk', () => {
    expect(toIndex(null)).toBe(0);
    expect(toIndex('2')).toBe(2);
    expect(toIndex('nope')).toBe(0);
  });
});

describe('parseSlides', () => {
  it('reads src, alt, and content', () => {
    expect(
      parseSlides(
        JSON.stringify([{ src: '/a.png', alt: 'A' }, { content: 'Two' }]),
      ),
    ).toEqual([{ src: '/a.png', alt: 'A' }, { content: 'Two' }]);
  });

  it('returns an empty list when the attribute is absent', () => {
    expect(parseSlides(null)).toEqual([]);
    expect(parseSlides('  ')).toEqual([]);
  });

  it('throws on invalid JSON, non-arrays, and non-object entries', () => {
    expect(() => parseSlides('{oops')).toThrow('KCarousel: invalid JSON');
    expect(() => parseSlides('{"a":1}')).toThrow(
      'KCarousel: expected a JSON array',
    );
    expect(() => parseSlides('["nope"]')).toThrow(
      'KCarousel: each slide is an object',
    );
  });
});

describe('serializeSlides', () => {
  it('round-trips plain string slides', () => {
    expect(serializeSlides([{ src: '/a.png', alt: 'A' }])).toBe(
      JSON.stringify([{ src: '/a.png', alt: 'A' }]),
    );
  });

  it('bails out when a slide holds a node', () => {
    const node = document.createElement('strong');
    expect(serializeSlides([{ content: node }])).toBeNull();
  });

  it('drops empty src and alt', () => {
    expect(serializeSlides([{ content: 'One' }])).toBe(
      JSON.stringify([{ content: 'One' }]),
    );
  });
});

describe('resolveSlide', () => {
  it('builds an img when the slide carries a src', () => {
    const node = resolveSlide({ src: '/a.png', alt: 'A' });
    expect(node).toBeInstanceOf(HTMLImageElement);
    expect((node as HTMLImageElement).alt).toBe('A');
  });

  it('defaults alt to an empty string', () => {
    expect((resolveSlide({ src: '/a.png' }) as HTMLImageElement).alt).toBe('');
  });

  it('passes content straight through, empty when there is none', () => {
    expect(resolveSlide({ content: 'One' })).toBe('One');
    expect(resolveSlide({})).toBe('');
  });
});

describe('getSlide and getCurrentSlide', () => {
  it('hands back the live nodes, null past the end', () => {
    const { state, abort, root } = mount(3);
    expect(getSlide(state, 1)).toBe(state.slides[1]);
    expect(getSlide(state, 9)).toBeNull();
    expect(getCurrentSlide(state)).toBe(state.slides[0]);
    abort.abort();
    root.remove();
  });

  it('follows the index', () => {
    const { state, abort, root } = mount(3, { index: '2' });
    expect(getCurrentSlide(state)).toBe(state.slides[2]);
    abort.abort();
    root.remove();
  });
});

describe('isPlaying', () => {
  it('is true by default and false once autoscroll is off', () => {
    const { state, abort, root } = mount(3);
    expect(isPlaying(state)).toBe(true);
    state.autoscroll = false;
    expect(isPlaying(state)).toBe(false);
    abort.abort();
    root.remove();
  });

  it('is false while paused by hover or focus', () => {
    const { state, abort, root } = mount(3);
    state.autoscrollPaused = true;
    expect(isPlaying(state)).toBe(false);
    abort.abort();
    root.remove();
  });
});

describe('init', () => {
  it('builds the track, dots, and controls', () => {
    const { state, abort, root } = mount(3);
    expect(state.slides).toHaveLength(3);
    expect(state.dots).toHaveLength(3);
    expect(root.querySelector('.k-carousel__viewport')).toBeTruthy();
    expect(root.getAttribute('aria-roledescription')).toBe('carousel');
    expect(root.tabIndex).toBe(0);
    abort.abort();
    root.remove();
  });

  it('reads index, loop, keyboard, and autoscroll off the host', () => {
    const { state, abort, root } = mount(3, {
      index: '1',
      loop: 'false',
      keyboard: 'false',
      autoscroll: 'false',
    });
    expect(state.index).toBe(1);
    expect(state.loop).toBe(false);
    expect(state.keyboard).toBe(false);
    expect(state.autoscroll).toBe(false);
    abort.abort();
    root.remove();
  });

  it('defaults loop, keyboard, and autoscroll to on', () => {
    const { state, abort, root } = mount(3);
    expect(state.loop).toBe(true);
    expect(state.keyboard).toBe(true);
    expect(state.autoscroll).toBe(true);
    abort.abort();
    root.remove();
  });

  it('lands on the starting slide without emitting', () => {
    const root = document.createElement('div');
    root.setAttribute('index', '2');
    root.setAttribute('autoscroll', 'false');
    document.body.append(root);
    const onChange = vi.fn();
    root.addEventListener('k-change', onChange);
    const abort = new AbortController();
    const state = init(
      root,
      [{ content: 'A' }, { content: 'B' }, { content: 'C' }],
      abort.signal,
    );
    expect(state.index).toBe(2);
    expect(onChange).not.toHaveBeenCalled();
    abort.abort();
    root.remove();
  });

  it('binds the arrows and the dots', () => {
    const { state, abort, root } = mount(3, { autoscroll: 'false' });
    state.next.click();
    expect(state.index).toBe(1);
    state.prev.click();
    expect(state.index).toBe(0);
    state.dots[2]?.click();
    expect(state.index).toBe(2);
    abort.abort();
    root.remove();
  });

  it('binds keybinds', () => {
    const { state, abort, root } = mount(3, { autoscroll: 'false' });
    root.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(state.index).toBe(1);
    abort.abort();
    root.remove();
  });
});

describe('applyAttribute', () => {
  it('moves the index without emitting', () => {
    const { state, abort, root } = mount(3, { autoscroll: 'false' });
    const onChange = vi.fn();
    root.addEventListener('k-change', onChange);
    root.setAttribute('index', '2');
    applyAttribute(state, 'index');
    expect(state.index).toBe(2);
    expect(onChange).not.toHaveBeenCalled();
    abort.abort();
    root.remove();
  });

  it('toggles loop and repaints the arrows', () => {
    const { state, abort, root } = mount(3, { autoscroll: 'false' });
    root.setAttribute('loop', 'false');
    applyAttribute(state, 'loop');
    expect(state.loop).toBe(false);
    expect(state.prev.disabled).toBe(true);
    root.setAttribute('loop', 'true');
    applyAttribute(state, 'loop');
    expect(state.loop).toBe(true);
    expect(state.prev.disabled).toBe(false);
    abort.abort();
    root.remove();
  });

  it('toggles autoscroll', () => {
    const { state, abort, root } = mount(3, { autoscroll: 'false' });
    root.setAttribute('autoscroll', 'true');
    applyAttribute(state, 'autoscroll');
    expect(state.autoscroll).toBe(true);
    root.setAttribute('autoscroll', 'false');
    applyAttribute(state, 'autoscroll');
    expect(state.autoscroll).toBe(false);
    abort.abort();
    root.remove();
  });

  it('toggles keyboard, and ignores unknown names', () => {
    const { state, abort, root } = mount(3, { autoscroll: 'false' });
    root.setAttribute('keyboard', 'false');
    applyAttribute(state, 'keyboard');
    expect(state.keyboard).toBe(false);
    expect(() => applyAttribute(state, 'nope')).not.toThrow();
    abort.abort();
    root.remove();
  });
});
