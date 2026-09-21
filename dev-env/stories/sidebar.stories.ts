import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Components/Sidebar',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

const nav = (id: string) => `
  <input id="${id}" type="checkbox" class="k-sidebar__toggle">
  <label for="${id}" class="k-sidebar__scrim"></label>
  <aside class="k-sidebar__panel">
    <label for="${id}" class="k-sidebar__trigger k-sidebar__trigger--close">Close</label>
    <nav class="k-sidebar__nav" aria-label="Sidebar">
      <ul class="k-sidebar__list">
        <li><a class="k-sidebar__link" href="#overview" aria-current="page">Overview</a></li>
        <li>
          <details class="k-sidebar__group" open>
            <summary class="k-sidebar__heading">
              <span>Library</span>
              <span class="k-icon k-icon--chevron-down k-icon--xs" aria-hidden="true"></span>
            </summary>
            <ul class="k-sidebar__list k-sidebar__list--nested">
              <li><a class="k-sidebar__link" href="#projects">Projects</a></li>
              <li><a class="k-sidebar__link" href="#settings">Settings</a></li>
            </ul>
          </details>
        </li>
      </ul>
    </nav>
    <div class="k-sidebar__footer">v0.2</div>
  </aside>
`;

/**
 * `.k-sidebar` with a checkbox, scrim, panel, then main. The checkbox is
 * the open state. No JS.
 */
export const Default: Story = {
  render: () => `
    <div class="k-sidebar" style="min-height: 22rem;">
      ${nav('nav-toggle')}
      <div class="k-sidebar__main" style="padding: 1rem;">
        <label for="nav-toggle" class="k-sidebar__trigger k-sidebar__trigger--open">Menu</label>
        <p class="text-sm" style="margin-top: 1rem;">The page content stays in the main column.</p>
      </div>
    </div>
  `,
};

export const End: Story = {
  render: () => `
    <div class="k-sidebar k-sidebar--end" style="min-height: 22rem;">
      ${nav('nav-toggle-end')}
      <div class="k-sidebar__main" style="padding: 1rem;">
        <label for="nav-toggle-end" class="k-sidebar__trigger k-sidebar__trigger--open">Filters</label>
        <p class="text-sm" style="margin-top: 1rem;">Opens from the end edge.</p>
      </div>
    </div>
  `,
};

/** Panel stays in flow from 50em up; drawer on small screens. */
export const Docked: Story = {
  render: () => `
    <div class="k-sidebar k-sidebar--docked" style="min-height: 22rem;">
      ${nav('nav-toggle-docked')}
      <div class="k-sidebar__main" style="padding: 1rem;">
        <label for="nav-toggle-docked" class="k-sidebar__trigger k-sidebar__trigger--open">Menu</label>
        <p class="text-sm" style="margin-top: 1rem;">Widen the canvas to see the docked rail.</p>
      </div>
    </div>
  `,
};
