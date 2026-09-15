import type { Meta, StoryObj } from '@storybook/html-vite';
import { KGauge, setGauge } from 'k-web-ui/js';
import 'k-web-ui/js';

const live = new Map<string, { chrome: string; el: HTMLElement }>();

interface GaugeArgs {
  value?: number;
  max: number;
  ring: boolean;
  block: boolean;
  size: 'sm' | 'md' | 'lg';
  variant: 'primary' | 'info' | 'success' | 'warning' | 'danger';
  label: string;
  text: string;
  indeterminate: boolean;
}

const DEFAULTS: GaugeArgs = {
  value: 64,
  max: 100,
  ring: false,
  block: false,
  size: 'md',
  variant: 'primary',
  label: 'Upload',
  text: '64%',
  indeterminate: false,
};

function classFromArgs(args: GaugeArgs): string {
  const names = ['k-gauge'];
  if (args.block) {
    names.push('k-gauge--block');
  }
  if (args.indeterminate) {
    names.push('k-gauge--indeterminate');
  }
  if (args.size !== 'md') {
    names.push(`k-gauge--${args.size}`);
  }
  if (args.variant !== 'primary') {
    names.push(`k-gauge--${args.variant}`);
  }
  return names.join(' ');
}

function paintBar(el: HTMLProgressElement, args: GaugeArgs): void {
  el.className = classFromArgs(args);
  if (args.label) {
    el.setAttribute('aria-label', args.label);
  } else {
    el.removeAttribute('aria-label');
  }
  setGauge(
    el,
    args.indeterminate ? undefined : args.value,
    args.max,
    args.text || undefined,
  );
}

function paintRing(el: KGauge, args: GaugeArgs): void {
  el.className = classFromArgs(args);
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
}

function gaugeRoot(
  id: string,
  overrides: Partial<GaugeArgs> = {},
): HTMLElement {
  const args = { ...DEFAULTS, ...overrides };
  if (args.ring) {
    const el = document.createElement('k-gauge');
    el.id = id;
    paintRing(el, args);
    return el;
  }
  const el = document.createElement('progress');
  el.id = id;
  paintBar(el, args);
  return el;
}

function chromeKey(args: GaugeArgs): string {
  return [
    args.ring,
    args.block,
    args.size,
    args.variant,
    args.indeterminate,
    args.label,
  ].join();
}

/**
 * `<progress class="k-gauge">` for a bar. `<k-gauge id="upload" class="k-gauge">`
 * for the ring; attributes write the reading and the caption.
 */
const meta: Meta<GaugeArgs> = {
  title: 'Components/Gauge',
  tags: ['autodocs'],
  render: (args, context) => {
    const current = live.get(context.id);
    const chrome = chromeKey(args);
    if (current && current.chrome === chrome) {
      if (current.el instanceof HTMLProgressElement) {
        paintBar(current.el, args);
      } else if (current.el instanceof KGauge) {
        paintRing(current.el, args);
      }
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
    ring: { control: 'boolean' },
    block: { control: 'boolean' },
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
  render: () => {
    const wrap = document.createElement('div');
    wrap.className = 'flex flex-col gap-4';
    wrap.append(
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
    );
    return wrap;
  },
};

export const Sizes: Story = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.className = 'flex flex-col gap-4';
    wrap.append(
      gaugeRoot('gauge-sm', { label: 'Small', size: 'sm', text: '' }),
      gaugeRoot('gauge-md', { label: 'Medium', text: '' }),
      gaugeRoot('gauge-lg', { label: 'Large', size: 'lg', text: '' }),
    );
    return wrap;
  },
};

export const Block: Story = {
  args: { block: true, label: 'Full width' },
};

export const Ring: Story = {
  args: { ring: true, text: '64%', label: 'Upload' },
};

export const Numbers: Story = {
  render: () =>
    row(
      gaugeRoot('gauge-open', {
        value: 8,
        max: 100,
        ring: true,
        text: '8',
        label: 'Open',
      }),
      gaugeRoot('gauge-requests', {
        value: 1024,
        max: 5000,
        ring: true,
        variant: 'success',
        text: '1,024',
        label: 'Requests',
      }),
      gaugeRoot('gauge-bandwidth', {
        value: 12400,
        max: 20000,
        ring: true,
        variant: 'info',
        text: '12.4k',
        label: 'Bandwidth',
      }),
      gaugeRoot('gauge-uptime', {
        value: 99.99,
        max: 100,
        ring: true,
        variant: 'warning',
        text: '99.99%',
        label: 'Uptime',
      }),
    ),
};

export const Empty: Story = {
  render: () =>
    row(
      gaugeRoot('gauge-waiting-ring', {
        ring: true,
        label: 'Waiting',
        text: '',
        value: undefined,
      }),
      gaugeRoot('gauge-waiting-bar', {
        label: 'Waiting',
        text: '',
        value: undefined,
      }),
    ),
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Loading' },
};
