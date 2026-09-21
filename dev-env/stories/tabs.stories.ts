import type { Meta, StoryObj } from '@storybook/html-vite';
import type { KTabItem, KTabs } from 'k-web-ui/js';
import 'k-web-ui/js';

const LABELS: KTabItem[] = [
  { label: 'Overview' },
  { label: 'Activity' },
  { label: 'Settings' },
];

const ICON_LABELS: KTabItem[] = [
  { label: 'Overview', icon: 'info' },
  { label: 'Activity', icon: 'success' },
  { label: 'Settings', icon: 'warning' },
];

const TEXT = [
  'Project home, recent activity, and pinned files.',
  'Comments and status changes from the last 7 days.',
  'Members, billing, and notification defaults.',
];

const meta: Meta = {
  title: 'Components/Tabs',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

/**
 * The host takes the labels. The panels are plain divs named after it:
 * `#id-0`, `#id-1`, `#id-2`.
 */
function tabs(
  id: string,
  {
    labels = LABELS,
    large = false,
  }: { labels?: KTabItem[]; large?: boolean } = {},
): HTMLDivElement {
  const wrap = document.createElement('div');

  const host = document.createElement('k-tabs');
  host.id = id;
  host.className = large ? 'k-tabs k-tabs--lg' : 'k-tabs';
  host.setAttribute('aria-label', 'Sections');
  wrap.append(host);

  for (const [index, line] of TEXT.entries()) {
    const panel = document.createElement('div');
    panel.id = `${id}-${index}`;
    panel.textContent = line;
    wrap.append(panel);
  }

  host.options = labels;
  return wrap;
}

export const Default: Story = {
  render: () => tabs('section-tabs'),
};

export const WithIcons: Story = {
  render: () => tabs('section-tabs-icons', { labels: ICON_LABELS }),
};

export const Large: Story = {
  render: () => tabs('section-tabs-lg', { labels: ICON_LABELS, large: true }),
};

export const SecondSelected: Story = {
  render: () => tabs('section-tabs-second'),
  play: ({ canvasElement }) => {
    canvasElement.querySelector<KTabs>('#section-tabs-second')?.select(1);
  },
};
