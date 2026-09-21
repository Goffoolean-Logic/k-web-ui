import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Foundations/Typography',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

const PANGRAM = 'The quick brown fox jumps over the lazy dog.';

const SIZE_ROWS = [
  ['text-xs', '0.75rem / 12px'],
  ['text-sm', '0.875rem / 14px'],
  ['text-base', '1rem / 16px'],
  ['text-lg', '1.125rem / 18px'],
  ['text-xl', '1.25rem / 20px'],
  ['text-2xl', '1.5rem / 24px'],
  ['text-3xl', '1.875rem / 30px'],
  ['text-4xl', '2.25rem / 36px'],
] as const;

const WEIGHTS = [
  [100, 'Thin'],
  [200, 'Extra light'],
  [300, 'Light'],
  [400, 'Regular'],
  [500, 'Medium'],
  [600, 'Semibold'],
  [700, 'Bold'],
  [800, 'Extra bold'],
  [900, 'Black'],
] as const;

/**
 * Outfit sizes, regular weight. Switch the theme in the toolbar. The face
 * does not change, only the ink.
 */
export const OutfitSizes: Story = {
  render: () => `
    <div class="font-k-sans text-k-fg" style="max-width: 48rem;">
      ${SIZE_ROWS.map(
        ([cls, label]) => `
          <div style="padding-block: 0.75rem; border-bottom: 1px solid var(--k-border);">
            <p class="text-xs text-k-fg-muted" style="margin: 0 0 0.25rem;">${cls} · ${label}</p>
            <p class="${cls}" style="margin: 0;">${PANGRAM}</p>
          </div>
        `,
      ).join('')}
    </div>
  `,
};

/** Outfit weights 100 through 900 at text-xl. */
export const OutfitWeights: Story = {
  render: () => `
    <div class="font-k-sans text-xl text-k-fg" style="max-width: 48rem;">
      ${WEIGHTS.map(
        ([weight, label]) => `
          <div style="padding-block: 0.75rem; border-bottom: 1px solid var(--k-border);">
            <p class="text-xs text-k-fg-muted" style="margin: 0 0 0.25rem;">${weight} ${label}</p>
            <p style="margin: 0; font-weight: ${weight};">${PANGRAM}</p>
          </div>
        `,
      ).join('')}
    </div>
  `,
};

/** IBM Plex Mono sizes and the three shipped weights. */
export const PlexMono: Story = {
  render: () => `
    <div class="font-k-mono text-k-fg" style="max-width: 40rem; display: flex; flex-direction: column; gap: 1.25rem;">
      <p class="text-xs" style="margin: 0; font-weight: 400;">tabs.options = labels</p>
      <p class="text-sm" style="margin: 0; font-weight: 400;">tabs.options = labels</p>
      <p class="text-base" style="margin: 0; font-weight: 400;">tabs.options = labels</p>
      <p class="text-lg" style="margin: 0; font-weight: 400;">tabs.options = labels</p>
      <p class="text-base" style="margin: 0; font-weight: 400;">400 0123456789 --k-primary</p>
      <p class="text-base" style="margin: 0; font-weight: 500;">500 0123456789 --k-primary</p>
      <p class="text-base" style="margin: 0; font-weight: 600;">600 0123456789 --k-primary</p>
    </div>
  `,
};

/** The same faces on a field, buttons, a link, and a card. */
export const OnChrome: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 24rem;">
      <div class="k-field">
        <label class="k-label" for="type-input">Email</label>
        <input class="k-input" id="type-input" type="text" placeholder="you@example.com" />
        <p class="k-hint">We'll never share it.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button type="button" class="k-btn k-btn--primary">Primary</button>
        <button type="button" class="k-btn k-btn--secondary">Secondary</button>
        <a class="k-link" href="#">Read the guide</a>
      </div>
      <div class="k-card">
        <div class="k-card__header">
          <h3 class="k-card__title">Deployment</h3>
          <p class="k-card__subtitle">Last run 4 minutes ago</p>
        </div>
        <div class="k-card__body">
          <p>Every check passed on the latest commit.</p>
        </div>
      </div>
    </div>
  `,
};
