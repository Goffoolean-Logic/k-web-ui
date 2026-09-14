import type { Meta, StoryObj } from '@storybook/html-vite';
import type { KCarousel } from 'k-web-ui/js';
import 'k-web-ui/js';

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

function paintCarousel(root: KCarousel, loop?: boolean): void {
  if (loop === false) {
    root.setAttribute('loop', 'false');
  }
  root.items = ITEMS;
}

function carouselRoot(id: string, loop?: boolean): KCarousel {
  const root = document.createElement('k-carousel');
  root.id = id;
  root.className = 'k-carousel';
  root.style.maxWidth = '28rem';
  paintCarousel(root, loop);
  return root;
}

/**
 * Empty `<k-carousel class="k-carousel">`. Set `items` and the element builds
 * the track, slides, and controls.
 */
export const Default: Story = {
  render: () => carouselRoot('gallery'),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<KCarousel>('#gallery');
    if (root) {
      paintCarousel(root);
    }
  },
};

export const NoLoop: Story = {
  render: () => carouselRoot('gallery-noloop', false),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<KCarousel>('#gallery-noloop');
    if (root) {
      paintCarousel(root, false);
    }
  },
};
