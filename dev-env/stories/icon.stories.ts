import type { Meta, StoryObj } from '@storybook/html-vite';
import { K_ICON_NAMES } from 'k-web-components/js';

const meta: Meta = {
  title: 'Foundations/Iconography',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

const icon = (name: string, size?: string) =>
  `<span class="k-icon k-icon--${name}${size ? ` k-icon--${size}` : ''}" aria-hidden="true"></span>`;

/**
 * Host is a span with `.k-icon` and a name modifier. The glyph is a CSS mask —
 * no inline SVG required. `createIcon(name)` builds the same markup from JS.
 */
export const Set: Story = {
  render: () => `
    <ul class="k-grid">
      ${K_ICON_NAMES.map(
        (name) => `
          <li class="k-grid__cell">
            ${icon(name, 'sm')}
            <code>${name}</code>
          </li>
        `,
      ).join('')}
    </ul>
  `,
};

export const Sizes: Story = {
  render: () => `
    <div class="flex flex-wrap items-end gap-8 text-k-fg">
      ${(['xs', 'sm', '', 'lg'] as const)
        .map((size) => {
          const label = size || 'md';
          return `
            <div class="flex flex-col items-center gap-2">
              ${icon('info', size)}
              <code class="text-xs text-k-fg-muted">${label}</code>
            </div>
          `;
        })
        .join('')}
    </div>
  `,
};

/** Same glyphs on the components that actually ship. */
export const OnChrome: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 36rem;">
      <div class="flex flex-wrap items-center gap-3">
        <button type="button" class="k-btn k-btn--primary">
          ${icon('success')}
          Save
        </button>
        <button type="button" class="k-btn k-btn--secondary">
          ${icon('chevron-left')}
          Back
        </button>
        <button type="button" class="k-btn k-btn--ghost k-btn--sm" aria-label="Close">
          ${icon('close')}
        </button>
        <button type="button" class="k-btn k-btn--secondary" disabled>
          <span class="k-spin">${icon('loading')}</span>
          Saving
        </button>
      </div>
      <div role="alert" class="k-banner k-banner--info">
        ${icon('info')}
        <span>New software update available.</span>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <span class="k-badge k-badge--info">${icon('info')} Info</span>
        <span class="k-badge k-badge--success">${icon('success')} Success</span>
        <span class="k-badge k-badge--warning">${icon('warning')} Warning</span>
        <span class="k-badge k-badge--danger">${icon('danger')} Danger</span>
      </div>
    </div>
  `,
};
