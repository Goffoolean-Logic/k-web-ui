import { describe, expect, it } from 'vitest';
import { init } from '../controller/controller.js';

function mount(className = ''): {
  state: ReturnType<typeof init>;
  abort: AbortController;
  root: HTMLElement;
  track: HTMLElement;
} {
  const track = document.createElement('div');
  const slides = [0, 1, 2].map((i) => {
    const el = document.createElement('div');
    el.id = `deals-${i}`;
    return el;
  });
  track.append(...slides);
  const root = document.createElement('div');
  root.id = 'deals';
  if (className) {
    root.className = className;
  }
  document.body.append(track, root);
  const abort = new AbortController();
  const state = init(root, slides, abort.signal);
  return { state, abort, root, track };
}

function press(root: HTMLElement, key: string): void {
  root.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
  );
}

describe('bindKeybinds', () => {
  it('does nothing when keyboard is off', () => {
    const { state, abort, root, track } = mount('k-carousel--no-keyboard');
    press(root, 'ArrowRight');
    expect(state.index).toBe(0);
    abort.abort();
    root.remove();
    track.remove();
  });

  it('moves with arrows, Home, and End', () => {
    const { state, abort, root, track } = mount();
    press(root, 'ArrowRight');
    expect(state.index).toBe(1);
    press(root, 'Home');
    expect(state.index).toBe(0);
    press(root, 'End');
    expect(state.index).toBe(2);
    abort.abort();
    root.remove();
    track.remove();
  });

  it('ignores other keys', () => {
    const { state, abort, root, track } = mount();
    press(root, 'Enter');
    expect(state.index).toBe(0);
    abort.abort();
    root.remove();
    track.remove();
  });
});
