import { renderPagination, visiblePages } from '../dom/dom.js';
import { bindEvents, goTo } from '../events/events.js';
import { bindKeybinds } from '../keybinds/keybinds.js';
import type { KPaginationState } from '../models/models.js';

/** Re-exported so `index.ts` only ever reaches for the controller. */
export { goTo } from '../events/events.js';

// --- attributes ---

export function toPage(raw: string | null): number {
  const value = Number(raw ?? 1);
  return Number.isFinite(value) && value >= 1 ? value : 1;
}

/**
 * Reads the `count` attribute. Null means the element has nothing to render
 * yet; a present but nonsensical value is a mistake worth surfacing.
 */
export function readCount(root: HTMLElement): number | null {
  const raw = root.getAttribute('count');
  if (raw === null) {
    return null;
  }
  const count = Number(raw);
  if (!Number.isFinite(count) || count < 1) {
    throw new Error('KPagination: count must be at least 1');
  }
  return count;
}

// --- reading the bar ---

export function hasPrevious(state: KPaginationState): boolean {
  return state.page > 1;
}

export function hasNext(state: KPaginationState): boolean {
  return state.page < state.count;
}

export function getVisiblePages(state: KPaginationState): number[] {
  return visiblePages(state.page, state.count);
}

// --- lifecycle ---

/** Renders the bar, wires the buttons, and marks the host as navigation. */
export function init(
  root: HTMLElement,
  count: number,
  signal: AbortSignal,
): KPaginationState {
  const state: KPaginationState = {
    root,
    count,
    page: toPage(root.getAttribute('page')),
    buttons: [],
    signal,
  };

  root.setAttribute('role', 'navigation');
  root.setAttribute('aria-label', 'Pagination');
  renderPagination(state);
  bindEvents(state);
  bindKeybinds(state);
  return state;
}

/**
 * `page` moves without stealing focus or re-announcing, since the attribute
 * is the caller's own doing. `count` changes the button set, so it rebuilds.
 */
export function applyAttribute(state: KPaginationState, name: string): boolean {
  if (name === 'page') {
    goTo(state, toPage(state.root.getAttribute('page')), {
      focus: false,
      emit: false,
    });
    return true;
  }
  return false;
}
