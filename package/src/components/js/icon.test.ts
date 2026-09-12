import { describe, expect, it } from 'vitest';
import { createIcon, createSpin } from './icon.js';

describe('createIcon', () => {
  it('sets the name class and hides the mark', () => {
    const el = createIcon('info');
    expect(el.tagName).toBe('SPAN');
    expect(el.className).toBe('k-icon k-icon--info');
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('adds a size class', () => {
    const el = createIcon('close', 'sm');
    expect(el.className).toBe('k-icon k-icon--close k-icon--sm');
  });
});

describe('createSpin', () => {
  it('wraps the loading icon by default', () => {
    const el = createSpin();
    expect(el.className).toBe('k-spin');
    const icon = el.firstElementChild;
    expect(icon?.className).toBe('k-icon k-icon--loading');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });

  it('can spin another named icon', () => {
    const el = createSpin('success', 'xs');
    expect(el.firstElementChild?.className).toBe(
      'k-icon k-icon--success k-icon--xs',
    );
  });
});
