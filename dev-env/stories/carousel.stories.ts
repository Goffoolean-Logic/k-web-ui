import type { Meta, StoryObj } from '@storybook/html-vite';
import 'k-web-ui/js';

const SLIDES = ['Draft the brief.', 'Review comments.', 'Ship the release.'];

const meta: Meta = {
  title: 'Components/Carousel',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

/**
 * No options. The slides sit in a wrapper of their own, which the element
 * takes over as the track. The host is the control bar under it.
 */
function carousel(id: string, autoscroll = false): HTMLDivElement {
  const wrap = document.createElement('div');
  wrap.style.maxWidth = '28rem';

  const track = document.createElement('div');
  for (const [index, text] of SLIDES.entries()) {
    const slide = document.createElement('div');
    slide.id = `${id}-${index}`;
    slide.textContent = text;
    track.append(slide);
  }
  wrap.append(track);

  const host = document.createElement('k-carousel');
  host.id = id;
  host.className = autoscroll
    ? 'k-carousel k-carousel--autoscroll'
    : 'k-carousel';
  wrap.append(host);

  return wrap;
}

export const Default: Story = {
  render: () => carousel('gallery'),
};

export const Autoscroll: Story = {
  render: () => carousel('gallery-auto', true),
};
