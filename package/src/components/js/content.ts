export function requireHostId(host: HTMLElement): string {
  const id = host.id.trim();
  if (!id) {
    throw new Error(`${host.localName}: id is required`);
  }
  return id;
}

/** Consecutive `#${id}-0`, `#${id}-1`, … until the first miss. */
export function contentNodes(host: HTMLElement): HTMLElement[] {
  const id = requireHostId(host);
  const nodes: HTMLElement[] = [];
  for (let i = 0; ; i += 1) {
    const node = document.getElementById(`${id}-${i}`);
    if (!node) {
      break;
    }
    nodes.push(node);
  }
  return nodes;
}

/**
 * Runs `onReady` when at least `#${id}-0` exists. Waits with a MutationObserver
 * instead of throwing on first paint.
 */
export function watchContent(
  host: HTMLElement,
  onReady: (nodes: HTMLElement[]) => void,
  signal: AbortSignal,
): void {
  requireHostId(host);

  const tryReady = (): boolean => {
    const nodes = contentNodes(host);
    if (nodes.length === 0) {
      return false;
    }
    onReady(nodes);
    return true;
  };

  if (tryReady()) {
    return;
  }

  const root = document.body ?? document.documentElement;
  const observer = new MutationObserver(() => {
    if (tryReady()) {
      observer.disconnect();
    }
  });
  observer.observe(root, { childList: true, subtree: true });
  signal.addEventListener(
    'abort',
    () => {
      observer.disconnect();
    },
    { once: true },
  );
}

export function setInactive(node: HTMLElement, inactive: boolean): void {
  node.hidden = inactive;
  if (inactive) {
    node.setAttribute('inert', '');
  } else {
    node.removeAttribute('inert');
  }
}

export function optionsEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
