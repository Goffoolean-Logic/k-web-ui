import type { KScrollbarAxis, KScrollbarState } from '../models/models.js';

const MIN_THUMB = 24;

export function isAxis(raw: string | null): raw is KScrollbarAxis {
  return raw === 'x' || raw === 'y' || raw === 'both';
}

export function readAxis(raw: string | null): KScrollbarAxis {
  return isAxis(raw) ? raw : 'both';
}

function createTrack(
  axis: 'x' | 'y',
  viewportId: string,
): { track: HTMLElement; thumb: HTMLElement } {
  const track = document.createElement('div');
  track.className = `k-scrollbar__track k-scrollbar__track--${axis}`;

  const thumb = document.createElement('div');
  thumb.className = `k-scrollbar__thumb k-scrollbar__thumb--${axis}`;
  thumb.tabIndex = -1;
  thumb.setAttribute('role', 'scrollbar');
  thumb.setAttribute(
    'aria-orientation',
    axis === 'y' ? 'vertical' : 'horizontal',
  );
  if (viewportId) {
    thumb.setAttribute('aria-controls', viewportId);
  }
  thumb.setAttribute('aria-valuemin', '0');
  thumb.setAttribute('aria-valuemax', '100');
  thumb.setAttribute('aria-valuenow', '0');
  track.append(thumb);
  return { track, thumb };
}

function viewportIdFor(root: HTMLElement, viewport: HTMLElement): string {
  if (viewport === document.documentElement || viewport === document.body) {
    return viewport.id;
  }
  if (viewport.id) {
    return viewport.id;
  }
  const id = `${root.id || 'k-scrollbar'}-viewport`;
  viewport.id = id;
  return id;
}

function reuseTracks(root: HTMLElement): {
  vTrack: HTMLElement;
  vThumb: HTMLElement;
  hTrack: HTMLElement;
  hThumb: HTMLElement;
} | null {
  const vTrack = root.querySelector<HTMLElement>(
    ':scope > .k-scrollbar__track--y',
  );
  const hTrack = root.querySelector<HTMLElement>(
    ':scope > .k-scrollbar__track--x',
  );
  const vThumb = vTrack?.querySelector<HTMLElement>('.k-scrollbar__thumb');
  const hThumb = hTrack?.querySelector<HTMLElement>('.k-scrollbar__thumb');
  if (!vTrack || !hTrack || !vThumb || !hThumb) {
    return null;
  }
  return { vTrack, vThumb, hTrack, hThumb };
}

/** Builds the viewport and tracks, or reuses them on a second connect. */
export function buildScrollbar(state: KScrollbarState): void {
  const root = state.root;

  if (state.mode === 'target') {
    const viewportId = viewportIdFor(root, state.viewport);
    const reused = reuseTracks(root);
    if (reused) {
      Object.assign(state, reused);
    } else {
      const vertical = createTrack('y', viewportId);
      const horizontal = createTrack('x', viewportId);
      state.vTrack = vertical.track;
      state.vThumb = vertical.thumb;
      state.hTrack = horizontal.track;
      state.hThumb = horizontal.thumb;
      root.replaceChildren(state.vTrack, state.hTrack);
    }
    state.viewport.setAttribute('data-k-scrollbar', '');
    paint(state);
    return;
  }

  const existing = root.querySelector<HTMLElement>(
    ':scope > .k-scrollbar__viewport',
  );
  if (existing) {
    state.viewport = existing;
    const reused = reuseTracks(root);
    if (reused) {
      Object.assign(state, reused);
    }
    paint(state);
    return;
  }

  const viewport = document.createElement('div');
  viewport.className = 'k-scrollbar__viewport';
  viewport.tabIndex = 0;
  viewport.append(...root.childNodes);
  state.viewport = viewport;
  const viewportId = viewportIdFor(root, viewport);
  const vertical = createTrack('y', viewportId);
  const horizontal = createTrack('x', viewportId);
  state.vTrack = vertical.track;
  state.vThumb = vertical.thumb;
  state.hTrack = horizontal.track;
  state.hThumb = horizontal.thumb;
  root.replaceChildren(viewport, state.vTrack, state.hTrack);
  paint(state);
}

