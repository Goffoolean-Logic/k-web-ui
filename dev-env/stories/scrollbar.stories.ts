import type { Meta, StoryObj } from '@storybook/html-vite';
import 'k-web-ui/js';

const LINES = [
  'Overview',
  'Install the kit',
  'Put a class on a button',
  'Import the JS once',
  'Tabs label their own panels',
  'Pagination counts the pages it finds',
  'Dropdown builds the menu',
  'Carousel drives the track next door',
  'Gauge paints a square reading',
  'This pane is taller than its host',
  'Wheel, drag the thumb, or click the track',
  'Native bars stay hidden',
];

/** Axis, thickness, and autohide are modifier classes on the tag. */
function pane(id: string, ...modifiers: string[]): HTMLElement {
  const host = document.createElement('k-scrollbar');
  host.id = id;
  host.className = ['k-scrollbar', ...modifiers].join(' ');
  host.style.height = '12rem';

  const list = document.createElement('ul');
  list.className = 'flex flex-col gap-2 p-3 text-sm text-k-fg';
  for (const line of LINES) {
    const item = document.createElement('li');
    item.textContent = line;
    list.append(item);
  }
  host.append(list);
  return host;
}

const meta: Meta = {
  title: 'Components/Scrollbar',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

/**
 * Overlay thumbs over a scrolling pane. Native bars are hidden. The rails
 * fade out until you hover, focus, or scroll.
 */
export const Default: Story = {
  render: () => pane('sb-scrollbar', 'k-scrollbar--y'),
};

export const NoAutohide: Story = {
  render: () =>
    pane('sb-scrollbar-pinned', 'k-scrollbar--y', 'k-scrollbar--no-autohide'),
};

export const Small: Story = {
  render: () => pane('sb-scrollbar-sm', 'k-scrollbar--y', 'k-scrollbar--sm'),
};

export const Large: Story = {
  render: () => pane('sb-scrollbar-lg', 'k-scrollbar--y', 'k-scrollbar--lg'),
};

export const Horizontal: Story = {
  render: () => {
    const host = pane('sb-scrollbar-x', 'k-scrollbar--x');
    host.style.height = '4.5rem';
    const list = host.querySelector('ul');
    if (list) {
      list.className =
        'flex flex-nowrap gap-5 p-3 text-sm text-k-fg whitespace-nowrap';
      list.style.minWidth = '48rem';
    }
    return host;
  },
};
