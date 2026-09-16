# Layer contracts and templates

Templates below use a hypothetical `k-steps` component with a `steps` JSON attribute and a `current` index. Substitute your own names.

Write the files bottom-up: `models`, then `dom`, `events`, `keybinds`, then `controller`, then `index`. Each layer only imports from the ones above it in that list.

## `models/models.ts`

Three types: the item, the build options, and the state the layers pass around. The state carries the root, the generated nodes, and the live config.

```ts
import type { KIconName } from '../../icon.js';

export type KStepItem = {
  label: string;
  icon?: KIconName | Node;
};

export type KStepsOptions = {
  items: KStepItem[];
  label?: string;
};

/** What `getCurrent()` hands back: the index plus the live nodes. */
export type KStepsCurrent = {
  index: number;
  step: HTMLElement;
  label: string;
};

export type KStepsState = {
  root: HTMLElement;
  steps: HTMLElement[];
  current: number;
  keyboard: boolean;
  /** The items the subtree was built from, for label lookups. */
  items?: KStepItem[];
};
```

Keep a field optional when the existing layer specs construct the state without it. Adding a required field breaks every test that builds a state literal.

## `dom/dom.ts`

Builds the subtree and paints it. Assigns the generated nodes onto the state and calls `root.replaceChildren(...)`. Throws when handed an empty item list.

```ts
import { createIcon } from '../../icon.js';
import { fill } from '../../root.js';
import type { KStepsOptions, KStepsState } from '../models/models.js';

export function buildSteps(state: KStepsState, options: KStepsOptions): void {
  if (options.items.length === 0) {
    throw new Error('KSteps: at least one item is required');
  }

  const hostId = state.root.id || 'k-steps';
  const list = document.createElement('ol');
  list.className = 'k-steps__list';

  const steps: HTMLElement[] = [];
  for (const [i, item] of options.items.entries()) {
    const step = document.createElement('li');
    step.className = 'k-steps__step';
    step.id = `${hostId}-step-${i}`;
    fill(step, item.label);
    steps.push(step);
    list.append(step);
  }

  state.steps = steps;
  state.root.replaceChildren(list);
}

/** Patches one attribute without rebuilding. */
export function setStepsLabel(state: KStepsState, label: string | null): void {
  const list = state.root.querySelector('.k-steps__list');
  if (!list) {
    return;
  }
  if (label) {
    list.setAttribute('aria-label', label);
    return;
  }
  list.removeAttribute('aria-label');
}
```

Every in-place patch the element supports needs a `setX` function here. The early `if (!list) return` matters: `applyAttribute` can fire before a subtree exists.

## `events/events.ts`

Owns the state transitions and binds listeners. The transition function is exported because the controller and the listeners both call it.

```ts
import { emitKChange } from '../../root.js';
import { paint } from '../dom/dom.js';
import type { KStepsState } from '../models/models.js';

export function goTo(
  state: KStepsState,
  index: number,
  { focus = false, emit = true } = {},
): void {
  const next = state.steps[index];
  if (!next) {
    return;
  }

  state.current = index;
  paint(state);

  if (focus) {
    next.focus();
  }
  if (emit) {
    emitKChange(state.root, { current: index });
  }
}

export function bindEvents(state: KStepsState, signal: AbortSignal): void {
  state.root.addEventListener(
    'click',
    (event) => {
      const step = (event.target as Element | null)?.closest?.('.k-steps__step');
      if (!(step instanceof HTMLElement) || !state.root.contains(step)) {
        return;
      }
      const index = state.steps.indexOf(step);
      if (index >= 0) {
        goTo(state, index, { focus: true });
      }
    },
    { signal },
  );
}
```

The `{ focus, emit }` options object is the pattern that lets `applyAttribute` move state silently. Always default `emit` to `true` and pass `emit: false` from attribute handlers.

Pass `{ signal }` to every `addEventListener`. For an observer, disconnect it on abort:

