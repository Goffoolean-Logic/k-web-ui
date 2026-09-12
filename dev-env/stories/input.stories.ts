import type { Meta, StoryObj } from '@storybook/html-vite';

interface InputArgs {
  label: string;
  placeholder: string;
  hint: string;
  invalid: boolean;
  disabled: boolean;
}

/** One field: label, input, hint. Pair `for` / `id`. Red border needs `.k-error`. */
const meta: Meta<InputArgs> = {
  title: 'Components/Input',
  tags: ['autodocs'],
  render: ({ label, placeholder, hint, invalid, disabled }) => `
    <div class="k-field" style="max-width: 20rem;">
      <label class="k-label" for="demo-input">${label}</label>
      <input
        class="k-input"
        id="demo-input"
        type="text"
        placeholder="${placeholder}"
        ${invalid ? 'aria-invalid="true" aria-describedby="demo-input-msg"' : hint ? 'aria-describedby="demo-input-msg"' : ''}
        ${disabled ? 'disabled' : ''}
      />
      ${hint ? `<p class="${invalid ? 'k-error' : 'k-hint'}" id="demo-input-msg">${hint}</p>` : ''}
    </div>
  `,
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    hint: "We'll never share it.",
    invalid: false,
    disabled: false,
  },
  argTypes: {
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<InputArgs>;

export const Default: Story = {};

export const Invalid: Story = {
  args: { invalid: true, hint: 'Enter a valid email address.' },
};

export const Disabled: Story = {
  args: { disabled: true, hint: '' },
};
