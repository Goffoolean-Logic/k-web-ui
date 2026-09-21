import { describe, expect, it } from 'vitest';
import { applyProgress, fillPercent, paint } from './dom.js';

describe('fillPercent', () => {
  it('scales and clamps', () => {
    expect(fillPercent(64, 100)).toBe(64);
    expect(fillPercent(150, 100)).toBe(100);
    expect(fillPercent(-10, 100)).toBe(0);
  });
});

describe('applyProgress', () => {
  it('clamps the value and writes --k-gauge', () => {
    const host = document.createElement('div');
    const progress = document.createElement('progress');
    host.append(progress);
    applyProgress(host, progress, 150, 100);
    expect(progress.value).toBe(100);
    expect(progress.style.getPropertyValue('--k-gauge')).toBe('100%');
  });

  it('clears value when the amount is omitted', () => {
    const host = document.createElement('div');
    const progress = document.createElement('progress');
    host.append(progress);
    applyProgress(host, progress, undefined, 100);
    expect(progress.hasAttribute('value')).toBe(false);
    expect(progress.style.getPropertyValue('--k-gauge')).toBe('0%');
  });
});

describe('paint', () => {
  it('builds the ring frame, reading, and caption', () => {
    const host = document.createElement('div');
    host.id = 'upload';
    paint(host, { value: 64, max: 100, label: 'Upload', format: '%' });
    expect(host.querySelector('.k-gauge__frame')).toBeTruthy();
    expect(host.querySelectorAll('.k-gauge__seg')).toHaveLength(6);
    expect(host.querySelector('.k-gauge__value')?.textContent).toBe('64%');
    expect(host.querySelector('.k-gauge__label')?.textContent).toBe('Upload');
  });

  it('formats currency and plain numbers from value', () => {
    const host = document.createElement('div');
    paint(host, { value: 1024, max: 5000, format: '$' });
    expect(host.querySelector('.k-gauge__value')?.textContent).toBe('$1,024');

    paint(host, { value: 8, max: 100 });
    expect(host.querySelector('.k-gauge__value')?.textContent).toBe('8');
  });

  it('lets an explicit text override the format', () => {
    const host = document.createElement('div');
    paint(host, {
      value: 12400,
      max: 20000,
      format: '$',
      text: '12.4k',
    });
    expect(host.querySelector('.k-gauge__value')?.textContent).toBe('12.4k');
  });

  it('ignores blank text so format still drives the dial', () => {
    const host = document.createElement('div');
    paint(host, { value: 64, max: 100, format: '%', text: '' });
    expect(host.querySelector('.k-gauge__value')?.textContent).toBe('64%');
  });

  it('names the caption from the host id', () => {
    const host = document.createElement('div');
    host.id = 'upload';
    paint(host, { label: 'Upload' });
    expect(host.querySelector('.k-gauge__label')?.id).toBe('upload-label');
    expect(
      host.querySelector('progress')?.getAttribute('aria-labelledby'),
    ).toBe('upload-label');
  });
});
