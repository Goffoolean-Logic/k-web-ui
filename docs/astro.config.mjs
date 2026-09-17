// @ts-check

import { fileURLToPath } from 'node:url';

import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig({
  redirects: {
    '/components/icon': '/foundations/iconography',
    '/foundations/tokens': '/foundations/colors',
  },
  integrations: [
    starlight({
      title: 'K-Web-UI',
      description: 'Designed to feel warm and engineered to run hot.',
      favicon: '/logo.png',
      components: {
        Head: './src/components/Head.astro',
        SiteTitle: './src/components/SiteTitle.astro',
        Hero: './src/components/Hero.astro',
        PageTitle: './src/components/PageTitle.astro',
        ThemeProvider: './src/components/ThemeProvider.astro',
        ThemeSelect: './src/components/ThemeSelect.astro',
        Footer: './src/components/Footer.astro',
        PageFrame: './src/components/PageFrame.astro',
        Header: './src/components/Header.astro',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Goffoolean-Logic/k-web-ui',
        },
      ],
      customCss: ['./src/styles/docs.css'],
      sidebar: [
        { label: 'Getting started', slug: 'getting-started' },
        { label: 'How it works', slug: 'how-it-works' },
        {
          label: 'Foundations',
          items: [
            { label: 'Colors', slug: 'foundations/colors' },
            { label: 'Typography', slug: 'foundations/typography' },
            { label: 'Styles', slug: 'foundations/styles' },
            { label: 'Iconography', slug: 'foundations/iconography' },
          ],
        },
        {
          label: 'Showcase',
          items: [
            { label: 'Profile', slug: 'showcase' },
            { label: 'Restyle', slug: 'showcase/restyle' },
          ],
        },
        {
          label: 'Components',
          items: [
            { label: 'Accordion', slug: 'components/accordion' },
            { label: 'Badge', slug: 'components/badge' },
            { label: 'Banner', slug: 'components/banner' },
            { label: 'Button', slug: 'components/button' },
            { label: 'Card', slug: 'components/card' },
            { label: 'Carousel', slug: 'components/carousel' },
            { label: 'Dropdown', slug: 'components/dropdown' },
            { label: 'Gauge', slug: 'components/gauge' },
            { label: 'Grid', slug: 'components/grid' },
            { label: 'Input', slug: 'components/input' },
            { label: 'Link', slug: 'components/link' },
            { label: 'Modal', slug: 'components/modal' },
            { label: 'Pagination', slug: 'components/pagination' },
            { label: 'Progress', slug: 'components/progress' },
            { label: 'Sidebar', slug: 'components/sidebar' },
            { label: 'Spin', slug: 'components/spin' },
            { label: 'Table', slug: 'components/table' },
            { label: 'Tabs', slug: 'components/tabs' },
            { label: 'Toast', slug: 'components/toast' },
            { label: 'Tooltip', slug: 'components/tooltip' },
          ],
        },
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        // Docs import k-web-ui/source, whose font and icon urls live in ../package.
        allow: [repoRoot],
      },
    },
  },
});
