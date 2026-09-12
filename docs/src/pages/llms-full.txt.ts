import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const publicDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../public');

const PAGES = [
  'getting-started.md',
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
  'components/grid.md',
  'components/input.md',
  'components/link.md',
  'components/modal.md',
  'components/pagination.md',
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
