# How it works

How to read these docs, how the kit is put together, and how to add a theme.

[Getting started](/getting-started.md) has the install. This page is the stuff underneath: how these docs are laid out, how the stylesheet stacks, where CSS stops and JavaScript starts, and how you drop your own theme on top.

## Reading these docs

Every page here has a plain markdown twin. Hit Copy markdown at the top and you get the whole page, no HTML scraping. [/llms.txt](/llms.txt) indexes them. [/llms-full.txt](/llms-full.txt) dumps all of them in one request.

Component pages all follow the same shape. Classes table first, then reference tables if it's scriptable, then examples. Accessibility and a short dos and don'ts list close it out. On a JS page, the Classes table is the one class you write. Generated parts sit in an accordion under it, for restyling.

Examples show the markup next to the live result. What you copy is what you were looking at. If an example needs script too, the source splits into HTML and TS tabs.

## CSS or JS

Every component page has a badge next to the title. Yellow **JS**, blue **CSS**.

**CSS** means it's a class on markup you write. Nothing to import, nothing to initialize. Fifteen of the twenty-one work this way: accordion, badge, banner, button, card, grid, input, link, modal, progress, sidebar, spin, table, toast, and tooltip.

**JS** means a custom element. You write one tag with its inputs and the element writes the children: [tabs](/components/tabs.md), [pagination](/components/pagination.md), [dropdown](/components/dropdown.md), [carousel](/components/carousel.md), [gauge](/components/gauge.md), and [scrollbar](/components/scrollbar.md). All six ship a stylesheet too, so the badge is really telling you whether you need the JS import.

The split is whatever the browser already does. A modal is CSS because `<dialog>` opens and closes itself. Tabs aren't. A tablist has to move `aria-selected` as the selection changes and answer arrow keys, and CSS can't do either. A scrollbar isn't either. Firefox, Chrome, and Safari each draw their own bar, and CSS can only recolor them.

Those children are ordinary markup on the page. Style them. Query them. The `k-` prefix is how the kit keeps those class names from colliding with yours.

## How the layers stack

The stylesheet declares its cascade order before any rules:

```css
@layer theme, base, components, utilities;
```

Order matters. Later layers win. `utilities` overrides `components`, and unlayered CSS in your own app beats both. That's how you're supposed to restyle a kit component. You shouldn't need a specificity fight. [Restyle](/showcase/restyle.md) turns the square gauge into a half-circle that way.

There's no reset. Drop the stylesheet into a page and nothing moves unless it carries a `k-` class. Native scrollbars are the exception: the sheet hides them so kit thumbs can sit on the page, including inside code blocks. That's also why the selectors name their element: `span.k-badge` and `button.k-btn`, not bare classes. A `k-badge` on a `div` works because `div` is spelled out in the rule. On a `<section>` it does nothing.

## Where a color comes from

A color goes through three layers before a component sees it.

At the bottom is the raw palette, named by hue and step: `--k-palette-orange-700`. Don't reach for these in your own CSS.

Above that sit the semantic tokens, which is where a theme actually happens. `--k-primary` stays `orange-700` in light and dark. Chrome doesn't flip. `--k-surface` does: `orange-50` in light, `steel-950` in dark, and steel 950 is black. `--k-border-hard` is the other flip: black in light, orange-500 in dark. [Colors](/foundations/colors.md) has the whole set.

Tailwind utilities sit on top, so `bg-k-primary` exists next to the token it reads. Those utilities emit `var(--k-primary)` rather than a resolved hex, which is why flipping `data-theme` repaints the page with no rebuild.

So a component reaches for `--k-surface` and never for `--k-palette-orange-50`.

## Your own theme

A theme is a CSS file you load after the kit. Set `--k-primary` and the rest. Components already read those tokens, so `.k-btn` doesn't need a rewrite. Your CSS is unlayered, so it beats the kit layers. Change `data-theme` on `<html>` and every `var(--k-…)` on the page repaints.

The kit ships two values: `k-light` and `k-dark`. Most apps keep those names and change the hex.

