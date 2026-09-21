import type { Meta, StoryObj } from '@storybook/html-vite';
import type { KGauge, KGaugeOptions } from 'k-web-ui/js';
import 'k-web-ui/js';

/** Keep one host per story so value changes ease instead of remounting. */
const live = new Map<string, KGauge>();

const DEFAULTS: KGaugeOptions = {
  value: 64,
  max: 100,
  label: 'Upload',
  format: '%',
};

function toOptions(args: KGaugeOptions): KGaugeOptions {
  return {
    ...args,
    // Storybook text controls use ""; blank must not shadow format.
    format: args.format?.trim() || undefined,
    text: args.text?.trim() || undefined,
    size: args.size || undefined,
    variant: args.variant || undefined,
    indeterminate: args.indeterminate || undefined,
  };
}

/** One `options` assignment carries the reading, the caption, and the chrome. */
function gauge(id: string, options: KGaugeOptions = DEFAULTS): KGauge {
  const el = document.createElement('k-gauge');
  el.id = id;
  el.className = 'k-gauge';
  el.options = toOptions(options);
  return el;
}

const meta: Meta<KGaugeOptions> = {
  title: 'Components/Gauge',
  tags: ['autodocs'],
  render: (args, context) => {
    const current = live.get(context.id);
    if (current) {
      current.options = toOptions(args);
      return current;
    }
    const el = gauge(`gauge-${context.id}`, args);
    live.set(context.id, el);
    return el;
  },
  args: DEFAULTS,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 1000, step: 1 } },
    max: { control: { type: 'number', min: 1 } },
    size: { control: 'inline-radio', options: [undefined, 'sm', 'lg'] },
    variant: {
      control: 'select',
      options: [undefined, 'info', 'success', 'warning', 'danger'],
    },
    label: { control: 'text' },
    format: {
      control: 'select',
      options: ['', '%', '$', '€', '£'],
      description:
        'Empty for a number. "%" for percent. Any other string prefixes the dial.',
    },
    text: {
      control: 'text',
      description:
        'Optional dial override. Leave empty to let format drive the reading.',
    },
    indeterminate: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<KGaugeOptions>;

export const Default: Story = {};

const row = (...nodes: HTMLElement[]): HTMLDivElement => {
  const wrap = document.createElement('div');
  wrap.className = 'flex flex-wrap items-end gap-8';
  wrap.append(...nodes);
  return wrap;
};

export const Colors: Story = {
  render: () =>
    row(
      gauge('gauge-primary', {
        value: 64,
        max: 100,
        label: 'Primary',
        format: '%',
      }),
      gauge('gauge-info', {
        value: 64,
        max: 100,
        label: 'Info',
        variant: 'info',
        format: '%',
      }),
      gauge('gauge-success', {
        value: 64,
        max: 100,
        label: 'Success',
        variant: 'success',
        format: '%',
      }),
      gauge('gauge-warning', {
        value: 64,
        max: 100,
        label: 'Warning',
        variant: 'warning',
        format: '%',
      }),
      gauge('gauge-danger', {
        value: 64,
        max: 100,
        label: 'Danger',
        variant: 'danger',
        format: '%',
      }),
    ),
};

export const Sizes: Story = {
  render: () =>
    row(
      gauge('gauge-sm', {
        value: 64,
        max: 100,
        label: 'Small',
        size: 'sm',
        format: '%',
      }),
      gauge('gauge-md', { value: 64, max: 100, label: 'Medium', format: '%' }),
      gauge('gauge-lg', {
        value: 64,
        max: 100,
        label: 'Large',
        size: 'lg',
        format: '%',
      }),
    ),
};

/** Number (no format), currency (`$`), and percent (`%`) on the dial. */
export const Formats: Story = {
  render: () =>
    row(
      gauge('gauge-number', { value: 8, max: 100, label: 'Open' }),
      gauge('gauge-currency', {
        value: 2450,
        max: 3000,
        label: 'Balance',
        format: '$',
        variant: 'success',
      }),
      gauge('gauge-percent', {
        value: 64,
        max: 100,
        label: 'Upload',
        format: '%',
        variant: 'info',
      }),
    ),
};

export const Numbers: Story = {
  render: () =>
    row(
      gauge('gauge-open', { value: 8, max: 100, label: 'Open' }),
      gauge('gauge-requests', {
        value: 1024,
        max: 5000,
        variant: 'success',
        label: 'Requests',
      }),
      gauge('gauge-bandwidth', {
        value: 12400,
        max: 20000,
        variant: 'info',
        label: 'Bandwidth',
        text: '12.4k',
      }),
      gauge('gauge-uptime', {
        value: 99.99,
        max: 100,
        variant: 'warning',
        label: 'Uptime',
        format: '%',
      }),
    ),
};

export const Empty: Story = {
  args: { value: undefined, max: 100, label: 'Waiting', format: undefined },
};

export const Indeterminate: Story = {
  args: { value: undefined, max: 100, label: 'Syncing', indeterminate: true },
};
