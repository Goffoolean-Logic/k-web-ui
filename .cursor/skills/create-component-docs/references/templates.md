# Page templates

Four templates: a CSS page and its twin, a JS page and its twin. The subjects are hypothetical (`breadcrumb`, `k-steps`) so a template can be copied whole without colliding with a component that exists.

Write the `.mdx` first, then translate it. Translating is mechanical; writing twice is not.

## CSS page, `docs/src/content/docs/components/<name>.mdx`

````mdx
---
title: Breadcrumb
description: nav.k-breadcrumb. Trail, separators, sizes.
kind: css
---

import Example from '../../../components/Example.astro';
import DocTable from '../../../components/DocTable.astro';

A breadcrumb shows where the current page sits in a hierarchy. Use it when the reader can move up. For switching between sibling views, use [tabs](/components/tabs/).

Put `.k-breadcrumb` on a `nav` around an `ol`. Each `li` takes `.k-breadcrumb__item`. A size modifier tightens the gap and the type.

## Classes

<DocTable
  columns={['Class', 'Type', 'Description']}
  rows={[
    [
      'k-breadcrumb',
      'component',
      'The trail itself. Goes on a nav wrapping an ol.',
    ],
    ['k-breadcrumb__item', 'part', 'One step in the trail.'],
    ['k-breadcrumb--sm', 'modifier', 'Tighter gap and smaller type.'],
  ]}
/>

## Examples

### Default

A two-step trail. The last step is the current page.

<Example html={`<nav class="k-breadcrumb" aria-label="Breadcrumb">
  <ol>
    <li class="k-breadcrumb__item"><a class="k-link" href="/">Home</a></li>
    <li class="k-breadcrumb__item" aria-current="page">Badge</li>
  </ol>
</nav>`}>
  <nav class="k-breadcrumb" aria-label="Breadcrumb">
    <ol>
      <li class="k-breadcrumb__item"><a class="k-link" href="/">Home</a></li>
      <li class="k-breadcrumb__item" aria-current="page">Badge</li>
    </ol>
  </nav>
</Example>

## Accessibility

Name the trail with `aria-label` on the `nav` and mark the last step `aria-current="page"`. Separators are decorative, so draw them in CSS rather than writing them as text a screen reader would read out.

## Dos and don'ts

**Do**
- Put `.k-breadcrumb` on a `nav` around an `ol`.
- Mark the current page with `aria-current="page"`.

**Don't**
- Use a breadcrumb for sibling navigation.
- Write separators as text content.
````

## CSS twin, `docs/public/components/<name>.md`

````md
# Breadcrumb

**CSS component.** No JavaScript needed.

nav.k-breadcrumb. Trail, separators, sizes.

A breadcrumb shows where the current page sits in a hierarchy. Use it when the reader can move up. For switching between sibling views, use [tabs](/components/tabs/).

Put `.k-breadcrumb` on a `nav` around an `ol`. Each `li` takes `.k-breadcrumb__item`. A size modifier tightens the gap and the type.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-breadcrumb` | component | The trail itself. Goes on a `nav` wrapping an `ol`. |
| `k-breadcrumb__item` | part | One step in the trail. |
| `k-breadcrumb--sm` | modifier | Tighter gap and smaller type. |

## Examples

### Default

A two-step trail. The last step is the current page.

```html
<nav class="k-breadcrumb" aria-label="Breadcrumb">
  <ol>
    <li class="k-breadcrumb__item"><a class="k-link" href="/">Home</a></li>
    <li class="k-breadcrumb__item" aria-current="page">Badge</li>
  </ol>
