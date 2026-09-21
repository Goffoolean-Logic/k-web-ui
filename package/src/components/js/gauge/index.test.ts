import { describe, expect, it } from 'vitest';
import { createGauge, type KGauge, setGauge } from './index.js';
import './index.js';

describe('createGauge', () => {
  it('builds a labelled frame from options', () => {
    const el = createGauge({
      value: 1024,
      max: 5000,
      size: 'sm',
      variant: 'success',
      label: 'Requests',
    });
    expect(el.tagName).toBe('K-GAUGE');
    expect(el.classList.contains('k-gauge--sm')).toBe(true);
    expect(el.classList.contains('k-gauge--success')).toBe(true);
    const progress = el.querySelector('progress');
    expect(progress?.style.getPropertyValue('--k-gauge')).toBe('20.48%');
    expect(el.querySelector('.k-gauge__label')?.textContent).toBe('Requests');
  });

  it('opts into the empty-state animation', () => {
    const el = createGauge({
      indeterminate: true,
      label: 'Syncing',
    });
    expect(el.classList.contains('k-gauge--indeterminate')).toBe(true);
    expect(el.querySelector('progress')?.hasAttribute('value')).toBe(false);
  });
});

describe('k-gauge', () => {
  it('writes the reading from options', () => {
    const el = document.createElement('k-gauge');
    el.id = 'docs-gauge';
    document.body.append(el);
    el.options = { value: 64, max: 100, label: 'Upload', format: '%' };
    expect(el.querySelector('.k-gauge__value')?.textContent).toBe('64%');
    expect(el.querySelector('.k-gauge__label')?.textContent).toBe('Upload');
    expect(
      el.querySelector('progress')?.style.getPropertyValue('--k-gauge'),
    ).toBe('64%');
    el.remove();
  });

  it('keeps the reading in step when value changes', () => {
    const el = document.createElement('k-gauge');
    document.body.append(el);
    el.options = { value: 10, max: 100, format: '%' };
    expect(el.querySelector('.k-gauge__value')?.textContent).toBe('10%');
    el.value = 80;
    expect(el.querySelector('.k-gauge__value')?.textContent).toBe('80%');
    el.remove();
  });
});

describe('setGauge', () => {
  it('clamps and rewrites the CSS variable', () => {
    const el = createGauge({ value: 10, max: 100 });
    setGauge(el, 150, 100);
    expect(el.querySelector('progress')?.value).toBe(100);
  });

  it('clears value when the next amount is omitted', () => {
    const el = createGauge({ value: 40, max: 100 });
    setGauge(el);
    expect(el.querySelector('progress')?.hasAttribute('value')).toBe(false);
  });
});

describe('k-gauge api', () => {
  function mounted(value?: number, max = 100): KGauge {
    const el = document.createElement('k-gauge');
    document.body.append(el);
    el.options = value === undefined ? { max } : { value, max };
    return el;
  }

  it('percent scales the value and clamps past the ends', () => {
    const el = mounted(64);
    expect(el.percent).toBe(64);
    el.value = 150;
    expect(el.percent).toBe(100);
    el.remove();
  });

  it('increment and decrement move the value', () => {
    const el = mounted(50);
    el.increment(10);
    expect(el.value).toBe(60);
    el.decrement(20);
    expect(el.value).toBe(40);
    el.remove();
  });

  it('complete fills the gauge and clear empties it', () => {
    const el = mounted(20);
    el.complete();
    expect(el.value).toBe(100);
    el.clear();
    expect(el.isEmpty).toBe(true);
    el.remove();
  });

  it('equal options do not rebuild', () => {
    const el = mounted(10);
    const progress = el.getProgress();
    el.options = { value: 10, max: 100 };
    expect(el.getProgress()).toBe(progress);
    el.remove();
  });
});
