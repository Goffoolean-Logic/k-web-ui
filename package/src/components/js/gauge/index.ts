import { defineElement } from '../root.js';
import {
  applyGaugeAttributes,
  init,
  paint,
  parseNumber,
  percentOf,
  setBooleanAttribute,
  stepValue,
} from './controller/controller.js';
import {
  isGaugeSize,
  isGaugeVariant,
  type KGaugeOptions,
  type KGaugeSize,
  type KGaugeVariant,
} from './models/models.js';

export type {
  KGaugeOptions,
  KGaugeSize,
  KGaugeVariant,
} from './models/models.js';

/**
 * Keep `value` / `max` and `--k-gauge` in step. Omit `value` for an empty
 * gauge. Pass `text` to control the visible reading.
 *
 *   setGauge(el, 64, 100);
 */
export function setGauge(
  el: KGauge,
  value?: number,
  max: number = el.max || 1,
  text?: string,
): void {
  el.max = max;
  if (text !== undefined) {
    el.text = text;
  }
  el.value = value;
  if (!el.isConnected) {
    paint(el);
  }
}

/**
 * Gauge frame. The host is `<k-gauge class="k-gauge">`. `value`, `max`,
 * `label`, `text`, `variant`, `size`, and `indeterminate` are attributes.
 * The tag writes a hidden progress, the reading, and the caption.
 *
 *   <k-gauge id="upload" class="k-gauge" value="64" max="100" label="Upload"></k-gauge>
 */
export class KGauge extends HTMLElement {
  static get observedAttributes(): string[] {
    return [
      'value',
      'max',
      'label',
      'text',
      'variant',
      'size',
      'indeterminate',
    ];
  }

  connectedCallback(): void {
    init(this);
  }

  attributeChangedCallback(): void {
    if (this.isConnected) {
      paint(this);
    }
  }

  get value(): number | undefined {
    return parseNumber(this.getAttribute('value'));
  }

  set value(next: number | undefined) {
    if (next === undefined || !Number.isFinite(next)) {
      this.removeAttribute('value');
      return;
    }
    this.setAttribute('value', String(next));
  }

  get max(): number {
    return parseNumber(this.getAttribute('max')) ?? 1;
  }

  set max(next: number) {
    this.setAttribute('max', String(next));
  }

  /** Share of `max` the gauge shows, 0 to 100. Empty reads as 0. */
  get percent(): number {
    return percentOf(this.value, this.max);
  }

  /** True when the gauge has no value, so it renders as an empty frame. */
  get isEmpty(): boolean {
    return this.value === undefined;
  }

  get isComplete(): boolean {
    const value = this.value;
    return value !== undefined && value >= this.max;
  }

  get label(): string {
    return this.getAttribute('label') ?? '';
  }

  set label(next: string) {
    if (next) {
      this.setAttribute('label', next);
      return;
    }
    this.removeAttribute('label');
  }

  get text(): string {
    return this.getAttribute('text') ?? '';
  }

  set text(next: string) {
    if (next) {
      this.setAttribute('text', next);
      return;
    }
    this.removeAttribute('text');
  }

  get variant(): KGaugeVariant | undefined {
    const raw = this.getAttribute('variant');
    return isGaugeVariant(raw) ? raw : undefined;
  }

  set variant(next: KGaugeVariant | undefined) {
    if (next && isGaugeVariant(next)) {
      this.setAttribute('variant', next);
      return;
    }
    this.removeAttribute('variant');
  }

  get size(): KGaugeSize | undefined {
    const raw = this.getAttribute('size');
    return isGaugeSize(raw) ? raw : undefined;
  }

  set size(next: KGaugeSize | undefined) {
    if (next && isGaugeSize(next)) {
      this.setAttribute('size', next);
      return;
    }
    this.removeAttribute('size');
  }

  get indeterminate(): boolean {
    return this.hasAttribute('indeterminate');
  }

  set indeterminate(next: boolean) {
    setBooleanAttribute(this, 'indeterminate', next);
  }

  /** Raises the value, stopping at `max`. Starts from 0 when empty. */
  increment(by = 1): void {
    this.value = stepValue(this.value, this.max, by);
  }

  /** Lowers the value, stopping at 0. */
  decrement(by = 1): void {
    this.value = stepValue(this.value, this.max, -by);
  }

  /** Fills the gauge to `max`. */
  complete(): void {
    this.value = this.max;
  }

  /** Drops the value so the gauge renders empty again. */
  clear(): void {
    this.value = undefined;
  }

  /** The hidden `<progress>` the gauge keeps in step. */
  getProgress(): HTMLProgressElement | null {
    return this.querySelector(':scope > progress');
  }

  /** Rewrites the progress, reading, and caption from the attributes. */
  refresh(): void {
    paint(this);
  }
}

defineElement('k-gauge', KGauge);

declare global {
  interface HTMLElementTagNameMap {
    'k-gauge': KGauge;
  }
}

/**
 * Empty `<k-gauge class="k-gauge">` with attributes. The tag writes the
 * reading and the caption. `indeterminate: true` turns on the empty-state
 * animation.
 */
export function createGauge(options: KGaugeOptions = {}): KGauge {
  const el = document.createElement('k-gauge');
  el.className = 'k-gauge';
  applyGaugeAttributes(el, options);
  paint(el);
  return el;
}
