import { createIcon } from '../../icon.js';
import type { KTabItem, KTabsOptions, KTabsState } from '../models/models.js';

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

export function setTabsLabel(state: KTabsState, label: string | null): void {
  const list = state.root.querySelector('.k-tabs__list');
  if (!list) {
    return;
  }
  if (label) {
    list.setAttribute('aria-label', label);
    return;
  }
  list.removeAttribute('aria-label');
}

export function buildTabs(
  state: KTabsState,
  options: KTabsOptions,
  panels: HTMLElement[],
): void {
  if (options.items.length === 0) {
    throw new Error('KTabs: at least one item is required');
  }
  if (options.items.length !== panels.length) {
    throw new Error('KTabs: options length must match content nodes');
  }

  const hostId = state.root.id;
  const list = document.createElement('div');
  list.className = 'k-tabs__list';
  list.setAttribute('role', 'tablist');
  const name = state.root.getAttribute('aria-label') || hostId;
  list.setAttribute('aria-label', name);

  const ink = document.createElement('span');
  ink.className = 'k-tabs__ink';
  ink.setAttribute('aria-hidden', 'true');
  list.append(ink);

  const tabs: HTMLElement[] = [];

  for (const [i, item] of options.items.entries()) {
    const panel = panels[i];
    if (!panel) {
      throw new Error('KTabs: missing panel');
    }
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'k-tabs__tab';
    tab.setAttribute('role', 'tab');
    tab.id = `${hostId}-tab-${i}`;
    tab.setAttribute('aria-controls', panel.id);
    paintTab(tab, item);

    panel.classList.add('k-tabs__panel');
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);

    tabs.push(tab);
    list.append(tab);
  }

  state.tabs = tabs;
  state.panels = panels;
  state.ink = ink;
  state.root.replaceChildren(list);
}

function paintTab(tab: HTMLElement, item: KTabItem): void {
  if (item.icon !== undefined) {
    tab.append(createIcon(item.icon));
  }
  tab.append(item.label);
}
