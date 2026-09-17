import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { APIRoute } from 'astro';

const publicDir = resolve(process.cwd(), 'public');

const PAGES = [
  'getting-started.md',
  'how-it-works.md',
  'showcase.md',
  'showcase/restyle.md',
  'theme-playground.md',
  'foundations/colors.md',
  'foundations/typography.md',
  'foundations/styles.md',
  'foundations/iconography.md',
  'components/accordion.md',
  'components/badge.md',
  'components/banner.md',
  'components/button.md',
  'components/card.md',
  'components/carousel.md',
  'components/dropdown.md',
  'components/gauge.md',
  'components/grid.md',
  'components/input.md',
  'components/link.md',
  'components/modal.md',
  'components/pagination.md',
  'components/progress.md',
  'components/scrollbar.md',
  'components/sidebar.md',
  'components/spin.md',
  'components/table.md',
  'components/tabs.md',
  'components/toast.md',
  'components/tooltip.md',
];

export const GET: APIRoute = () => {
  const body = PAGES.map((file) =>
    readFileSync(resolve(publicDir, file), 'utf8').trim(),
  ).join('\n\n---\n\n');

  return new Response(`${body}\n`, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
};
