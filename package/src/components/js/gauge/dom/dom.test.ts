import { describe, expect, it } from 'vitest';
import { applyProgress, classNames, paint } from './dom.js';

describe('classNames', () => {
  it('adds size and variant modifiers', () => {
    expect(classNames({ ring: true, size: 'sm', variant: 'success' })).toBe(
      'k-gauge k-gauge--sm k-gauge--success',
    );
  });
});

describe('applyProgress', () => {
  it('clamps the value and writes --k-gauge', () => {
    const el = document.createElement('progress');
    applyProgress(el, 150, 100);
    expect(el.value).toBe(100);
    expect(el.style.getPropertyValue('--k-gauge')).toBe('100%');
  });

  it('clears value when the amount is omitted', () => {
    const el = document.createElement('progress');
    applyProgress(el, 40, 100);
    applyProgress(el, undefined, 100);
    expect(el.hasAttribute('value')).toBe(false);
    expect(el.style.getPropertyValue('--k-gauge')).toBe('0%');
  });
});

describe('paint', () => {
  it('builds the ring frame, reading, and caption', () => {
    const host = document.createElement('div');
    host.className = 'k-gauge k-gauge--ring';
    host.setAttribute('value', '64');
    host.setAttribute('max', '100');
    host.setAttribute('label', 'Upload');
    host.setAttribute('text', '64%');
    paint(host);
    expect(host.classList.contains('k-gauge-group')).toBe(true);
    expect(host.querySelector('.k-gauge__frame')).toBeTruthy();
    expect(host.querySelectorAll('.k-gauge__seg')).toHaveLength(6);
    expect(host.querySelector('.k-gauge__value')?.textContent).toBe('64%');
    expect(host.querySelector('.k-gauge__label')?.textContent).toBe('Upload');
    const progress = host.querySelector('progress');
    expect(progress?.style.getPropertyValue('--k-gauge')).toBe('64%');
    expect(progress?.getAttribute('aria-labelledby')).toBe(
      host.querySelector('.k-gauge__label')?.id,
    );
  });

  it('names the caption from the host id', () => {
    const host = document.createElement('k-gauge');
    host.id = 'upload';
    host.className = 'k-gauge';
    host.setAttribute('label', 'Upload');
    paint(host);
    expect(host.querySelector('.k-gauge__label')?.id).toBe('upload-label');
    expect(
      host.querySelector('progress')?.getAttribute('aria-labelledby'),
    ).toBe('upload-label');
  });

  it('treats k-gauge as a ring without --ring in the markup', () => {
    const host = document.createElement('k-gauge');
    host.className = 'k-gauge';
    host.setAttribute('value', '64');
    host.setAttribute('max', '100');
    host.setAttribute('label', 'Upload');
    paint(host);
    expect(host.classList.contains('k-gauge--ring')).toBe(true);
    expect(host.classList.contains('k-gauge-group')).toBe(true);
    expect(host.querySelector('.k-gauge__frame')).toBeTruthy();
    expect(host.querySelector('.k-gauge__label')?.textContent).toBe('Upload');
  });
});
