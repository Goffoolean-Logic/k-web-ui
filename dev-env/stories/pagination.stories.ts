import type { Meta, StoryObj } from '@storybook/html-vite';
import { KPagination } from 'k-web-ui/js';

const meta: Meta = {
  title: 'Components/Pagination',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

function paginationRoot(id: string, count: number, page?: number): HTMLElement {
  const root = document.createElement('div');
  root.id = id;
  root.className = 'k-pagination';
  KPagination.mount(root, { count, page });
  return root;
}

/**
 * Empty element with an id and `.k-pagination`. Few pages list every number
 * and drop first/last. Longer lists keep those jumps and a three-page window.
 */
export const Default: Story = {
  render: () => paginationRoot('result-pages', 12, 5),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('#result-pages');
    if (root) {
      KPagination.mount(root, { count: 12, page: 5 });
    }
  },
};

export const FewPages: Story = {
  render: () => paginationRoot('result-pages-few', 4),
  play: ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('#result-pages-few');
    if (root) {
      KPagination.mount(root, { count: 4 });
    }
  },
};
