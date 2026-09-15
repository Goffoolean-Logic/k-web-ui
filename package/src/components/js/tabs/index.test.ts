import { describe, expect, it } from 'vitest';
import type { KTabs } from './index.js';
import './index.js';

function host(): KTabs {
  const el = document.createElement('k-tabs');
  el.id = 'sections';
  return el;
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
