import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Components/Card',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => `
    <div class="k-card" style="max-width: 24rem;">
      <div class="k-card__header">
        <h3 class="k-card__title">Deployment</h3>
        <p class="k-card__subtitle">Last run 4 minutes ago</p>
      </div>
      <div class="k-card__body">
        <p>Every check passed on the latest commit.</p>
      </div>
      <div class="k-card__footer">
        <button type="button" class="k-btn k-btn--ghost k-btn--sm">Cancel</button>
        <button type="button" class="k-btn k-btn--primary k-btn--sm">Promote</button>
      </div>
    </div>
  `,
};

/** Header and footer are optional. A body-only card is fine. */
export const BodyOnly: Story = {
  render: () => `
    <div class="k-card" style="max-width: 24rem;">
      <div class="k-card__body">
        <p>Just a body.</p>
      </div>
    </div>
  `,
};
