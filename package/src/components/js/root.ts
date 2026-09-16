export function resolveRoot(
  target: string | HTMLElement,
  name: string,
): HTMLElement {
  if (typeof target !== 'string') {
    return target;
  }

  const id = target.startsWith('#') ? target.slice(1) : target;
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`${name}: no element with id "${id}"`);
  }
  return el;
}

export function parseJsonList(raw: string | null, name: string): unknown[] {
  if (raw === null || raw.trim() === '') {
    return [];
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`${name}: invalid JSON`);
  }
  if (!Array.isArray(parsed)) {
    throw new Error(`${name}: expected a JSON array`);
  }
  return parsed;
}

export function fill(node: HTMLElement, content: string | Node): void {
  if (typeof content === 'string') {
    node.textContent = content;
    return;
  }
  node.replaceChildren(content);
}

export function defineElement(
  name: `${string}-${string}`,
  ctor: CustomElementConstructor,
): void {
  if (customElements.get(name) === undefined) {
    customElements.define(name, ctor);
  }
}

/**
 * Item-list edits for the `panels`, `slides`, and `options` properties. Each
 * returns a new array, or the original when the index misses, so assigning
 * the result is what triggers a rebuild.
 */
export function insertAt<T>(items: T[], item: T, at?: number): T[] {
  const next = [...items];
  next.splice(at ?? next.length, 0, item);
  return next;
}

export function removeAt<T>(items: T[], index: number): T[] {
  if (index < 0 || index >= items.length) {
    return items;
  }
  const next = [...items];
  next.splice(index, 1);
  return next;
}

export function patchAt<T>(items: T[], index: number, patch: Partial<T>): T[] {
  const current = items[index];
  if (!current) {
    return items;
  }
  const next = [...items];
  next[index] = { ...current, ...patch };
  return next;
}

export function emitKChange(
  host: EventTarget,
  detail: Record<string, unknown>,
): void {
  host.dispatchEvent(
    new CustomEvent('k-change', {
      bubbles: true,
      detail,
    }),
  );
}
