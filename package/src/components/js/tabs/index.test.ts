import { describe, expect, it, vi } from 'vitest';
import type { KTabs } from './index.js';
import './index.js';

function host(): KTabs {
  const el = document.createElement('k-tabs');
  el.id = 'sections';
  return el;
}

function press(tab: HTMLElement | undefined, key: string): void {
  if (!tab) {
    throw new Error('missing tab');
  }
  tab.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
  );
}

const panels = [
  { label: 'Overview', content: 'First' },
  { label: 'Usage', content: 'Second' },
];

describe('k-tabs', () => {
  it('builds tablist, tabs, panels, and ARIA from the panels attribute', () => {
    const tabs = host();
    tabs.setAttribute('label', 'Sections');
    tabs.setAttribute('panels', JSON.stringify(panels));
    document.body.append(tabs);

    const list = tabs.querySelector('[role="tablist"]');
    expect(list).toBeTruthy();
    expect(list?.getAttribute('aria-label')).toBe('Sections');
    expect(tabs.tabs).toHaveLength(2);
    expect(tabs.tabs[0]?.getAttribute('aria-selected')).toBe('true');
    expect(tabs.tabs[1]?.getAttribute('aria-selected')).toBe('false');
    expect(tabs.tabs[0]?.getAttribute('aria-controls')).toBe(
      'sections-panel-0',
    );
    expect(tabs.querySelectorAll('[role="tabpanel"]')).toHaveLength(2);
    expect(tabs.querySelector<HTMLElement>('#sections-panel-0')?.hidden).toBe(
      false,
    );
    expect(tabs.querySelector<HTMLElement>('#sections-panel-1')?.hidden).toBe(
      true,
    );
    tabs.remove();
  });

  it('select shows one panel', () => {
    const tabs = host();
    tabs.panels = panels;
    document.body.append(tabs);
    tabs.select(1);
    expect(tabs.selectedIndex).toBe(1);
    expect(tabs.querySelector<HTMLElement>('#sections-panel-0')?.hidden).toBe(
      true,
    );
    expect(tabs.querySelector<HTMLElement>('#sections-panel-1')?.hidden).toBe(
      false,
    );
    tabs.remove();
  });

  it('setting panels again does not double-bind', () => {
    const tabs = host();
    tabs.panels = panels;
    document.body.append(tabs);
    tabs.panels = panels;
    expect(tabs.querySelectorAll('[role="tablist"]')).toHaveLength(1);
    expect(tabs.querySelectorAll('[role="tab"]')).toHaveLength(2);
    tabs.remove();
  });

  it('renders a kit icon on the tab', () => {
    const tabs = host();
    tabs.panels = [{ label: 'Overview', icon: 'info', content: 'First' }];
    document.body.append(tabs);
    expect(tabs.tabs[0]?.querySelector('.k-icon--info')).toBeTruthy();
    tabs.remove();
  });

  it('keeps the tab and panel nodes when selected changes', () => {
    const tabs = host();
    tabs.panels = panels;
    document.body.append(tabs);
    const [first, second] = tabs.tabs;
    const list = tabs.querySelector('[role="tablist"]');
    const panel = tabs.querySelector('#sections-panel-1');
    const onChange = vi.fn();
    tabs.addEventListener('k-change', onChange);

    tabs.setAttribute('selected', '1');

    expect(tabs.tabs[0]).toBe(first);
    expect(tabs.tabs[1]).toBe(second);
    expect(tabs.querySelector('[role="tablist"]')).toBe(list);
    expect(tabs.querySelector('#sections-panel-1')).toBe(panel);
    expect(tabs.selectedIndex).toBe(1);
    expect(onChange).not.toHaveBeenCalled();
    tabs.remove();
  });

  it('turns keyboard navigation on and off after connect', () => {
    const tabs = host();
    tabs.panels = panels;
    tabs.setAttribute('keyboard', 'false');
    document.body.append(tabs);

    press(tabs.tabs[0], 'ArrowRight');
    expect(tabs.selectedIndex).toBe(0);

    tabs.setAttribute('keyboard', 'true');
    press(tabs.tabs[0], 'ArrowRight');
    expect(tabs.selectedIndex).toBe(1);
    tabs.remove();
  });

  it('relabels the tablist without rebuilding it', () => {
    const tabs = host();
    tabs.setAttribute('label', 'Sections');
    tabs.panels = panels;
    document.body.append(tabs);
    const list = tabs.querySelector('[role="tablist"]');

    tabs.setAttribute('label', 'Chapters');
    expect(tabs.querySelector('[role="tablist"]')).toBe(list);
    expect(list?.getAttribute('aria-label')).toBe('Chapters');

    tabs.removeAttribute('label');
    expect(list?.hasAttribute('aria-label')).toBe(false);
    tabs.remove();
  });

  it('keeps a node as panel content without writing it to the attribute', () => {
    const tabs = host();
    const child = document.createElement('strong');
    child.textContent = 'Rich';
    tabs.panels = [{ label: 'Overview', content: child }];
    document.body.append(tabs);
    expect(tabs.hasAttribute('panels')).toBe(false);
    expect(tabs.querySelector('#sections-panel-0')?.firstElementChild).toBe(
      child,
    );
    tabs.remove();
  });
});