```ts
signal.addEventListener('abort', () => observer.disconnect(), { once: true });
```

## `keybinds/keybinds.ts`

Binds keydown and nothing else. Check the live `state.keyboard` **inside** the handler, not around the `addEventListener` call, so the attribute can be toggled after connect.

```ts
import { goTo } from '../events/events.js';
import type { KStepsState } from '../models/models.js';

export function bindKeybinds(state: KStepsState, signal: AbortSignal): void {
  state.root.addEventListener(
    'keydown',
    (event) => {
      if (!state.keyboard) {
        return;
      }

      const last = state.steps.length - 1;
      let next: number | undefined;

      switch (event.key) {
        case 'ArrowRight':
          next = state.current === last ? 0 : state.current + 1;
          break;
        case 'Home':
          next = 0;
          break;
        default:
          return;
      }

      event.preventDefault();
      goTo(state, next, { focus: true });
    },
    { signal },
  );
}
```

## `controller/controller.ts`

Four responsibilities, in this order in the file. Open with the re-exports `index.ts` needs.

```ts
import { parseJsonList } from '../../root.js';
import { buildSteps, setStepsLabel } from '../dom/dom.js';
import { bindEvents, goTo } from '../events/events.js';
import { bindKeybinds } from '../keybinds/keybinds.js';
import type {
  KStepItem,
  KStepsCurrent,
  KStepsState,
} from '../models/models.js';

/** Re-exported so `index.ts` only ever reaches for the controller. */
export { insertAt, patchAt, removeAt } from '../../root.js';
export { goTo } from '../events/events.js';

// --- attributes ---

export function toIndex(raw: string | null): number {
  const value = Number(raw ?? 0);
  return Number.isFinite(value) ? value : 0;
}

export function parseSteps(raw: string | null): KStepItem[] {
  const list = parseJsonList(raw, 'KSteps');
  const steps: KStepItem[] = [];
  for (const entry of list) {
    if (!entry || typeof entry !== 'object') {
      throw new Error('KSteps: each step is an object');
    }
    const rec = entry as { label?: unknown; icon?: unknown };
    if (typeof rec.label !== 'string') {
      throw new Error('KSteps: each step needs a label');
    }
    const step: KStepItem = { label: rec.label };
    if (typeof rec.icon === 'string') {
      step.icon = rec.icon as KStepItem['icon'];
    }
    steps.push(step);
  }
  return steps;
}

/** Returns null when any item holds a Node, so the caller skips reflection. */
export function serializeSteps(steps: KStepItem[]): string | null {
  const json: Array<Record<string, string>> = [];
  for (const step of steps) {
    if (step.icon instanceof Node) {
      return null;
    }
    const entry: Record<string, string> = { label: step.label };
    if (typeof step.icon === 'string') {
      entry.icon = step.icon;
    }
    json.push(entry);
  }
  return JSON.stringify(json);
}

// --- reading current state ---

export function getCurrent(state: KStepsState): KStepsCurrent | null {
  const step = state.steps[state.current];
  if (!step) {
    return null;
  }
  return {
    index: state.current,
    step,
    label: state.items?.[state.current]?.label ?? step.textContent ?? '',
  };
}

export function getLabels(state: KStepsState): string[] {
  const items = state.items ?? [];
  return state.steps.map((step, i) => items[i]?.label ?? step.textContent ?? '');
}

export function indexOfLabel(state: KStepsState, label: string): number {
  return getLabels(state).indexOf(label);
}

/** Moves by `delta`, wrapping past either end unless told not to. */
export function step(
  state: KStepsState,
  delta: number,
  { wrap = true, focus = false } = {},
): void {
  const last = state.steps.length - 1;
  let next = state.current + delta;
  if (next > last) {
    next = wrap ? 0 : last;
  }
  if (next < 0) {
    next = wrap ? last : 0;
  }
  goTo(state, next, { focus });
}

// --- lifecycle ---

/** Builds the subtree, binds listeners, and applies the starting state. */
export function init(
  root: HTMLElement,
  steps: KStepItem[],
  signal: AbortSignal,
): KStepsState {
  const state: KStepsState = {
    root,
    steps: [],
    current: 0,
    keyboard: root.getAttribute('keyboard') !== 'false',
    items: steps,
  };

  buildSteps(state, {
    items: steps,
    label: root.getAttribute('label') ?? undefined,
  });
  bindEvents(state, signal);
  bindKeybinds(state, signal);
  goTo(state, toIndex(root.getAttribute('current')), { emit: false });
  return state;
}

/** Patches a live subtree in place so focus and animations survive. */
export function applyAttribute(state: KStepsState, name: string): void {
  const root = state.root;
  switch (name) {
    case 'current':
      goTo(state, toIndex(root.getAttribute('current')), { emit: false });
      break;
    case 'keyboard':
      state.keyboard = root.getAttribute('keyboard') !== 'false';
      break;
    case 'label':
      setStepsLabel(state, root.getAttribute('label'));
      break;
  }
}
```

