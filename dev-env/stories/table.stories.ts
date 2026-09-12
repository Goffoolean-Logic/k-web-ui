import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Components/Table',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

const rows = `
  <thead>
    <tr>
      <th>Name</th>
      <th>Role</th>
      <th>Status</th>
      <th>Updated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ada Kim</td>
      <td>Admin</td>
      <td>Active</td>
      <td>Mar 4</td>
    </tr>
    <tr>
      <td>Sam Ortiz</td>
      <td>Editor</td>
      <td>Invited</td>
      <td>Mar 2</td>
    </tr>
    <tr>
      <td>Riley Chen</td>
      <td>Viewer</td>
      <td>Active</td>
      <td>Feb 28</td>
    </tr>
    <tr>
      <td>Jordan Blake</td>
      <td>Editor</td>
      <td>Paused</td>
      <td>Feb 12</td>
    </tr>
  </tbody>
`;

/**
 * Host is a `table.k-table`. Chrome only — no JS.
 */
export const Default: Story = {
  render: () => `<table class="k-table">${rows}</table>`,
};

export const Zebra: Story = {
  render: () => `<table class="k-table k-table--zebra">${rows}</table>`,
};

export const Small: Story = {
  render: () =>
    `<table class="k-table k-table--sm k-table--zebra">${rows}</table>`,
};
