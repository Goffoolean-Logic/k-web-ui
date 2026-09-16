import type { Preview } from '@storybook/html-vite';
import './preview.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Light or dark',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'k-light', title: 'Light' },
          { value: 'k-dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'k-light',
  },
  decorators: [
    (story, context) => {
      // Exactly how a consumer switches themes: one attribute on the root.
      document.documentElement.setAttribute(
        'data-theme',
        String(context.globals.theme),
      );
      return story();
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
