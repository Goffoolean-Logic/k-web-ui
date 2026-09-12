import type { Meta, StoryObj } from '@storybook/html-vite';

interface LinkArgs {
  label: string;
  href: string;
  disabled: boolean;
}

/** A real `<a>` with an underline. Use a button if the click stays on this page. */
const meta: Meta<LinkArgs> = {
  title: 'Components/Link',
  tags: ['autodocs'],
  render: ({ label, href, disabled }) =>
    `<a class="k-link" href="${href}"${disabled ? ' aria-disabled="true"' : ''}>${label}</a>`,
  args: {
    label: 'Read the guide',
    href: '#',
    disabled: false,
  },
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<LinkArgs>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true, label: 'Unavailable' },
};

export const InCopy: Story = {
  render: () => `
    <p class="text-sm text-k-fg" style="max-width: 28rem;">
      The docs are public.
      <a class="k-link" href="#">Read the guide</a>
      or <a class="k-link" href="#">browse examples</a>.
    </p>
  `,
};
