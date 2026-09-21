import { optionsEqual } from '../content.js';
import { defineElement } from '../root.js';
import { init, paint, percentOf, stepValue } from './controller/controller.js';
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

export function setGauge(
  el: KGauge,
  value?: number,
  max: number = el.max || 1,
): void {
  el.options = {
    ...el.options,
    max,
    value,
  };
}

export class KGauge extends HTMLElement {
  #opts: KGaugeOptions = {};

  connectedCallback(): void {
    this.classList.add('k-gauge');
    init(this);
    paint(this, this.#opts);
  }

  get options(): KGaugeOptions {
    return this.#opts;
  }

  set options(value: KGaugeOptions) {
    const next: KGaugeOptions = {
      ...value,
      format: value.format?.trim() || undefined,
      text: value.text || undefined,
    };
    if (optionsEqual(next, this.#opts)) {
      return;
    }
    this.#opts = next;
    this.#syncClasses();
    paint(this, this.#opts);
  }

  #syncClasses(): void {
    this.classList.add('k-gauge');
    this.classList.toggle('k-gauge--sm', this.#opts.size === 'sm');
    this.classList.toggle('k-gauge--lg', this.#opts.size === 'lg');
    this.classList.toggle(
      'k-gauge--indeterminate',
      Boolean(this.#opts.indeterminate),
    );
    for (const name of ['info', 'success', 'warning', 'danger'] as const) {
      this.classList.toggle(`k-gauge--${name}`, this.#opts.variant === name);
    }
  }

  get value(): number | undefined {
    return this.#opts.indeterminate ? undefined : this.#opts.value;
  }

  set value(next: number | undefined) {
    this.options = { ...this.#opts, value: next };
  }

  get max(): number {
    return this.#opts.max ?? 1;
  }

  set max(next: number) {
    this.options = { ...this.#opts, max: next };
  }

  get percent(): number {
    return percentOf(this.value, this.max);
  }

  get isEmpty(): boolean {
    return this.value === undefined;
  }

  get isComplete(): boolean {
    const value = this.value;
    return value !== undefined && value >= this.max;
  }

  get label(): string {
    return this.#opts.label ?? '';
  }

  set label(next: string) {
    this.options = { ...this.#opts, label: next || undefined };
  }

  get format(): string {
    return this.#opts.format ?? '';
  }

  set format(next: string) {
    this.options = { ...this.#opts, format: next || undefined };
  }

  get text(): string {
    return this.#opts.text ?? '';
  }

  set text(next: string) {
    this.options = { ...this.#opts, text: next || undefined };
  }

  get variant(): KGaugeVariant | undefined {
    return this.#opts.variant;
  }

  set variant(next: KGaugeVariant | undefined) {
    this.options = { ...this.#opts, variant: next };
  }

  get size(): KGaugeSize | undefined {
    return this.#opts.size;
  }

  set size(next: KGaugeSize | undefined) {
    this.options = { ...this.#opts, size: next };
  }

  get indeterminate(): boolean {
    return Boolean(this.#opts.indeterminate);
  }

  set indeterminate(next: boolean) {
    this.options = { ...this.#opts, indeterminate: next || undefined };
  }

  increment(by = 1): void {
    this.value = stepValue(this.value, this.max, by);
  }

  decrement(by = 1): void {
    this.value = stepValue(this.value, this.max, -by);
  }

  complete(): void {
    this.value = this.max;
  }

  clear(): void {
    this.value = undefined;
  }

  getProgress(): HTMLProgressElement | null {
    return this.querySelector(':scope > progress');
  }

  refresh(): void {
    if (this.isConnected) {
      paint(this, this.#opts);
    }
  }
}

defineElement('k-gauge', KGauge);

declare global {
  interface HTMLElementTagNameMap {
    'k-gauge': KGauge;
  }
}

export function createGauge(options: KGaugeOptions = {}): KGauge {
  const el = document.createElement('k-gauge');
  el.options = options;
  paint(el, options);
  return el;
}

// Keep type guards available for callers that branch on size/variant strings.
export { isGaugeSize, isGaugeVariant };
