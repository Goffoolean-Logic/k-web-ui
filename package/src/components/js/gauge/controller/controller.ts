import { fillPercent, paint } from '../dom/dom.js';
import type { KGaugeOptions } from '../models/models.js';

export { paint } from '../dom/dom.js';

export function percentOf(value: number | undefined, max: number): number {
  if (value === undefined || !Number.isFinite(value)) {
    return 0;
  }
  return fillPercent(value, max);
}

export function stepValue(
  value: number | undefined,
  max: number,
  by: number,
): number {
  const from = value !== undefined && Number.isFinite(value) ? value : 0;
  return Math.min(max, Math.max(0, from + by));
}

export function init(el: HTMLElement): void {
  el.classList.add('k-gauge');
}

export function applyGaugeOptions(
  el: HTMLElement,
  options: KGaugeOptions,
): void {
  paint(el, options);
}
