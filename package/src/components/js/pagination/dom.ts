import { createIcon, type KIconName } from '../icon.js';
import type { KPaginationState } from './models.js';

/** At or below this, every page is listed and first/last are omitted. */
const FEW_PAGES = 5;
const WINDOW = 3;

function control(
  className: string,
  label: string,
  icon: KIconName,
  disabled: boolean,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `k-pagination__btn ${className}`;
  btn.setAttribute('aria-label', label);
  btn.disabled = disabled;
  btn.append(createIcon(icon, 'sm'));
  return btn;
}

function pageButton(
  page: number,
  current: number,
  count: number,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'k-pagination__btn k-pagination__page';
  btn.textContent = String(page);
  btn.dataset.page = String(page);
  btn.setAttribute('aria-label', `Page ${page} of ${count}`);
  if (page === current) {
    btn.classList.add('k-pagination__current');
    btn.setAttribute('aria-current', 'page');
  }
  return btn;
}

function visiblePages(page: number, count: number): number[] {
  if (count <= FEW_PAGES) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  let start = page - 1;
  let end = page + 1;
  if (start < 1) {
    start = 1;
    end = WINDOW;
  }
  if (end > count) {
    end = count;
    start = count - WINDOW + 1;
  }

  const pages: number[] = [];
  for (let n = start; n <= end; n++) {
    pages.push(n);
  }
  return pages;
}

export function renderPagination(state: KPaginationState): void {
  const atStart = state.page <= 1;
  const atEnd = state.page >= state.count;
  const few = state.count <= FEW_PAGES;

  const prev = control(
    'k-pagination__prev',
    'Previous page',
    'chevron-left',
    atStart,
  );
  const next = control(
    'k-pagination__next',
    'Next page',
    'chevron-right',
    atEnd,
  );
  const pages = visiblePages(state.page, state.count).map((n) =>
    pageButton(n, state.page, state.count),
  );

  const buttons = few
    ? [prev, ...pages, next]
    : [
        control('k-pagination__first', 'First page', 'chevron-first', atStart),
        prev,
        ...pages,
        next,
        control('k-pagination__last', 'Last page', 'chevron-last', atEnd),
      ];

  state.buttons = buttons;
  state.root.replaceChildren(...buttons);
}
