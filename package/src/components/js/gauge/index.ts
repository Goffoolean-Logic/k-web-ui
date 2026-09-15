import { defineElement } from '../root.js';
import { applyProgress, classNames, paint } from './dom/dom.js';
import type { KGaugeOptions } from './models/models.js';

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

/**
 * Keep `value` / `max` and `--k-gauge` in step. Omit `value` for an empty
 * gauge. Pass `text` to control the visible reading in a ring group.
 *
 *   setGauge(el, 64, 100);
 */
export function setGauge(
  el: HTMLProgressElement | KGauge,
  value?: number,
  max: number = el.max || 1,
  text?: string,
): void {
  if (el instanceof KGauge) {
    el.max = max;
    if (text !== undefined) {
      el.text = text;
    }
    el.value = value;
    if (!el.isConnected) {
      paint(el);
    }
    return;
  }

  applyProgress(el, value, max, text);
}

/**
 * Gauge frame. The host is `<k-gauge class="k-gauge">`. `value`, `max`,
 * `label`, and `text` are attributes. The tag writes `--ring`, the reading,
 * and the caption.
 *
 *   <k-gauge id="upload" class="k-gauge" value="64" max="100" label="Upload"></k-gauge>
 */
export class KGauge extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['value', 'max', 'label', 'text'];
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
}

defineElement('k-gauge', KGauge);

declare global {
  interface HTMLElementTagNameMap {
    'k-gauge': KGauge;
  }
}

/**
 * Native `<progress class="k-gauge">` for a bar. Prefer an empty
 * `<k-gauge id="upload" class="k-gauge">` with attributes for the ring.
 * `indeterminate: true` turns on the empty-state animation.
 */
export function createGauge(options: KGaugeOptions = {}): HTMLElement {
  if (options.ring) {
    const el = document.createElement('k-gauge');
    el.className = classNames(options);
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
    paint(el);
    return el;
  }

  const el = document.createElement('progress');
  el.className = classNames(options);
  if (options.label) {
    el.setAttribute('aria-label', options.label);
  }
  const value = options.indeterminate ? undefined : options.value;
  applyProgress(el, value, options.max ?? 1, options.text);
  return el;
}
