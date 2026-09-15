import type { Meta, StoryObj } from '@storybook/html-vite';
import type { KDropdown } from 'k-web-ui/js';
import 'k-web-ui/js';

const OPTIONS = JSON.stringify([
  { label: 'Name' },
  { label: 'Date' },
  { label: 'Size' },
]);

const meta: Meta = {
  title: 'Components/Dropdown',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

function paintDropdown(root: KDropdown): void {
  root.setAttribute('label', 'Sort');
  root.setAttribute('options', OPTIONS);
}

function dropdownRoot(id: string, extraClass = ''): KDropdown {
  const root = document.createElement('k-dropdown');
  root.id = id;
  root.className = extraClass ? `k-dropdown ${extraClass}` : 'k-dropdown';
  paintDropdown(root);
  return root;
}

/**
 * Empty `<k-dropdown class="k-dropdown">`. `label` and `options` are
 * attributes. The element builds the trigger, menu, and ARIA.
 */
export const Default: Story = {
  render: () => dropdownRoot('sort-dropdown'),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<KDropdown>('#sort-dropdown');
    if (root) {
      paintDropdown(root);
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
    const root = canvasElement.querySelector<KDropdown>('#sort-dropdown-end');
    if (root) {
      paintDropdown(root);
    }
  },
};
