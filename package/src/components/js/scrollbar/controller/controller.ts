import { resolveRoot } from '../../root.js';
import {
  buildScrollbar,
  paint,
  readAxis,
  setAutohide,
  setAxis,
} from '../dom/dom.js';
import { bindEvents } from '../events/events.js';
import type { KScrollbarSize, KScrollbarState } from '../models/models.js';

/** Re-exported so `index.ts` only ever reaches for the controller. */
export {
  hasOverflowX,
  hasOverflowY,
  paint,
  readAxis,
  setAxis,
  teardown,
} from '../dom/dom.js';
export { scrollTo } from '../events/events.js';

export function isSize(raw: string | null): raw is KScrollbarSize {
  return raw === 'sm' || raw === 'lg';
}

export function resolveViewport(
  root: HTMLElement,
  raw: string | null,
): { viewport: HTMLElement; mode: 'wrap' | 'target' } {
  if (raw === null || raw === '') {
    return { viewport: root, mode: 'wrap' };
  }
  if (raw === 'viewport' || raw === 'html') {
    const scroller =
      (document.scrollingElement as HTMLElement | null) ??
      document.documentElement;
    return { viewport: scroller, mode: 'target' };
  }
  try {
    return { viewport: resolveRoot(raw, 'KScrollbar'), mode: 'target' };
  } catch {
    const found = document.querySelector(raw);
    if (found instanceof HTMLElement) {
      return { viewport: found, mode: 'target' };
    }
    throw new Error(`KScrollbar: no element matching "${raw}"`);
  }
}

export function setBooleanAttribute(
  el: HTMLElement,
  name: string,
  next: boolean,
): void {
  if (next) {
    el.setAttribute(name, '');
    return;
  }
  el.removeAttribute(name);
}

let targetSeq = 0;

/**
 * Mounts a `k-scrollbar` that paints over `target`. Reuses one already
 * attached to the same node.
 */
export function attachScrollbar(
  target: HTMLElement | 'viewport' = 'viewport',
): HTMLElement {
  if (target === 'viewport') {
    const existing = document.querySelector('k-scrollbar[target="viewport"]');
    if (existing instanceof HTMLElement) {
      return existing;
    }
    const el = document.createElement('k-scrollbar');
    el.className = 'k-scrollbar';
    el.setAttribute('target', 'viewport');
    document.body.append(el);
    return el;
  }

  let id = target.getAttribute('data-k-scrollbar-id');
  if (!id) {
    targetSeq += 1;
    id = `k-scrollbar-target-${targetSeq}`;
    target.setAttribute('data-k-scrollbar-id', id);
  }
  const selector = `[data-k-scrollbar-id="${id}"]`;
  const existing = document.querySelector(`k-scrollbar[target='${selector}']`);
  if (existing instanceof HTMLElement) {
    return existing;
  }
  const el = document.createElement('k-scrollbar');
  el.className = 'k-scrollbar';
  el.setAttribute('target', selector);
  document.body.append(el);
  return el;
}

export function init(root: HTMLElement, signal: AbortSignal): KScrollbarState {
  const { viewport, mode } = resolveViewport(root, root.getAttribute('target'));
  const state: KScrollbarState = {
    root,
    viewport,
    vTrack: root,
    vThumb: root,
    hTrack: root,
    hThumb: root,
    axis: readAxis(root.getAttribute('axis')),
    mode,
    autohide: root.hasAttribute('autohide'),
    dragging: false,
    dragAxis: null,
    dragPointer: null,
    dragStartPos: 0,
    dragStartScroll: 0,
    silent: false,
    signal,
  };

  setAutohide(state, state.autohide);
  buildScrollbar(state);
  bindEvents(state, signal);
  if (typeof requestAnimationFrame === 'function') {
    const frame = requestAnimationFrame(() => paint(state));
    signal.addEventListener('abort', () => cancelAnimationFrame(frame), {
      once: true,
    });
  }
  return state;
}

/**
 * `axis` and `autohide` patch. `target` and `size` need a rebuild for
 * `target`; `size` is CSS-only so it is a no-op here.
 */
export function applyAttribute(state: KScrollbarState, name: string): boolean {
  if (name === 'axis') {
    setAxis(state, readAxis(state.root.getAttribute('axis')));
    return true;
  }
  if (name === 'autohide') {
    setAutohide(state, state.root.hasAttribute('autohide'));
    return true;
  }
  if (name === 'size') {
    return true;
  }
  return false;
}

export function disconnectState(state: KScrollbarState): void {
  const timer = Number(state.root.dataset.kScrollbarHideTimer || 0);
  if (timer) {
    window.clearTimeout(timer);
  }
}
