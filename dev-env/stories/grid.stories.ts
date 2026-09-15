import type { Meta, StoryObj } from '@storybook/html-vite';
import { K_ICON_NAMES } from 'k-web-ui/js';

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

const card = (label: string) => `
  <div class="k-card">
    <div class="k-card__body"><p>${label}</p></div>
  </div>
`;

/** Columns auto-fill. A list, because the cells are a set. */
export const AutoFill: Story = {
  render: () => `
    <ul class="k-grid">
      ${K_ICON_NAMES.map(cell).join('')}
    </ul>
  `,
};

/** `--3` pins three columns. Cards do not need a cell wrapper. */
export const FixedColumns: Story = {
  render: () => `
    <div class="k-grid k-grid--3">
      ${['Deploy', 'Checks', 'Preview', 'Build', 'Review', 'Ship'].map(card).join('')}
    </div>
  `,
};

/** `--tight` shortens the gap and cell padding. */
export const Tight: Story = {
  render: () => `
    <ul class="k-grid k-grid--tight">
      ${K_ICON_NAMES.map(cell).join('')}
    </ul>
  `,
};
