import { describe, expect, it } from 'vitest';
import type { KTabsState } from '../models/models.js';
import { buildTabs, tabFromEvent } from './dom.js';

function state(id?: string): KTabsState {
  const root = document.createElement('div');
  if (id) {
    root.id = id;
  }
  document.body.append(root);
  return { root, tabs: [], panels: [], keyboard: true };
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

  it('walks up to the nearest tab', () => {
    const root = document.createElement('div');
    const tab = document.createElement('button');
    tab.setAttribute('role', 'tab');
    const mark = document.createElement('span');
    tab.append(mark);
    root.append(tab);
    const event = new MouseEvent('click', { bubbles: true });
    mark.dispatchEvent(event);
    expect(tabFromEvent(root, event)).toBe(tab);
  });

  it('returns null when the event is not on a tab in the root', () => {
    const root = document.createElement('div');
    const other = document.createElement('div');
    const tab = document.createElement('button');
    tab.setAttribute('role', 'tab');
    other.append(tab);
    const miss = document.createElement('button');
    root.append(miss);

    const outside = new MouseEvent('click', { bubbles: true });
    tab.dispatchEvent(outside);
    expect(tabFromEvent(root, outside)).toBeNull();

    const plain = new MouseEvent('click', { bubbles: true });
    miss.dispatchEvent(plain);
    expect(tabFromEvent(root, plain)).toBeNull();
  });
});

describe('buildTabs', () => {
  it('throws when items is empty', () => {
    const current = state();
    expect(() => buildTabs(current, { items: [] })).toThrow(
      'KTabs: at least one item is required',
    );
    current.root.remove();
  });

  it('builds ARIA from the host id', () => {
    const current = state('sections');
    buildTabs(current, {
      items: [
        { label: 'Overview', content: 'First' },
        { label: 'Usage', content: 'Second' },
      ],
      label: 'Sections',
    });

    const list = current.root.querySelector('[role="tablist"]');
    expect(list?.getAttribute('aria-label')).toBe('Sections');
    expect(current.tabs).toHaveLength(2);
    expect(current.panels).toHaveLength(2);
    expect(current.tabs[0]?.id).toBe('sections-tab-0');
    expect(current.tabs[0]?.getAttribute('aria-controls')).toBe(
      'sections-panel-0',
    );
    expect(current.panels[0]?.id).toBe('sections-panel-0');
    expect(current.panels[0]?.getAttribute('aria-labelledby')).toBe(
      'sections-tab-0',
    );
    expect(current.panels[0]?.textContent).toBe('First');
    expect(current.ink?.className).toBe('k-tabs__ink');
    expect(current.ink?.getAttribute('aria-hidden')).toBe('true');
    current.root.remove();
  });

  it('falls back to k-tabs when the host has no id', () => {
    const current = state();
    buildTabs(current, { items: [{ label: 'One', content: 'A' }] });
    expect(current.tabs[0]?.id).toBe('k-tabs-tab-0');
    expect(current.panels[0]?.id).toBe('k-tabs-panel-0');
    current.root.remove();
  });

  it('omits aria-label when none is given', () => {
    const current = state('plain');
    buildTabs(current, { items: [{ label: 'One', content: 'A' }] });
    expect(
      current.root
        .querySelector('[role="tablist"]')
        ?.hasAttribute('aria-label'),
    ).toBe(false);
    current.root.remove();
  });

  it('accepts a Node as panel content', () => {
    const current = state('nodes');
    const child = document.createElement('strong');
    child.textContent = 'Rich';
    buildTabs(current, { items: [{ label: 'One', content: child }] });
    expect(current.panels[0]?.firstElementChild).toBe(child);
    current.root.remove();
  });

  it('places a named icon before the label', () => {
    const current = state('icons');
    buildTabs(current, {
      items: [{ label: 'Overview', icon: 'info', content: 'First' }],
    });
    const icon = current.tabs[0]?.querySelector('.k-icon');
    expect(icon?.className).toBe('k-icon k-icon--info');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(current.tabs[0]?.textContent).toBe('Overview');
    current.root.remove();
  });

  it('accepts a Node as the tab icon', () => {
    const current = state('icon-node');
    const mark = document.createElement('span');
    mark.className = 'k-icon k-icon--success';
    buildTabs(current, {
      items: [{ label: 'Usage', icon: mark, content: 'Second' }],
    });
    expect(current.tabs[0]?.firstElementChild).toBe(mark);
    expect(current.tabs[0]?.textContent).toBe('Usage');
    current.root.remove();
  });

  it('omits text when the item has no label', () => {
    const current = state('icon-only');
    buildTabs(current, {
      items: [{ icon: 'info', content: 'First' }],
    });
    expect(current.tabs[0]?.querySelector('.k-icon')).not.toBeNull();
    expect(current.tabs[0]?.textContent).toBe('');
    current.root.remove();
  });
});
