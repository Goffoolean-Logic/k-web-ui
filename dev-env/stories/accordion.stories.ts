import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Components/Accordion',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

const items = (name?: string) => `
  <details class="k-accordion__item"${name ? ` name="${name}"` : ''} open>
    <summary class="k-accordion__trigger">Billing</summary>
    <div class="k-accordion__panel">Invoices go out on the first of the month. Download them from the receipts page.</div>
  </details>
  <details class="k-accordion__item"${name ? ` name="${name}"` : ''}>
    <summary class="k-accordion__trigger">Notifications</summary>
    <div class="k-accordion__panel">Email for mentions and a weekly summary. You can mute a thread anytime.</div>
  </details>
  <details class="k-accordion__item"${name ? ` name="${name}"` : ''}>
    <summary class="k-accordion__trigger">Privacy</summary>
    <div class="k-accordion__panel">Session cookies only. You can export or delete your data from settings.</div>
  </details>
`;

/**
 * A `.k-accordion` of `details.k-accordion__item`. Native details, no JS.
 * Same `name` on each details makes the group exclusive.
 */
export const Default: Story = {
  render: () => `
    <div class="k-accordion" style="max-width: 28rem;">
      ${items()}
    </div>
  `,
};

export const Exclusive: Story = {
  render: () => `
    <div class="k-accordion" style="max-width: 28rem;">
      ${items('settings')}
    </div>
  `,
};
