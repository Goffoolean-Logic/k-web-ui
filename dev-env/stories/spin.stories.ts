import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Components/Spin',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

const icon = (name: string, size?: string) =>
  `<span class="k-icon k-icon--${name}${size ? ` k-icon--${size}` : ''}" aria-hidden="true"></span>`;

/**
 * `.k-spin` around a `.k-icon`. The wrapper rotates. The glyph does not.
 */
export const Default: Story = {
  render: () => `
    <span class="k-spin">${icon('loading', 'lg')}</span>
  `,
};

export const Sizes: Story = {
  render: () => `
    <div class="flex flex-wrap items-end gap-8">
      <span class="k-spin">${icon('loading', 'xs')}</span>
      <span class="k-spin">${icon('loading', 'sm')}</span>
      <span class="k-spin">${icon('loading')}</span>
      <span class="k-spin">${icon('loading', 'lg')}</span>
    </div>
  `,
};

export const InButton: Story = {
  render: () => `
    <button type="button" class="k-btn k-btn--secondary" disabled>
      <span class="k-spin">${icon('loading')}</span>
      Saving
    </button>
  `,
};
