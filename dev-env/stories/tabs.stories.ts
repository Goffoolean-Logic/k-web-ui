import type { Meta, StoryObj } from '@storybook/html-vite';
import { KTabs } from 'k-web-components/js';

const ITEMS = [
  { label: 'Main', content: 'Standard seat. Carry-on plus a personal item.' },
  { label: 'Comfort+', content: 'Extra pitch and dedicated overhead bins.' },
  { label: 'First', content: 'Lie-flat seat and lounge access.' },
];

const meta: Meta = {
  title: 'Components/Tabs',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

/**
 * Host markup is only the id and `.k-tabs`. `KTabs.mount` builds the rest.
 */
export const Default: Story = {
  render: () => `<div id="cabin-tabs" class="k-tabs" style="max-width: 28rem;"></div>`,
  play: () => {
    KTabs.mount('cabin-tabs', { label: 'Cabin', items: ITEMS });
  },
};

export const SecondSelected: Story = {
  render: () => `<div id="cabin-tabs-second" class="k-tabs" style="max-width: 28rem;"></div>`,
  play: () => {
    KTabs.mount('cabin-tabs-second', { label: 'Cabin', items: ITEMS, selected: 1 });
  },
};