</nav>
```

## Accessibility

Name the trail with `aria-label` on the `nav` and mark the last step `aria-current="page"`. Separators are decorative, so draw them in CSS rather than writing them as text a screen reader would read out.

## Dos and don'ts

**Do**
- Put `.k-breadcrumb` on a `nav` around an `ol`.
- Mark the current page with `aria-current="page"`.

**Don't**
- Use a breadcrumb for sibling navigation.
- Write separators as text content.
````

## JS page, `docs/src/content/docs/components/<name>.mdx`

Note the third opening paragraph, the one-row Classes table with `generated` parts, and the event line after the tables.

````mdx
---
title: Steps
description: k-steps. Ordered trail and ARIA from steps.
kind: js
---

import Example from '../../../components/Example.astro';
import StepsDemo from '../../../components/StepsDemo.astro';
import DocTable from '../../../components/DocTable.astro';

Steps show progress through a fixed sequence. Use them when the reader has to finish in order. For views they can visit in any order, use [tabs](/components/tabs/).

Put `<k-steps class="k-steps">` on the page with `steps`. The element builds the list, the steps, and the ARIA. Each step is a `label`, and `icon` is optional: a kit icon name.

The active step carries the primary fill. Changing `steps` rebuilds the list; changing `current`, `label`, or `keyboard` does not. Reduced motion drops the motion.

## Classes

<DocTable
  columns={['Class', 'Type', 'Description']}
  rows={[
    [
      'k-steps',
      'component',
      'The one class you write. The element generates the list and the steps inside it.',
    ],
  ]}
  generated={[
    ['k-steps__list', 'part', 'The list the element builds.'],
    ['k-steps__step', 'part', 'One step in the trail.'],
  ]}
/>

## Attributes

<DocTable
  columns={['Attribute', 'Type', 'Default', 'Description']}
  rows={[
    [
      'steps',
      'JSON array',
      '',
      'One object per step: label, and an optional icon.',
    ],
    ['current', 'number', '0', 'Zero-based index of the active step.'],
    ['label', 'string', '', 'Accessible name for the generated list.'],
    [
      'keyboard',
      '"false" to disable',
      'enabled',
      'Arrow keys, Home, and End move between steps.',
    ],
  ]}
/>

## Properties

<DocTable
  columns={['Property', 'Type', 'Description']}
  rows={[
    [
      'steps',
      'KStepItem[]',
      'Read/write. Accepts a Node as icon. Node values are not written back to the attribute.',
    ],
    [
      'count',
      'number',
      'Read-only. Number of steps. Reads the attribute, so it works before the element connects.',
    ],
    ['current', 'number', 'Read-only. Active index, or -1 before connecting.'],
  ]}
/>

## Methods

<DocTable
  columns={['Method', 'Returns', 'Description']}
  rows={[
    [
      'getCurrent()',
      'KStepsCurrent | null',
      'The active step as { index, step, label }, or null when nothing is built.',
    ],
    ['getStep(index)', 'HTMLElement | null', 'The step at an index.'],
    ['goTo(index, { focus })', 'void', 'Moves and fires k-change.'],
    [
      'next({ wrap, focus })',
      'void',
      'Advances one step. Wraps past the last one unless wrap is false.',
    ],
    ['addStep(step, at)', 'void', 'Inserts a step, appending when at is left out.'],
    ['refresh()', 'void', 'Rebuilds the subtree from the current steps.'],
    [
      'disconnect()',
      'void',
      'Removes listeners without removing the element from the page.',
    ],
  ]}
/>

The edit methods write through the `steps` property, so they reflect to the attribute and rebuild the list. Everything else patches in place.

Moving a step fires `k-change` with `{ current }`, and the event bubbles. Setting the `current` attribute moves without firing it, so you can drive the element from your own state without a loop.

## Examples

### Three steps

<Example
  stack
  html={`<k-steps
  class="k-steps"
  label="Checkout"
  steps='[{"label":"Cart"},{"label":"Address"},{"label":"Payment"}]'
