import { describe, expect, it } from 'vitest';
import { KTabs } from './index.js';

function host(): HTMLElement {
  const el = document.createElement('div');
  el.id = 'sections';
  document.body.append(el);
  return el;
}

const items = [
  { label: 'Overview', content: 'First' },
  { label: 'Usage', content: 'Second' },
];

describe('KTabs.mount', () => {
  it('builds tablist, tabs, panels, and ARIA', () => {
    const root = host();
    const tabs = KTabs.mount(root, { items, label: 'Sections' });

    const list = root.querySelector('[role="tablist"]');
    expect(list).toBeTruthy();
    expect(list?.getAttribute('aria-label')).toBe('Sections');
    expect(tabs.tabs).toHaveLength(2);
    expect(tabs.tabs[0]?.getAttribute('aria-selected')).toBe('true');
    expect(tabs.tabs[1]?.getAttribute('aria-selected')).toBe('false');
    expect(tabs.tabs[0]?.getAttribute('aria-controls')).toBe(
      'sections-panel-0',
    );
    expect(root.querySelectorAll('[role="tabpanel"]')).toHaveLength(2);
    expect(root.querySelector<HTMLElement>('#sections-panel-0')?.hidden).toBe(
      false,
    );
    expect(root.querySelector<HTMLElement>('#sections-panel-1')?.hidden).toBe(
      true,
    );
    root.remove();
  });

  it('select shows one panel', () => {
    const root = host();
    const tabs = KTabs.mount(root, { items });
    tabs.select(1);
    expect(tabs.selectedIndex).toBe(1);
    expect(root.querySelector<HTMLElement>('#sections-panel-0')?.hidden).toBe(
      true,
    );
    expect(root.querySelector<HTMLElement>('#sections-panel-1')?.hidden).toBe(
      false,
    );
    root.remove();
  });

  it('remount on a live host does not double-bind', () => {
    const root = host();
    const first = KTabs.mount(root, { items });
    const second = KTabs.mount(root, { items });
    expect(second).toBe(first);
    expect(root.querySelectorAll('[role="tablist"]')).toHaveLength(1);
    expect(root.querySelectorAll('[role="tab"]')).toHaveLength(2);
    root.remove();
  });
});
