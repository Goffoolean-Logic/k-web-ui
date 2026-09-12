import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Components/Grid',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

const cell = (name: string) => `
  <li class="k-grid__cell">
    <span class="k-icon k-icon--${name} k-icon--sm" aria-hidden="true"></span>
    <code>${name}</code>
  </li>
`;

/** Columns auto-fill. A list, because the cells are a set. */
export const AutoFill: Story = {
  render: () => `
    <ul class="k-grid">
      ${['info', 'success', 'warning', 'danger', 'close', 'loading'].map(cell).join('')}
    </ul>
  `,
};

/** `--3` pins three columns. Cards do not need a cell wrapper. */
export const FixedColumns: Story = {
  render: () => `
    <div class="k-grid k-grid--3">
      <div class="k-card">
        <div class="k-card__body"><p>Deploy</p></div>
      </div>
      <div class="k-card">
        <div class="k-card__body"><p>Checks</p></div>
      </div>
      <div class="k-card">
        <div class="k-card__body"><p>Preview</p></div>
      </div>
    </div>
  `,
};

/** `--tight` shortens the gap and cell padding. */
export const Tight: Story = {
  render: () => `
    <ul class="k-grid k-grid--tight">
      ${['chevron-left', 'chevron-right', 'chevron-down', 'chevron-first', 'chevron-last'].map(cell).join('')}
    </ul>
  `,
};
