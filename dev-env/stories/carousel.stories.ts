import type { Meta, StoryObj } from '@storybook/html-vite';
import { KCarousel } from 'k-web-ui/js';

const meta: Meta = {
  title: 'Components/Carousel',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

const ITEMS = [
  { content: 'Draft the brief.' },
  { content: 'Review comments.' },
  { content: 'Ship the release.' },
];

function carouselRoot(id: string, loop?: boolean): HTMLElement {
  const root = document.createElement('div');
  root.id = id;
  root.className = 'k-carousel';
  root.style.maxWidth = '28rem';
  KCarousel.mount(root, { items: ITEMS, loop });
  return root;
}

/**
 * Empty element with an id and `.k-carousel`. `KCarousel.mount` builds the
 * track, slides, and controls from `items`.
 */
export const Default: Story = {
  render: () => carouselRoot('gallery'),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('#gallery');
    if (root) {
      KCarousel.mount(root, { items: ITEMS });
    }
  },
};

export const NoLoop: Story = {
  render: () => carouselRoot('gallery-noloop', false),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('#gallery-noloop');
    if (root) {
      KCarousel.mount(root, { items: ITEMS, loop: false });
    }
  },
};
