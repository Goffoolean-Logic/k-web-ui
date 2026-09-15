import type { Meta, StoryObj } from '@storybook/html-vite';
import type { KGauge } from 'k-web-ui/js';
import 'k-web-ui/js';

const live = new Map<string, { chrome: string; el: KGauge }>();

interface GaugeArgs {
  value?: number;
  max: number;
  size: 'sm' | 'md' | 'lg';
  variant: 'primary' | 'info' | 'success' | 'warning' | 'danger';
  label: string;
  text: string;
  indeterminate: boolean;
}

const DEFAULTS: GaugeArgs = {
  value: 64,
  max: 100,
  size: 'md',
  variant: 'primary',
  label: 'Upload',
  text: '64%',
  indeterminate: false,
};

function paintGauge(el: KGauge, args: GaugeArgs): void {
  el.className = 'k-gauge';
  el.setAttribute('max', String(args.max));
  if (args.indeterminate || args.value === undefined) {
    el.removeAttribute('value');
  } else {
    el.setAttribute('value', String(args.value));
  }
  if (args.label) {
    el.setAttribute('label', args.label);
  } else {
    el.removeAttribute('label');
  }
  if (args.text) {
    el.setAttribute('text', args.text);
  } else {
    el.removeAttribute('text');
  }
  if (args.size !== 'md') {
    el.setAttribute('size', args.size);
  } else {
    el.removeAttribute('size');
  }
  if (args.variant !== 'primary') {
    el.setAttribute('variant', args.variant);
  } else {
    el.removeAttribute('variant');
  }
  if (args.indeterminate) {
    el.setAttribute('indeterminate', '');
  } else {
    el.removeAttribute('indeterminate');
  }
}

function gaugeRoot(id: string, overrides: Partial<GaugeArgs> = {}): KGauge {
  const args = { ...DEFAULTS, ...overrides };
  const el = document.createElement('k-gauge');
  el.id = id;
  paintGauge(el, args);
  return el;
}

function chromeKey(args: GaugeArgs): string {
  return [args.size, args.variant, args.indeterminate, args.label].join();
}

/**
 * `<k-gauge id="upload" class="k-gauge">`. Attributes write the reading
 * and the caption.
 */
const meta: Meta<GaugeArgs> = {
  title: 'Components/Gauge',
  tags: ['autodocs'],
  render: (args, context) => {
    const current = live.get(context.id);
    const chrome = chromeKey(args);
    if (current && current.chrome === chrome) {
      paintGauge(current.el, args);
      return current.el;
    }

    const el = gaugeRoot(`gauge-${context.id}`, args);
    live.set(context.id, { chrome, el });
    return el;
  },
  args: DEFAULTS,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: { type: 'number', min: 1 } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: {
      control: 'select',
      options: ['primary', 'info', 'success', 'warning', 'danger'],
    },
    label: { control: 'text' },
    text: { control: 'text' },
    indeterminate: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<GaugeArgs>;

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
      gaugeRoot('gauge-primary', { label: 'Primary', text: '' }),
      gaugeRoot('gauge-info', { label: 'Info', variant: 'info', text: '' }),
      gaugeRoot('gauge-success', {
        label: 'Success',
        variant: 'success',
        text: '',
      }),
      gaugeRoot('gauge-warning', {
        label: 'Warning',
        variant: 'warning',
        text: '',
      }),
      gaugeRoot('gauge-danger', {
        label: 'Danger',
        variant: 'danger',
        text: '',
      }),
    ),
};

export const Sizes: Story = {
  render: () =>
    row(
      gaugeRoot('gauge-sm', { label: 'Small', size: 'sm', text: '' }),
      gaugeRoot('gauge-md', { label: 'Medium', text: '' }),
      gaugeRoot('gauge-lg', { label: 'Large', size: 'lg', text: '' }),
    ),
};

export const Numbers: Story = {
  render: () =>
    row(
      gaugeRoot('gauge-open', {
        value: 8,
        max: 100,
        text: '8',
        label: 'Open',
      }),
      gaugeRoot('gauge-requests', {
        value: 1024,
        max: 5000,
        variant: 'success',
        text: '1,024',
        label: 'Requests',
      }),
      gaugeRoot('gauge-bandwidth', {
        value: 12400,
        max: 20000,
        variant: 'info',
        text: '12.4k',
        label: 'Bandwidth',
      }),
      gaugeRoot('gauge-uptime', {
        value: 99.99,
        max: 100,
        variant: 'warning',
        text: '99.99%',
        label: 'Uptime',
      }),
    ),
};

export const Empty: Story = {
  args: { label: 'Waiting', text: '', value: undefined },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Syncing', text: '' },
};
