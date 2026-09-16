---
name: create-css-component
description: >
  Scaffold a new CSS-only component in the k-web-ui kit: the stylesheet, its
  import, a Storybook story, both docs pages, and the sidebar entry. Use when
  adding, creating, or scaffolding a CSS component, a class-only component, or
  a component that needs no JavaScript, and when the user names a new kit
  component such as "add a breadcrumb component."
---

# Create a CSS component

A CSS component is a class on real HTML. No custom element, no JavaScript. The consumer writes `<span class="k-badge">` and the stylesheet does the rest. If the component has to generate its own children or hold state, stop and use `create-js-component` instead.

Use `badge`, `card`, and `accordion` as the reference implementations. Read one before writing a new one.

## Files to touch

Work through these in order. Every one is required; a component that skips the docs mirror or the sidebar entry ships broken.

```
- [ ] package/src/components/css/<name>.css        the stylesheet
- [ ] package/src/components/index.css             @import the stylesheet
- [ ] dev-env/stories/<name>.stories.ts            Storybook story
- [ ] docs/src/content/docs/components/<name>.mdx  docs page
- [ ] docs/public/components/<name>.md             plain-markdown mirror
- [ ] docs/astro.config.mjs                        sidebar entry
```

`<name>` is singular and lowercase: `badge`, not `badges`.

## Step 1: the stylesheet

Create `package/src/components/css/<name>.css`. Wrap everything in `@layer components` and open with a comment naming the markup the classes require.

```css
@layer components {
  /*
   * Requires <nav class="k-breadcrumb"> wrapping an <ol>.
   * Color and size modifiers combine: k-breadcrumb--info k-breadcrumb--sm.
   */
  nav.k-breadcrumb {
    --k-breadcrumb-gap: 0.5rem;

    @apply flex items-center text-sm text-k-fg-muted;
    gap: var(--k-breadcrumb-gap);
  }

  nav.k-breadcrumb .k-breadcrumb__item {
    @apply inline-flex items-center;
  }

  nav.k-breadcrumb.k-breadcrumb--sm {
    --k-breadcrumb-gap: 0.25rem;
    @apply text-xs;
  }
}
```

Rules that matter here:

**Qualify the block selector with its element.** `nav.k-breadcrumb`, `button.k-btn`, `span.k-badge`. When two elements are both valid, use `:is(span.k-badge, div.k-badge)`. This is what keeps the kit from styling the wrong tag, and it is why every existing file reads this way.

**Name with BEM.** Block `k-<name>`, part `k-<name>__<part>`, modifier `k-<name>--<variant>`. Parts are plain classes, so scope them under the block: `nav.k-breadcrumb .k-breadcrumb__item`.

**Prefer a semantic attribute over a modifier when the value is a real option.** `k-tabs[size='lg']` and `k-dropdown[align='end']` are attributes, not `--lg` and `--end` classes. Reach for a modifier for appearance, an attribute for configuration.

**Put per-component knobs in custom properties** named `--k-<name>-*`, declared on the block so modifiers can reassign them without repeating the rules that consume them. Badge does this with `--k-badge-color` and `--k-badge-size`.

**Use `@apply` with the kit's theme classes** (`bg-k-surface`, `text-k-fg-muted`, `border-k-border`) rather than raw values. Tokens come from `package/src/base/themes.css` and resolve through the `@reference` at the top of `index.css`. Read that file before inventing a color.

**Follow the established vocabulary.** Color variants are `primary`, `secondary`, `accent`, `info`, `success`, `warning`, `danger`. Sizes are `xs`, `sm`, `lg`, `xl`, with medium as the unmodified default. Do not add a `--md` class that does nothing.

Group the rules with a short comment per group, in this order: block, parts, colors, styles, sizes, states.

## Step 2: register it

Add one line to `package/src/components/index.css`. The list is append-only and not alphabetized, so put it at the end:

```css
@import './css/breadcrumb.css';
```

## Step 3: Storybook story

Create `dev-env/stories/<name>.stories.ts`. Model it on `dev-env/stories/badge.stories.ts`: a typed args interface, a class-builder function, a `meta` with `tags: ['autodocs']` and `argTypes` controls, then one exported story per interesting state.

```ts
import type { Meta, StoryObj } from '@storybook/html-vite';

interface BreadcrumbArgs {
  size: 'sm' | 'md';
}

const breadcrumbClass = ({ size }: BreadcrumbArgs): string =>
  ['k-breadcrumb', size === 'md' ? '' : `k-breadcrumb--${size}`]
    .filter(Boolean)
    .join(' ');

/** One-line description. This becomes the autodocs blurb. */
const meta: Meta<BreadcrumbArgs> = {
  title: 'Components/Breadcrumb',
  tags: ['autodocs'],
  render: (args) => `<nav class="${breadcrumbClass(args)}">…</nav>`,
  args: { size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
};

export default meta;

type Story = StoryObj<BreadcrumbArgs>;

export const Default: Story = {};
```

The size-as-`'md'`-means-omit-the-class pattern is deliberate and used across every story. Keep it.

## Step 4 and 5: the two docs pages

Every component has two, and they must agree:

- `docs/src/content/docs/components/<name>.mdx` renders the site page.
- `docs/public/components/<name>.md` is what the page's "Copy markdown" button fetches, so it mirrors the same content in plain markdown.

Use the `create-component-docs` skill for both. It owns the section order, the table conventions, the twin's translation rules, and full templates for each file.

The frontmatter must carry `kind: css`, which is what draws the CSS badge beside the page title.

## Step 6: sidebar

Add the entry to the `Components` array in `docs/astro.config.mjs`, **alphabetically**:

```js
{ label: 'Breadcrumb', slug: 'components/breadcrumb' },
```

## Verify

Run all of these from the repo root and fix anything they report:

```bash
pnpm lint:fix
pnpm format:check
pnpm typecheck
pnpm build:docs
pnpm build:storybook
```

`pnpm build:docs` fails on a missing sidebar slug or bad frontmatter, so it is the check that catches a half-registered component. There are no unit tests for a CSS component.

Starlight warns about a missing `i18n` collection and a missing `404` entry on every build. Both are pre-existing and unrelated.

Then confirm by eye that the rendered class list in the docs page matches the selectors you actually wrote. A class in the table that does not exist in the stylesheet is the most common mistake.

## Additional resources

- Docs pages, both files: the `create-component-docs` skill
- Reference implementations: `package/src/components/css/badge.css`, `card.css`, `accordion.css`
- Design tokens: `package/src/base/themes.css`
