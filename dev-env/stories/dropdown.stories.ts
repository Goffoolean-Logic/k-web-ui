import type { Meta, StoryObj } from '@storybook/html-vite';
import type { KDropdown } from 'k-web-ui/js';
import 'k-web-ui/js';

const meta: Meta = {
  title: 'Components/Dropdown',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

function dropdownRoot(id: string, extraClass = ''): KDropdown {
  const root = document.createElement('k-dropdown');
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
  return root;
}

/**
 * You write the `<k-dropdown>`, trigger, and hidden menu. Importing the JS
 * registers the tag and wires toggle, outside click, and keyboard movement.
 */
export const Default: Story = {
  render: () => dropdownRoot('sort-dropdown'),
};

export const End: Story = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.justifyContent = 'flex-end';
    wrap.append(dropdownRoot('sort-dropdown-end', 'k-dropdown--end'));
    return wrap;
  },
};
