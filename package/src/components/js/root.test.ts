import { describe, expect, it, vi } from 'vitest';
import {
  defineElement,
  emitKChange,
  fill,
  insertAt,
  patchAt,
  removeAt,
  resolveRoot,
} from './root.js';

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

describe('insertAt', () => {
  const items = [{ label: 'One' }, { label: 'Two' }];

  it('appends by default and inserts at an index', () => {
    expect(insertAt(items, { label: 'Three' }).map((i) => i.label)).toEqual([
      'One',
      'Two',
      'Three',
    ]);
    expect(insertAt(items, { label: 'Zero' }, 0).map((i) => i.label)).toEqual([
      'Zero',
      'One',
      'Two',
    ]);
  });

  it('leaves the source array alone', () => {
    insertAt(items, { label: 'Three' });
    expect(items).toHaveLength(2);
  });
});

describe('removeAt', () => {
  const items = [{ label: 'One' }, { label: 'Two' }];

  it('drops the index', () => {
    expect(removeAt(items, 0).map((i) => i.label)).toEqual(['Two']);
  });

  it('returns the original array when the index misses', () => {
    expect(removeAt(items, 9)).toBe(items);
    expect(removeAt(items, -1)).toBe(items);
  });
});

describe('patchAt', () => {
  const items = [{ label: 'One', content: 'A' }, { label: 'Two' }];

  it('merges the patch into one item', () => {
    const patched = patchAt(items, 0, { label: 'First' });
    expect(patched[0]).toEqual({ label: 'First', content: 'A' });
    expect(patched[1]).toBe(items[1]);
  });

  it('returns the original array when the index misses', () => {
    expect(patchAt(items, 9, { label: 'Nope' })).toBe(items);
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
