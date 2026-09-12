import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Components/Sidebar',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

const panel = (id: string) => `
  <input id="${id}" type="checkbox" class="k-sidebar__toggle">
  <label for="${id}" class="k-sidebar__scrim"></label>
  <aside class="k-sidebar__panel">
    <label for="${id}" class="k-sidebar__trigger">Close</label>
    <a class="k-link" href="#overview">Overview</a>
    <a class="k-link" href="#projects">Projects</a>
    <a class="k-link" href="#settings">Settings</a>
  </aside>
`;

/**
 * Host is `.k-sidebar` with a checkbox toggle, scrim, panel, then main.
 * The checkbox is the open state — no JS.
 */
export const Default: Story = {
  render: () => `
    <div class="k-sidebar" style="min-height: 16rem;">
      ${panel('nav-toggle')}
      <div class="k-sidebar__main">
        <label for="nav-toggle" class="k-sidebar__trigger">Menu</label>
        <p class="text-sm" style="margin-top: 1rem;">The page content stays in the main column.</p>
      </div>
    </div>
  `,
};

export const End: Story = {
  render: () => `
    <div class="k-sidebar k-sidebar--end" style="min-height: 16rem;">
      ${panel('nav-toggle-end')}
      <div class="k-sidebar__main">
        <label for="nav-toggle-end" class="k-sidebar__trigger">Filters</label>
        <p class="text-sm" style="margin-top: 1rem;">Opens from the end edge.</p>
      </div>
    </div>
  `,
};
