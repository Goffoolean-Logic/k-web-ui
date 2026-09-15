import type { Meta, StoryObj } from '@storybook/html-vite';

interface ProgressArgs {
  value?: number;
  max: number;
  block: boolean;
  size: 'sm' | 'md' | 'lg';
  variant: 'primary' | 'info' | 'success' | 'warning' | 'danger';
  label: string;
  indeterminate: boolean;
}

const DEFAULTS: ProgressArgs = {
  value: 64,
  max: 100,
  block: false,
  size: 'md',
  variant: 'primary',
  label: 'Upload',
  indeterminate: false,
};

function classFromArgs(args: ProgressArgs): string {
  const names = ['k-progress'];
  if (args.block) {
    names.push('k-progress--block');
  }
  if (args.indeterminate) {
    names.push('k-progress--indeterminate');
  }
  if (args.size !== 'md') {
    names.push(`k-progress--${args.size}`);
  }
  if (args.variant !== 'primary') {
    names.push(`k-progress--${args.variant}`);
  }
  return names.join(' ');
}

function fillPercent(args: ProgressArgs): string {
  if (args.indeterminate || args.value === undefined || args.max <= 0) {
    return '0%';
  }
  const pct = Math.min(100, Math.max(0, (args.value / args.max) * 100));
  return `${pct}%`;
}

function paintBar(el: HTMLProgressElement, args: ProgressArgs): void {
  el.className = classFromArgs(args);
  el.max = args.max;
  if (args.label) {
    el.setAttribute('aria-label', args.label);
  } else {
    el.removeAttribute('aria-label');
  }
  if (args.indeterminate || args.value === undefined) {
    el.removeAttribute('value');
    el.textContent = '';
  } else {
    el.value = args.value;
    el.textContent = fillPercent(args);
  }
  el.style.setProperty('--k-progress', fillPercent(args));
}

function progressRoot(
  id: string,
  overrides: Partial<ProgressArgs> = {},
): HTMLProgressElement {
  const args = { ...DEFAULTS, ...overrides };
  const el = document.createElement('progress');
  el.id = id;
  paintBar(el, args);
  return el;
}

/**
 * `<progress class="k-progress">`. `value` and `max` are native.
 * `--k-progress` is the fill.
 */
const meta: Meta<ProgressArgs> = {
  title: 'Components/Progress',
  tags: ['autodocs'],
  render: (args) => {
    const el = document.createElement('progress');
    paintBar(el, args);
    return el;
  },
  args: DEFAULTS,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: { type: 'number', min: 1 } },
    block: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: {
      control: 'select',
      options: ['primary', 'info', 'success', 'warning', 'danger'],
    },
    label: { control: 'text' },
    indeterminate: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<ProgressArgs>;

export const Default: Story = {};

export const Colors: Story = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.className = 'flex flex-col gap-4';
    wrap.append(
      progressRoot('progress-primary', { label: 'Primary' }),
      progressRoot('progress-info', { label: 'Info', variant: 'info' }),
      progressRoot('progress-success', {
        label: 'Success',
        variant: 'success',
      }),
      progressRoot('progress-warning', {
        label: 'Warning',
        variant: 'warning',
      }),
      progressRoot('progress-danger', { label: 'Danger', variant: 'danger' }),
    );
    return wrap;
  },
};

export const Sizes: Story = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.className = 'flex flex-col gap-4';
    wrap.append(
      progressRoot('progress-sm', { label: 'Small', size: 'sm' }),
      progressRoot('progress-md', { label: 'Medium' }),
      progressRoot('progress-lg', { label: 'Large', size: 'lg' }),
    );
    return wrap;
  },
};

export const Block: Story = {
  args: { block: true, label: 'Full width' },
};

export const Empty: Story = {
  args: { value: undefined, label: 'Waiting' },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Loading' },
};
