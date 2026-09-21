import { describe, expect, it, vi } from 'vitest';
import {
  contentNodes,
  optionsEqual,
  requireHostId,
  setInactive,
  watchContent,
} from './content.js';

describe('contentNodes', () => {
  it('throws without an id', () => {
    expect(() => contentNodes(document.createElement('div'))).toThrow(
      'div: id is required',
    );
  });

  it('reads consecutive ids from anywhere in the document', () => {
    const host = document.createElement('div');
    host.id = 'story';
    const a = document.createElement('div');
    a.id = 'story-0';
    const b = document.createElement('div');
    b.id = 'story-1';
    document.body.append(a, b, host);
    expect(contentNodes(host)).toEqual([a, b]);
    host.remove();
    a.remove();
    b.remove();
  });

  it('stops at the first missing index', () => {
    const host = document.createElement('div');
    host.id = 'gap';
    const a = document.createElement('div');
    a.id = 'gap-0';
    const c = document.createElement('div');
    c.id = 'gap-2';
    document.body.append(a, c, host);
    expect(contentNodes(host)).toEqual([a]);
    host.remove();
    a.remove();
    c.remove();
  });
});

describe('watchContent', () => {
  it('fires after #id-0 is added', async () => {
    const host = document.createElement('div');
    host.id = 'late';
    document.body.append(host);
    const abort = new AbortController();
    const onReady = vi.fn();
    watchContent(host, onReady, abort.signal);
    expect(onReady).not.toHaveBeenCalled();

    const page = document.createElement('div');
    page.id = 'late-0';
    document.body.append(page);
    await vi.waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    expect(onReady.mock.calls[0]?.[0]).toEqual([page]);
    abort.abort();
    host.remove();
    page.remove();
  });
});

describe('setInactive', () => {
  it('toggles hidden and inert', () => {
    const el = document.createElement('div');
    setInactive(el, true);
    expect(el.hidden).toBe(true);
    expect(el.hasAttribute('inert')).toBe(true);
    setInactive(el, false);
    expect(el.hidden).toBe(false);
    expect(el.hasAttribute('inert')).toBe(false);
  });
});

describe('optionsEqual', () => {
  it('treats equal snapshots as equal', () => {
    expect(optionsEqual(['A', 'B'], ['A', 'B'])).toBe(true);
    expect(optionsEqual({ value: 1 }, { value: 1 })).toBe(true);
    expect(optionsEqual({ value: 1 }, { value: 2 })).toBe(false);
  });
});

describe('requireHostId', () => {
  it('trims and returns the id', () => {
    const el = document.createElement('div');
    el.id = 'ok';
    expect(requireHostId(el)).toBe('ok');
  });
});
