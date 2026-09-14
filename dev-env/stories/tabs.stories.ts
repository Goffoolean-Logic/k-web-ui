import type { Meta, StoryObj } from '@storybook/html-vite';
import type { KTabs } from 'k-web-ui/js';
import 'k-web-ui/js';

const ITEMS = [
  {
    label: 'Overview',
    content: 'Project home, recent activity, and pinned files.',
  },
  {
    label: 'Activity',
    content: 'Comments and status changes from the last 7 days.',
  },
  {
    label: 'Settings',
    content: 'Members, billing, and notification defaults.',
  },
];

const meta: Meta = {
  title: 'Components/Tabs',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

function paintTabs(root: KTabs, selected?: number): void {
  root.setAttribute('label', 'Sections');
  if (selected != null) {
    root.setAttribute('selected', String(selected));
  }
  root.items = ITEMS;
}

function tabsRoot(id: string, selected?: number): KTabs {
  const root = document.createElement('k-tabs');
  root.id = id;
  root.className = 'k-tabs';
  root.style.maxWidth = '28rem';
  paintTabs(root, selected);
  return root;
}

/**
 * Empty `<k-tabs class="k-tabs">`. Set `items` and the element builds the rest.
 */
export const Default: Story = {
  render: () => tabsRoot('section-tabs'),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<KTabs>('#section-tabs');
    if (root) {
      paintTabs(root);
    }
  },
};

export const SecondSelected: Story = {
  render: () => tabsRoot('section-tabs-second', 1),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<KTabs>('#section-tabs-second');
    if (root) {
      paintTabs(root, 1);
    }
  },
};
