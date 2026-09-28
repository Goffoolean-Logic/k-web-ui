import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Foundations/Styles',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

/** The one corner radius. */
export const Radius: Story = {
  render: () => `
    <div
      class="rounded-k bg-k-surface-raised border border-k-border"
      style="display: flex; align-items: center; justify-content: center; min-height: 6rem; min-width: 10rem;"
    >
      rounded-k
    </div>
  `,
};

/**
 * Three elevations. shadow-k-1 is a resting lift, 2 is a menu, 3 is an overlay.
 * Switch to dark to see the stronger dark-mode shadows.
 */
export const Shadows: Story = {
  render: () => `
    <div class="flex flex-wrap items-center gap-8" style="padding: 1.5rem;">
      <div
        class="rounded-k bg-k-surface-raised shadow-k-1"
        style="display: flex; align-items: center; justify-content: center; min-height: 6rem; min-width: 10rem;"
      >
        shadow-k-1
      </div>
      <div
        class="rounded-k bg-k-surface-raised shadow-k-2"
        style="display: flex; align-items: center; justify-content: center; min-height: 6rem; min-width: 10rem;"
      >
        shadow-k-2
      </div>
      <div
        class="rounded-k bg-k-surface-raised shadow-k-3"
        style="display: flex; align-items: center; justify-content: center; min-height: 6rem; min-width: 10rem;"
      >
        shadow-k-3
      </div>
    </div>
  `,
};

/**
 * Focus styling is defined once in the base layer and scoped to k- classes.
 * Tab through these. Every component should get the same ring.
 */
export const FocusRing: Story = {
  render: () => `
    <div class="flex flex-wrap items-center gap-3">
      <button type="button" class="k-btn k-btn--primary">Button</button>
      <a href="#" class="k-link">Anchor</a>
      <input class="k-input" style="max-width: 12rem;" placeholder="Input" />
    </div>
  `,
};

/** Visually hidden text stays in the accessibility tree but off-screen. */
export const VisuallyHidden: Story = {
  render: () => `
    <p class="text-sm text-k-fg">
      There is a hidden word after this sentence.
      <span class="k-visually-hidden">supercalifragilistic</span>
      Inspect the DOM or use a screen reader to find it.
    </p>
  `,
};
