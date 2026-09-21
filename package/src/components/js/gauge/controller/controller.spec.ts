import { describe, expect, it } from 'vitest';
import { percentOf, stepValue } from './controller.js';

describe('percentOf', () => {
  it('scales the value against max', () => {
    expect(percentOf(64, 100)).toBe(64);
    expect(percentOf(1, 4)).toBe(25);
  });

  it('clamps past either end', () => {
    expect(percentOf(150, 100)).toBe(100);
    expect(percentOf(-10, 100)).toBe(0);
  });

  it('is 0 for an empty gauge', () => {
    expect(percentOf(undefined, 100)).toBe(0);
  });
});

describe('stepValue', () => {
  it('nudges and clamps', () => {
    expect(stepValue(50, 100, 10)).toBe(60);
    expect(stepValue(undefined, 100, 1)).toBe(1);
    expect(stepValue(98, 100, 10)).toBe(100);
    expect(stepValue(5, 100, -10)).toBe(0);
  });
});
