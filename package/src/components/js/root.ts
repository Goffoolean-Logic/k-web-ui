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
