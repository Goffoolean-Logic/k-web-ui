import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Foundations/Colors',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

const SEMANTIC_TOKENS = [
  'surface',
  'surface-raised',
  'surface-hard',
  'surface-soft',
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

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const swatch = (token: string, cssVar: string) => `
  <li class="k-grid__cell">
    <div
      class="h-12 w-full rounded-k border border-k-border"
      style="background-color: var(${cssVar});"
    ></div>
    <code>${token}</code>
  </li>
`;

const scale = (name: string) =>
  STEPS.map((step) => swatch(`${name}-${step}`, `--k-palette-${name}-${step}`)).join(
    '',
  );

/**
 * Semantic colors through the active theme. Switch the theme in the toolbar.
 * A swatch that does not move is a token missing from that theme.
 */
export const Semantic: Story = {
  render: () => `
    <ul class="k-grid k-grid--3">
      ${SEMANTIC_TOKENS.map((token) => swatch(`--k-${token}`, `--k-${token}`)).join('')}
    </ul>
  `,
};

/** Brand scale. Light page wash, fields, actions, borders, and focus. */
export const Orange: Story = {
  render: () => `<ul class="k-grid k-grid--4">${scale('orange')}</ul>`,
};

/**
 * Dark page scale. 950 is black. Raised panels sit on 900. Stronger fills
 * sit on 800.
 */
export const Steel: Story = {
  render: () => `<ul class="k-grid k-grid--4">${scale('steel')}</ul>`,
};

/** Cool gray. Unused by the current themes. */
export const Neutral: Story = {
  render: () => `<ul class="k-grid k-grid--4">${scale('neutral')}</ul>`,
};
