function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Share of `max` that `value` covers, as 0 to 100. */
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
  return el.querySelector(':scope > progress');
}

function groupFor(el: HTMLElement): HTMLElement | null {
  if (el.tagName === 'K-GAUGE') {
    return el;
  }
  return el.closest('k-gauge');
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

function stripHostModifiers(host: HTMLElement): void {
  host.classList.add('k-gauge');
  for (const name of [...host.classList]) {
    if (name.startsWith('k-gauge--')) {
      host.classList.remove(name);
    }
  }
}

export function paint(host: HTMLElement): void {
  stripHostModifiers(host);

  let progress = asProgress(host);
  if (!progress) {
    progress = document.createElement('progress');
    host.prepend(progress);
  }

  ensureFrame(host, progress);
  const frame = host.querySelector(':scope > .k-gauge__frame') ?? progress;
  const readout = ensurePart(host, '.k-gauge__value', 'k-gauge__value', frame);
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

  applyProgress(
    progress,
    host.hasAttribute('indeterminate')
      ? undefined
      : parseNumber(host.getAttribute('value')),
    parseNumber(host.getAttribute('max')) ?? 1,
    host.getAttribute('text') || undefined,
  );
}