```js
import 'k-web-ui';
import './theme.css';
```

```css
/* theme.css: after the kit stylesheet */

:root {
  --k-primary: #1d4ed8;
  --k-primary-hover: #3b82f6;
  --k-border: #3b82f6;
  --k-ring: #3b82f6;
}

:root,
[data-theme='k-light'] {
  --k-surface: #eff6ff;
  --k-fg-muted: #1e40af;
}

[data-theme='k-dark'] {
  --k-surface: #020617;
  --k-fg-muted: #93c5fd;
}
```

Set the tokens you want different. The rest stay the kit defaults. Hex is fine. Palette variables work too if you still want the kit ramps.

A third name is the same pattern with a new selector. Light canvas tokens live on `:root`, so they still apply until you override them.

```html
<html data-theme="night">
```

```css
[data-theme='night'] {
  color-scheme: dark;
  --k-surface: #020617;
  --k-surface-raised: #0f172a;
  --k-surface-hard: #1e293b;
  --k-surface-soft: #020617;
  --k-fg: #f8fafc;
  --k-fg-muted: #93c5fd;
  --k-border-hard: #38bdf8;
  --k-accent: #f8fafc;
  --k-accent-fg: #020617;
  --k-accent-hover: #e0f2fe;
}
```

Redeclare every flipping token you care about. Leave one out and you inherit the light value from `:root`. Status colors and shadows flip in `k-dark` too; copy that block from the [Theme playground](/theme-playground.md) if you want the full list.

A few hover rules still look for `k-dark` itself: secondary buttons, pagination, carousel arrows, and the loading icon. Keep the shipped names if you want those treatments without extra CSS. If you invent a new name, copy the hover rules onto it.

Switching is one attribute:

```js
document.documentElement.setAttribute('data-theme', 'night');
```

[Colors](/foundations/colors.md) lists the tokens. [Styles](/foundations/styles.md) has radius, shadow, and the focus ring.

## Content goes in attributes

A JS component reads its content from a JSON attribute.

```html
<k-tabs class="k-tabs" panels='[{"label":"Overview","content":"Text."}]'></k-tabs>
```

The matching property holds the same data, and the element writes it back to the attribute when it can.

Content changes rebuild the subtree. Configuration changes don't. `selected`, `index`, `page`, and `label` patch in place, so focus and a running animation survive. Each component page says which of its own attributes land in which group.

## Adding node content

JSON in an attribute is a string. That's enough for "The first panel." It's not enough for a [gauge](/components/gauge.md) or a [table](/components/table.md) inside a tab.

Those go on the property as a DOM node: an element you built, or the contents of a `<template>`.

```html
<template id="usage">
  <k-gauge class="k-gauge" value="64" max="100" label="Upload"></k-gauge>
</template>
<k-tabs id="sections" class="k-tabs"></k-tabs>
```

```js
const tabs = document.getElementById('sections');
const usage = document.getElementById('usage');
tabs.panels = [
  { label: 'Overview', content: 'The first panel.' },
  { label: 'Usage', content: usage.content.cloneNode(true) },
];
```

[Tabs](/components/tabs.md) accept a node as panel `content` or `icon`. [Carousel](/components/carousel.md) accepts one as slide `content`. A node can't be written back to the attribute, so it lives on the property only. The [Showcase](/showcase.md) profile tabs are this pattern in a full page.

## One event

Four of the five elements fire a single event, `k-change`, and it bubbles. Gauge is the exception. It shows a value and has nothing to report back.

```js
document.querySelector('k-tabs').addEventListener('k-change', (event) => {
  console.log(event.detail.selected);
});
```

The `detail` carries whatever moved, so its shape depends on the element: `{ selected }` from tabs, `{ page }` from pagination, `{ index }` from carousel, and `{ index, label, href }` from dropdown. Each component page states its own.

A click fires it. So does calling a method. Setting the attribute doesn't, on purpose: your app can push its own state into the element without hearing it echo back.
