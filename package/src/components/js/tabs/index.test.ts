import { describe, expect, it, vi } from 'vitest';
import type { KTabs } from './index.js';
import './index.js';

function mount(id = 'sections'): { tabs: KTabs; panels: HTMLElement[] } {
  const tabs = document.createElement('k-tabs') as KTabs;
  tabs.id = id;
  const panels = [0, 1].map((i) => {
    const el = document.createElement('div');
    el.id = `${id}-${i}`;
    el.textContent = i === 0 ? 'First' : 'Second';
    return el;
  });
  document.body.append(panels[0]!, panels[1]!, tabs);
  tabs.options = [{ label: 'Overview' }, { label: 'Usage' }];
  return { tabs, panels: panels as HTMLElement[] };
}

function press(tab: HTMLElement | undefined, key: string): void {
  if (!tab) {
    throw new Error('missing tab');
  }
  tab.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
  );
}

describe('k-tabs', () => {
  it('builds the tablist and wires external panels', () => {
    const { tabs, panels } = mount();
    const list = tabs.querySelector('[role="tablist"]');
    expect(list?.getAttribute('aria-label')).toBe('sections');
    expect(tabs.tabs).toHaveLength(2);
    expect(tabs.tabs[0]?.getAttribute('aria-controls')).toBe('sections-0');
    expect(panels[0]?.getAttribute('role')).toBe('tabpanel');
    expect(panels[0]?.hidden).toBe(false);
    expect(panels[1]?.hidden).toBe(true);
    expect(panels[1]?.hasAttribute('inert')).toBe(true);
    tabs.remove();
    panels[0]?.remove();
    panels[1]?.remove();
  });

  it('does not leak across two hosts', () => {
    const a = mount('alpha');
    const b = mount('beta');
    a.tabs.select(1);
    expect(a.panels[1]?.hidden).toBe(false);
    expect(b.panels[0]?.hidden).toBe(false);
    expect(b.panels[1]?.hidden).toBe(true);
    a.tabs.remove();
    b.tabs.remove();
    for (const node of [...a.panels, ...b.panels]) {
      node.remove();
    }
  });

  it('select shows one panel and emits index', () => {
    const { tabs, panels } = mount();
    const onChange = vi.fn();
    tabs.addEventListener('k-change', onChange);
    tabs.select(1);
    expect(tabs.selectedIndex).toBe(1);
    expect(panels[0]?.hidden).toBe(true);
    expect(panels[1]?.hidden).toBe(false);
    expect(onChange.mock.calls[0]?.[0].detail).toEqual({ index: 1 });
    tabs.remove();
    panels[0]?.remove();
    panels[1]?.remove();
  });

  it('renders a kit icon on the tab', () => {
    const { tabs, panels } = mount();
    tabs.options = [{ label: 'Overview', icon: 'info' }, { label: 'Usage' }];
    expect(tabs.tabs[0]?.querySelector('.k-icon--info')).toBeTruthy();
    tabs.remove();
    panels[0]?.remove();
    panels[1]?.remove();
  });

  it('equal options do not rebuild', () => {
    const { tabs, panels } = mount();
    const first = tabs.tabs[0];
    tabs.options = [{ label: 'Overview' }, { label: 'Usage' }];
    expect(tabs.tabs[0]).toBe(first);
    tabs.remove();
    panels[0]?.remove();
    panels[1]?.remove();
  });

  it('turns keyboard off with k-tabs--no-keyboard', () => {
    const { tabs, panels } = mount();
    tabs.classList.add('k-tabs--no-keyboard');
    press(tabs.tabs[0], 'ArrowRight');
    expect(tabs.selectedIndex).toBe(0);
    tabs.classList.remove('k-tabs--no-keyboard');
    press(tabs.tabs[0], 'ArrowRight');
    expect(tabs.selectedIndex).toBe(1);
    tabs.remove();
    panels[0]?.remove();
    panels[1]?.remove();
  });

  it('uses host aria-label on the tablist', () => {
    const { tabs, panels } = mount();
    tabs.setAttribute('aria-label', 'Education');
    expect(
      tabs.querySelector('[role="tablist"]')?.getAttribute('aria-label'),
    ).toBe('Education');
    tabs.remove();
    panels[0]?.remove();
    panels[1]?.remove();
  });

  it('waits for content nodes', async () => {
    const tabs = document.createElement('k-tabs') as KTabs;
    tabs.id = 'late-tabs';
    document.body.append(tabs);
    tabs.options = [{ label: 'A' }, { label: 'B' }];
    expect(tabs.tabs).toHaveLength(0);
    const p0 = document.createElement('div');
    p0.id = 'late-tabs-0';
    const p1 = document.createElement('div');
    p1.id = 'late-tabs-1';
    document.body.append(p0, p1);
    await vi.waitFor(() => expect(tabs.tabs).toHaveLength(2));
    tabs.remove();
    p0.remove();
    p1.remove();
  });
});

describe('k-tabs api', () => {
  it('getSelected returns the index, nodes, and label', () => {
    const { tabs, panels } = mount();
    tabs.select(1);
    expect(tabs.getSelected()).toEqual({
      index: 1,
      tab: tabs.tabs[1],
      panel: tabs.getPanel(1),
      label: 'Usage',
    });
    tabs.remove();
    panels[0]?.remove();
    panels[1]?.remove();
  });

  it('next and previous wrap', () => {
    const { tabs, panels } = mount();
    tabs.next();
    expect(tabs.selectedIndex).toBe(1);
    tabs.next();
    expect(tabs.selectedIndex).toBe(0);
    tabs.remove();
    panels[0]?.remove();
    panels[1]?.remove();
  });

  it('throws when option count does not match nodes', () => {
    const { tabs, panels } = mount();
    expect(() => {
      tabs.options = [{ label: 'Only' }];
    }).toThrow('KTabs: options length must match content nodes');
    tabs.remove();
    panels[0]?.remove();
    panels[1]?.remove();
  });
});
