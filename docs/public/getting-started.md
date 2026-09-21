# Getting started

Install the kit and put a class on a button.

You write the HTML. Put a `k-` class on it and it picks up the kit look. Most of this kit is CSS, so a lot of the time that's all you need. JavaScript only shows up for widgets CSS can't do, like tabs and pagination. No `k-` class? The kit leaves that element alone.

Every docs page has a `.md` twin. Copy it from the button at the top, start at [/llms.txt](/llms.txt), or grab [/llms-full.txt](/llms-full.txt) in one request.

## Install

```bash
pnpm add k-web-ui
```

That writes it into `package.json` and installs it into `node_modules`. Import the sheet once, in your CSS:

```css
@import 'k-web-ui';
```

That prebuilt sheet is enough for `k-btn` and the kit's own token utilities (`bg-k-surface`, `rounded-k`, …). Tailwind itself is a dependency of `k-web-ui`. You do not add `tailwindcss` to the app.

To compile **your** utilities (`w-[100px]`, `flex`, arbitrary values) through the same Tailwind, import source and run the kit's PostCSS plugin:

```css
@import 'k-web-ui/source';

@source "./**/*.{html,js,ts}";
```

```json
{
  "plugins": {
    "k-web-ui/postcss": {}
  }
}
```

Do not import both `k-web-ui` and `k-web-ui/source`. Source already includes the kit layers plus Tailwind's theme and utilities.

That same PostCSS step is what makes the Tailwind IntelliSense extension work. It does not rewrite editor settings. It exposes the kit's `tailwindcss` package so the extension can load `@theme` from `k-web-ui/source`. The app still does not add `tailwindcss` to `package.json`. After the first `ng serve` / CSS build, reload the editor window.

## Markup

Classes are tied to the element. A button is a `<button>` with `.k-btn`, not a `div` you styled to look like one.

```html
<button type="button" class="k-btn k-btn--primary">Save</button>
<button type="button" class="k-btn k-btn--secondary">Cancel</button>
```

## Theme

One attribute on the document root:

```html
<html data-theme="k-light">
```

`k-light` or `k-dark`. Orange on buttons and fields stays put. Background and text flip. Override those tokens, or add a name of your own, in [How it works](/how-it-works.md). The [Theme playground](/theme-playground/) is there if you want to poke at values first.

## JavaScript

Six widgets are custom elements: tabs, pagination, dropdown, carousel, gauge, and scrollbar. Give the tag an `id`, write your content next to it with that id and a number, and import the JS once. The element finds the content and writes the chrome.

```html
<k-tabs id="sections" class="k-tabs" aria-label="Sections"></k-tabs>
<div id="sections-0">The first panel.</div>
<div id="sections-1">The second panel.</div>
<div id="sections-2">The third panel.</div>
```

```ts
import 'k-web-ui/js';

document.getElementById('sections').options = [
  { label: 'Overview' },
  { label: 'Usage' },
  { label: 'API' },
];
```

That's the whole pattern. Pagination and carousel read the same numbered ids and need no options at all; dropdown and gauge take options and have no content to link.

A progress bar is `<progress class="k-progress">`. Accordion, grid, modal, sidebar, spin, table, toast, and tooltip are CSS only. You write the markup and skip the JS import.
