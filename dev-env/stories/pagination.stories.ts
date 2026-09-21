import type { Meta, StoryObj } from '@storybook/html-vite';
import 'k-web-ui/js';

const meta: Meta = {
  title: 'Components/Pagination',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

/**
 * No options. The element counts the `#id-0`, `#id-1`, … pages it finds.
 * Few pages list every number and drop first/last. Longer lists keep those
 * jumps and a three-page window.
 */
function pagination(id: string, count: number): HTMLDivElement {
  const wrap = document.createElement('div');

  for (let index = 0; index < count; index += 1) {
    const page = document.createElement('div');
    page.id = `${id}-${index}`;
    page.textContent = `Page ${index + 1} of ${count}`;
    wrap.append(page);
  }

  const host = document.createElement('k-pagination');
  host.id = id;
  host.className = 'k-pagination';
  wrap.append(host);

  return wrap;
}

export const Default: Story = {
  render: () => pagination('result-pages', 12),
};

export const FewPages: Story = {
  render: () => pagination('result-pages-few', 4),
};
