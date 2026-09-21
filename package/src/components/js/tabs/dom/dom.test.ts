import { describe, expect, it } from 'vitest';
import type { KTabsState } from '../models/models.js';
import { buildTabs, tabFromEvent } from './dom.js';

function panelsFor(id: string, count: number): HTMLElement[] {
  return Array.from({ length: count }, (_, i) => {
    const el = document.createElement('div');
    el.id = `${id}-${i}`;
    document.body.append(el);
    return el;
  });
}

describe('tabFromEvent', () => {
  it('returns the tab inside the root', () => {
    const root = document.createElement('div');
    const tab = document.createElement('button');
    tab.setAttribute('role', 'tab');
    root.append(tab);
    const event = new MouseEvent('click', { bubbles: true });
    tab.dispatchEvent(event);
    expect(tabFromEvent(root, event)).toBe(tab);
  });

  it('returns null when the event is not on a tab in the root', () => {
    const root = document.createElement('div');
    const miss = document.createElement('button');
    root.append(miss);
    const plain = new MouseEvent('click', { bubbles: true });
    miss.dispatchEvent(plain);
    expect(tabFromEvent(root, plain)).toBeNull();
  });
});

describe('buildTabs', () => {
  it('throws when items is empty', () => {
    const root = document.createElement('div');
    root.id = 'empty';
    const state: KTabsState = { root, tabs: [], panels: [], keyboard: true };
    expect(() => buildTabs(state, { items: [] }, [])).toThrow(
      'KTabs: at least one item is required',
    );
  });

  it('wires external panels and builds ARIA from the host id', () => {
    const root = document.createElement('div');
    root.id = 'sections';
    root.setAttribute('aria-label', 'Sections');
    const panels = panelsFor('sections', 2);
    document.body.append(root);
    const state: KTabsState = { root, tabs: [], panels: [], keyboard: true };
    buildTabs(
      state,
      { items: [{ label: 'Overview' }, { label: 'Usage' }] },
      panels,
    );

    const list = root.querySelector('[role="tablist"]');
    expect(list?.getAttribute('aria-label')).toBe('Sections');
    expect(state.tabs[0]?.id).toBe('sections-tab-0');
    expect(state.tabs[0]?.getAttribute('aria-controls')).toBe('sections-0');
    expect(panels[0]?.getAttribute('role')).toBe('tabpanel');
    expect(panels[0]?.getAttribute('aria-labelledby')).toBe('sections-tab-0');
    root.remove();
    for (const panel of panels) {
      panel.remove();
    }
  });

  it('places a named icon before the label', () => {
    const root = document.createElement('div');
    root.id = 'icons';
    const panels = panelsFor('icons', 1);
    document.body.append(root);
    const state: KTabsState = { root, tabs: [], panels: [], keyboard: true };
    buildTabs(state, { items: [{ label: 'Info', icon: 'info' }] }, panels);
    expect(state.tabs[0]?.querySelector('.k-icon--info')).toBeTruthy();
    root.remove();
    panels[0]?.remove();
  });

  it('throws when option count does not match panels', () => {
    const root = document.createElement('div');
    root.id = 'mismatch';
    const panels = panelsFor('mismatch', 1);
    document.body.append(root);
    const state: KTabsState = { root, tabs: [], panels: [], keyboard: true };
    expect(() =>
      buildTabs(state, { items: [{ label: 'A' }, { label: 'B' }] }, panels),
    ).toThrow('KTabs: options length must match content nodes');
    root.remove();
    panels[0]?.remove();
  });
});
