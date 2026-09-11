import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Foundations/Tokens',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

const SEMANTIC_TOKENS = [
  'surface',
  'surface-raised',
  'field',
  'field-fg',
  'fg',
  'fg-muted',
  'border',
  'primary',
  'primary-fg',
  'primary-hover',
  'accent',
  'accent-fg',
  'accent-hover',
  'danger',
  'danger-fg',
  'ring',
];

/**
 * Every semantic token, resolved through the active theme. Switch the theme in
 * the toolbar to confirm each one repoints — a swatch that doesn't move is a
 * token missing from that theme.
 */
export const Colors: Story = {
  render: () => `
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      ${SEMANTIC_TOKENS.map(
        (token) => `
        <div class="k-card">
          <div class="k-card__body">
            <div
              class="h-12 w-full rounded-k border border-k-border"
              style="background-color: var(--k-${token});"
            ></div>
            <code class="text-xs text-k-fg-muted">--k-${token}</code>
          </div>
        </div>
      `,
      ).join('')}
    </div>
  `,
};

/**
 * Focus styling is defined once in the base layer and scoped to k- classes.
 * Tab through these to confirm every component gets an identical ring.
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
