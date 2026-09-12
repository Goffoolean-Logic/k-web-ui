import type { KTabsOptions, KTabsState } from './models.js';

export function resolveRoot(target: string | HTMLElement): HTMLElement {
  if (typeof target !== 'string') {
    return target;
  }

  const id = target.startsWith('#') ? target.slice(1) : target;
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`KTabs: no element with id "${id}"`);
  }
  return el;
}

function fill(node: HTMLElement, content: string | Node): void {
  if (typeof content === 'string') {
    node.textContent = content;
    return;
  }
  node.replaceChildren(content);
}

export function tabFromEvent(
  root: HTMLElement,
  event: Event,
): HTMLElement | null {
  const tab = (event.target as Element | null)?.closest?.('[role="tab"]');
  if (!(tab instanceof HTMLElement) || !root.contains(tab)) {
    return null;
  }
  return tab;
}

export function buildTabs(state: KTabsState, options: KTabsOptions): void {
  if (options.items.length === 0) {
    throw new Error('KTabs: at least one item is required');
  }

  const hostId = state.root.id || 'k-tabs';
  const list = document.createElement('div');
  list.className = 'k-tabs__list';
  list.setAttribute('role', 'tablist');
  if (options.label) {
    list.setAttribute('aria-label', options.label);
  }

  const tabs: HTMLElement[] = [];
  const panels: HTMLElement[] = [];

  for (const [i, item] of options.items.entries()) {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'k-tabs__tab';
    tab.setAttribute('role', 'tab');
    tab.id = `${hostId}-tab-${i}`;
    tab.setAttribute('aria-controls', `${hostId}-panel-${i}`);
    tab.textContent = item.label;

    const panel = document.createElement('div');
    panel.className = 'k-tabs__panel';
    panel.setAttribute('role', 'tabpanel');
    panel.id = `${hostId}-panel-${i}`;
    panel.setAttribute('aria-labelledby', tab.id);
    fill(panel, item.content);

    tabs.push(tab);
    panels.push(panel);
    list.append(tab);
  }

  state.tabs = tabs;
  state.panels = panels;
  state.root.replaceChildren(list, ...panels);
}
