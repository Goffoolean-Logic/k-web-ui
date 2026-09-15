import { describe, expect, it } from 'vitest';
import { createGauge, setGauge } from './index.js';
import './index.js';

describe('createGauge', () => {
  it('builds a labelled progress bar', () => {
    const el = createGauge({ value: 64, max: 100, label: 'Upload' });
    expect(el.tagName).toBe('PROGRESS');
    expect(el.className).toBe('k-gauge');
    expect(el).toBeInstanceOf(HTMLProgressElement);
    const progress = el as HTMLProgressElement;
    expect(progress.value).toBe(64);
    expect(progress.max).toBe(100);
    expect(progress.style.getPropertyValue('--k-gauge')).toBe('64%');
    expect(progress.getAttribute('aria-label')).toBe('Upload');
    expect(progress.textContent).toBe('64%');
  });

  it('wraps a ring with a reading and caption', () => {
    const el = createGauge({
      value: 1024,
      max: 5000,
      ring: true,
      size: 'sm',
      variant: 'success',
      label: 'Requests',
    });
    expect(el.tagName).toBe('K-GAUGE');
    expect(el.classList.contains('k-gauge--ring')).toBe(true);
    expect(el.classList.contains('k-gauge-group')).toBe(true);
    const progress = el.querySelector('progress');
    expect(progress?.classList.contains('k-gauge')).toBe(true);
    expect(progress?.classList.contains('k-gauge--ring')).toBe(true);
    expect(progress?.classList.contains('k-gauge--sm')).toBe(true);
    expect(progress?.classList.contains('k-gauge--success')).toBe(true);
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
    expect(el).toBeInstanceOf(HTMLProgressElement);
    const progress = el as HTMLProgressElement;
    expect(progress.hasAttribute('value')).toBe(false);
    expect(progress.classList.contains('k-gauge--indeterminate')).toBe(false);
    expect(progress.style.getPropertyValue('--k-gauge')).toBe('0%');
  });

  it('opts into the empty-state animation', () => {
    const el = createGauge({
      ring: true,
      indeterminate: true,
      label: 'Syncing',
    });
    const progress = el.querySelector('progress');
    expect(progress?.classList.contains('k-gauge--indeterminate')).toBe(true);
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
    expect(el.classList.contains('k-gauge--ring')).toBe(true);
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
    const el = createGauge({ value: 10, max: 100 }) as HTMLProgressElement;
    setGauge(el, 150, 100);
    expect(el.value).toBe(100);
    expect(el.style.getPropertyValue('--k-gauge')).toBe('100%');
    expect(el.textContent).toBe('100%');
  });

  it('clears value when the next amount is omitted', () => {
    const el = createGauge({ value: 40, max: 100 }) as HTMLProgressElement;
    setGauge(el);
    expect(el.hasAttribute('value')).toBe(false);
    expect(el.style.getPropertyValue('--k-gauge')).toBe('0%');
  });

  it('updates the visible reading in a ring group', () => {
    const group = createGauge({
      value: 8,
      max: 100,
      ring: true,
      label: 'Done',
    });
    const progress = group.querySelector('progress');
    expect(progress).toBeInstanceOf(HTMLProgressElement);
    setGauge(progress as HTMLProgressElement, 12.5, 100, '12.5%');
    expect(group.querySelector('.k-gauge__value')?.textContent).toBe('12.5%');
  });
});
