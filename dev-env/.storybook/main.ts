import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/html-vite';
import tailwindcss from '@tailwindcss/vite';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.ts'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  viteFinal: (viteConfig, { configType }) => {
    viteConfig.plugins ??= [];
    viteConfig.plugins.push(tailwindcss());
    viteConfig.server ??= {};
    viteConfig.server.fs ??= {};
    viteConfig.server.fs.allow = [
      ...(viteConfig.server.fs.allow ?? []),
      repoRoot,
    ];
    // Relative asset URLs so a PR preview can live under /pr/<n>/.
    if (configType === 'PRODUCTION') {
      viteConfig.base = './';
    }
    return viteConfig;
  },
};

export default config;
