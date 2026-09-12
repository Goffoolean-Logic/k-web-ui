import type { Meta, StoryObj } from '@storybook/html-vite';

type BadgeColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';
type BadgeStyle = 'solid' | 'outline' | 'dash' | 'soft' | 'ghost';
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface BadgeArgs {
  label: string;
  color: BadgeColor;
  style: BadgeStyle;
  size: BadgeSize;
}

const badgeClass = ({ color, style, size }: BadgeArgs): string =>
  [
    'k-badge',
    color === 'default' ? '' : `k-badge--${color}`,
    style === 'solid' ? '' : `k-badge--${style}`,
    size === 'md' ? '' : `k-badge--${size}`,
  ]
    .filter(Boolean)
    .join(' ');

const meta: Meta<BadgeArgs> = {
  title: 'Components/Badge',
  tags: ['autodocs'],
  render: (args) => `<span class="${badgeClass(args)}">${args.label}</span>`,
  args: {
    label: 'Badge',
    color: 'default',
    style: 'solid',
    size: 'md',
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'danger'],
    },
    style: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'dash', 'soft', 'ghost'],
    },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
};

export default meta;

type Story = StoryObj<BadgeArgs>;

export const Default: Story = {};

const COLORS: Exclude<BadgeColor, 'default'>[] = [
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'danger',
];

const row = (inner: string) => `<div class="flex flex-wrap items-center gap-2">${inner}</div>`;

export const Colors: Story = {
  render: () =>
    row(
      [
        '<span class="k-badge">Default</span>',
        ...COLORS.map((color) => `<span class="k-badge k-badge--${color}">${label(color)}</span>`),
      ].join(''),
    ),
};

export const Soft: Story = {
  render: () =>
    row(
      COLORS.map(
        (color) => `<span class="k-badge k-badge--soft k-badge--${color}">${label(color)}</span>`,
      ).join(''),
    ),
};

export const Outline: Story = {
  render: () =>
    row(
      COLORS.map(
        (color) => `<span class="k-badge k-badge--outline k-badge--${color}">${label(color)}</span>`,
      ).join(''),
    ),
};

export const Dash: Story = {
  render: () =>
    row(
      COLORS.map(
        (color) => `<span class="k-badge k-badge--dash k-badge--${color}">${label(color)}</span>`,
      ).join(''),
    ),
};

export const Ghost: Story = {
  render: () => `<span class="k-badge k-badge--ghost">Ghost</span>`,
};

export const Sizes: Story = {
  render: () =>
    row(`
      <span class="k-badge k-badge--primary k-badge--xs">Xsmall</span>
      <span class="k-badge k-badge--primary k-badge--sm">Small</span>
      <span class="k-badge k-badge--primary">Medium</span>
      <span class="k-badge k-badge--primary k-badge--lg">Large</span>
      <span class="k-badge k-badge--primary k-badge--xl">Xlarge</span>
    `),
};

export const Empty: Story = {
  render: () =>
    row(`
      <span class="k-badge k-badge--primary k-badge--lg"></span>
      <span class="k-badge k-badge--primary"></span>
      <span class="k-badge k-badge--primary k-badge--sm"></span>
      <span class="k-badge k-badge--primary k-badge--xs"></span>
    `),
};

const iconInfo = '<span class="k-icon k-icon--info" aria-hidden="true"></span>';
const iconSuccess = '<span class="k-icon k-icon--success" aria-hidden="true"></span>';
const iconWarning = '<span class="k-icon k-icon--warning" aria-hidden="true"></span>';
const iconDanger = '<span class="k-icon k-icon--danger" aria-hidden="true"></span>';

export const WithIcon: Story = {
  render: () =>
    row(`
      <span class="k-badge k-badge--info">${iconInfo} Info</span>
      <span class="k-badge k-badge--success">${iconSuccess} Success</span>
      <span class="k-badge k-badge--warning">${iconWarning} Warning</span>
      <span class="k-badge k-badge--danger">${iconDanger} Danger</span>
    `),
};

export const InText: Story = {
  render: () => `
    <div class="flex flex-col gap-3 text-k-fg">
      <h1 class="text-xl font-semibold">
        Heading 1 <span class="k-badge k-badge--primary k-badge--xl">Badge</span>
      </h1>
      <h2 class="text-lg font-semibold">
        Heading 2 <span class="k-badge k-badge--primary k-badge--lg">Badge</span>
      </h2>
      <h3 class="text-base font-semibold">
        Heading 3 <span class="k-badge k-badge--primary">Badge</span>
      </h3>
      <h4 class="text-sm font-semibold">
        Heading 4 <span class="k-badge k-badge--primary k-badge--sm">Badge</span>
      </h4>
      <p class="text-xs">
        Paragraph <span class="k-badge k-badge--primary k-badge--xs">Badge</span>
      </p>
    </div>
  `,
};

export const InButton: Story = {
  render: () => `
    <div class="flex flex-wrap items-center gap-3">
      <button type="button" class="k-btn k-btn--secondary">
        Inbox <span class="k-badge k-badge--sm">+99</span>
      </button>
      <button type="button" class="k-btn k-btn--primary">
        Inbox <span class="k-badge k-badge--sm k-badge--accent">+99</span>
      </button>
    </div>
  `,
};

function label(color: string): string {
  return color.charAt(0).toUpperCase() + color.slice(1);
}
