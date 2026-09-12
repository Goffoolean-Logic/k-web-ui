import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Components/Toast',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

/**
 * `.k-toast` wrapping banners. CSS only. Pin with `--top`, `--bottom`,
 * `--start`, `--center`, `--end`. No auto-dismiss.
 */
export const Default: Story = {
  render: () => `
    <p class="text-sm" style="min-height: 8rem;">Toasts pin to the canvas corner.</p>
    <div class="k-toast">
      <div role="alert" class="k-banner k-banner--success k-banner--soft">
        <span>Changes saved.</span>
      </div>
      <div role="alert" class="k-banner k-banner--info k-banner--soft">
        <span>Invite sent to the team.</span>
      </div>
    </div>
  `,
};

export const TopCenter: Story = {
  render: () => `
    <p class="text-sm" style="min-height: 8rem;">Pinned top-center.</p>
    <div class="k-toast k-toast--top k-toast--center">
      <div role="alert" class="k-banner k-banner--warning k-banner--soft">
        <span>Could not reach the server.</span>
      </div>
    </div>
  `,
};
