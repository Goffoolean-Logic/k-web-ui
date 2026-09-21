import { describe, expect, it, vi } from 'vitest';
import { buildTabs } from '../dom/dom.js';
import type { KTabsState } from '../models/models.js';
import { bindEvents, selectTab } from './events.js';

function mounted(): {
  state: KTabsState;
  abort: AbortController;
  panels: HTMLElement[];
} {
  const root = document.createElement('div');
  root.id = 'sections';
  const panels = [0, 1].map((i) => {
    const el = document.createElement('div');
    el.id = `sections-${i}`;
    document.body.append(el);
    return el;
  });
  document.body.append(root);
  const state: KTabsState = { root, tabs: [], panels: [], keyboard: true };
  buildTabs(
    state,
    { items: [{ label: 'Overview' }, { label: 'Usage' }] },
    panels,
  );
  selectTab(state, 0, { emit: false });
  return { state, abort: new AbortController(), panels };
}

describe('selectTab', () => {
  it('marks the selected tab and hides the rest', () => {
    const { state, panels } = mounted();
    selectTab(state, 1, { emit: false });
    expect(state.tabs[0]?.getAttribute('aria-selected')).toBe('false');
    expect(state.tabs[1]?.getAttribute('aria-selected')).toBe('true');
    expect(panels[0]?.hidden).toBe(true);
    expect(panels[1]?.hidden).toBe(false);
    state.root.remove();
    for (const panel of panels) {
      panel.remove();
    }
  });

  it('does nothing for an out-of-range index', () => {
    const { state, panels } = mounted();
    const onChange = vi.fn();
    state.root.addEventListener('k-change', onChange);
    selectTab(state, 9);
    expect(state.tabs[0]?.getAttribute('aria-selected')).toBe('true');
    expect(onChange).not.toHaveBeenCalled();
    state.root.remove();
    for (const panel of panels) {
      panel.remove();
    }
  });

  it('focuses the tab when asked', () => {
    const { state, panels } = mounted();
    selectTab(state, 1, { focus: true, emit: false });
    expect(document.activeElement).toBe(state.tabs[1]);
    state.root.remove();
    for (const panel of panels) {
      panel.remove();
    }
  });

  it('emits k-change unless emit is false', () => {
    const { state, panels } = mounted();
    const onChange = vi.fn();
    state.root.addEventListener('k-change', onChange);
    selectTab(state, 1);
    expect(onChange.mock.calls[0]?.[0].detail).toEqual({ index: 1 });
    selectTab(state, 0, { emit: false });
    expect(onChange).toHaveBeenCalledTimes(1);
    state.root.remove();
    for (const panel of panels) {
      panel.remove();
    }
  });
});

describe('bindEvents', () => {
  it('selects the clicked tab', () => {
    const { state, abort, panels } = mounted();
    bindEvents(state, abort.signal);
    state.tabs[1]?.click();
    expect(state.tabs[1]?.getAttribute('aria-selected')).toBe('true');
    abort.abort();
    state.root.remove();
    for (const panel of panels) {
      panel.remove();
    }
  });

  it('ignores clicks that are not on a tab', () => {
    const { state, abort, panels } = mounted();
    bindEvents(state, abort.signal);
    const onChange = vi.fn();
    state.root.addEventListener('k-change', onChange);
    state.root.click();
    expect(onChange).not.toHaveBeenCalled();
    abort.abort();
    state.root.remove();
    for (const panel of panels) {
      panel.remove();
    }
  });

  it('stops listening after abort', () => {
    const { state, abort, panels } = mounted();
    bindEvents(state, abort.signal);
    abort.abort();
    const onChange = vi.fn();
    state.root.addEventListener('k-change', onChange);
    state.tabs[1]?.click();
    expect(onChange).not.toHaveBeenCalled();
    state.root.remove();
    for (const panel of panels) {
      panel.remove();
    }
  });
});
