import { describe, expect, it } from 'vitest';
import type { KTabs } from './index.js';
import './index.js';

function host(): KTabs {
  const el = document.createElement('k-tabs');
  el.id = 'sections';
  return el;
}

const items = [
  { label: 'Overview', content: 'First' },
  { label: 'Usage', content: 'Second' },
];

describe('k-tabs', () => {
  it('builds tablist, tabs, panels, and ARIA', () => {
    const tabs = host();
    tabs.setAttribute('label', 'Sections');
    tabs.items = items;
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
    tabs.items = items;
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

  it('setting items again does not double-bind', () => {
    const tabs = host();
    tabs.items = items;
    document.body.append(tabs);
    tabs.items = items;
    expect(tabs.querySelectorAll('[role="tablist"]')).toHaveLength(1);
    expect(tabs.querySelectorAll('[role="tab"]')).toHaveLength(2);
    tabs.remove();
  });
});
