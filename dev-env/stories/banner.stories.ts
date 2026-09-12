import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Components/Banner',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

const iconInfo = '<span class="k-icon k-icon--info" aria-hidden="true"></span>';
const iconSuccess =
  '<span class="k-icon k-icon--success" aria-hidden="true"></span>';
const iconWarning =
  '<span class="k-icon k-icon--warning" aria-hidden="true"></span>';
const iconDanger =
  '<span class="k-icon k-icon--danger" aria-hidden="true"></span>';

/**
 * A div with role="alert" and .k-banner. Icon, body, and actions are optional.
 */
export const Default: Story = {
  render: () => `
    <div role="alert" class="k-banner">
      ${iconInfo}
      <span>12 unread messages. Tap to see.</span>
    </div>
  `,
};

export const Info: Story = {
  render: () => `
    <div role="alert" class="k-banner k-banner--info">
      ${iconInfo}
      <span>New software update available.</span>
    </div>
  `,
};

export const Success: Story = {
  render: () => `
    <div role="alert" class="k-banner k-banner--success">
      ${iconSuccess}
      <span>Your purchase has been confirmed.</span>
    </div>
  `,
};

export const Warning: Story = {
  render: () => `
    <div role="alert" class="k-banner k-banner--warning">
      ${iconWarning}
      <span>Invalid email address.</span>
    </div>
  `,
};

export const Danger: Story = {
  render: () => `
    <div role="alert" class="k-banner k-banner--danger">
      ${iconDanger}
      <span>Task failed successfully.</span>
    </div>
  `,
};

export const Soft: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      <div role="alert" class="k-banner k-banner--info k-banner--soft">
        <span>12 unread messages. Tap to see.</span>
      </div>
      <div role="alert" class="k-banner k-banner--success k-banner--soft">
        <span>Your purchase has been confirmed.</span>
      </div>
      <div role="alert" class="k-banner k-banner--warning k-banner--soft">
        <span>Invalid email address.</span>
      </div>
      <div role="alert" class="k-banner k-banner--danger k-banner--soft">
        <span>Task failed successfully.</span>
      </div>
    </div>
  `,
};

export const Outline: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      <div role="alert" class="k-banner k-banner--info k-banner--outline">
        <span>12 unread messages. Tap to see.</span>
      </div>
      <div role="alert" class="k-banner k-banner--success k-banner--outline">
        <span>Your purchase has been confirmed.</span>
      </div>
      <div role="alert" class="k-banner k-banner--warning k-banner--outline">
        <span>Invalid email address.</span>
      </div>
      <div role="alert" class="k-banner k-banner--danger k-banner--outline">
        <span>Task failed successfully.</span>
      </div>
    </div>
  `,
};

export const Dash: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      <div role="alert" class="k-banner k-banner--info k-banner--dash">
        <span>12 unread messages. Tap to see.</span>
      </div>
      <div role="alert" class="k-banner k-banner--success k-banner--dash">
        <span>Your purchase has been confirmed.</span>
      </div>
      <div role="alert" class="k-banner k-banner--warning k-banner--dash">
        <span>Invalid email address.</span>
      </div>
      <div role="alert" class="k-banner k-banner--danger k-banner--dash">
        <span>Task failed successfully.</span>
      </div>
    </div>
  `,
};

/** Stacks on a narrow canvas. Becomes a row from 40rem with k-banner--sm-horizontal. */
export const WithActions: Story = {
  render: () => `
    <div role="alert" class="k-banner k-banner--vertical k-banner--sm-horizontal">
      ${iconInfo}
      <span>We use cookies for no reason.</span>
      <div class="k-banner__actions">
        <button type="button" class="k-btn k-btn--ghost k-btn--sm">Deny</button>
        <button type="button" class="k-btn k-btn--primary k-btn--sm">Accept</button>
      </div>
    </div>
  `,
};

export const WithTitle: Story = {
  render: () => `
    <div role="alert" class="k-banner k-banner--vertical k-banner--sm-horizontal">
      ${iconInfo}
      <div class="k-banner__body">
        <h3 class="k-banner__title">New message</h3>
        <p class="k-banner__description">You have 1 unread message.</p>
      </div>
      <div class="k-banner__actions">
        <button type="button" class="k-btn k-btn--secondary k-btn--sm">See</button>
      </div>
    </div>
  `,
};