describe('k-tabs api', () => {
  it('getSelected returns the index, nodes, and label', () => {
    const tabs = host();
    tabs.panels = panels;
    document.body.append(tabs);
    tabs.select(1);

    expect(tabs.getSelected()).toEqual({
      index: 1,
      tab: tabs.tabs[1],
      panel: tabs.getPanel(1),
      label: 'Usage',
    });
    tabs.remove();
  });

  it('getSelected is null before the element is connected', () => {
    const tabs = host();
    tabs.panels = panels;
    expect(tabs.getSelected()).toBeNull();
    expect(tabs.selectedIndex).toBe(-1);
  });

  it('reports count and labels with or without a connection', () => {
    const tabs = host();
    tabs.panels = panels;
    expect(tabs.count).toBe(2);
    expect(tabs.labels).toEqual(['Overview', 'Usage']);

    document.body.append(tabs);
    expect(tabs.count).toBe(2);
    expect(tabs.labels).toEqual(['Overview', 'Usage']);
    tabs.remove();
  });

  it('getTab and getPanel hand back the live nodes, null past the end', () => {
    const tabs = host();
    tabs.panels = panels;
    document.body.append(tabs);
    expect(tabs.getTab(0)).toBe(tabs.tabs[0]);
    expect(tabs.getPanel(1)?.id).toBe('sections-panel-1');
    expect(tabs.getTab(9)).toBeNull();
    expect(tabs.getPanel(9)).toBeNull();
    tabs.remove();
  });

  it('next and previous wrap, and clamp when asked', () => {
    const tabs = host();
    tabs.panels = panels;
    document.body.append(tabs);

    tabs.next();
    expect(tabs.selectedIndex).toBe(1);
    tabs.next();
    expect(tabs.selectedIndex).toBe(0);
    tabs.previous();
    expect(tabs.selectedIndex).toBe(1);

    tabs.next({ wrap: false });
    expect(tabs.selectedIndex).toBe(1);
    tabs.select(0);
    tabs.previous({ wrap: false });
    expect(tabs.selectedIndex).toBe(0);
    tabs.remove();
  });

  it('selectByLabel selects a match and reports a miss', () => {
    const tabs = host();
    tabs.panels = panels;
    document.body.append(tabs);
    expect(tabs.selectByLabel('Usage')).toBe(true);
    expect(tabs.selectedIndex).toBe(1);
    expect(tabs.selectByLabel('Nope')).toBe(false);
    expect(tabs.selectedIndex).toBe(1);
    tabs.remove();
  });

  it('addPanel appends or inserts, and renders the new tab', () => {
    const tabs = host();
    tabs.panels = panels;
    document.body.append(tabs);

    tabs.addPanel({ label: 'API', content: 'Third' });
    expect(tabs.labels).toEqual(['Overview', 'Usage', 'API']);

    tabs.addPanel({ label: 'Intro', content: 'Zero' }, 0);
    expect(tabs.labels).toEqual(['Intro', 'Overview', 'Usage', 'API']);
    expect(tabs.querySelectorAll('[role="tab"]')).toHaveLength(4);
    tabs.remove();
  });

  it('removePanel drops a tab and its panel', () => {
    const tabs = host();
    tabs.panels = panels;
    document.body.append(tabs);
    tabs.removePanel(0);
    expect(tabs.labels).toEqual(['Usage']);
    expect(tabs.querySelectorAll('[role="tabpanel"]')).toHaveLength(1);
    tabs.remove();
  });

  it('updatePanel patches one item and leaves the others alone', () => {
    const tabs = host();
    tabs.panels = panels;
    document.body.append(tabs);
    tabs.updatePanel(1, { label: 'Recipes' });
    expect(tabs.labels).toEqual(['Overview', 'Recipes']);
    expect(tabs.tabs[1]?.textContent).toBe('Recipes');
    tabs.remove();
  });

  it('refresh rebuilds the subtree', () => {
    const tabs = host();
    tabs.panels = panels;
    document.body.append(tabs);
    const first = tabs.tabs[0];
    tabs.refresh();
    expect(tabs.tabs[0]).not.toBe(first);
    expect(tabs.querySelectorAll('[role="tablist"]')).toHaveLength(1);
    tabs.remove();
  });

  it('api calls are inert while disconnected', () => {
    const tabs = host();
    tabs.panels = panels;
    expect(() => {
      tabs.select(1);
      tabs.next();
      tabs.previous();
      tabs.refresh();
    }).not.toThrow();
    expect(tabs.selectByLabel('Usage')).toBe(false);
    expect(tabs.tabs).toEqual([]);
  });
});
