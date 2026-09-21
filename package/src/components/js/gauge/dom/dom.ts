function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function fillPercent(value: number, max: number): number {
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

/**
 * Builds the dial reading from value.
 * No format → number. "%" → percent. Anything else → currency prefix.
 */
export function formatReadout(value: number, format?: string): string {
  const n = formatValue(value);
  const kind = format?.trim();
  if (!kind) {
    return n;
  }
  if (kind === '%') {
    return `${n}%`;
  }
  return `${kind}${n}`;
}

/** Blank text is not an override; format (or the plain number) still drives the dial. */
export function readoutText(
  value: number,
  format?: string,
  text?: string,
): string {
  if (text != null && text !== '') {
    return text;
  }
  return formatReadout(value, format);
}

function asProgress(el: HTMLElement): HTMLProgressElement | null {
  if (el instanceof HTMLProgressElement) {
    return el;
  }
  return el.querySelector(':scope > progress');
}

function readoutFor(host: HTMLElement): HTMLElement | null {
  return host.querySelector(':scope > .k-gauge__value');
}

function captionFor(host: HTMLElement): HTMLElement | null {
  return host.querySelector(':scope > .k-gauge__label');
}

function setFill(
  progress: HTMLProgressElement,
  host: HTMLElement,
  pct: string,
): void {
  progress.style.setProperty('--k-gauge', pct);
  host.style.setProperty('--k-gauge', pct);
}

export function applyProgress(
  host: HTMLElement,
  progress: HTMLProgressElement,
  value: number | undefined,
  max: number,
  text?: string,
  format?: string,
): void {
  const nextMax = Number.isFinite(max) && max > 0 ? max : 1;
  progress.max = nextMax;

  if (value === undefined || !Number.isFinite(value)) {
    progress.removeAttribute('value');
    setFill(progress, host, '0%');
    progress.textContent = '';
    const readout = readoutFor(host);
    if (readout) {
      readout.textContent = text != null && text !== '' ? text : '';
    }
    return;
  }

  const nextValue = clamp(value, 0, nextMax);
  progress.value = nextValue;
  const pct = fillPercent(nextValue, nextMax);
  setFill(progress, host, `${pct}%`);
  progress.textContent = `${Math.round(pct)}%`;
  const readout = readoutFor(host);
  if (readout) {
    readout.textContent = readoutText(nextValue, format, text);
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

export type GaugePaintOptions = {
  value?: number;
  max?: number;
  label?: string;
  format?: string;
  text?: string;
  indeterminate?: boolean;
};

export function paint(
  host: HTMLElement,
  options: GaugePaintOptions = {},
): void {
  host.classList.add('k-gauge');

  let progress = asProgress(host);
  if (!progress) {
    progress = document.createElement('progress');
    host.prepend(progress);
  }

  ensureFrame(host, progress);
  const frame = host.querySelector(':scope > .k-gauge__frame') ?? progress;
  const readout = ensurePart(host, '.k-gauge__value', 'k-gauge__value', frame);
  readout.setAttribute('aria-hidden', 'true');

  const label = options.label ?? '';
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

  applyProgress(
    host,
    progress,
    options.indeterminate ? undefined : options.value,
    options.max ?? 1,
    options.text,
    options.format,
  );
}
