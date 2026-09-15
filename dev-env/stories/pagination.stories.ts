import type { Meta, StoryObj } from '@storybook/html-vite';
import type { KPagination } from 'k-web-ui/js';
import 'k-web-ui/js';

const meta: Meta = {
  title: 'Components/Pagination',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

function paginationRoot(id: string, count: number, page?: number): KPagination {
  const root = document.createElement('k-pagination');
  root.id = id;
  root.className = 'k-pagination';
  root.setAttribute('count', String(count));
  if (page != null) {
    root.setAttribute('page', String(page));
  }
  return root;
}

/**
 * Empty `<k-pagination class="k-pagination">` with `count` and optional `page`.
 * Few pages list every number and drop first/last. Longer lists keep those
 * jumps and a three-page window.
 */
export const Default: Story = {
  render: () => paginationRoot('result-pages', 12, 5),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<KPagination>('#result-pages');
    if (root) {
      root.setAttribute('count', '12');
      root.setAttribute('page', '5');
    }
  },
};

export const FewPages: Story = {
  render: () => paginationRoot('result-pages-few', 4),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<KPagination>('#result-pages-few');
    if (root) {
      root.setAttribute('count', '4');
    }
  },
};
