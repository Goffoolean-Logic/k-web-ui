import { emitKChange } from '../../root.js';
import { overflowOf, paint, syncOverlay } from '../dom/dom.js';
import type { KScrollbarState } from '../models/models.js';

const HIDE_MS = 700;

function emitScroll(state: KScrollbarState): void {
  if (state.silent) {
    return;
  }
  emitKChange(state.root, {
    scrollTop: state.viewport.scrollTop,
    scrollLeft: state.viewport.scrollLeft,
  });
}

function markScrolling(state: KScrollbarState): void {
  if (!state.autohide) {
    return;
  }
  state.root.setAttribute('data-scrolling', '');
  window.clearTimeout(Number(state.root.dataset.kScrollbarHideTimer || 0));
  const timer = window.setTimeout(() => {
    state.root.removeAttribute('data-scrolling');
  }, HIDE_MS);
  state.root.dataset.kScrollbarHideTimer = String(timer);
}

export function scrollTo(
  state: KScrollbarState,
  top?: number,
  left?: number,
  { emit = true } = {},
): void {
  const view = state.viewport;
  state.silent = !emit;
  if (top !== undefined) {
    view.scrollTop = top;
  }
  if (left !== undefined) {
    view.scrollLeft = left;
  }
  paint(state);
  if (emit) {
    emitKChange(state.root, {
      scrollTop: view.scrollTop,
      scrollLeft: view.scrollLeft,
    });
  }
  state.silent = false;
}

export function beginDrag(
  state: KScrollbarState,
  axis: 'x' | 'y',
  pointerId: number,
  clientPos: number,
  thumb: HTMLElement,
): void {
  state.dragging = true;
  state.dragAxis = axis;
  state.dragPointer = pointerId;
  state.dragStartPos = clientPos;
  state.dragStartScroll =
    axis === 'y' ? state.viewport.scrollTop : state.viewport.scrollLeft;
  state.root.setAttribute('data-dragging', '');
  thumb.setPointerCapture?.(pointerId);
}

export function moveDrag(state: KScrollbarState, clientPos: number): void {
  const axis = state.dragAxis;
  if (!state.dragging || !axis) {
    return;
  }
  const { overflow } = overflowOf(state.viewport, axis);
  const track = axis === 'y' ? state.vTrack : state.hTrack;
  const trackSize = axis === 'y' ? track.clientHeight : track.clientWidth;
  const thumb = axis === 'y' ? state.vThumb : state.hThumb;
  const thumbSize = axis === 'y' ? thumb.offsetHeight : thumb.offsetWidth;
  const maxPos = Math.max(0, trackSize - thumbSize);
  const delta = clientPos - state.dragStartPos;
  const scrollDelta = maxPos <= 0 ? 0 : (delta / maxPos) * overflow;
  state.silent = true;
  if (axis === 'y') {
    state.viewport.scrollTop = state.dragStartScroll + scrollDelta;
  } else {
    state.viewport.scrollLeft = state.dragStartScroll + scrollDelta;
  }
  paint(state);
  state.silent = false;
}

export function endDrag(state: KScrollbarState): void {
  if (!state.dragging) {
    return;
  }
  state.dragging = false;
  state.dragAxis = null;
  state.dragPointer = null;
  state.root.removeAttribute('data-dragging');
  emitScroll(state);
}

export function jumpTo(
  state: KScrollbarState,
  axis: 'x' | 'y',
  clientPos: number,
): void {
  const track = axis === 'y' ? state.vTrack : state.hTrack;
  const thumb = axis === 'y' ? state.vThumb : state.hThumb;
  const rect = track.getBoundingClientRect();
  const offset = axis === 'y' ? clientPos - rect.top : clientPos - rect.left;
  const trackSize = axis === 'y' ? rect.height : rect.width;
  const thumbSize = axis === 'y' ? thumb.offsetHeight : thumb.offsetWidth;
  const { overflow } = overflowOf(state.viewport, axis);
  const maxPos = Math.max(0, trackSize - thumbSize);
  const thumbPos = Math.min(maxPos, Math.max(0, offset - thumbSize / 2));
  const next = maxPos <= 0 ? 0 : (thumbPos / maxPos) * overflow;
  if (axis === 'y') {
    scrollTo(state, next, undefined);
    return;
  }
  scrollTo(state, undefined, next);
}

function axisForThumb(
  state: KScrollbarState,
  target: EventTarget | null,
): 'x' | 'y' | null {
  if (!(target instanceof Element)) {
    return null;
  }
  if (state.vThumb === target || state.vThumb.contains(target)) {
    return 'y';
  }
  if (state.hThumb === target || state.hThumb.contains(target)) {
    return 'x';
  }
  return null;
}

function axisForTrack(
  state: KScrollbarState,
  target: EventTarget | null,
): 'x' | 'y' | null {
  if (!(target instanceof Element)) {
    return null;
  }
  if (state.vTrack === target) {
    return 'y';
  }
  if (state.hTrack === target) {
    return 'x';
  }
  return null;
}

export function bindEvents(state: KScrollbarState, signal: AbortSignal): void {
  const view = state.viewport;
  view.addEventListener(
    'scroll',
    () => {
      paint(state);
      markScrolling(state);
      emitScroll(state);
    },
    { signal },
  );

  const onWindow = () => {
    syncOverlay(state);
    paint(state);
  };
  if (state.mode === 'target') {
    window.addEventListener('scroll', onWindow, { signal, capture: true });
    window.addEventListener('resize', onWindow, { signal });
  }

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => paint(state));
    observer.observe(view);
    if (view.firstElementChild) {
      observer.observe(view.firstElementChild);
    }
    observer.observe(state.root);
    observer.observe(state.vTrack);
    observer.observe(state.hTrack);
    signal.addEventListener('abort', () => observer.disconnect(), {
      once: true,
    });
  }

  if (state.mode === 'wrap') {
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (
            node === state.viewport ||
            node === state.vTrack ||
            node === state.hTrack
          ) {
            continue;
          }
          if (node.parentNode === state.root) {
            state.viewport.append(node);
          }
        }
      }
      paint(state);
    });
    mutations.observe(state.root, { childList: true });
    signal.addEventListener('abort', () => mutations.disconnect(), {
      once: true,
    });
  }

  state.root.addEventListener(
    'pointerdown',
    (event) => {
      const pointer = event as PointerEvent;
      const thumbAxis = axisForThumb(state, pointer.target);
      if (thumbAxis) {
        pointer.preventDefault();
        beginDrag(
          state,
          thumbAxis,
          pointer.pointerId,
          thumbAxis === 'y' ? pointer.clientY : pointer.clientX,
          thumbAxis === 'y' ? state.vThumb : state.hThumb,
        );
        return;
      }
      const trackAxis = axisForTrack(state, pointer.target);
      if (trackAxis) {
        pointer.preventDefault();
        jumpTo(
          state,
          trackAxis,
          trackAxis === 'y' ? pointer.clientY : pointer.clientX,
        );
      }
    },
    { signal },
  );

  state.root.addEventListener(
    'pointermove',
    (event) => {
      if (!state.dragging) {
        return;
      }
      const pointer = event as PointerEvent;
      if (
        state.dragPointer !== null &&
        pointer.pointerId !== state.dragPointer
      ) {
        return;
      }
      moveDrag(
        state,
        state.dragAxis === 'y' ? pointer.clientY : pointer.clientX,
      );
    },
    { signal },
  );

  const stopDrag = () => endDrag(state);
  state.root.addEventListener('pointerup', stopDrag, { signal });
  state.root.addEventListener('pointercancel', stopDrag, { signal });
}
