import { describe, expect, it } from 'vitest';
import { fill, resolveRoot } from './root.js';

describe('resolveRoot', () => {
  it('returns an element argument', () => {
    const el = document.createElement('div');
    expect(resolveRoot(el, 'KTest')).toBe(el);
  });

  it('resolves an id', () => {
    const el = document.createElement('div');
    el.id = 'host';
    document.body.append(el);
    expect(resolveRoot('host', 'KTest')).toBe(el);
    expect(resolveRoot('#host', 'KTest')).toBe(el);
    el.remove();
  });

  it('throws when the node is missing', () => {
    expect(() => resolveRoot('missing', 'KTest')).toThrow(
      'KTest: no element with id "missing"',
    );
  });
});

describe('fill', () => {
  it('sets text or a node', () => {
    const host = document.createElement('div');
    fill(host, 'Hello');
    expect(host.textContent).toBe('Hello');
    const child = document.createElement('span');
    child.textContent = 'Node';
    fill(host, child);
    expect(host.firstElementChild).toBe(child);
  });
});
