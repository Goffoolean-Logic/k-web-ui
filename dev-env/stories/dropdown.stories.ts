import type { Meta, StoryObj } from '@storybook/html-vite';
import 'k-web-ui/js';

const ITEMS = [{ label: 'Name' }, { label: 'Date' }, { label: 'Size' }];

const meta: Meta = {
  title: 'Components/Dropdown',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

/** The element builds the trigger, menu, and ARIA from `options`. */
function dropdown(
  id: string,
  { end = false, select = false }: { end?: boolean; select?: boolean } = {},
): HTMLElement {
  const host = document.createElement('k-dropdown');
  host.id = id;
  host.className = end ? 'k-dropdown k-dropdown--end' : 'k-dropdown';
  host.options = { trigger: 'Sort', items: ITEMS, select };
  return host;
}

export const Default: Story = {
  render: () => dropdown('sort-dropdown'),
};

export const Select: Story = {
  render: () => dropdown('sort-dropdown-select', { select: true }),
};

export const End: Story = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.justifyContent = 'flex-end';
    wrap.append(dropdown('sort-dropdown-end', { end: true, select: true }));
    return wrap;
  },
};
