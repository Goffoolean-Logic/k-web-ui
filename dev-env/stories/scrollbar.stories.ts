import type { Meta, StoryObj } from '@storybook/html-vite';
import type { KScrollbar } from 'k-web-ui/js';
import 'k-web-ui/js';

const LINES = [
  'Overview',
  'Install the kit',
  'Put a class on a button',
  'Import the JS once',
  'Tabs write their own panels',
  'Pagination windows a long list',
  'Dropdown builds the menu',
  'Carousel keeps a track',
  'Gauge paints a square reading',
  'This pane is taller than its host',
  'Wheel, drag the thumb, or click the track',
  'Native bars stay hidden',
];

function pane(id: string, attrs: Record<string, string> = {}): KScrollbar {
  const root = document.createElement('k-scrollbar');
  root.id = id;
  root.className = 'k-scrollbar';
  root.style.height = '12rem';
  for (const [name, value] of Object.entries(attrs)) {
    root.setAttribute(name, value);
  }
  const list = document.createElement('ul');
  list.className = 'flex flex-col gap-2 p-3 text-sm text-k-fg';
  for (const line of LINES) {
    const item = document.createElement('li');
    item.textContent = line;
    list.append(item);
  }
  root.append(list);
  return root;
}

const meta: Meta = {
  title: 'Components/Scrollbar',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

/**
 * Overlay thumbs over a scrolling pane. Native bars are hidden. The same
 * chrome works in Chrome, Firefox, and Safari.
 */
export const Default: Story = {
  render: () => pane('sb-scrollbar'),
};

export const Autohide: Story = {
  render: () => pane('sb-scrollbar-autohide', { autohide: '' }),
};

export const Small: Story = {
  render: () => pane('sb-scrollbar-sm', { size: 'sm' }),
};

export const Large: Story = {
  render: () => pane('sb-scrollbar-lg', { size: 'lg' }),
};

function strip(id: string): KScrollbar {
  const root = pane(id, { axis: 'x' });
  root.style.height = '4.5rem';
  const list = root.querySelector('ul');
  if (list) {
    list.className =
      'flex flex-nowrap gap-5 p-3 text-sm text-k-fg whitespace-nowrap';
    list.style.minWidth = '48rem';
  }
  return root;
}

export const Horizontal: Story = {
  render: () => strip('sb-scrollbar-x'),
};
