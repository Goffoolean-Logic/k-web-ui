import { describe, expect, it } from 'vitest';
import {
  applyGaugeAttributes,
  init,
  parseNumber,
  percentOf,
  setBooleanAttribute,
  stepValue,
} from './controller.js';

describe('parseNumber', () => {
  it('reads a number and rejects blanks or junk', () => {
    expect(parseNumber('64')).toBe(64);
    expect(parseNumber('0')).toBe(0);
    expect(parseNumber(null)).toBeUndefined();
    expect(parseNumber('')).toBeUndefined();
    expect(parseNumber('nope')).toBeUndefined();
  });
});

describe('setBooleanAttribute', () => {
  it('adds an empty attribute, then removes it', () => {
    const el = document.createElement('div');
    setBooleanAttribute(el, 'indeterminate', true);
    expect(el.getAttribute('indeterminate')).toBe('');
    setBooleanAttribute(el, 'indeterminate', false);
    expect(el.hasAttribute('indeterminate')).toBe(false);
  });
});

describe('applyGaugeAttributes', () => {
  it('writes every option that is set', () => {
    const el = document.createElement('div');
    applyGaugeAttributes(el, {
      value: 64,
      max: 100,
      label: 'Upload',
      text: '64 MB',
      size: 'lg',
      variant: 'success',
    });
    expect(el.getAttribute('value')).toBe('64');
    expect(el.getAttribute('max')).toBe('100');
    expect(el.getAttribute('label')).toBe('Upload');
    expect(el.getAttribute('text')).toBe('64 MB');
    expect(el.getAttribute('size')).toBe('lg');
    expect(el.getAttribute('variant')).toBe('success');
  });

  it('writes nothing for an empty bag', () => {
    const el = document.createElement('div');
    applyGaugeAttributes(el, {});
    expect(el.attributes).toHaveLength(0);
  });

  it('drops the value when the gauge is indeterminate', () => {
    const el = document.createElement('div');
    applyGaugeAttributes(el, { value: 64, indeterminate: true });
    expect(el.hasAttribute('value')).toBe(false);
    expect(el.getAttribute('indeterminate')).toBe('');
  });

  it('ignores a value that is not a number', () => {
    const el = document.createElement('div');
    applyGaugeAttributes(el, { value: Number.NaN });
    expect(el.hasAttribute('value')).toBe(false);
  });
});

describe('percentOf', () => {
  it('scales the value against max', () => {
    expect(percentOf(64, 100)).toBe(64);
    expect(percentOf(1, 4)).toBe(25);
  });

  it('clamps past either end', () => {
    expect(percentOf(150, 100)).toBe(100);
    expect(percentOf(-10, 100)).toBe(0);
  });

  it('reads an empty or unusable gauge as 0', () => {
    expect(percentOf(undefined, 100)).toBe(0);
    expect(percentOf(Number.NaN, 100)).toBe(0);
    expect(percentOf(10, 0)).toBe(0);
  });
});

describe('stepValue', () => {
  it('moves up and down from the current value', () => {
    expect(stepValue(10, 100, 5)).toBe(15);
    expect(stepValue(10, 100, -5)).toBe(5);
  });

  it('starts from 0 when the gauge is empty', () => {
    expect(stepValue(undefined, 100, 5)).toBe(5);
    expect(stepValue(undefined, 100, -5)).toBe(0);
  });

  it('holds inside 0 and max', () => {
    expect(stepValue(98, 100, 5)).toBe(100);
    expect(stepValue(2, 100, -5)).toBe(0);
  });
});

describe('init', () => {
  it('marks the host and paints the parts', () => {
    const el = document.createElement('k-gauge');
    el.setAttribute('value', '64');
    el.setAttribute('max', '100');
    el.setAttribute('label', 'Upload');
    document.body.append(el);

    init(el);

    expect(el.classList.contains('k-gauge')).toBe(true);
    expect(el.querySelector(':scope > progress')).toBeTruthy();
    expect(el.querySelector('.k-gauge__value')?.textContent).toBe('64');
    expect(el.querySelector('.k-gauge__label')?.textContent).toBe('Upload');
    el.remove();
  });
});
