import { emitKChange } from '../../root.js';
import { renderPagination } from '../dom/dom.js';
import type { KPaginationState } from '../models/models.js';

export function goTo(
  state: KPaginationState,
  page: number,
  { focus = true, emit = true } = {},
): void {
  const next = Math.min(state.count, Math.max(1, page));
  if (next === state.page) {
    return;
  }
  state.page = next;
  renderPagination(state);
  bindEvents(state);
  if (focus) {
    state.root.querySelector<HTMLElement>('[aria-current="page"]')?.focus();
  }
  if (emit) {
    emitKChange(state.root, { page: state.page });
  }
}

export function bindEvents(state: KPaginationState): void {
  const first = state.root.querySelector('.k-pagination__first');
  const prev = state.root.querySelector('.k-pagination__prev');
  const next = state.root.querySelector('.k-pagination__next');
  const last = state.root.querySelector('.k-pagination__last');
  first?.addEventListener('click', () => goTo(state, 1), {
    signal: state.signal,
  });
  prev?.addEventListener('click', () => goTo(state, state.page - 1), {
    signal: state.signal,
  });
  next?.addEventListener('click', () => goTo(state, state.page + 1), {
    signal: state.signal,
  });
  last?.addEventListener('click', () => goTo(state, state.count), {
    signal: state.signal,
  });

  for (const btn of state.root.querySelectorAll<HTMLButtonElement>(
    '[data-page]',
  )) {
    btn.addEventListener('click', () => goTo(state, Number(btn.dataset.page)), {
      signal: state.signal,
    });
  }
}
