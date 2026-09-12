import type { Meta, StoryObj } from '@storybook/html-vite';

interface ButtonArgs {
  label: string;
  variant: 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';
  size: 'sm' | 'md' | 'lg';
  block: boolean;
  disabled: boolean;
}

const buttonClass = ({ variant, size, block }: ButtonArgs): string =>
  [
    'k-btn',
    `k-btn--${variant}`,
    size === 'md' ? '' : `k-btn--${size}`,
    block ? 'k-btn--block' : '',
  ]
    .filter(Boolean)
    .join(' ');

const meta: Meta<ButtonArgs> = {
  title: 'Components/Button',
  tags: ['autodocs'],
  render: (args) =>
    `<button type="button" class="${buttonClass(args)}"${args.disabled ? ' disabled' : ''}>${args.label}</button>`,
  args: {
    label: 'Button',
    variant: 'primary',
    size: 'md',
    block: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'ghost', 'accent', 'danger'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    block: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<ButtonArgs>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', label: 'Secondary' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', label: 'Ghost' },
};

export const Accent: Story = {
  args: { variant: 'accent', label: 'Accent' },
};

export const Danger: Story = {
  args: { variant: 'danger', label: 'Delete' },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Disabled' },
};

export const Sizes: Story = {
  render: () => `
    <div class="flex items-center gap-3">
      <button type="button" class="k-btn k-btn--primary k-btn--sm">Small</button>
      <button type="button" class="k-btn k-btn--primary">Medium</button>
      <button type="button" class="k-btn k-btn--primary k-btn--lg">Large</button>
    </div>
  `,
};
