import type { Meta, StoryObj } from '@storybook/html-vite';
import type { KTabItem, KTabs } from 'k-web-ui/js';
import 'k-web-ui/js';

const PANELS: KTabItem[] = [
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

const ICON_PANELS: KTabItem[] = [
  {
    label: 'Overview',
    icon: 'info',
    content: 'Project home, recent activity, and pinned files.',
  },
  {
    label: 'Activity',
    icon: 'success',
    content: 'Comments and status changes from the last 7 days.',
  },
  {
    label: 'Settings',
    icon: 'warning',
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
  panels: KTabItem[] = PANELS,
  selected?: number,
): void {
  root.setAttribute('label', 'Sections');
  if (selected != null) {
    root.setAttribute('selected', String(selected));
  }
  root.setAttribute('panels', JSON.stringify(panels));
}

function tabsRoot(
  id: string,
  {
    selected,
    panels = PANELS,
    large = false,
  }: { selected?: number; panels?: KTabItem[]; large?: boolean } = {},
): KTabs {
  const root = document.createElement('k-tabs');
  root.id = id;
  root.className = large ? 'k-tabs k-tabs--lg' : 'k-tabs';
  paintTabs(root, panels, selected);
  return root;
}

/**
 * Empty `<k-tabs class="k-tabs">`. `panels` is an attribute. The element
 * builds the rest.
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
      paintTabs(root, PANELS, 1);
    }
  },
};

export const WithIcons: Story = {
  render: () => tabsRoot('section-tabs-icons', { panels: ICON_PANELS }),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<KTabs>('#section-tabs-icons');
    if (root) {
      paintTabs(root, ICON_PANELS);
    }
  },
};

export const Large: Story = {
  render: () =>
    tabsRoot('section-tabs-lg', { panels: ICON_PANELS, large: true }),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<KTabs>('#section-tabs-lg');
    if (root) {
      paintTabs(root, ICON_PANELS);
    }
  },
};
