import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Foundations/Typography',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

const PANGRAM = 'The quick brown fox jumps over the lazy dog.';

/**
 * Outfit on kit chrome. Switch the theme in the toolbar — the face does not
 * change, only the ink.
 */
export const Outfit: Story = {
  render: () => `
    <div class="k-card" style="max-width: 40rem;">
      <div class="k-card__body">
        <p class="text-xs text-k-fg-muted">Outfit 400 / text-sm</p>
        <p class="text-sm">${PANGRAM}</p>
        <p class="text-xs text-k-fg-muted" style="margin-top: 1.25rem;">Outfit 500 / text-sm</p>
        <p class="text-sm font-medium">${PANGRAM}</p>
        <p class="text-xs text-k-fg-muted" style="margin-top: 1.25rem;">Outfit 600 / text-base</p>
        <p class="text-base font-semibold">${PANGRAM}</p>
        <div class="flex flex-wrap items-end gap-3" style="margin-top: 1.25rem;">
          <span class="text-xs text-k-fg-muted">xs</span>
          <span class="text-sm">sm</span>
          <span class="text-base">base</span>
        </div>
      </div>
    </div>
  `,
};

/** IBM Plex Mono for code inside kit markup, and the font-k-mono utility. */
export const PlexMono: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 40rem;">
      <p class="text-xs text-k-fg-muted">Nested in a k- card — code uses mono automatically.</p>
      <div class="k-card">
        <div class="k-card__body">
          <code>--k-font-mono: 'IBM Plex Mono'</code>
        </div>
      </div>
      <p class="text-xs text-k-fg-muted">Utility, 400 / 500 / 600</p>
      <p class="font-k-mono text-sm text-k-fg" style="font-weight: 400;">400 0123456789 k-tabs</p>
      <p class="font-k-mono text-sm text-k-fg" style="font-weight: 500;">500 0123456789 k-tabs</p>
      <p class="font-k-mono text-sm text-k-fg" style="font-weight: 600;">600 0123456789 k-tabs</p>
    </div>
  `,
};

/** Same faces on the components that actually ship. */
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