`init` reads its own attributes off the root. That is what keeps `index.ts` free of `getAttribute` calls.

**When only some attributes can be patched**, have `applyAttribute` return a `boolean` instead and let the index rebuild on `false`. `dropdown` and `pagination` do this:

```ts
export function applyAttribute(state: KStepsState, name: string): boolean {
  if (name === 'label') {
    setStepsLabel(state, state.root.getAttribute('label'));
    return true;
  }
  return false;
}
```

## `index.ts`

```ts
import { defineElement } from '../root.js';
import {
  applyAttribute,
  getCurrent,
  getLabels,
  goTo,
  indexOfLabel,
  init,
  insertAt,
  parseSteps,
  patchAt,
  removeAt,
  serializeSteps,
  step,
} from './controller/controller.js';
import type {
  KStepItem,
  KStepsCurrent,
  KStepsState,
} from './models/models.js';

export type {
  KStepItem,
  KStepsCurrent,
  KStepsOptions,
} from './models/models.js';

type StepOptions = { wrap?: boolean; focus?: boolean };

/**
 * Steps. The host is `<k-steps class="k-steps">`. `steps`, `current`,
 * `label`, and `keyboard` are attributes. The element builds the list,
 * the steps, and the ARIA.
 *
 *   <k-steps class="k-steps" steps='[{"label":"Cart"},{"label":"Pay"}]'></k-steps>
 */
export class KSteps extends HTMLElement {
  #state: KStepsState | null = null;
  #abort = new AbortController();
  #steps: KStepItem[] | null = null;
  #reflecting = false;

  static get observedAttributes(): string[] {
    return ['steps', 'current', 'label', 'keyboard'];
  }

  connectedCallback(): void {
    this.classList.add('k-steps');
    this.#init();
  }

  disconnectedCallback(): void {
    this.disconnect();
    this.#abort = new AbortController();
    this.#state = null;
  }

  attributeChangedCallback(name: string): void {
    if (this.#reflecting) {
      return;
    }
    if (name === 'steps') {
      this.#steps = null;
    }
    if (!this.isConnected) {
      return;
    }
    if (name === 'steps') {
      this.#init();
      return;
    }
    if (this.#state) {
      applyAttribute(this.#state, name);
    }
  }

  #init(): void {
    const steps = this.steps;
    if (steps.length === 0) {
      return;
    }
    this.#abort.abort();
    this.#abort = new AbortController();
    this.#state = init(this, steps, this.#abort.signal);
  }

  /** Number of steps, readable before the element is connected. */
  get count(): number {
    return this.steps.length;
  }

  get steps(): KStepItem[] {
    return this.#steps ?? parseSteps(this.getAttribute('steps'));
  }

  set steps(value: KStepItem[]) {
    this.#steps = value;
    const json = serializeSteps(value);
    if (json !== null) {
      this.#reflecting = true;
      this.setAttribute('steps', json);
      this.#reflecting = false;
    }
    if (this.isConnected) {
      this.#init();
    }
  }

  get labels(): string[] {
    if (this.#state) {
      return getLabels(this.#state);
    }
    return this.steps.map((item) => item.label);
  }

  get current(): number {
    return this.#state?.current ?? -1;
  }

  getCurrent(): KStepsCurrent | null {
    return this.#state ? getCurrent(this.#state) : null;
  }

  getStep(index: number): HTMLElement | null {
    return this.#state?.steps[index] ?? null;
  }

  goTo(index: number, { focus = false } = {}): void {
    if (this.#state) {
      goTo(this.#state, index, { focus });
    }
  }

  /** Moves to the first step whose label matches. Returns false on a miss. */
  goToLabel(label: string): boolean {
    if (!this.#state) {
      return false;
    }
    const index = indexOfLabel(this.#state, label);
    if (index < 0) {
      return false;
    }
    goTo(this.#state, index);
    return true;
  }

  next(options?: StepOptions): void {
    if (this.#state) {
      step(this.#state, 1, options);
    }
  }

  previous(options?: StepOptions): void {
    if (this.#state) {
      step(this.#state, -1, options);
    }
  }

  addStep(item: KStepItem, at?: number): void {
    this.steps = insertAt(this.steps, item, at);
  }

  removeStep(index: number): void {
    this.steps = removeAt(this.steps, index);
  }

  updateStep(index: number, patch: Partial<KStepItem>): void {
    this.steps = patchAt(this.steps, index, patch);
  }

  /** Rebuilds the subtree from the current steps. */
  refresh(): void {
    if (this.isConnected) {
      this.#init();
    }
  }

  disconnect(): void {
    this.#abort.abort();
  }
}

defineElement('k-steps', KSteps);

declare global {
  interface HTMLElementTagNameMap {
    'k-steps': KSteps;
  }
}
```

