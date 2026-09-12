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
  'info',
  'info-fg',
  'success',
  'success-fg',
  'warning',
  'warning-fg',
  'ring',
];

const STEEL = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/**
 * Dark canvas scale. 950 is black. Switch to dark to see these become the
 * surface stack — canvas at 950, raised chrome at 900, hard at 800.
 */
export const Steel: Story = {
  render: () => `
    <ul class="k-grid k-grid--4">
      ${STEEL.map(
        (step) => `
        <li class="k-grid__cell">
          <div
            class="h-12 w-full rounded-k border border-k-border"
            style="background-color: var(--k-palette-steel-${step});"
          ></div>
          <code>--k-palette-steel-${step}</code>
        </li>
      `,
      ).join('')}
    </ul>
  `,
};

/**
 * Every semantic token, resolved through the active theme. Switch the theme in
 * the toolbar to confirm each one repoints — a swatch that doesn't move is a
 * token missing from that theme.
 */
export const Colors: Story = {
  render: () => `
    <ul class="k-grid k-grid--3">
      ${SEMANTIC_TOKENS.map(
        (token) => `
        <li class="k-grid__cell">
          <div
            class="h-12 w-full rounded-k border border-k-border"
            style="background-color: var(--k-${token});"
          ></div>
          <code>--k-${token}</code>
        </li>
      `,
      ).join('')}
    </ul>
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
