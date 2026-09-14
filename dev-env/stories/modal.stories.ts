import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Components/Modal',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

/**
 * A dialog with popover and `.k-modal`. A button with matching
 * popovertarget opens it. No JS.
 */
export const Default: Story = {
  render: () => `
    <button type="button" class="k-btn k-btn--primary" popovertarget="delete-modal">
      Delete file
    </button>
    <dialog id="delete-modal" class="k-modal" popover>
      <button
        type="button"
        class="k-modal__scrim"
        popovertarget="delete-modal"
        popovertargetaction="hide"
        aria-label="Close"
      ></button>
      <div class="k-modal__box">
        <h3 class="k-modal__title">Delete file</h3>
        <p class="k-modal__body">This will remove report.pdf from the project. You can't undo this.</p>
        <div class="k-modal__actions">
          <button type="button" class="k-btn k-btn--ghost" popovertarget="delete-modal" popovertargetaction="hide">
            Cancel
          </button>
          <button type="button" class="k-btn k-btn--primary" popovertarget="delete-modal" popovertargetaction="hide">
            Delete
          </button>
        </div>
      </div>
    </dialog>
  `,
};
