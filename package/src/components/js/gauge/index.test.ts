import { describe, expect, it } from 'vitest';
import { createGauge, type KGauge, setGauge } from './index.js';
import './index.js';

describe('createGauge', () => {
  it('builds a labelled frame with a reading and caption', () => {
    const el = createGauge({
      value: 1024,
      max: 5000,
      size: 'sm',
      variant: 'success',
      label: 'Requests',
    });
    expect(el.tagName).toBe('K-GAUGE');
    expect(el.className).toBe('k-gauge');
    expect(el.getAttribute('size')).toBe('sm');
    expect(el.getAttribute('variant')).toBe('success');
    const progress = el.querySelector('progress');
    expect(progress?.className).toBe('');
    expect(progress?.style.getPropertyValue('--k-gauge')).toBe('20.48%');
    expect(el.querySelector('.k-gauge__value')?.textContent).toBe(
      new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(
        1024,
      ),
    );
    const caption = el.querySelector('.k-gauge__label');
    expect(caption?.textContent).toBe('Requests');
    expect(progress?.getAttribute('aria-labelledby')).toBe(caption?.id);
    expect(el.querySelector('.k-gauge__frame')).toBeTruthy();
    expect(el.querySelectorAll('.k-gauge__seg')).toHaveLength(6);
  });

  it('keeps an empty gauge still until indeterminate is set', () => {
    const el = createGauge({ label: 'Upload' });
    expect(el.tagName).toBe('K-GAUGE');
    const progress = el.querySelector('progress');
    expect(progress?.hasAttribute('value')).toBe(false);
    expect(el.hasAttribute('indeterminate')).toBe(false);
    expect(progress?.style.getPropertyValue('--k-gauge')).toBe('0%');
  });

  it('opts into the empty-state animation', () => {
    const el = createGauge({
      indeterminate: true,
      label: 'Syncing',
    });
    const progress = el.querySelector('progress');
    expect(el.className).toBe('k-gauge');
    expect(el.hasAttribute('indeterminate')).toBe(true);
    expect(progress?.hasAttribute('value')).toBe(false);
    expect(el.querySelector('.k-gauge__label')?.textContent).toBe('Syncing');
  });
});

describe('k-gauge', () => {
  it('writes the reading and caption from attributes', () => {
    const el = document.createElement('k-gauge');
    el.id = 'docs-gauge';
    el.className = 'k-gauge';
    el.setAttribute('value', '64');
    el.setAttribute('max', '100');
    el.setAttribute('label', 'Upload');
    el.setAttribute('text', '64%');
    document.body.append(el);
    expect(el.querySelector('.k-gauge__value')?.textContent).toBe('64%');
    expect(el.className).toBe('k-gauge');
    expect(el.querySelector('.k-gauge__label')?.textContent).toBe('Upload');
    expect(el.querySelector('.k-gauge__label')?.id).toBe('docs-gauge-label');
    expect(
      el.querySelector('progress')?.style.getPropertyValue('--k-gauge'),
    ).toBe('64%');
    el.remove();
  });
});

describe('setGauge', () => {
  it('clamps and rewrites the CSS variable', () => {
    const el = createGauge({ value: 10, max: 100 });
    setGauge(el, 150, 100);
    const progress = el.querySelector('progress');
    expect(progress).toBeInstanceOf(HTMLProgressElement);
    expect((progress as HTMLProgressElement).value).toBe(100);
    expect(progress?.style.getPropertyValue('--k-gauge')).toBe('100%');
    expect(el.querySelector('.k-gauge__value')?.textContent).toBe(
      new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(
        100,
      ),
    );
  });

  it('clears value when the next amount is omitted', () => {
    const el = createGauge({ value: 40, max: 100 });
    setGauge(el);
    const progress = el.querySelector('progress');
    expect(progress?.hasAttribute('value')).toBe(false);
    expect(progress?.style.getPropertyValue('--k-gauge')).toBe('0%');
  });

  it('updates the visible reading', () => {
    const el = createGauge({
      value: 8,
      max: 100,
      label: 'Done',
    });
    setGauge(el, 12.5, 100, '12.5%');
    expect(el.querySelector('.k-gauge__value')?.textContent).toBe('12.5%');
  });
});

describe('k-gauge api', () => {
  function mounted(value?: number, max = 100): KGauge {
    const el = document.createElement('k-gauge');
    el.setAttribute('max', String(max));
    if (value !== undefined) {
      el.setAttribute('value', String(value));
    }
    document.body.append(el);
    return el;
  }

  it('percent scales the value and clamps past the ends', () => {
    const el = mounted(64);
    expect(el.percent).toBe(64);
    el.value = 150;
    expect(el.percent).toBe(100);
    el.value = -10;
    expect(el.percent).toBe(0);
    el.remove();
  });

  it('percent is 0 for an empty gauge', () => {
    const el = mounted();
    expect(el.percent).toBe(0);
    expect(el.isEmpty).toBe(true);
    el.remove();
  });

  it('isComplete flips at max', () => {
    const el = mounted(99);
    expect(el.isComplete).toBe(false);
    el.value = 100;
    expect(el.isComplete).toBe(true);
    el.remove();
  });

  it('increment and decrement move the value and repaint', () => {
    const el = mounted(50);
    el.increment(10);
    expect(el.value).toBe(60);
    expect(el.querySelector('progress')?.value).toBe(60);
    el.decrement(20);
    expect(el.value).toBe(40);
    el.remove();
  });

  it('increment defaults to one step and starts from empty', () => {
    const el = mounted();
    el.increment();
    expect(el.value).toBe(1);
    el.remove();
  });

  it('increment and decrement stop at the ends', () => {
    const el = mounted(98);
    el.increment(10);
    expect(el.value).toBe(100);
    el.decrement(500);
    expect(el.value).toBe(0);
    el.remove();
  });

  it('complete fills the gauge and clear empties it', () => {
    const el = mounted(20);
    el.complete();
    expect(el.value).toBe(100);
    expect(el.percent).toBe(100);
    el.clear();
    expect(el.value).toBeUndefined();
    expect(el.isEmpty).toBe(true);
    expect(el.querySelector('progress')?.hasAttribute('value')).toBe(false);
    el.remove();
  });

  it('getProgress hands back the inner progress', () => {
    const el = mounted(64);
    expect(el.getProgress()).toBe(el.querySelector('progress'));
    expect(el.getProgress()?.value).toBe(64);
    el.remove();
  });

  it('refresh rewrites the parts from the attributes', () => {
    const el = mounted(64);
    el.querySelector('.k-gauge__value')?.remove();
    el.refresh();
    expect(el.querySelector('.k-gauge__value')?.textContent).toBe('64');
    el.remove();
  });

  it('works on a gauge that was never connected', () => {
    const el = createGauge({ value: 10, max: 100 });
    el.increment(5);
    expect(el.value).toBe(15);
    expect(el.percent).toBe(15);
    expect(el.getProgress()).toBeTruthy();
  });
});
