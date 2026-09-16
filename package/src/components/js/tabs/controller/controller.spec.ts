import { describe, expect, it, vi } from 'vitest';
import { buildTabs } from '../dom/dom.js';
import { selectTab } from '../events/events.js';
import type { KTabsState } from '../models/models.js';
import {
  applyAttribute,
  getLabels,
  getSelected,
  getSelectedIndex,
  indexOfLabel,
  init,
  parsePanels,
  serializePanels,
  step,
  toIndex,
} from './controller.js';

function mount(
  labels: string[],
  attrs: Record<string, string> = {},
): { state: KTabsState; abort: AbortController; root: HTMLElement } {
  const root = document.createElement('div');
  root.id = 'sections';
  for (const [name, value] of Object.entries(attrs)) {
    root.setAttribute(name, value);
  }
  document.body.append(root);
  const abort = new AbortController();
  const state = init(
    root,
    labels.map((label, i) => ({ label, content: `body-${i}` })),
    abort.signal,
  );
  return { state, abort, root };
}

function bare(): KTabsState {
  const root = document.createElement('div');
  document.body.append(root);
  return { root, tabs: [], panels: [], keyboard: true };
}

describe('toIndex', () => {
  it('defaults to 0 and rejects junk', () => {
    expect(toIndex(null)).toBe(0);
    expect(toIndex('2')).toBe(2);
    expect(toIndex('nope')).toBe(0);
  });
});

describe('parsePanels', () => {
  it('reads label, icon, and content', () => {
    expect(
      parsePanels(
        JSON.stringify([{ label: 'One', icon: 'info', content: 'A' }]),
      ),
    ).toEqual([{ content: 'A', label: 'One', icon: 'info' }]);
  });

  it('returns an empty list when the attribute is absent', () => {
    expect(parsePanels(null)).toEqual([]);
    expect(parsePanels('  ')).toEqual([]);
  });

  it('defaults missing content to an empty string', () => {
    expect(parsePanels(JSON.stringify([{ label: 'One' }]))).toEqual([
      { content: '', label: 'One' },
    ]);
  });

  it('throws on invalid JSON, non-arrays, and non-object entries', () => {
    expect(() => parsePanels('{oops')).toThrow('KTabs: invalid JSON');
    expect(() => parsePanels('{"a":1}')).toThrow(
      'KTabs: expected a JSON array',
    );
    expect(() => parsePanels('["nope"]')).toThrow(
      'KTabs: each panel is an object',
    );
  });
});

describe('serializePanels', () => {
  it('round-trips plain string panels', () => {
    expect(
      serializePanels([{ label: 'One', icon: 'info', content: 'A' }]),
    ).toBe(JSON.stringify([{ label: 'One', icon: 'info', content: 'A' }]));
  });

  it('bails out when a panel holds a node', () => {
    const node = document.createElement('strong');
    expect(serializePanels([{ label: 'One', content: node }])).toBeNull();
    expect(
      serializePanels([{ label: 'One', content: 'A', icon: node }]),
    ).toBeNull();
  });
});

describe('getSelectedIndex', () => {
  it('reports the selected tab', () => {
    const { state, abort, root } = mount(['Overview', 'Usage']);
    expect(getSelectedIndex(state)).toBe(0);
    selectTab(state, 1, { emit: false });
    expect(getSelectedIndex(state)).toBe(1);
    abort.abort();
    root.remove();
  });

  it('returns -1 when nothing is built', () => {
    const state = bare();
    expect(getSelectedIndex(state)).toBe(-1);
    state.root.remove();
  });
});

describe('getSelected', () => {
  it('returns the index with the live tab and panel nodes', () => {
    const { state, abort, root } = mount(['Overview', 'Usage']);
    selectTab(state, 1, { emit: false });
    expect(getSelected(state)).toEqual({
      index: 1,
      tab: state.tabs[1],
      panel: state.panels[1],
      label: 'Usage',
    });
    abort.abort();
    root.remove();
  });

  it('falls back to the tab text when the item carries no label', () => {
    const state = bare();
    buildTabs(state, { items: [{ icon: 'info', content: 'First' }] });
    selectTab(state, 0, { emit: false });
    expect(getSelected(state)?.label).toBe('');
    state.root.remove();
  });

  it('returns null when nothing is built', () => {
    const state = bare();
    expect(getSelected(state)).toBeNull();
    state.root.remove();
  });
});

