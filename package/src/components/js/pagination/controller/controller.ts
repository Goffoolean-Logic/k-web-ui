import { renderPagination, visiblePages } from '../dom/dom.js';
import { bindEvents, goTo, syncPanels } from '../events/events.js';
import { bindKeybinds } from '../keybinds/keybinds.js';
import type { KPaginationState } from '../models/models.js';

export { goTo } from '../events/events.js';

export function hasPrevious(state: KPaginationState): boolean {
  return state.page > 1;
}

export function hasNext(state: KPaginationState): boolean {
  return state.page < state.count;
}

export function getVisiblePages(state: KPaginationState): number[] {
  return visiblePages(state.page, state.count);
}

export function init(
  root: HTMLElement,
  panels: HTMLElement[],
  signal: AbortSignal,
): KPaginationState {
  const state: KPaginationState = {
    root,
    count: panels.length,
    page: 1,
    buttons: [],
    signal,
    panels,
  };

  root.setAttribute('role', 'navigation');
  if (!root.hasAttribute('aria-label')) {
    root.setAttribute('aria-label', 'Pagination');
  }
  renderPagination(state);
  bindEvents(state);
  bindKeybinds(state);
  syncPanels(state);
  return state;
}
