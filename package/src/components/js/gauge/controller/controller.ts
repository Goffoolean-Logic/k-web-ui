import { fillPercent, paint } from '../dom/dom.js';
import type { KGaugeOptions } from '../models/models.js';

/** Re-exported so `index.ts` only ever reaches for the controller. */
export { paint } from '../dom/dom.js';

// --- attributes ---

export function parseNumber(raw: string | null): number | undefined {
  if (raw === null || raw === '') {
    return undefined;
  }
  const next = Number(raw);
  return Number.isFinite(next) ? next : undefined;
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

/** Writes an options bag onto a fresh host, skipping anything unset. */
export function applyGaugeAttributes(
  el: HTMLElement,
  options: KGaugeOptions,
): void {
  if (options.max !== undefined) {
    el.setAttribute('max', String(options.max));
  }
  if (
    !options.indeterminate &&
    options.value !== undefined &&
    Number.isFinite(options.value)
  ) {
    el.setAttribute('value', String(options.value));
  }
  if (options.label) {
    el.setAttribute('label', options.label);
  }
  if (options.text) {
    el.setAttribute('text', options.text);
  }
  if (options.size) {
    el.setAttribute('size', options.size);
  }
  if (options.variant) {
    el.setAttribute('variant', options.variant);
  }
  if (options.indeterminate) {
    el.setAttribute('indeterminate', '');
  }
}

// --- reading the fill ---

/** 0 for an empty or indeterminate gauge, so callers get a usable number. */
export function percentOf(value: number | undefined, max: number): number {
  if (value === undefined || !Number.isFinite(value)) {
    return 0;
  }
  return fillPercent(value, max);
}

/** Nudges a value by `by`, held inside 0 and `max`. Empty counts as 0. */
export function stepValue(
  value: number | undefined,
  max: number,
  by: number,
): number {
  const from = value !== undefined && Number.isFinite(value) ? value : 0;
  return Math.min(max, Math.max(0, from + by));
}

// --- lifecycle ---

/** Marks the host and writes the progress, reading, and caption. */
export function init(el: HTMLElement): void {
  el.classList.add('k-gauge');
  paint(el);
}