></k-steps>`}
>
  <StepsDemo />
</Example>

## Accessibility

`k-steps` builds the `ol`, `aria-current` on the active step, and `aria-label` from `label`. Arrow keys, Home, and End move when `keyboard` is on. Decorative icons are `aria-hidden`, so keep the name in the step text.

Give the host an `id` when more than one `k-steps` is on the page. Generated ids derive from it, so two id-less hosts collide.

## Dos and don'ts

**Do**
- Use `<k-steps class="k-steps">` with `steps`.
- Listen for `k-change` to react to a move.
- Give the host an `id` when more than one is on the page.

**Don't**
- Hand-write the list. The element builds it.
- Use steps for views the reader can visit in any order.
````

## JS twin, `docs/public/components/<name>.md`

Only the head and the tables differ in shape from the CSS twin. Note the em dash where a default was `''`, and the escaped pipe in the union return types.

````md
# Steps

**JS component.** Import `k-web-ui/js` once and the element writes the inside.

k-steps. Ordered trail and ARIA from steps.

Steps show progress through a fixed sequence. Use them when the reader has to finish in order. For views they can visit in any order, use [tabs](/components/tabs/).

Put `<k-steps class="k-steps">` on the page with `steps`. The element builds the list, the steps, and the ARIA. Each step is a `label`, and `icon` is optional: a kit icon name.

The active step carries the primary fill. Changing `steps` rebuilds the list; changing `current`, `label`, or `keyboard` does not. Reduced motion drops the motion.

## Classes

| Class | Type | Description |
| --- | --- | --- |
| `k-steps` | component | The one class you write. The element generates the list and the steps inside it. |

### Generated classes

| Class | Type | Description |
| --- | --- | --- |
| `k-steps__list` | part | The list the element builds. |
| `k-steps__step` | part | One step in the trail. |

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` | JSON array | — | One object per step: `label`, and an optional `icon`. |
| `current` | number | `0` | Zero-based index of the active step. |
| `label` | string | — | Accessible name for the generated list. |
| `keyboard` | `"false"` to disable | enabled | Arrow keys, Home, and End move between steps. |

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `steps` | `KStepItem[]` | Read/write. Accepts a `Node` as `icon`. Node values are not written back to the attribute. |
| `count` | number | Read-only. Number of steps. Reads the attribute, so it works before the element connects. |
| `current` | number | Read-only. Active index, or `-1` before connecting. |

## Methods

| Method | Returns | Description |
| --- | --- | --- |
| `getCurrent()` | `KStepsCurrent \| null` | The active step as `{ index, step, label }`, or `null` when nothing is built. |
| `getStep(index)` | `HTMLElement \| null` | The step at an index. |
| `goTo(index, { focus })` | void | Moves and fires `k-change`. |
| `next({ wrap, focus })` | void | Advances one step. Wraps past the last one unless `wrap` is false. |
| `addStep(step, at)` | void | Inserts a step, appending when `at` is left out. |
| `refresh()` | void | Rebuilds the subtree from the current steps. |
| `disconnect()` | void | Removes listeners without removing the element from the page. |

The edit methods write through the `steps` property, so they reflect to the attribute and rebuild the list. Everything else patches in place.

Moving a step fires `k-change` with `{ current }`, and the event bubbles. Setting the `current` attribute moves without firing it, so you can drive the element from your own state without a loop.

## Examples

### Three steps

```html
<k-steps
  class="k-steps"
  label="Checkout"
  steps='[{"label":"Cart"},{"label":"Address"},{"label":"Payment"}]'
></k-steps>
```

## Accessibility

`k-steps` builds the `ol`, `aria-current` on the active step, and `aria-label` from `label`. Arrow keys, Home, and End move when `keyboard` is on. Decorative icons are `aria-hidden`, so keep the name in the step text.

Give the host an `id` when more than one `k-steps` is on the page. Generated ids derive from it, so two id-less hosts collide.

## Dos and don'ts

**Do**
- Use `<k-steps class="k-steps">` with `steps`.
- Listen for `k-change` to react to a move.
- Give the host an `id` when more than one is on the page.

**Don't**
- Hand-write the list. The element builds it.
- Use steps for views the reader can visit in any order.
````
