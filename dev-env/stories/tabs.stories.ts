import type { Meta, StoryObj } from '@storybook/html-vite';
import type { KTabItem, KTabs } from 'k-web-ui/js';
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

const ICON_ITEMS = [
  {
    label: 'Overview',
    icon: 'info' as const,
    content: 'Project home, recent activity, and pinned files.',
  },
  {
    label: 'Activity',
    icon: 'success' as const,
    content: 'Comments and status changes from the last 7 days.',
  },
  {
    label: 'Settings',
    icon: 'warning' as const,
    content: 'Members, billing, and notification defaults.',
  },
];

const meta: Meta = {
  title: 'Components/Tabs',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

function paintTabs(
  root: KTabs,
  items: KTabItem[] = ITEMS,
  selected?: number,
): void {
  root.setAttribute('label', 'Sections');
  if (selected != null) {
    root.setAttribute('selected', String(selected));
  }
  root.items = items;
}

function tabsRoot(
  id: string,
  {
    selected,
    items = ITEMS,
    large = false,
  }: { selected?: number; items?: KTabItem[]; large?: boolean } = {},
): KTabs {
  const root = document.createElement('k-tabs');
  root.id = id;
  root.className = large ? 'k-tabs k-tabs--lg' : 'k-tabs';
  paintTabs(root, items, selected);
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
  render: () => tabsRoot('section-tabs-second', { selected: 1 }),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<KTabs>('#section-tabs-second');
    if (root) {
      paintTabs(root, ITEMS, 1);
    }
  },
};

export const WithIcons: Story = {
  render: () => tabsRoot('section-tabs-icons', { items: ICON_ITEMS }),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<KTabs>('#section-tabs-icons');
    if (root) {
      paintTabs(root, ICON_ITEMS);
    }
  },
};

export const Large: Story = {
  render: () => tabsRoot('section-tabs-lg', { items: ICON_ITEMS, large: true }),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<KTabs>('#section-tabs-lg');
    if (root) {
      paintTabs(root, ICON_ITEMS);
    }
  },
};
