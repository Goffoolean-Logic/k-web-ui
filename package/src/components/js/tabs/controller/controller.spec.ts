import { describe, expect, it } from 'vitest';
import { init, selectTab, getSelectedIndex, step } from './controller.js';
import type { KTabItem } from '../models/models.js';

function mount(labels: string[]) {
  const root = document.createElement('div');
  root.id = 'sections';
  document.body.append(root);
  const panels = labels.map((_, i) => {
    const el = document.createElement('div');
    el.id = `sections-${i}`;
    document.body.append(el);
    return el;
  });
  const abort = new AbortController();
  const items: KTabItem[] = labels.map((label) => ({ label }));
  const state = init(root, items, panels, abort.signal);
  return { state, abort, root, panels };
}

describe('k-tabs controller', () => {
  it('selects and steps', () => {
    const { state, root, panels } = mount(['A', 'B']);
    expect(getSelectedIndex(state)).toBe(0);
    selectTab(state, 1, { emit: false });
    expect(getSelectedIndex(state)).toBe(1);
    step(state, 1);
    expect(getSelectedIndex(state)).toBe(0);
    root.remove();
    for (const panel of panels) {
      panel.remove();
    }
  });
});
