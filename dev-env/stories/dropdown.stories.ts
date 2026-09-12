import type { Meta, StoryObj } from '@storybook/html-vite';
import { KDropdown } from 'k-web-components/js';

const meta: Meta = {
  title: 'Components/Dropdown',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

function dropdownRoot(id: string, extraClass = ''): HTMLElement {
  const root = document.createElement('div');
  root.id = id;
  root.className = extraClass ? `k-dropdown ${extraClass}` : 'k-dropdown';
  root.innerHTML = `
    <button type="button" class="k-btn k-btn--secondary k-dropdown__trigger">Sort</button>
    <div id="${id}-menu" class="k-dropdown__menu" hidden>
      <button type="button" class="k-dropdown__item">Name</button>
      <button type="button" class="k-dropdown__item">Date</button>
      <button type="button" class="k-dropdown__item">Size</button>
    </div>
  `;
  KDropdown.mount(root);
  return root;
}

/**
 * Host is a `.k-dropdown` with a trigger and a hidden menu. `KDropdown.mount`
 * wires toggle, outside click, and keyboard movement.
 */
export const Default: Story = {
  render: () => dropdownRoot('sort-dropdown'),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('#sort-dropdown');
    if (root) {
      KDropdown.mount(root);
    }
  },
};

export const End: Story = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.justifyContent = 'flex-end';
    wrap.append(dropdownRoot('sort-dropdown-end', 'k-dropdown--end'));
    return wrap;
  },
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('#sort-dropdown-end');
    if (root) {
      KDropdown.mount(root);
    }
  },
};
