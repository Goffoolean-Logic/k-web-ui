import { defineElement } from '../root.js';
import { paint } from './dom/dom.js';
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

function parseNumber(raw: string | null): number | undefined {
  if (raw === null || raw === '') {
    return undefined;
  }
  const next = Number(raw);
  return Number.isFinite(next) ? next : undefined;
}

function setBooleanAttribute(
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

function applyGaugeAttributes(el: HTMLElement, options: KGaugeOptions): void {
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
    this.classList.add('k-gauge');
    paint(this);
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
