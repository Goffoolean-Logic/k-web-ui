import { describe, expect, it, vi } from 'vitest';
import { buildTabs } from '../dom/dom.js';
import type { KTabsState } from '../models/models.js';
import { bindEvents, selectTab } from './events.js';

function mounted(): { state: KTabsState; abort: AbortController } {
  const root = document.createElement('div');
  root.id = 'sections';
  document.body.append(root);
  const state: KTabsState = { root, tabs: [], panels: [], keyboard: true };
  buildTabs(state, {
    items: [
      { label: 'Overview', content: 'First' },
      { label: 'Usage', content: 'Second' },
    ],
  });
  selectTab(state, 0, { emit: false });
  return { state, abort: new AbortController() };
}

describe('selectTab', () => {
  it('marks the selected tab and hides the rest', () => {
    const { state } = mounted();
    selectTab(state, 1, { emit: false });
    expect(state.tabs[0]?.getAttribute('aria-selected')).toBe('false');
    expect(state.tabs[1]?.getAttribute('aria-selected')).toBe('true');
    expect(state.tabs[0]?.tabIndex).toBe(-1);
    expect(state.tabs[1]?.tabIndex).toBe(0);
    expect(state.panels[0]?.hidden).toBe(true);
    expect(state.panels[1]?.hidden).toBe(false);
    state.root.remove();
  });

  it('does nothing for an out-of-range index', () => {
    const { state } = mounted();
    const onChange = vi.fn();
    state.root.addEventListener('k-change', onChange);
    selectTab(state, 9);
    expect(state.tabs[0]?.getAttribute('aria-selected')).toBe('true');
    expect(onChange).not.toHaveBeenCalled();
    state.root.remove();
  });

  it('focuses the tab when asked', () => {
    const { state } = mounted();
    selectTab(state, 1, { focus: true, emit: false });
    expect(document.activeElement).toBe(state.tabs[1]);
    state.root.remove();
  });

  it('emits k-change unless emit is false', () => {
    const { state } = mounted();
    const onChange = vi.fn();
    state.root.addEventListener('k-change', onChange);
    selectTab(state, 1);
    expect(onChange).toHaveBeenCalledTimes(1);
    const event = onChange.mock.calls[0]?.[0] as CustomEvent<{
      selected: number;
    }>;
    expect(event.detail).toEqual({ selected: 1 });

    selectTab(state, 0, { emit: false });
    expect(onChange).toHaveBeenCalledTimes(1);
    state.root.remove();
  });
});

describe('bindEvents', () => {
  it('selects the clicked tab', () => {
    const { state, abort } = mounted();
    bindEvents(state, abort.signal);
    const onChange = vi.fn();
    state.root.addEventListener('k-change', onChange);
    state.tabs[1]?.click();
    expect(state.tabs[1]?.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(state.tabs[1]);
    expect(onChange).toHaveBeenCalledTimes(1);
    abort.abort();
    state.root.remove();
  });

  it('ignores clicks that are not on a tab', () => {
    const { state, abort } = mounted();
    bindEvents(state, abort.signal);
    const onChange = vi.fn();
    state.root.addEventListener('k-change', onChange);
    state.panels[0]?.click();
    expect(onChange).not.toHaveBeenCalled();
    abort.abort();
    state.root.remove();
  });

  it('stops listening after abort', () => {
    const { state, abort } = mounted();
    bindEvents(state, abort.signal);
    abort.abort();
    state.tabs[1]?.click();
    expect(state.tabs[0]?.getAttribute('aria-selected')).toBe('true');
    state.root.remove();
  });
});
