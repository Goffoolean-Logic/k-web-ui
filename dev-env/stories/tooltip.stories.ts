import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Components/Tooltip',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

/**
 * Host is a span with `.k-tooltip` and `data-tip`. Shows on hover and
 * focus-within — no JS.
 */
export const Default: Story = {
  render: () => `
    <div style="padding: 3rem;">
      <span class="k-tooltip" data-tip="Saved 2 minutes ago">
        <button type="button" class="k-btn k-btn--secondary">Save</button>
      </span>
    </div>
  `,
};

export const Placements: Story = {
  render: () => `
    <div style="display: flex; flex-wrap: wrap; gap: 3rem; padding: 4rem; justify-content: center;">
      <span class="k-tooltip" data-tip="Default: above">
        <button type="button" class="k-btn k-btn--secondary">Top</button>
      </span>
      <span class="k-tooltip k-tooltip--bottom" data-tip="Below the control">
        <button type="button" class="k-btn k-btn--secondary">Bottom</button>
      </span>
      <span class="k-tooltip k-tooltip--left" data-tip="To the left">
        <button type="button" class="k-btn k-btn--secondary">Left</button>
      </span>
      <span class="k-tooltip k-tooltip--right" data-tip="To the right">
        <button type="button" class="k-btn k-btn--secondary">Right</button>
      </span>
    </div>
  `,
};
