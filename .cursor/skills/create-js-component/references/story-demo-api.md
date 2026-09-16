# Story, demo, and API.md

Three of the four surfaces that document a JS component. The fourth, the pair of docs pages, belongs to the `create-component-docs` skill — use that for the `.mdx` and its markdown twin.

Templates below use a hypothetical `k-steps` component, matching the one in [architecture.md](architecture.md).

## `dev-env/stories/<name>.stories.ts`

A JS component story imports the registered element rather than rendering a class string. Declare shared fixture data at module scope and build hosts in a helper.

```ts
import type { Meta, StoryObj } from '@storybook/html-vite';
import type { KStepItem, KSteps } from 'k-web-ui/js';
import 'k-web-ui/js';

const STEPS: KStepItem[] = [
  { label: 'Cart' },
  { label: 'Address' },
  { label: 'Payment' },
];

const meta: Meta = {
  title: 'Components/Steps',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

function stepsRoot(id: string, current?: number): KSteps {
  const root = document.createElement('k-steps');
  root.id = id;
  root.className = 'k-steps';
  if (current != null) {
    root.setAttribute('current', String(current));
  }
  root.setAttribute('steps', JSON.stringify(STEPS));
  return root;
}

export const Default: Story = {
  render: () => stepsRoot('sb-steps'),
};

export const Midway: Story = {
  render: () => stepsRoot('sb-steps-midway', 1),
};
```

Give every host a distinct `id`. Generated child ids derive from it, so two id-less hosts on one page collide.

Set configuration as attributes and content as the JSON attribute or the property. The property is the only way to pass a `Node`.

A CSS-only component's story instead builds a class string from typed args; see `dev-env/stories/badge.stories.ts` for that shape.

## `docs/src/components/<Name>Demo.astro`

A small wrapper so a docs page can drop a live element in with props. Defaults let the common case render with no arguments.

```astro
---
interface Item {
  label: string;
  icon?: string;
}

interface Props {
  id?: string;
  current?: number;
  items?: Item[];
}

const {
  id = 'docs-steps',
  current,
  items = [{ label: 'Cart' }, { label: 'Address' }, { label: 'Payment' }],
} = Astro.props;
---

<k-steps
  id={id}
  class="k-steps"
  current={current != null ? String(current) : undefined}
  steps={JSON.stringify(items)}></k-steps>

<script>
  import 'k-web-ui/js';
</script>
```

The inline `<script>` is what registers the element on that page. Every demo needs it. Pass `undefined` rather than an empty string for an unset attribute, so it is omitted from the rendered markup.

## `API.md`

Add a section headed with the tag name as an H2, in the same order as the docs sidebar. It carries:

- A fenced html block showing the tag with its attributes
- One line on what the element generates
- Attribute, Property, and Method tables in markdown
- The event's detail shape, written as: `k-change` detail: `{ current: number }`.
- A short code sample of the common integration

Then check the shared sections at the top of the file. These list components by name and go stale:

- **One event** names every element that fires `k-change`
- **Config changes patch, content changes rebuild** lists the attribute names in each group
- **Three shared members** notes which elements have `disconnect()`
- The `import type { … }` block needs every new public type

If the thing turns out not to be a custom element after all, it belongs in the **Not custom elements** list at the bottom instead.