function isDocumentScroller(el: HTMLElement): boolean {
  return (
    el === document.documentElement ||
    el === document.body ||
    el === document.scrollingElement
  );
}

export function syncOverlay(state: KScrollbarState): void {
  if (state.mode !== 'target') {
    return;
  }
  const root = state.root;
  if (isDocumentScroller(state.viewport)) {
    root.style.inset = '0px';
    root.style.width = 'auto';
    root.style.height = 'auto';
    root.style.top = '';
    root.style.left = '';
    return;
  }
  const rect = state.viewport.getBoundingClientRect();
  root.style.inset = 'auto';
  root.style.top = `${rect.top}px`;
  root.style.left = `${rect.left}px`;
  root.style.width = `${rect.width}px`;
  root.style.height = `${rect.height}px`;
}

function paintAxis(state: KScrollbarState, axis: 'x' | 'y'): void {
  const enabled = state.axis === 'both' || state.axis === axis;
  const track = axis === 'y' ? state.vTrack : state.hTrack;
  const thumb = axis === 'y' ? state.vThumb : state.hThumb;
  if (!enabled) {
    track.hidden = true;
    return;
  }

  const view = state.viewport;
  const client = axis === 'y' ? view.clientHeight : view.clientWidth;
  const scroll = axis === 'y' ? view.scrollHeight : view.scrollWidth;
  const pos = axis === 'y' ? view.scrollTop : view.scrollLeft;
  const overflow = scroll - client;

  track.hidden = false;

  if (overflow <= 0 || client <= 0) {
    track.setAttribute('data-idle', '');
    return;
  }

  track.removeAttribute('data-idle');
  const trackSize =
    (axis === 'y' ? track.offsetHeight : track.offsetWidth) ||
    (axis === 'y' ? state.root.clientHeight : state.root.clientWidth) ||
    client;
  if (trackSize <= 0) {
    return;
  }
  const size = Math.max(MIN_THUMB, (client / scroll) * trackSize);
  const maxPos = Math.max(0, trackSize - size);
  const thumbPos = maxPos === 0 ? 0 : (pos / overflow) * maxPos;
  const value = Math.round((pos / overflow) * 100);

  if (axis === 'y') {
    thumb.style.height = `${size}px`;
    thumb.style.transform = `translateY(${thumbPos}px)`;
  } else {
    thumb.style.width = `${size}px`;
    thumb.style.transform = `translateX(${thumbPos}px)`;
  }
  thumb.setAttribute('aria-valuenow', String(value));
}

/** Sizes and places both thumbs from the live scroll metrics. */
export function paint(state: KScrollbarState): void {
  if (!state.vTrack || !state.hTrack) {
    return;
  }
  syncOverlay(state);
  paintAxis(state, 'y');
  paintAxis(state, 'x');
}

export function overflowOf(
  viewport: HTMLElement,
  axis: 'x' | 'y',
): { client: number; scroll: number; pos: number; overflow: number } {
  const client = axis === 'y' ? viewport.clientHeight : viewport.clientWidth;
  const scroll = axis === 'y' ? viewport.scrollHeight : viewport.scrollWidth;
  const pos = axis === 'y' ? viewport.scrollTop : viewport.scrollLeft;
  return { client, scroll, pos, overflow: scroll - client };
}

export function hasOverflowY(state: KScrollbarState): boolean {
  return overflowOf(state.viewport, 'y').overflow > 0;
}

export function hasOverflowX(state: KScrollbarState): boolean {
  return overflowOf(state.viewport, 'x').overflow > 0;
}

export function setAxis(state: KScrollbarState, axis: KScrollbarAxis): void {
  state.axis = axis;
  paint(state);
}

export function setAutohide(state: KScrollbarState, autohide: boolean): void {
  state.autohide = autohide;
}

/** Moves viewport children back onto the host and drops generated chrome. */
export function teardown(state: KScrollbarState): void {
  if (state.mode === 'wrap' && state.viewport?.parentNode === state.root) {
    state.root.append(...state.viewport.childNodes);
    state.viewport.remove();
  }
  if (state.mode === 'target') {
    state.viewport.removeAttribute('data-k-scrollbar');
  }
  state.vTrack?.remove();
  state.hTrack?.remove();
}
