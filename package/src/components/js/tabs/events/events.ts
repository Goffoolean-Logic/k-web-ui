import { emitKChange } from '../../root.js';
import { tabFromEvent } from '../dom/dom.js';
import type { KTabsState } from '../models/models.js';

const INK_MS = 400;

function prefersReducedMotion(): boolean {
  return (
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function box(el: HTMLElement): {
  top: number;
  left: number;
  width: number;
  height: number;
} {
  return {
    top: el.offsetTop,
    left: el.offsetLeft,
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}

function applyBox(
  ink: HTMLElement,
  next: { top: number; left: number; width: number; height: number },
): void {
  ink.style.top = `${next.top}px`;
  ink.style.left = `${next.left}px`;
  ink.style.width = `${next.width}px`;
  ink.style.height = `${next.height}px`;
}

function visualBox(ink: HTMLElement): {
  top: number;
  left: number;
  width: number;
  height: number;
} {
  const parent = ink.offsetParent;
  const running =
    typeof ink.getAnimations === 'function' ? ink.getAnimations() : [];
  if (!(parent instanceof HTMLElement) || running.length === 0) {
    return box(ink);
  }

  const inkRect = ink.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  const style = getComputedStyle(parent);
  return {
    top:
      inkRect.top -
      parentRect.top -
      (Number.parseFloat(style.borderTopWidth) || 0) -
      (Number.parseFloat(style.paddingTop) || 0),
    left:
      inkRect.left -
      parentRect.left -
      (Number.parseFloat(style.borderLeftWidth) || 0) -
      (Number.parseFloat(style.paddingLeft) || 0),
    width: inkRect.width,
    height: inkRect.height,
  };
}

export function paintInk(state: KTabsState, { animate = true } = {}): void {
  const tab = state.tabs.find(
    (item) => item.getAttribute('aria-selected') === 'true',
  );
  const ink = state.ink;
  if (!(tab instanceof HTMLElement) || !(ink instanceof HTMLElement)) {
    return;
  }

  const next = box(tab);
  const running =
    typeof ink.getAnimations === 'function' ? ink.getAnimations() : [];
  const canAnimate =
    animate &&
    !prefersReducedMotion() &&
    typeof ink.animate === 'function' &&
    (ink.offsetWidth > 0 || running.length > 0);

  if (!canAnimate) {
    for (const motion of running) {
      motion.cancel();
    }
    applyBox(ink, next);
    return;
  }

  const prev = visualBox(ink);
  if (
    prev.top === next.top &&
    prev.left === next.left &&
    prev.width === next.width &&
    prev.height === next.height
  ) {
    return;
  }

  for (const motion of running) {
    motion.cancel();
  }
  applyBox(ink, next);
  ink.animate(
    [
      {
        top: `${prev.top}px`,
        left: `${prev.left}px`,
        width: `${prev.width}px`,
        height: `${prev.height}px`,
      },
      {
        top: `${next.top}px`,
        left: `${next.left}px`,
        width: `${next.width}px`,
        height: `${next.height}px`,
      },
    ],
    { duration: INK_MS, easing: 'ease-in-out' },
  );
}

export function selectTab(
  state: KTabsState,
  index: number,
  { focus = false, emit = true } = {},
): void {
  const next = state.tabs[index];
  if (!next) {
    return;
  }

  for (const [i, tab] of state.tabs.entries()) {
    const on = i === index;
    tab.setAttribute('aria-selected', String(on));
    tab.tabIndex = on ? 0 : -1;
    const panel = state.panels[i];
    if (panel) {
      panel.hidden = !on;
    }
  }

  paintInk(state);

  if (state.ink && state.ink.offsetWidth === 0) {
    requestAnimationFrame(() => paintInk(state, { animate: false }));
  }

  if (focus) {
    next.focus();
  }

  if (emit) {
    emitKChange(state.root, { selected: index });
  }
}

export function bindEvents(state: KTabsState, signal: AbortSignal): void {
  state.root.addEventListener(
    'click',
    (event) => {
      const tab = tabFromEvent(state.root, event);
      if (!tab) {
        return;
      }
      const index = state.tabs.indexOf(tab);
      if (index >= 0) {
        selectTab(state, index, { focus: true });
      }
    },
    { signal },
  );

  const list = state.root.querySelector('.k-tabs__list');
  if (list && typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => {
      paintInk(state, { animate: false });
    });
    observer.observe(list);
    signal.addEventListener('abort', () => observer.disconnect(), {
      once: true,
    });
  }
}
