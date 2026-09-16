# How it works

How to read these docs, and how the kit is put together.

[Getting started](/getting-started/) has the imports. This page is what sits underneath them: how these pages are laid out, how the stylesheet stacks, and where the line between CSS and JavaScript falls.

## Reading these docs

Every page here has a plain markdown twin. The Copy markdown button at the top fetches it, so you can drop a whole page into an editor or a model without scraping HTML out of the page. [/llms.txt](/llms.txt) indexes them and [/llms-full.txt](/llms-full.txt) returns all of them at once.

Component pages follow the same shape every time. A Classes table comes first, then reference tables for anything scriptable, then the examples. Accessibility notes and a short dos and don'ts list close out every one. On a JS page the Classes table is the one class you write. Generated parts sit in an accordion under it, for restyling.

Examples show the markup and the live result together. What you copy is what you were just looking at. When an example needs script as well as markup, the source splits into HTML and TS tabs.

## CSS or JS

Every component page carries a badge beside its title. Yellow **JS**, blue **CSS**.

**CSS** means the component is a class on markup you write. Nothing to import, nothing to initialize. Fifteen of the twenty work this way: accordion, badge, banner, button, card, grid, input, link, modal, progress, sidebar, spin, table, toast, and tooltip.

**JS** means a custom element. You write one tag with its inputs and the element writes the children: [tabs](/components/tabs.md), [pagination](/components/pagination.md), [dropdown](/components/dropdown.md), [carousel](/components/carousel.md), and [gauge](/components/gauge.md). All five ship a stylesheet as well, so what the badge really tells you is whether you need the JS import.

The line sits at what the browser already does on its own. A modal is CSS because `<dialog>` opens and closes itself. Tabs are different. A tablist has to move `aria-selected` as the selection changes and answer arrow keys, and CSS cannot do either.

Those children are ordinary markup on the page. Style them. Query them. The `k-` prefix is how the kit keeps those class names from colliding with yours.

## How the layers stack

The stylesheet declares its cascade order before any rules:

```css
@layer theme, base, components, utilities;
```

Order matters, because later layers win. `utilities` overrides `components`, and unlayered CSS in your own app beats both. That is the intended way to restyle a kit component, and it is why you should not need a specificity fight to do it.

There is no reset. Drop the stylesheet into a page and nothing moves unless it carries a `k-` class. That is also why the selectors name their element, `span.k-badge` and `button.k-btn` instead of bare classes. A `k-badge` on a `div` works because `div` is spelled out in the rule. On a `<section>` it does nothing at all.

## Where a color comes from

A color takes three hops before a component sees it.

At the bottom is the raw palette, named by hue and step: `--k-palette-orange-700`. Nothing you write should reach for one of these directly.

Above that sit the semantic tokens, which is where a theme actually happens. `--k-primary` stays `orange-700` in light and dark both, because the chrome does not flip. `--k-surface` does flip: `orange-50` in light, `steel-950` in dark, and steel 950 is black. [Colors](/foundations/colors.md) has the whole set.

The Tailwind utilities sit on top, so `bg-k-primary` exists next to the token it reads. Those utilities emit `var(--k-primary)` rather than a resolved hex, which is the reason flipping `data-theme` repaints a page with no rebuild.

So a component reaches for `--k-surface` and never for `--k-palette-orange-50`.

## Content goes in attributes

A JS component reads its content from a JSON attribute.

```html
<k-tabs class="k-tabs" panels='[{"label":"Overview","content":"Text."}]'></k-tabs>
```

The matching property holds the same data, and the element writes it back to the attribute when it can.

Content changes rebuild the subtree. Configuration changes do not. `selected`, `index`, `page`, and `label` patch in place, so focus and a running animation survive. Each component page says which of its own attributes land in which group.

## Adding node content

JSON in an attribute is a string. That is enough for "The first panel." It is not enough for a [gauge](/components/gauge.md) or a [table](/components/table.md) inside a tab.

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

[Tabs](/components/tabs.md) accept a node as panel `content` or `icon`. [Carousel](/components/carousel.md) accepts one as slide `content`. A node cannot be written back to the attribute, so it lives on the property only. The [Showcase](/showcase.md) profile tabs are this pattern in a full page.

## One event

Four of the five elements fire a single event, `k-change`, and it bubbles. Gauge is the exception, since it shows a value and has nothing to report back.

```js
document.querySelector('k-tabs').addEventListener('k-change', (event) => {
  console.log(event.detail.selected);
});
```

The `detail` carries whatever moved, so its shape depends on the element: `{ selected }` from tabs, `{ page }` from pagination, `{ index }` from carousel, and `{ index, label, href }` from dropdown. Each component page states its own.

A click fires it. So does calling a method. Setting the attribute does not, and that gap is deliberate, so an app can push its own state into the element without hearing it echo back.
