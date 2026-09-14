import { describe, expect, it, vi } from 'vitest';
import { defineElement, emitKChange, fill, resolveRoot } from './root.js';

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

describe('defineElement', () => {
  it('defines a tag once', () => {
    class KRootProbe extends HTMLElement {}
    defineElement('k-root-probe', KRootProbe);
    expect(customElements.get('k-root-probe')).toBe(KRootProbe);
    expect(() => defineElement('k-root-probe', KRootProbe)).not.toThrow();
  });
});

describe('emitKChange', () => {
  it('dispatches a bubbling k-change event', () => {
    const host = document.createElement('div');
    const onChange = vi.fn();
    host.addEventListener('k-change', onChange);
    emitKChange(host, { page: 2 });
    expect(onChange).toHaveBeenCalledTimes(1);
    const event = onChange.mock.calls[0]?.[0] as CustomEvent<{ page: number }>;
    expect(event.bubbles).toBe(true);
    expect(event.detail).toEqual({ page: 2 });
  });
});
