import type { Meta, StoryObj } from '@storybook/html-vite';
import { KTabs } from 'k-web-ui/js';

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

function mountTabs(root: HTMLElement, selected?: number): void {
  KTabs.mount(root, { label: 'Sections', items: ITEMS, selected });
}

function tabsRoot(id: string, selected?: number): HTMLElement {
  const root = document.createElement('div');
  root.id = id;
  root.className = 'k-tabs';
  root.style.maxWidth = '28rem';
  mountTabs(root, selected);
  return root;
}

/**
 * Empty element with an id and `.k-tabs`. `KTabs.mount` builds the rest.
 */
export const Default: Story = {
  render: () => tabsRoot('section-tabs'),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('#section-tabs');
    if (root) {
      mountTabs(root);
    }
  },
};

export const SecondSelected: Story = {
  render: () => tabsRoot('section-tabs-second', 1),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>(
      '#section-tabs-second',
    );
    if (root) {
      mountTabs(root, 1);
    }
  },
};
