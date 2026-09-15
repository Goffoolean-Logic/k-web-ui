import type { KGaugeOptions } from '../models/models.js';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function fillPercent(value: number, max: number): number {
  if (max <= 0) {
    return 0;
  }
  return clamp((value / max) * 100, 0, 100);
}

function formatValue(value: number): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(
    value,
  );
}

function parseNumber(raw: string | null): number | undefined {
  if (raw === null || raw === '') {
    return undefined;
  }
  const next = Number(raw);
  return Number.isFinite(next) ? next : undefined;
}

function asProgress(el: HTMLElement): HTMLProgressElement | null {
  if (el instanceof HTMLProgressElement) {
    return el;
  }
  return el.querySelector(':scope > progress.k-gauge');
}

function groupFor(el: HTMLElement): HTMLElement | null {
  if (el.tagName === 'K-GAUGE' || el.classList.contains('k-gauge-group')) {
    return el;
  }
  return el.closest('k-gauge, .k-gauge-group');
}

function readoutFor(el: HTMLElement): HTMLElement | null {
  return groupFor(el)?.querySelector(':scope > .k-gauge__value') ?? null;
}

function captionFor(el: HTMLElement): HTMLElement | null {
  return groupFor(el)?.querySelector(':scope > .k-gauge__label') ?? null;
}

function setFill(progress: HTMLProgressElement, pct: string): void {
  progress.style.setProperty('--k-gauge', pct);
  groupFor(progress)?.style.setProperty('--k-gauge', pct);
}

export function applyProgress(
  progress: HTMLProgressElement,
  value: number | undefined,
  max: number,
  text?: string,
): void {
  const nextMax = Number.isFinite(max) && max > 0 ? max : 1;
  progress.max = nextMax;

  if (value === undefined || !Number.isFinite(value)) {
    progress.removeAttribute('value');
    setFill(progress, '0%');
    progress.textContent = '';
    const readout = readoutFor(progress);
    if (readout) {
      readout.textContent = text ?? '';
    }
    return;
  }

  const nextValue = clamp(value, 0, nextMax);
  progress.value = nextValue;
  const pct = fillPercent(nextValue, nextMax);
  setFill(progress, `${pct}%`);
  progress.textContent = `${Math.round(pct)}%`;
  const readout = readoutFor(progress);
  if (readout) {
    readout.textContent = text ?? formatValue(nextValue);
  }
}

const SEGMENTS = ['left', 'top', 'right'] as const;

function ensureFrame(host: HTMLElement, progress: HTMLProgressElement): void {
  if (host.querySelector(':scope > .k-gauge__frame')) {
    return;
  }

  const frame = document.createElement('span');
  frame.className = 'k-gauge__frame';
  frame.setAttribute('aria-hidden', 'true');
  for (const layer of ['track', 'fill']) {
    for (const side of SEGMENTS) {
      const seg = document.createElement('span');
      seg.className = `k-gauge__seg k-gauge__seg--${layer} k-gauge__seg--${side}`;
      frame.append(seg);
    }
  }
  progress.after(frame);
}

function ensurePart(
  host: HTMLElement,
  selector: string,
  className: string,
  after: Element,
): HTMLSpanElement {
  const existing = host.querySelector(`:scope > ${selector}`);
  if (existing instanceof HTMLSpanElement) {
    return existing;
  }
  const part = document.createElement('span');
  part.className = className;
  after.after(part);
  return part;
}

function progressClassNames(host: HTMLElement): string {
  const names = ['k-gauge'];
  for (const name of host.classList) {
    if (name.startsWith('k-gauge--')) {
      names.push(name);
    }
  }
  return names.join(' ');
}

export function classNames(options: KGaugeOptions): string {
  const names = ['k-gauge'];
  if (options.block) {
    names.push('k-gauge--block');
  }
  if (options.indeterminate) {
    names.push('k-gauge--indeterminate');
  }
  if (options.size) {
    names.push(`k-gauge--${options.size}`);
  }
  if (options.variant) {
    names.push(`k-gauge--${options.variant}`);
  }
  return names.join(' ');
}

export function paint(host: HTMLElement): void {
  const ring =
    host.tagName === 'K-GAUGE' || host.classList.contains('k-gauge--ring');
  host.classList.toggle('k-gauge--ring', ring);
  host.classList.toggle('k-gauge-group', ring);

  let progress = asProgress(host);
  if (!progress) {
    progress = document.createElement('progress');
    host.prepend(progress);
  }
  progress.className = progressClassNames(host);

  if (ring) {
    ensureFrame(host, progress);
    const frame = host.querySelector(':scope > .k-gauge__frame') ?? progress;
    const readout = ensurePart(
      host,
      '.k-gauge__value',
      'k-gauge__value',
      frame,
    );
    readout.setAttribute('aria-hidden', 'true');

    const label = host.getAttribute('label') ?? '';
    if (label) {
      const caption = ensurePart(
        host,
        '.k-gauge__label',
        'k-gauge__label',
        readout,
      );
      caption.textContent = label;
      caption.id = `${host.id || 'k-gauge'}-label`;
      progress.setAttribute('aria-labelledby', caption.id);
      progress.removeAttribute('aria-label');
    } else {
      captionFor(host)?.remove();
      progress.removeAttribute('aria-labelledby');
    }
  } else {
    host.querySelector(':scope > .k-gauge__frame')?.remove();
    readoutFor(host)?.remove();
    captionFor(host)?.remove();
    const label = host.getAttribute('label') ?? '';
    if (label) {
      progress.setAttribute('aria-label', label);
    } else {
      progress.removeAttribute('aria-label');
    }
  }

  const busy = host.classList.contains('k-gauge--indeterminate');
  applyProgress(
    progress,
    busy ? undefined : parseNumber(host.getAttribute('value')),
    parseNumber(host.getAttribute('max')) ?? 1,
    host.getAttribute('text') || undefined,
  );
}