describe('getLabels and indexOfLabel', () => {
  it('lists the labels in order', () => {
    const { state, abort, root } = mount(['Overview', 'Usage']);
    expect(getLabels(state)).toEqual(['Overview', 'Usage']);
    abort.abort();
    root.remove();
  });

  it('finds a label and reports -1 for a miss', () => {
    const { state, abort, root } = mount(['Overview', 'Usage']);
    expect(indexOfLabel(state, 'Usage')).toBe(1);
    expect(indexOfLabel(state, 'Nope')).toBe(-1);
    abort.abort();
    root.remove();
  });
});

describe('step', () => {
  it('moves forward and back, wrapping at the ends', () => {
    const { state, abort, root } = mount(['A', 'B', 'C']);
    step(state, 1);
    expect(getSelectedIndex(state)).toBe(1);
    step(state, 1);
    expect(getSelectedIndex(state)).toBe(2);
    step(state, 1);
    expect(getSelectedIndex(state)).toBe(0);
    step(state, -1);
    expect(getSelectedIndex(state)).toBe(2);
    abort.abort();
    root.remove();
  });

  it('clamps instead of wrapping when wrap is false', () => {
    const { state, abort, root } = mount(['A', 'B', 'C']);
    step(state, -1, { wrap: false });
    expect(getSelectedIndex(state)).toBe(0);
    selectTab(state, 2, { emit: false });
    step(state, 1, { wrap: false });
    expect(getSelectedIndex(state)).toBe(2);
    abort.abort();
    root.remove();
  });

  it('focuses the new tab when asked', () => {
    const { state, abort, root } = mount(['A', 'B', 'C']);
    step(state, 1, { focus: true });
    expect(document.activeElement).toBe(state.tabs[1]);
    abort.abort();
    root.remove();
  });

  it('does nothing when nothing is selected', () => {
    const state = bare();
    expect(() => step(state, 1)).not.toThrow();
    state.root.remove();
  });
});

describe('init', () => {
  it('builds, binds, and applies the starting selection from attributes', () => {
    const { state, abort, root } = mount(['Overview', 'Usage'], {
      label: 'Sections',
      selected: '1',
    });

    expect(state.keyboard).toBe(true);
    expect(state.items).toHaveLength(2);
    expect(getSelectedIndex(state)).toBe(1);
    expect(
      root.querySelector('[role="tablist"]')?.getAttribute('aria-label'),
    ).toBe('Sections');

    state.tabs[0]?.click();
    expect(getSelectedIndex(state)).toBe(0);

    abort.abort();
    root.remove();
  });

  it('binds keybinds through to the tablist', () => {
    const { state, abort, root } = mount(['A', 'B', 'C']);
    state.tabs[0]?.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(getSelectedIndex(state)).toBe(1);
    abort.abort();
    root.remove();
  });

  it('reads keyboard="false" off the host', () => {
    const { state, abort, root } = mount(['One'], { keyboard: 'false' });
    expect(state.keyboard).toBe(false);
    abort.abort();
    root.remove();
  });
});

describe('applyAttribute', () => {
  it('patches selection without emitting', () => {
    const { state, abort, root } = mount(['Overview', 'Usage']);
    const onChange = vi.fn();
    root.addEventListener('k-change', onChange);
    root.setAttribute('selected', '1');
    applyAttribute(state, 'selected');
    expect(getSelectedIndex(state)).toBe(1);
    expect(onChange).not.toHaveBeenCalled();
    abort.abort();
    root.remove();
  });

  it('toggles keyboard on the state', () => {
    const { state, abort, root } = mount(['Overview', 'Usage']);
    root.setAttribute('keyboard', 'false');
    applyAttribute(state, 'keyboard');
    expect(state.keyboard).toBe(false);
    root.setAttribute('keyboard', 'true');
    applyAttribute(state, 'keyboard');
    expect(state.keyboard).toBe(true);
    abort.abort();
    root.remove();
  });

  it('relabels the tablist in place', () => {
    const { state, abort, root } = mount(['Overview', 'Usage'], {
      label: 'Sections',
    });
    const list = root.querySelector('[role="tablist"]');
    root.setAttribute('label', 'Chapters');
    applyAttribute(state, 'label');
    expect(root.querySelector('[role="tablist"]')).toBe(list);
    expect(list?.getAttribute('aria-label')).toBe('Chapters');
    abort.abort();
    root.remove();
  });

  it('repaints the ink for size, and ignores unknown names', () => {
    const { state, abort, root } = mount(['Overview', 'Usage']);
    root.setAttribute('size', 'lg');
    expect(() => applyAttribute(state, 'size')).not.toThrow();
    expect(() => applyAttribute(state, 'nope')).not.toThrow();
    abort.abort();
    root.remove();
  });
});