Two ordering details in `attributeChangedCallback` that are easy to get wrong: clear the cached item list **before** the `isConnected` check, or a disconnected element keeps stale content; and check `#reflecting` first, or the property setter triggers its own rebuild.

## `package/src/components/js/index.ts`

Add the class, the value exports, and every public type. Keep the file alphabetical.

```ts
export type { KStepItem, KStepsCurrent, KStepsOptions } from './steps/index.js';
export { KSteps } from './steps/index.js';
```

A type a public method returns must be exported here, or consumers cannot name it.

## Tests

`controller.spec.ts` covers parsing, serialization, `init`, `applyAttribute`, and the read helpers. Build the state through `init` rather than by hand, so the spec exercises the real wiring:

```ts
function mount(
  labels: string[],
  attrs: Record<string, string> = {},
): { state: KStepsState; abort: AbortController; root: HTMLElement } {
  const root = document.createElement('div');
  root.id = 'checkout';
  for (const [name, value] of Object.entries(attrs)) {
    root.setAttribute(name, value);
  }
  document.body.append(root);
  const abort = new AbortController();
  const state = init(root, labels.map((label) => ({ label })), abort.signal);
  return { state, abort, root };
}
```

Abort the controller and remove the root at the end of every test. For a component with timers, drive them with `vi.useFakeTimers()` and restore real timers before returning.

`index.test.ts` covers the element: that attributes build the subtree, that config changes keep node identity, that programmatic calls emit and attribute changes do not, and that every command is inert while disconnected.

```ts
it('config changes keep the nodes', () => {
  const el = host();
  el.steps = steps;
  document.body.append(el);
  const first = el.getStep(0);
  const onChange = vi.fn();
  el.addEventListener('k-change', onChange);

  el.setAttribute('current', '1');

  expect(el.getStep(0)).toBe(first);
  expect(el.current).toBe(1);
  expect(onChange).not.toHaveBeenCalled();
  el.remove();
});
```

The `dom`, `events`, and `keybinds` specs keep testing their own layer directly and construct state literals by hand.
